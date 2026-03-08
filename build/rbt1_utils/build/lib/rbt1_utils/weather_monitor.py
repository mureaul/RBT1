import rclpy
from rclpy.node import Node
from std_msgs.msg import Bool, Float32

PRESSURE_LIMIT = 1013.0

class WeatherMonitor(Node):
    def __init__(self):
        super().__init__('weather_monitor')
        self.weather_ok = True

        # Subscriber: pression
        self.create_subscription(Float32, '/state/internal_bmp180_pressure', self.pressure_cb, 10)

        # Publisher: état météo
        self.pub = self.create_publisher(Bool, '/state/weather_ok', 10)

        # Timer pour publier régulièrement
        self.create_timer(1.0, self.publish_state)
        self.get_logger().info("Weather Monitor READY")

    def pressure_cb(self, msg: Float32):
        self.weather_ok = msg.data >= PRESSURE_LIMIT

    def publish_state(self):
        msg = Bool()
        #msg.data = self.weather_ok
        msg.data = True
        self.pub.publish(msg)

def main():
    rclpy.init()
    node = WeatherMonitor()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('Node stopped by user')
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
