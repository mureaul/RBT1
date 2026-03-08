import rclpy
from rclpy.node import Node
import subprocess
import time
import threading
import os
import math

from datetime import datetime
from std_msgs.msg import Float32
from sensor_msgs.msg import Imu, LaserScan, NavSatFix
from std_msgs.msg import Bool as BoolMsg
from nav_msgs.msg import Odometry
from std_srvs.srv import Empty
from tf2_msgs.msg import TFMessage
from nav2_msgs.srv import ManageLifecycleNodes
from geometry_msgs.msg import PoseWithCovarianceStamped
from rbt1_interfaces.msg import MissionCommand, MissionState

from lifecycle_msgs.srv import GetState, ChangeState
from lifecycle_msgs.msg import Transition


class Orchestrator(Node):

    def __init__(self):
        super().__init__('bringup_orchestrator')

        self.processes = []
        self.last_msg_time = {}
        self.state_received = None

        # Publisher permanent pour initialpose
        self.initial_pose_pub = self.create_publisher(PoseWithCovarianceStamped, '/initialpose', 10)
        self.subscriber = self.create_subscription(MissionState,'/mission/state',self.mission_state_callback,10)

        threading.Thread(target=self.run_sequence, daemon=True).start()

    # CALLBACK ====================================
    def mission_state_callback(self, msg: MissionState):
        self.state_received = msg


    # ==========================================================
    # 🔁 TOPIC + FRÉQUENCE (bloquant)
    # ==========================================================
    def wait_for_topic_freq(self, topic, msg_type, min_hz, timeout=None):
        self.get_logger().info(f"Waiting for {topic} @ {min_hz} Hz ...")

        last_times = []

        def cb(msg):
            now = time.time()
            last_times.append(now)
            if len(last_times) > 10:
                last_times.pop(0)

        sub = self.create_subscription(msg_type, topic, cb, 10)

        start = time.time()
        while rclpy.ok():
            if timeout and (time.time() - start) > timeout:
                raise RuntimeError(f"Timeout waiting for {topic}")

            if len(last_times) >= 2:
                dt = last_times[-1] - last_times[0]
                freq = (len(last_times) - 1) / dt if dt > 0 else 0.0
                if freq >= min_hz:
                    self.get_logger().info(f"{topic} OK ({freq:.1f} Hz) ✔")
                    self.destroy_subscription(sub)
                    return

            time.sleep(0.2)

    # ==========================================================
    # 🔁 TOPIC (présence uniquement)
    # ==========================================================
    def wait_for_topic_presence(self, topic_name, timeout=240.0):
        self.get_logger().info(f"Waiting for topic {topic_name} ...")

        start = time.time()
        while rclpy.ok():
            topics = self.get_topic_names_and_types()
            if any(topic_name == name for name, _ in topics):
                self.get_logger().info(f"Topic {topic_name} OK ✔")
                return True

            if time.time() - start > timeout:
                raise RuntimeError(f"Timeout waiting for topic {topic_name}")

            time.sleep(0.3)

    # ==========================================================
    # 🔁 SERVICE (présence uniquement)
    # ==========================================================
    def wait_for_service_presence(self, service_name, timeout=240.0):
        self.get_logger().info(f"Waiting for service {service_name} ...")

        start = time.time()
        while rclpy.ok():
            services = self.get_service_names_and_types()
            if any(service_name == name for name, _ in services):
                self.get_logger().info(f"Service {service_name} OK ✔")
                return True

            if time.time() - start > timeout:
                raise RuntimeError(f"Timeout waiting for service {service_name}")

            time.sleep(0.3)

    # ==========================================================
    # 🔁 LIFECYCLE
    # ==========================================================
    def wait_for_lifecycle_active(self, node_name):
        self.get_logger().info(f"Waiting for {node_name} to become ACTIVE ...")

        cli = self.create_client(GetState, f'/{node_name}/get_state')
        cli.wait_for_service()

        while rclpy.ok():
            future = cli.call_async(GetState.Request())
            rclpy.spin_until_future_complete(self, future)
            state = future.result().current_state.label

            if state == 'active':
                self.get_logger().info(f"{node_name} ACTIVE ✔")
                return

            time.sleep(0.5)

    def activate_lifecycle_node(self, node_name):
        cli = self.create_client(ChangeState, f'/{node_name}/change_state')
        cli.wait_for_service()

        req = ChangeState.Request()
        req.transition.id = Transition.TRANSITION_ACTIVATE
        cli.call_async(req)

    # ==========================================================
    # 🚀 PROCESS LAUNCH
    # ==========================================================
    def launch_ros_process(self, cmd):
        self.get_logger().info(f"Launching: {' '.join(cmd)}")
        env = os.environ.copy()
        env["PYTHONUNBUFFERED"] = "1"
        proc = subprocess.Popen(cmd, env=env)
        self.processes.append(proc)

    def launch_ros_process_no_log(self, cmd, name="process"):
        self.get_logger().info(f"Launching: {' '.join(cmd)}")
        env = os.environ.copy()
        env["PYTHONUNBUFFERED"] = "1"
        proc = subprocess.Popen(cmd, env=env, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        self.processes.append(proc)

    # ==========================================================
    #   SERVICE RPLIDAR STOP MOTOR
    # ==========================================================
    def stop_motor(self):
        self.get_logger().info("🛑 Sending STOP MOTOR command")

        client = self.create_client(Empty, '/stop_motor')

        if not client.wait_for_service(timeout_sec=3.0):
            self.get_logger().error("❌ /stop_motor service not available")
            return False

        req = Empty.Request()

        future = client.call_async(req)
        rclpy.spin_until_future_complete(self, future)

        if future.done():
            try:
                future.result()  # Empty_Response, rien à lire dedans
                self.get_logger().info("✅ Motor successfully stopped")
                return True
            except Exception as e:
                self.get_logger().error(f"❌ Motor stop failed: {e}")
                return False
        else:
            self.get_logger().error("❌ Service call did not complete")
            return False

    # ==========================================================
    # 🔁 WAIT FOR A SPECIFIC NAV2 LIFECYCLE NODE
    # ==========================================================
    def wait_for_nav2_node_active(self, node_name, timeout=180.0, stable_checks=2):

        self.get_logger().info(f"Waiting Nav2 node {node_name} to become ACTIVE...")

        srv = f'/{node_name}/get_state'
        client = self.create_client(GetState, srv)

        start_time = time.time()

        if not client.wait_for_service(timeout_sec=timeout):
            raise RuntimeError(f"{node_name} lifecycle service not available")

        stable_count = 0

        while rclpy.ok():

            if time.time() - start_time > timeout:
                raise RuntimeError(f"Timeout waiting {node_name} ACTIVE")

            future = client.call_async(GetState.Request())
            while rclpy.ok() and not future.done():
                rclpy.spin_once(self, timeout_sec=0.1)
            
            result = future.result()
            if result is None:
                time.sleep(0.5)
                continue

            state = result.current_state.label

            if state == "active":
                stable_count += 1
                self.get_logger().info(
                    f"{node_name} ACTIVE check {stable_count}/{stable_checks}"
                )

                if stable_count >= stable_checks:
                    self.get_logger().info(f"✅ {node_name} ACTIVE ✔")
                    # Si c'est AMCL, publier initialpose
                    if node_name == "amcl":
                        self.publish_initial_pose()
                    return
            else:
                stable_count = 0
                self.get_logger().info(f"{node_name} state = {state}")

            time.sleep(0.5)

    # ==========================================================
    # 📍 PUBLISH INITIAL POSE
    # ==========================================================
    def publish_initial_pose(self, x=0.0, y=0.0, yaw=0.0, frame_id="map"):
        """Publie initialpose pour AMCL sur /initialpose"""
        msg = PoseWithCovarianceStamped()
        msg.header.stamp = rclpy.time.Time().to_msg()
        msg.header.frame_id = frame_id
        msg.pose.pose.position.x = x
        msg.pose.pose.position.y = y
        msg.pose.pose.position.z = 0.0

        # Calcul quaternion Z seulement
        qz = math.sin(yaw / 2.0)
        qw = math.cos(yaw / 2.0)

        msg.pose.pose.orientation.x = 0.0
        msg.pose.pose.orientation.y = 0.0
        msg.pose.pose.orientation.z = qz
        msg.pose.pose.orientation.w = qw

        # Covariance par défaut
        msg.pose.covariance = [0.0]*36
        msg.pose.covariance[0] = 0.25  # x
        msg.pose.covariance[7] = 0.25  # y
        msg.pose.covariance[35] = 0.0685  # yaw

        # Publier plusieurs fois pour s'assurer qu'AMCL le reçoit
        for _ in range(3):
            self.initial_pose_pub.publish(msg)
            time.sleep(0.2)

        self.get_logger().info(f"📍 Initial pose published at x={x}, y={y}, yaw={yaw}")

    
    # ======================================
    # CHECK Mission MANAGER WAIT
    # ======================================
    def wait_for_wait_mission(self, timeout_sec=10.0):
        import time
        start_time = time.time()
        while self.state_received == None:
            rclpy.spin_once(self, timeout_sec=0.1)
            if self.state_received:
                if self.state_received.state == "WAIT_MISSION":
                    self.get_logger().info("✅ MissionState WAIT_MISSION reçu")
                    return True
            if time.time() - start_time > timeout_sec:
                self.get_logger().error("⛔ Timeout: WAIT_MISSION non reçu")
                return False
        return False




    # ==========================================================
    # 🧠 SEQUENCE PRINCIPALE
    # ==========================================================
    def run_sequence(self):
        config_dir = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'config')

        # -------------------------------
        # micro-ROS
        # -------------------------------
        self.wait_for_topic_freq('/imu/data', Imu, 5.0)
        self.get_logger().info("✅ MicroRos LORA sucessfully launched")

        self.wait_for_topic_presence('/state/lame_speed')
        self.get_logger().info("✅ MicroRos MOTORS sucessfully launched")

        # -------------------------------
        # Heartbeat
        # -------------------------------
        self.launch_ros_process(['ros2', 'run','rbt1_utils', 'heartbeat_node'])
        self.wait_for_topic_freq('/heartbeat/ros', BoolMsg, 1.0)
        self.get_logger().info("✅ Heartbeat_node sucessfully launched")

        # -------------------------------
        # weather_monitor
        # -------------------------------
        self.launch_ros_process(['ros2', 'run','rbt1_utils', 'weather_monitor_node'])
        self.wait_for_topic_freq('/state/weather_ok', BoolMsg, 1.0)
        self.get_logger().info("✅ Weather_monitor_node sucessfully launched")

        # -------------------------------
        # battery_monitor
        # -------------------------------
        self.launch_ros_process(['ros2', 'run','rbt1_utils', 'battery_monitor_node'])
        self.wait_for_topic_freq('/state/battery_ok', BoolMsg, 1.0)
        self.get_logger().info("✅ Baterry_monitor_node sucessfully launched")

        # -------------------------------
        # Robot description
        # -------------------------------
        self.launch_ros_process(['ros2', 'launch','rbt1_description', 'robot_state_publisher.launch.py'])
        self.wait_for_topic_presence('/robot_description')
        self.get_logger().info("✅ robot_state_publisher sucessfully launched")

        # -------------------------------
        # LIDAR
        # -------------------------------
        self.launch_ros_process(['ros2', 'launch','rplidar_ros', 'rplidar_c1_launch.py'])
        self.wait_for_topic_freq('/scan', LaserScan, 5.0)
        self.get_logger().info("✅ rpLidar sucessfully launched")

        # -------------------------------
        # GPS
        # -------------------------------
        self.launch_ros_process(['ros2', 'launch','ublox_gps', 'ublox_gps_node-launch.py'])
        self.wait_for_topic_freq('/ublox_gps_node/fix', NavSatFix, 1)
        self.get_logger().info("✅ GPS sucessfully launched")

        # -------------------------------
        # Generate maps & coverage
        # -------------------------------
        self.get_logger().info("🚀 Generating maps & coverage files...")
        result = subprocess.run(["ros2", "run", "rbt1_navigation", "map_generator"],capture_output=True,text=True)
        if result.returncode == 0:
            self.get_logger().info("✅ Map & coverage generation finished successfully")
        else:
            self.get_logger().error(f"❌ Map generation failed:\n{result.stderr}")
            raise RuntimeError("Map generation failed, aborting bringup")
        self.get_logger().info("Maps & coverage ready ✔")

        # -------------------------------
        # EKF + NAV2
        # -------------------------------
        self.launch_ros_process(['ros2', 'launch','rbt1_navigation', 'nav2_gps.launch.py'])
        self.wait_for_service_presence('/lifecycle_manager_navigation/manage_nodes')
        self.wait_for_nav2_node_active('map_server')
        self.wait_for_nav2_node_active('amcl')  # initialpose publié automatiquement ici
        self.wait_for_nav2_node_active('controller_server')
        self.wait_for_nav2_node_active('smoother_server')
        self.wait_for_nav2_node_active('planner_server')
        self.wait_for_nav2_node_active('route_server')
        self.wait_for_nav2_node_active('behavior_server')
        self.wait_for_nav2_node_active('velocity_smoother')
        self.wait_for_nav2_node_active('collision_monitor')
        self.wait_for_nav2_node_active('bt_navigator')
        self.wait_for_nav2_node_active('waypoint_follower')
        self.wait_for_nav2_node_active('docking_server')
        self.get_logger().info("✅ EKF + NAV2 sucessfully launched")        

        # -------------------------------
        # mission manager
        # -------------------------------
        #self.launch_ros_process(['ros2', 'run','rbt1_navigation', 'mission_manager'])
        #self.wait_for_topic_presence('/mission/state')
        #self.wait_for_wait_mission(timeout_sec=120.0)
        #self.get_logger().info("✅ Mission Manager sucessfully launched")

        # -------------------------------
        # mission orchestrator
        # -------------------------------
        #self.launch_ros_process(['ros2', 'run','rbt1_navigation', 'mission_orchestrator'])
        #self.wait_for_topic_presence('/mission/command')
        #self.get_logger().info("✅ Mission Orchestrator sucessfully launched")

        self.get_logger().info("🚜 Bringup fully started ✔ ---------------")

    # ==========================================================
    def destroy_node(self):
        self.get_logger().info("Stopping launched processes...")
        self.stop_motor()
        for p in self.processes:
            p.terminate()
        super().destroy_node()


def main():
    rclpy.init()
    node = Orchestrator()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()