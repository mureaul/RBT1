import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist, PoseStamped
from std_msgs.msg import Bool
import math


class DockController(Node):

    def __init__(self):
        super().__init__('dock_controller_pid')

        self.target_pose = None
        self.contact = False

        self.create_subscription(PoseStamped, '/dock/pose', self.pose_cb, 10)
        self.create_subscription(Bool, '/dock/contact', self.contact_cb, 10)

        self.cmd_pub = self.create_publisher(Twist, '/cmd_vel', 10)

        self.timer = self.create_timer(0.05, self.update)

        self.Kp_dist = 0.5
        self.Kp_ang = 1.2

        self.get_logger().info("🤖 Dock PID controller started")

    def pose_cb(self, msg):
        self.target_pose = msg

    def contact_cb(self, msg):
        self.contact = msg.data

    def update(self):
        if self.target_pose is None or self.contact:
            self.stop()
            return

        x = self.target_pose.pose.position.x
        y = self.target_pose.pose.position.y

        dist_error = x
        ang_error = math.atan2(y, x)

        cmd = Twist()
        cmd.linear.x = max(min(self.Kp_dist * dist_error, 0.1), 0.02)
        cmd.angular.z = max(min(self.Kp_ang * ang_error, 0.3), -0.3)

        self.cmd_pub.publish(cmd)

    def stop(self):
        self.cmd_pub.publish(Twist())


def main():
    rclpy.init()
    node = DockController()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
