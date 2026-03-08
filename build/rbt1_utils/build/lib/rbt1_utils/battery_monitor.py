import rclpy
from rclpy.node import Node
from std_msgs.msg import Bool, Float32

BATTERY_THRESHOLD = 30.0  # % minimal

class BatteryMonitor(Node):
    def __init__(self):
        super().__init__('battery_monitor')
        self.battery_ok = True

        # Subscriber: état batterie
        self.create_subscription(Float32, '/batterie_state', self.battery_cb, 10)

        # Publisher: état batterie
        self.pub = self.create_publisher(Bool, '/state/battery_ok', 10)

        # Timer pour publier régulièrement
        self.create_timer(1.0, self.publish_state)
        self.get_logger().info("Battery Monitor READY")

    def battery_cb(self, msg: Float32):
        self.battery_ok = msg.data >= BATTERY_THRESHOLD

    def publish_state(self):
        msg = Bool()
        #msg.data = self.battery_ok
        msg.data = True
        self.pub.publish(msg)

def main():
    rclpy.init()
    node = BatteryMonitor()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('Node stopped by user')
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
