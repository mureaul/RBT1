import rclpy
from rclpy.node import Node
from std_msgs.msg import Bool, Float32
from collections import deque
import time

PRESSURE_LIMIT = 1008.0
PRESSURE_DROP_LIMIT = -1.0   # hPa/hour
HUMIDITY_LIMIT = 80
TREND_WINDOW = 3600          # seconds

class WeatherMonitor(Node):

    def __init__(self):
        super().__init__('weather_monitor')

        self.pressure_ok = False
        self.humidity_ok = False
        self.trend_ok = True

        # historique pression (timestamp, pression)
        self.pressure_history = deque()

        # Subscribers
        self.create_subscription(Float32,'/state/internal_bmp180_pressure',self.pressure_cb,10)
        self.create_subscription(Float32,'/state/internal_humidity',self.humidity_cb,10)

        # Publisher
        self.pub = self.create_publisher(Bool, '/state/weather_ok', 10)

        # Timer
        self.create_timer(1.0, self.publish_state)
        self.get_logger().info("Weather Monitor READY")

    def pressure_cb(self, msg: Float32):
        pressure = msg.data
        now = time.time()
        # stocker historique
        self.pressure_history.append((now, pressure))
        # supprimer vieux samples
        while self.pressure_history and now - self.pressure_history[0][0] > TREND_WINDOW:
            self.pressure_history.popleft()
        # seuil pression
        self.pressure_ok = pressure >= PRESSURE_LIMIT
        # calcul tendance
        if len(self.pressure_history) >= 2:
            t0, p0 = self.pressure_history[0]
            t1, p1 = self.pressure_history[-1]
            delta_p = p1 - p0
            delta_t = (t1 - t0) / 3600.0  # heures
            trend = delta_p / delta_t
            self.trend_ok = trend >= PRESSURE_DROP_LIMIT
            self.get_logger().debug(f"Pressure trend: {trend:.2f} hPa/h")

    def humidity_cb(self, msg: Float32):
        self.humidity_ok = msg.data <= HUMIDITY_LIMIT

    def publish_state(self):
        weather_ok = (self.pressure_ok and self.humidity_ok and self.trend_ok)
        msg = Bool()
        #msg.data = weather_ok
        msg.data=True
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