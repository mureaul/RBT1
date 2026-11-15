import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseWithCovarianceStamped
from nav_msgs.msg import Odometry

class EKF2Pose(Node):
    def __init__(self):
        super().__init__('ekf2pose')
        self.pub = self.create_publisher(PoseWithCovarianceStamped, '/ekf_pose', 10)
        self.sub = self.create_subscription(Odometry, '/odometry/global', self.cb, 10)

    def cb(self, msg: Odometry):
        p = PoseWithCovarianceStamped()
        p.header = msg.header
        p.pose = msg.pose
        self.pub.publish(p)

def main(args=None):
    rclpy.init(args=args)
    node = EKF2Pose()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == "__main__":
    main()