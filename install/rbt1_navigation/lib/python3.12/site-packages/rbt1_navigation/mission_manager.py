import rclpy
import yaml
import os
import math

from rclpy.node import Node
from enum import Enum, auto
from ament_index_python.packages import get_package_share_directory

from std_msgs.msg import Float32, Bool, Int32
from sensor_msgs.msg import NavSatFix
from geometry_msgs.msg import PoseStamped
from nav_msgs.msg import Odometry
from geometry_msgs.msg import Quaternion, PoseWithCovarianceStamped
from tf2_ros import Buffer, TransformListener
from geographiclib.geodesic import Geodesic
from std_srvs.srv import Empty

from nav2_simple_commander.robot_navigator import BasicNavigator
from action_msgs.msg import GoalStatus

from rbt1_interfaces.msg import MissionCommand, MissionState
from rbt1_interfaces.srv import GenerateCoverage

PRESSURE_LIMIT = 1013.0

# ================= ENUMS =================
class MissionStatus(Enum):
    NONE = auto()
    WAIT_MISSION = auto()
    PRECHECK = auto()
    RUNNING = auto()
    COMPLETE = auto()
    PAUSED = auto()
    RESUME = auto()
    ERROR = auto()

class MissionStep(Enum):
    NONE = auto()
    TRANSIT = auto()
    COVERAGE = auto()
    RETURN_TO_BASE = auto()

class ReturnCause(Enum):
    NONE = auto()
    MISSION_COMPLETE = auto()
    WEATHER = auto()
    BATTERY = auto()

# ================= NODE =================
class MissionManager(Node):

    def __init__(self):
        super().__init__('mission_manager')

        # ---- ÉTAT GLOBAL ----
        self.status = MissionStatus.NONE
        self.step = MissionStep.NONE
        self.current_mission = None
        self.return_cause = ReturnCause.NONE
        self.init_done = False
        self.current_mission = None
        self.coverage_done = False
        self.coverage_in_progress = False
        self.resume_context = {
            "step": None,
            "coverage_done": None,
            "progress": None,
            "pose": None,
            "coverage_line": None
        }

        # ---- CAPTEURS & ÉTAT ----
        self.max_segment_length = 15.0
        self.carrot_distance = 8.0
        self.battery = 100.0
        self.weather_pause = False
        self.gps_pos = None
        self.amcl_pos = None
        self.map_pos = None
        self.dock_gps = None
        self.load_dock_gps()
        self.battery_threshold = 20.0
        self.motor_started = False
        self.go_to_base_in_progress = False
        self.transit_in_progress = False
        self.coverage_in_progress = False
        self.coverage_index = 0

        # ---- NAV2 ----
        self.navigator = BasicNavigator()

        # ---- SUBSCRIBERS ----
        self.create_subscription(MissionCommand, '/mission/command', self.mission_cb, 10)
        self.create_subscription(NavSatFix, '/ublox_gps_node/fix', self.gps_cb, 10)
        self.create_subscription(Odometry, '/odometry/global', self.odom_cb, 10)
        self.create_subscription(Bool, '/state/weather_ok', self.weather_ok_cb, 10)
        self.create_subscription(Bool, '/state/battery_ok', self.battery_ok_cb, 10)

        # ---- PUBLISHERS ----
        self.state_pub = self.create_publisher(MissionState, '/mission/state', 10)
        self.lame_speed_pub = self.create_publisher(Float32, '/cmd/lame_speed', 10)

        # ---- TIMERS ----
        self.create_timer(1.0, self.mission_loop)
        self.create_timer(2.0, self.monitor_position)

        # ------ GPS -> map via TF -------------
        self.tf_buffer = Buffer()
        self.tf_listener = TransformListener(self.tf_buffer, self)
        self.load_map_origin()
        
        self.publish_lame_speed(0.0)
        self.init_done = True
        self.get_logger().info("✅ Mission Manager READY")

    # ================= CALLBACKS =================
    def mission_cb(self, msg: MissionCommand):
        if self.status not in (MissionStatus.NONE, MissionStatus.WAIT_MISSION):
            self.get_logger().warn("Mission rejected: already running")
            return
        if not msg.zone:
            self.get_logger().error("Mission rejected: zone not specified")
            return
        self.current_mission = msg
        self.current_zone = msg.zone
        self.status = MissionStatus.NONE
        self.publish_state("Mission received")

    def battery_ok_cb(self, msg):
        self.battery = msg.data

    def weather_ok_cb(self, msg):
        self.weather_pause = not msg.data

    def gps_cb(self, msg):
        self.gps_pos = msg

    def odom_cb(self, msg):
        self.map_pos = msg.pose.pose.position

 
    # ================= MONITORING =================
    def monitor_position(self):
        if self.status in (MissionStatus.RUNNING, MissionStatus.RESUME):
            if self.map_pos is None and self.gps_pos is None:
                return
            feedback = self.navigator.getFeedback()
            if feedback:
                self.get_logger().info(f"[Monitor Position]: |GPS: Lat:{self.gps_pos.latitude}, lon:{self.gps_pos.longitude} |map: x:{self.map_pos.x}, y:{self.map_pos.y} |Distance restante:, {feedback.distance_remaining}")   
            else:
                self.get_logger().info(f"[Monitor Position]: |GPS: Lat:{self.gps_pos.latitude}, lon:{self.gps_pos.longitude} |map: x:{self.map_pos.x}, y:{self.map_pos.y}")  

    #================ RESUME MISSION ===============
    def save_resume_context(self):
        self.resume_context["step"] = self.step
        self.resume_context["coverage_done"] = self.coverage_done
        if self.step == MissionStep.COVERAGE:
            self.resume_context["coverage_index"] = self.coverage_index
        else:
            self.resume_context["coverage_index"] = 0
        self.get_logger().info(f"Context saved: step={self.step}, index={self.resume_context['coverage_index']}")

    def restore_resume_context(self):
        self.step = self.resume_context["step"]
        self.coverage_done = self.resume_context["coverage_done"]
        if self.step == MissionStep.COVERAGE:
            self.coverage_index = self.resume_context.get("coverage_index", 0)
            self.get_logger().info(f"Resuming coverage from index {self.coverage_index}")
        self.status = MissionStatus.RUNNING
        self.publish_state("Mission resumed")

    # ================= MOTOR SERVICE =================
    def stop_motor(self):
        self.get_logger().info("🛑 Sending STOP MOTOR command")
        client = self.create_client(Empty, '/stop_motor')
        if not client.wait_for_service(timeout_sec=3.0):
            self.get_logger().error("❌ /stop_motor service not available")
            return False
        req = Empty.Request()
        future = client.call_async(req)
        future.add_done_callback(self._motor_stop_response_callback)
        response = future.result()
        self.motor_future = future
        return False

    def _motor_stop_response_callback(self, future):
        try:
            response = future.result()
            self.motor_started = False
            self.get_logger().info("✅ Motor stoped successfully")
        except Exception as e:
            self.get_logger().error(f"❌ Motor service call failed: {e}")

    def start_motor(self):
        self.get_logger().info("Sending START MOTOR command")
        client = self.create_client(Empty, '/start_motor')
        if not client.wait_for_service(timeout_sec=3.0):
            self.get_logger().error("❌ /start_motor service not available")
            return False
        req = Empty.Request()
        future = client.call_async(req)
        future.add_done_callback(self._motor_start_response_callback)
        self.motor_future = future
        return True

    def _motor_start_response_callback(self, future):
        try:
            response = future.result()
            self.motor_started = True
            self.get_logger().info("✅ Motor started successfully")
        except Exception as e:
            self.get_logger().error(f"❌ Motor service call failed: {e}")


    # ================= POINTS LOADING =================
    def yaml_to_poses(self, points):
        poses = []
        for p in points:
            pose = PoseStamped()
            pose.header.frame_id = "map"
            pose.pose.position.x = p["x"]
            pose.pose.position.y = p["y"]
            yaw = p["yaw"]
            pose.pose.orientation.z = math.sin(yaw/2)
            pose.pose.orientation.w = math.cos(yaw/2)
            poses.append(pose)
            return poses

    def gps_to_map_pose(self, lat, lon, yaw=0.0):
        # origine GPS de la map
        lat0 = self.map_origin_lat
        lon0 = self.map_origin_lon
        # calcul géodésique
        g = Geodesic.WGS84.Inverse(lat0, lon0, lat, lon)
        distance = g["s12"]
        azimuth = math.radians(g["azi1"])
        east = distance * math.sin(azimuth)
        north = distance * math.cos(azimuth)

        pose = PoseStamped()
        pose.header.frame_id = "map"
        pose.header.stamp = self.get_clock().now().to_msg()
        pose.pose.position.x = east
        pose.pose.position.y = north
        pose.pose.position.z = 0.0
        pose.pose.orientation = self.yaw_to_quaternion(yaw)

        self.get_logger().info(f"GPS→MAP lat={lat} lon={lon} -> x={east:.2f} y={north:.2f}")
        return pose

    def load_dock_gps(self):
        pkg = get_package_share_directory('rbt1_navigation')
        path = os.path.join(pkg, 'config', 'dock_gps.yaml')
        with open(path, 'r') as f:
            self.dock_gps = yaml.safe_load(f)['dock']

    def yaw_to_quaternion(self, yaw):
        q = Quaternion()
        q.z = math.sin(yaw / 2.0)
        q.w = math.cos(yaw / 2.0)
        return q

    def distance_to_pose(self, pose):
        if self.map_pos is None:
            return float("inf")

        dx = pose.pose.position.x - self.map_pos.x
        dy = pose.pose.position.y - self.map_pos.y
        return math.hypot(dx, dy)

    def compute_carrot_goal(self, target_pose):
        if self.map_pos is None:
            return target_pose
        rx = self.map_pos.x
        ry = self.map_pos.y
        tx = target_pose.pose.position.x
        ty = target_pose.pose.position.y
        dx = tx - rx
        dy = ty - ry
        dist = math.hypot(dx, dy)
        carrot_distance = 8.0
        if dist <= carrot_distance:
            return target_pose
        ratio = carrot_distance / dist
        gx = rx + dx * ratio
        gy = ry + dy * ratio
        goal = PoseStamped()
        goal.header.frame_id = "map"
        goal.header.stamp = self.get_clock().now().to_msg()
        goal.pose.position.x = gx
        goal.pose.position.y = gy
        yaw = math.atan2(dy, dx)
        goal.pose.orientation = self.yaw_to_quaternion(yaw)
        return goal

    def load_map_origin(self):
        pkg = get_package_share_directory('rbt1_navigation')
        path = os.path.join(pkg, 'maps', 'RBT1 - Map.yaml')
        with open(path, 'r') as f:
            data = yaml.safe_load(f)
        self.map_origin_lat = data["origin"][1]
        self.map_origin_lon = data["origin"][0]
        self.get_logger().info(f"Map origin GPS loaded: lat={self.map_origin_lat} lon={self.map_origin_lon}")

    # ================= ACTIONS =================
    def start_transit(self):
        self.publish_lame_speed(0.0)
        self.transit_target = self.coverage_poses[0]
        carrot_goal = self.compute_carrot_goal(self.transit_target)
        self.navigator.goToPose(carrot_goal)
        self.transit_in_progress = True
        self.get_logger().info("Transit started using Pure Pursuit navigation")

    def go_to_base(self):
        base_pose = self.gps_to_map_pose(
            self.dock_gps['latitude'],
            self.dock_gps['longitude'],
            self.dock_gps.get('altitude', 0.0)
        )

        self.base_transit_poses = self.split_path_from_current(base_pose, max_distance=15.0)
        self.base_transit_index = 0
        self.go_to_base_in_progress = True
        self.navigator.goToPose(self.base_transit_poses[self.base_transit_index])

        self.get_logger().info(f"Go to base → {len(self.base_transit_poses)} split poses")

    # ================= UTILS =================
    def abort(self, reason):
        self.status = MissionStatus.ERROR
        self.navigator.cancelTask()
        self.publish_state(f"ABORT: {reason}")
        self.get_logger().info(f"ABORT: {reason}")

    def publish_state(self, info=""):
        msg = MissionState()
        msg.mission_id = self.current_mission.mission_id if self.current_mission else ""
        msg.state = self.status.name
        msg.current_step = self.step.name
        msg.info = info
        self.state_pub.publish(msg)
        self.get_logger().info(f"MissionState published: {msg.state} | step: {msg.current_step} | info: {info}")

    def publish_lame_speed(self, speed=1.0):
        msg = Float32()
        msg.data = speed
        self.lame_speed_pub.publish(msg)
        self.get_logger().info(f"Lame speed: {speed}")

    def try_set_initial_pose_from_gps(self):
        if getattr(self, "initial_pose_set", False):
            return

        if self.map_pos is None:
            self.get_logger().info("Waiting GPS for initial pose...")
            return

        # Utilise la position GPS actuelle comme référence
        pose = PoseStamped()
        pose.header.frame_id = "map"
        pose.header.stamp = self.get_clock().now().to_msg()
        pose.pose.position.x = self.map_pos.x
        pose.pose.position.y = self.map_pos.y
        pose.pose.position.z = 0.0
        pose.pose.orientation.w = 1.0

        self.navigator.waitUntilNav2Active()
        self.navigator.setInitialPose(pose)


        self.initial_pose_set = True
        self.get_logger().info("✅ Initial pose set from real GPS position")

    # ================= MISSION LOOP =================

    def mission_loop(self):
        
        if self.status == MissionStatus.NONE:
            if self.init_done == True:
                self.get_logger().info("Init OK et position actuelle reçue")
                self.try_set_initial_pose_from_gps()
                self.status = MissionStatus.WAIT_MISSION
                self.publish_state("NONE -> WAIT_MISSION")

        if self.status == MissionStatus.WAIT_MISSION:
            #Nouvelle mission reçue
            if not self.current_mission==None:
                self.get_logger().info("Nouvelle mission reçue")
                # Charger le YAML coverage pour la zone
                yaml_file = os.path.join(get_package_share_directory('rbt1_navigation'),'maps',f"{self.current_zone}_coverage.yaml")
                if not os.path.exists(yaml_file):
                    self.abort(f"[{self.status.name}].[{self.step.name}] : Coverage YAML not found: {yaml_file}")
                    return
                with open(yaml_file, 'r') as f:
                    data = yaml.safe_load(f)
                self.coverage_poses = self.yaml_to_poses(data.get('poses', []))
                self.go_to_base_in_progress = False
                self.transit_in_progress = False
                self.coverage_in_progress = False
                self.coverage_index = 0
                self.get_logger().info(f"[{self.status.name}]: Loaded {len(self.coverage_poses)} coverage poses")
                self.status = MissionStatus.PRECHECK
                self.publish_state("WAIT_MISSION -> PRECHECK")

        if self.status == MissionStatus.PRECHECK:
            #Check conditions démarrage mission ok
            if self.weather_pause or not self.battery:
                self.get_logger().info("Condition Precheck KO")
                self.save_resume_context()
                self.status = MissionStatus.PAUSED
                self.publish_state("PRECHECK -> PAUSED")         
            else:
                self.get_logger().info("Condition Precheck OK")
                self.start_motor() #Lidar
                self.status = MissionStatus.RUNNING
                self.publish_state("PRECHECK -> RUNNING")
        
        if self.status == MissionStatus.RUNNING:
            self.return_cause = ReturnCause.NONE
            if self.step==MissionStep.NONE:
                self.publish_lame_speed(0.0)
                #coordonnée du point cible transit chargé
                if self.coverage_poses:
                    self.get_logger().info(f"[{self.status.name}].[{self.step.name}]: Coordonées coverage chargés")
                    self.step=MissionStep.TRANSIT
                    self.publish_state("NONE -> TRANSIT")
            
            if self.step == MissionStep.TRANSIT:
                self.publish_lame_speed(0.0)
                if not self.transit_in_progress:
                    self.start_transit()
                if self.navigator.isTaskComplete():
                    if self.distance_to_pose(self.transit_target) < 0.4:
                        self.transit_in_progress = False
                        self.get_logger().info(f"[{self.status.name}].[{self.step.name}]: Transit target reached")
                        self.step = MissionStep.COVERAGE
                        self.publish_state("TRANSIT -> COVERAGE")
                    else:
                        carrot_goal = self.compute_carrot_goal(self.transit_target)
                        self.navigator.goToPose(carrot_goal)             

            if self.step==MissionStep.COVERAGE:
                if self.coverage_poses:
                    self.publish_lame_speed(1.0)
                    if not self.coverage_in_progress:
                        self.navigator.goToPose(self.coverage_poses[self.coverage_index])
                        self.coverage_in_progress=True
                        self.get_logger().info(f"[{self.status.name}].[{self.step.name}]: GoToPose : {self.coverage_index}")
                    if self.navigator.isTaskComplete():
                        if self.coverage_index < len(self.coverage_poses):
                            self.coverage_index += 1
                            msg_progress = Float32()
                            msg_progress.data = self.coverage_index / len(self.coverage_poses)
                            self.coverage_progress_cb(msg_progress)  # mettre à jour variable interne
                            msg_line = Int32()
                            msg_line.data = self.coverage_index
                            self.coverage_line_cb(msg_line)  # publier ligne actuelle
                            next_pose = self.coverage_poses[self.coverage_index]
                            self.get_logger().info(f"[[{self.status.name}].[{self.step.name}]: GoToPose : {self.coverage_index + 1}/{len(self.coverage_poses)}")
                            self.navigator.goToPose(next_pose)
                        else:
                            self.coverage_done = True
                            self.coverage_in_progress = False
                            self.get_logger().info(f"[{self.status.name}].[{self.step.name}]: Coverage completed")
                            self.step=MissionStep.RETURN_TO_BASE
                            self.return_cause=ReturnCause.MISSION_COMPLETE
                            self.publish_state("COVERAGE -> RETURN_TO_BASE | MISSION_COMPLETE")

            if self.weather_pause:
                self.step=MissionStep.RETURN_TO_BASE
                self.return_cause=ReturnCause.WEATHER
                self.get_logger().info(f"[{self.status.name}].[{self.step.name}] : Weather condition KO")

            if not self.battery:
                self.step=MissionStep.RETURN_TO_BASE
                self.return_cause=ReturnCause.BATTERY
                self.get_logger().info(f"[{self.status.name}].[{self.step.name}] : Battery condition KO")              

        if self.step == MissionStep.RETURN_TO_BASE:
            self.publish_lame_speed(0.0)
            if not hasattr(self, "base_target"):
                self.base_target = self.gps_to_map_pose(
                    self.dock_gps['latitude'],
                    self.dock_gps['longitude'],
                    self.dock_gps.get('altitude', 0.0)
                )
            if not self.go_to_base_in_progress:
                self.save_resume_context()
                carrot_goal = self.compute_carrot_goal(self.base_target)
                self.navigator.goToPose(carrot_goal)
                self.go_to_base_in_progress = True
                self.get_logger().info("Return to base started (Pure Pursuit)")
            if self.navigator.isTaskComplete():
                if self.distance_to_pose(self.base_target) < 1.0:
                    if self.return_cause == ReturnCause.MISSION_COMPLETE:
                        self.go_to_base_in_progress = False
                        self.status = MissionStatus.COMPLETE
                        self.stop_motor()
                        self.get_logger().info("Robot docked")
                        self.publish_state("RETURN_TO_BASE -> COMPLETE")
                    else:
                        self.go_to_base_in_progress = False
                        self.status = MissionStatus.PAUSED
                        self.stop_motor()
                        self.get_logger().info("Robot returned to dock (pause)")
                        self.publish_state("RETURN_TO_BASE -> PAUSED")
                else:
                    carrot_goal = self.compute_carrot_goal(self.base_target)
                    self.navigator.goToPose(carrot_goal)

        if self.status == MissionStatus.PAUSED:
            if not self.weather_pause and self.battery: #optimisation démarrage si battery >95% 
                self.get_logger().info(f"[{self.status.name}]: Battery or weather OK")
                self.start_motor()
                if self.navigator.isTaskComplete(): 
                    self.restore_resume_context()
                    self.get_logger().info(f"[{self.status.name}]: Restore contexte for resume")
                    if self.step==MissionStep.COVERAGE:
                        self.navigator.goToPose(self.coverage_poses[self.coverage_index])
                        self.status=MissionStatus.RESUME
                        self.get_logger().info(f"[{self.status.name}]: NavToPose for resume")
                        self.publish_state("PAUSED -> RESUME")
        
        if self.status==MissionStatus.RESUME:
            result = self.navigator.getResult()
            if result == GoalStatus.STATUS_SUCCEEDED:                                 
                self.status = MissionStatus.RUNNING
                self.get_logger().info(f"[{self.status.name}]: Resume complete. Start Running...")
                self.publish_state("RESUME -> RUNNING")

        if self.status == MissionStatus.COMPLETE:
            self.coverage_poses=None #purge des données de poses
            self.current_mission=None #purge de la mission
            self.coverage_index = 0 #recalage de l'index coverage au début de carte
            self.get_logger().info(f"[{self.status.name}]: ✅ Mission complete !")
            self.status = MissionStatus.WAIT_MISSION
            self.publish_state("COMPLETE -> WAIT_MISSION")

        if self.status == MissionStatus.ERROR:
            #Erreur détectée et init demandé
            self.status = MissionStatus.NONE

# ================= MAIN =================
def main():
    rclpy.init()
    node = MissionManager()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info("Mission Manager interrupted by user")
    finally:
        node.get_logger().info("Shutting down Mission Manager")
        rclpy.shutdown()


if __name__ == '__main__':
    main()