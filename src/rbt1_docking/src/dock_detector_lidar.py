import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import PoseStamped
from std_msgs.msg import Bool
import numpy as np
import math


class DockDetector(Node):

    def __init__(self):
        super().__init__('dock_detector_lidar')

        self.create_subscription(LaserScan, '/scan', self.scan_cb, 10)

        self.pose_pub = self.create_publisher(PoseStamped, '/dock/pose', 10)
        self.visible_pub = self.create_publisher(Bool, '/dock/visible', 10)

        self.get_logger().info("👁️ Dock LiDAR detector started")

    def scan_cb(self, scan: LaserScan):
        ranges = np.array(scan.ranges)
        angles = scan.angle_min + np.arange(len(ranges)) * scan.angle_increment

        valid = np.isfinite(ranges)
        ranges = ranges[valid]
        angles = angles[valid]

        if len(ranges) < 50:
            self.publish_visible(False)
            return

        # Mur arrière ≈ distance constante sur ±10°
        mask = np.abs(angles) < math.radians(10)
        wall_ranges = ranges[mask]

        if len(wall_ranges) < 10:
            self.publish_visible(False)
            return

        std = np.std(wall_ranges)

        if std < 0.05:
            distance = np.mean(wall_ranges)
            self.publish_dock_pose(distance)
            self.publish_visible(True)
        else:
            self.publish_visible(False)

    def publish_dock_pose(self, distance):
        pose = PoseStamped()
        pose.header.frame_id = 'base_link'
        pose.header.stamp = self.get_clock().now().to_msg()

        pose.pose.position.x = distance
        pose.pose.orientation.w = 1.0

        self.pose_pub.publish(pose)

    def publish_visible(self, visible):
        msg = Bool()
        msg.data = visible
        self.visible_pub.publish(msg)


def main():
    rclpy.init()
    node = DockDetector()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
