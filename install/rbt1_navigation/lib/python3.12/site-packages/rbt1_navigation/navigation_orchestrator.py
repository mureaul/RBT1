import os
import subprocess
import signal
import time
import yaml
import rclpy
from rclpy.node import Node
from std_srvs.srv import Trigger
from rbt1_interfaces.srv import LoadZone, NavigationStatus
from lifecycle_msgs.srv import GetState, ChangeState
from lifecycle_msgs.msg import State, Transition
from nav2_msgs.srv import LoadMap, ManageLifecycleNodes
from rclpy.parameter import Parameter
from rcl_interfaces.srv import SetParameters
from rclpy.executors import SingleThreadedExecutor, MultiThreadedExecutor
from rclpy.callback_groups import ReentrantCallbackGroup


NAV2_LIFECYCLE_NODES = [
    'map_server',
    'amcl',
    'planner_server',
    'controller_server',
    'behavior_server',
    'bt_navigator',
    'waypoint_follower'
]

class NavigationOrchestrator(Node):

    def __init__(self):
        super().__init__('navigation_orchestrator')

        self.current_zone = None
        self.nav_process = None

        # ---- SERVICES ----
        self.cb_group = ReentrantCallbackGroup()
        self.create_service(LoadZone,'/nav2/load_zone',self.load_zone_cb,callback_group=self.cb_group)
        #self.create_service(LoadZone, '/nav2/load_zone', self.load_zone_cb)


        self.get_logger().info("✅ Navigation Orchestrator READY")


    # ==========================================================
    # 🔁 LIFECYCLE HELPERS
    # ==========================================================
    def change_state(self, node_name, transition_id):
        cli = self.create_client(ChangeState, f'/{node_name}/change_state')
        if not cli.wait_for_service(timeout_sec=3.0):
            self.get_logger().error(f"{node_name} change_state not available")
            return False

        req = ChangeState.Request()
        req.transition.id = transition_id

        future = cli.call_async(req)
        rclpy.spin_until_future_complete(self, future)

        return future.result() is not None and future.result().success

    def wait_for_state(self, node_name, target_state, timeout=60.0):
        cli = self.create_client(GetState, f'/{node_name}/get_state')

        if not cli.wait_for_service(timeout_sec=3.0):
            self.get_logger().error(f"/{node_name}/get_state not available")
            return False

        start_time = self.get_clock().now()

        while (self.get_clock().now() - start_time).nanoseconds < timeout * 1e9:
            future = cli.call_async(GetState.Request())
            while not future.done():
                rclpy.spin_once(self, timeout_sec=0.1)

            if future.result() is None:
                self.get_logger().warn(f"Failed to get state of {node_name}")
                continue

            state = future.result().current_state.label
            self.get_logger().debug(f"{node_name} state: {state}")

            if state == target_state:
                return True

            time.sleep(0.2)

        self.get_logger().error(f"Timeout waiting for {node_name} to reach state {target_state}")
        
        return False

    def lifecycle_transition_nav2_localization(self, command: int, timeout: float = 10.0) -> bool:
        #cli = self.create_client(ManageLifecycleNodes,'/lifecycle_manager_localization/manage_nodes')
        
        cli = self.create_client(ManageLifecycleNodes,'/lifecycle_manager_localization/manage_nodes',callback_group=self.cb_group)
        
        if not cli.wait_for_service(timeout_sec=5.0):
            self.get_logger().error("lifecycle_manager_localization not available")
            return False

        req = ManageLifecycleNodes.Request()
        req.command = command

        future = cli.call_async(req)

        self.get_logger().info(f"lancement demande de mise en pause nav2")
        rclpy.spin_until_future_complete(self, future, timeout_sec=timeout)
        self.get_logger().info(f"Process demande de mise en pause nav2 terminé")

        if not future.done():
            self.get_logger().error("Timeout waiting for lifecycle manager response")
            return False

        result = future.result()
        self.get_logger().info(f"result from lifecycle_manager_localization : {result}")
        self.get_logger().info(f"result.success from lifecycle_manager_localization : {result.success}")
        
        if result is None:
            self.get_logger().error("Lifecycle manager returned None")
            return False

        if not result.success:
            self.get_logger().error(f"Lifecycle transition failed: {result.message}")
            return False

        self.get_logger().info(f"Lifecycle transition {command} applied successfully")
        return True

    # ================= SERVICES =================

    def load_zone_cb(self, request, response):
        zone = request.zone
        self.get_logger().info(f"Request to load zone: {zone}")

        if zone == self.current_zone:
            response.success = True
            response.message = "Zone already loaded"
            return response

        #desactiver les noeuds nav2_localization
        #if not self.lifecycle_transition_nav2_localization(ManageLifecycleNodes.Request.PAUSE):
        #    response.success = False
        #    response.message = "Failed to deactivate localization"
        #    self.get_logger().info(f"Lifecycle nav2 a échoué : {response.message}")
        #    return response

        # Charger la carte
        maps_dir = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'maps')
        map_yaml_name = f"{zone}.yaml"
        map_yaml = os.path.join(maps_dir, map_yaml_name)

        if not self.load_map(map_yaml):
            response.success = False
            response.message = "Failed to load map"
            self.get_logger().info(f"Chargement de la carte {zone} a échoué")
            return response
        else:
            self.get_logger().info(f"Chargement de la carte {zone} réussie")
        
        # Paramètres spécifiques à la zone (OPTIONNEL)
        #self.set_node_parameters(
        #    'controller_server',
        #    {'max_vel_x': 0.3 if zone == 'zone1' else 0.6}
        #)

        # Charger paramètres NavSat zone
        self.get_logger().info("Updating NavSat parameters...")
        navsat_dir = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'config')
        navsat_yaml_name = f"{zone}_navsat.yaml"
        navsat_yaml = os.path.join(navsat_dir, navsat_yaml_name)
        if not self.load_yaml_parameters('navsat_transform', navsat_yaml):
            response.success = False
            response.message = "Failed to load NavSat parameters"
            return response

        # Tempo Stabilisation EKF
        self.get_logger().info("Waiting for navsat / EKF stabilization...")
        time.sleep(1.0)

        #activer les noeuds nav2_localization
        #if not self.lifecycle_transition_nav2_localization(ManageLifecycleNodes.Request.RESUME):
        #    response.success = False
        #    response.message = "Failed to activate localization"
        #    self.get_logger().info(f"Lifecycle nav2 a échoué : {response.message}")
        #    return response

        self.current_zone = zone
        response.success = True
        response.message = f"Zone {zone} loaded successfully"
        self.get_logger().info("Chargement de la carte terminée et nav2 reparamétré ✔")
        return response


    #------------ LOAD PARAMETERS -----------------------

    def load_map(self, map_yaml_path: str) -> bool:
        self.get_logger().info(f"Loading map: {map_yaml_path}")
        
        cli = self.create_client(LoadMap, '/map_server/load_map')
        if not cli.wait_for_service(timeout_sec=5.0):
            self.get_logger().error("/map_server/load_map not available")
            return False

        req = LoadMap.Request()
        req.map_url = map_yaml_path

        future = cli.call_async(req)
        executor = SingleThreadedExecutor()
        self.get_logger().info("Call to map_server/load_map sent")
        timeout = 60.0
        start_time = time.time()
        while not future.done() and (time.time() - start_time) < timeout:
            executor.spin_once(timeout_sec=0.1)
        
        if not future.done():
            self.get_logger().error("Timeout waiting for map_server/load_map response")
            return False
        
        if future.result() is None:
            self.get_logger().error("LoadMap service call failed")
            return False

        if future.result().result != future.result().RESULT_SUCCESS:
            self.get_logger().error("Map loading failed")
            return False

        self.get_logger().info("Map loaded successfully ✔")
        return True

    def load_yaml_parameters(self, node_name: str, yaml_path: str) -> bool:
        if not os.path.exists(yaml_path):
            self.get_logger().error(f"YAML not found: {yaml_path}")
            return False

        with open(yaml_path, 'r') as f:
            data = yaml.safe_load(f)

        # format ROS2 yaml: node_name: ros__parameters:
        params = data.get(node_name, {}).get('ros__parameters', {})
        if not params:
            self.get_logger().error(f"No parameters found for {node_name} in {yaml_path}")
            return False

        cli = self.create_client(SetParameters, f'/{node_name}/set_parameters')
        if not cli.wait_for_service(timeout_sec=3.0):
            self.get_logger().error(f"/{node_name}/set_parameters not available")
            return False

        req = SetParameters.Request()
        req.parameters = [
            Parameter(name=k, value=v).to_parameter_msg()
            for k, v in params.items()
        ]

        future = cli.call_async(req)
        rclpy.spin_until_future_complete(self, future)

        if future.result() is None:
            self.get_logger().error("SetParameters call failed")
            return False

        self.get_logger().info(f"Parameters applied to {node_name}")
        return True


    def _on_map_loaded(self, future):
        if future.result() is None:
            self.get_logger().error("LoadMap service call failed")
            return

        if future.result().result != LoadMap.Response.RESULT_SUCCESS:
            self.get_logger().error("Map loading failed")
            return

        self.get_logger().info("Map loaded successfully ✔")


    # -------------- CHANGER DES PARAMETRES DYNAMIQUES -----------------
    def set_node_parameters(self, node_name: str, params: dict) -> bool:
        cli = self.create_client(SetParameters, f'/{node_name}/set_parameters')
        if not cli.wait_for_service(timeout_sec=3.0):
            self.get_logger().error(f"{node_name}/set_parameters not available")
            return False

        req = SetParameters.Request()
        req.parameters = [
            Parameter(name=k, value=v).to_parameter_msg()
            for k, v in params.items()
        ]

        future = cli.call_async(req)
        rclpy.spin_until_future_complete(self, future)

        return future.result() is not None

def main():
    rclpy.init()
    node = NavigationOrchestrator()
    executor = MultiThreadedExecutor()
    executor.add_node(node)
    executor.spin()
    #rclpy.spin(node)
    node.stop_navigation()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
