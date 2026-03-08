import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient

from nav_msgs.msg import Path
from geometry_msgs.msg import PoseStamped
from std_msgs.msg import Float32, Bool, Int32

from nav2_msgs.action import FollowPath
import math


class PathFollower(Node):

    def __init__(self):
        super().__init__('path_follower')

        # Action client Nav2 FollowPath
        self._action_client = ActionClient(self, FollowPath, '/follow_path')

        # Subscribers
        self.create_subscription(Path, '/coverage/path', self.path_callback, 10)
        self.create_subscription(Int32, '/coverage/resume_line', self.resume_cb, 10)

        # Publishers
        self.progress_pub = self.create_publisher(Float32, '/coverage/progress', 10)
        self.done_pub = self.create_publisher(Bool, '/coverage/done', 10)
        self.line_pub = self.create_publisher(Int32, '/coverage/line', 10)

        # Path / lignes
        self.path_points = []
        self.line_start_indices = []
        self.line_end_indices = []
        self.resume_line = 0
        self.current_index = 0
        self.line_id = 0
        self.total_points = 0
        self.execution_active = False

        self.get_logger().info("✅ PathFollower READY")

    # ------------------ CALLBACKS ------------------
    def path_callback(self, msg: Path):
        if self.execution_active:
            self.get_logger().info("Coverage already running → ignoring new path")
            return

        if not msg.poses:
            self.get_logger().warn("Empty path received")
            return

        self.get_logger().info(f"Received coverage path with {len(msg.poses)} poses")

        # Stockage path + détection des lignes
        self.path_points = msg.poses
        self.total_points = len(self.path_points)
        self.detect_lines()

        # Calcul du point de départ via resume_line
        start_idx = self.line_to_index(self.resume_line)
        self.current_index = start_idx
        self.line_id = self.resume_line
        self.execution_active = True

        # Slice path depuis start_idx pour reprendre correctement
        sliced_path = Path()
        sliced_path.header = msg.header
        sliced_path.poses = msg.poses[start_idx:]

        # Publie ligne de reprise
        line_msg = Int32()
        line_msg.data = self.line_id
        self.line_pub.publish(line_msg)

        # Lance FollowPath action
        self.send_follow_path_goal(sliced_path)

    def resume_cb(self, msg: Int32):
        # Reprendre au début de la ligne précédente
        self.resume_line = max(0, msg.data - 1)
        self.get_logger().info(f"Resuming coverage from start of line {self.resume_line}")

    # ------------------ NAV2 ACTION ------------------
    def send_follow_path_goal(self, path: Path):
        if not self._action_client.wait_for_server(timeout_sec=5.0):
            self.get_logger().error("FollowPath action server not available")
            return

        goal_msg = FollowPath.Goal()
        goal_msg.path = path
        goal_msg.controller_id = ""
        goal_msg.goal_checker_id = ""

        self._send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )
        self._send_goal_future.add_done_callback(self.goal_response_callback)

    def goal_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().error("FollowPath goal rejected")
            self.execution_active = False
            return
        self.get_logger().info("FollowPath goal accepted")
        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.result_callback)

    def feedback_callback(self, feedback_msg):
        feedback = feedback_msg.feedback
        current_pose = feedback.current_pose

        if not self.path_points:
            return

        idx, progress_ratio = self.project_on_path(current_pose)

        # On ne met à jour que si changement réel
        if idx == self.current_index:
            return

        self.current_index = idx

        # Publie progression
        progress = Float32()
        progress.data = progress_ratio
        self.progress_pub.publish(progress)

        # Gestion de fin de ligne
        if idx in self.line_end_indices and idx > 0:
            line_msg = Int32()
            line_msg.data = self.line_id
            self.line_pub.publish(line_msg)
            self.get_logger().info(f"Line {self.line_id} completed")
            self.line_id += 1

    def result_callback(self, future):
        result = future.result().result
        self.get_logger().info("Coverage execution finished")
        done_msg = Bool()
        done_msg.data = True
        self.done_pub.publish(done_msg)
        self.execution_active = False

    # ------------------ DETECTION DES LIGNES ------------------
    def detect_lines(self):
        """Détecte les lignes pour l’optimisation agricole (parallèles)."""
        self.line_start_indices = [0]
        self.line_end_indices = []

        for i in range(1, len(self.path_points)-1):
            p0 = self.path_points[i-1].pose.position
            p1 = self.path_points[i].pose.position
            p2 = self.path_points[i+1].pose.position

            dx1, dy1 = p1.x - p0.x, p1.y - p0.y
            dx2, dy2 = p2.x - p1.x, p2.y - p1.y
            angle = abs(dx1*dy2 - dy1*dx2)
            if angle > 0.1:  # seuil empirique
                self.line_end_indices.append(i)
                self.line_start_indices.append(i+1)

        self.line_end_indices.append(len(self.path_points)-1)
        self.get_logger().info(f"Detected {len(self.line_start_indices)} lines")

    def line_to_index(self, line_id):
        if not self.line_start_indices:
            return 0
        line_id = min(line_id, len(self.line_start_indices)-1)
        return self.line_start_indices[line_id]

    # ------------------ PROJECTION SUR LE PATH ------------------
    def project_on_path(self, current_pose: PoseStamped):
        if not self.path_points:
            return 0, 0.0

        min_dist = float('inf')
        closest_idx = 0
        progress_ratio = 0.0

        for i in range(len(self.path_points)-1):
            p_start = self.path_points[i].pose.position
            p_end = self.path_points[i+1].pose.position

            vx, vy = p_end.x - p_start.x, p_end.y - p_start.y
            ux, uy = current_pose.pose.position.x - p_start.x, current_pose.pose.position.y - p_start.y

            seg_len2 = vx*vx + vy*vy
            t = 0.0 if seg_len2 == 0 else max(0.0, min(1.0, (ux*vx + uy*vy)/seg_len2))

            proj_x = p_start.x + t*vx
            proj_y = p_start.y + t*vy

            dist2 = (proj_x - current_pose.pose.position.x)**2 + (proj_y - current_pose.pose.position.y)**2
            if dist2 < min_dist:
                min_dist = dist2
                closest_idx = i
                progress_ratio = (i + t)/(len(self.path_points)-1)

        return closest_idx, progress_ratio


def main(args=None):
    rclpy.init(args=args)
    node = PathFollower()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()