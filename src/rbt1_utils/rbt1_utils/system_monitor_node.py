import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import psutil
import json

class SystemMonitorNode(Node):
    def __init__(self):
        super().__init__('system_monitor_node')
        self.publisher_ = self.create_publisher(String, '/state/system_status', 10)
        self.timer = self.create_timer(2.0, self.timer_callback) # Échantillonnage toutes les 2s

    def timer_callback(self):
        msg = String()
        
        # Récupération des données Ubuntu natives
        metrics = {
            "cpu": psutil.cpu_percent(),
            "ram": psutil.virtual_memory().percent,
            "temp": psutil.sensors_temperatures()['cpu_thermal'][0].current if 'cpu_thermal' in psutil.sensors_temperatures() else 45.0
        }
        
        msg.data = json.dumps(metrics)
        self.publisher_.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    node = SystemMonitorNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()