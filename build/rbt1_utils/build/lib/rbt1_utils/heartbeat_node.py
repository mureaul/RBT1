import rclpy
from rclpy.node import Node
from std_msgs.msg import Bool

class Heartbeat(Node):
    def __init__(self):
        super().__init__('heartbeat_node')
        self.pub = self.create_publisher(Bool, '/heartbeat/ros', 10)
        self.timer = self.create_timer(1.0, self.tick)

    def tick(self):
        msg = Bool()
        msg.data = True
        self.pub.publish(msg)

def main():
    rclpy.init()
    node = Heartbeat()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('Node stopped by user')
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
