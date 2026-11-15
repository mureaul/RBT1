#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from std_srvs.srv import Trigger # Utilisation de Trigger pour simplifier, ou structure custom
import json
import os
from datetime import datetime

class BladeHistorian(Node):
    def __init__(self):
        super().__init__('blade_historian')
        self.declare_parameter('history_file_path', '/home/mureaul/RBT1/records/historian/blade_history_24h.json')
        self.history_file = self.get_parameter('history_file_path').get_parameter_value().string_value
        self.max_points = 7200
        self.save_interval_seconds = 60 
        self.history = self.load_history()
        self.last_telemetry_data = None

        self.create_subscription(String, '/state/lame_telemetry', self.blade_telemetry_callback, 10)
        self.srv = self.create_service(Trigger, '/blade_historian/get_history', self.get_history_callback)
        self.create_timer(self.save_interval_seconds, self.sample_data_callback)
        
        self.get_logger().info("🚀 Nœud blade_historian (Service Mode) démarré !")

    def blade_telemetry_callback(self, msg):
        try: self.last_telemetry_data = json.loads(msg.data)
        except: pass

    def load_history(self):
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, 'r') as f: return json.load(f)
            except: pass
        return {"timestamps": [], "state": [], "target_speed": [], "current_speed": [], "motor_current": [], "input_voltage": [], "esc_temp": [], "consumed_ah": []}

    def get_history_callback(self, request, response):
        response.success = True
        response.message = json.dumps(self.history)
        return response

    def sample_data_callback(self):
        if not self.last_telemetry_data: return
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.history["timestamps"].append(now)
        self.history["state"].append(str(self.last_telemetry_data.get("st", "UNKNOWN")))
        self.history["current_speed"].append(float(self.last_telemetry_data.get("cr", 0.0)))
        self.history["motor_current"].append(float(self.last_telemetry_data.get("i", 0.0)))
        self.history["input_voltage"].append(float(self.last_telemetry_data.get("v", 0.0)))
        self.history["esc_temp"].append(float(self.last_telemetry_data.get("te", 0.0)))
        self.history["consumed_ah"].append(float(self.last_telemetry_data.get("ah", 0.0)))
        
        if len(self.history["timestamps"]) > self.max_points:
            for key in self.history: self.history[key].pop(0)
        with open(self.history_file, 'w') as f: json.dump(self.history, f)

def main(args=None):
    rclpy.init(args=args)
    rclpy.spin(BladeHistorian())
    rclpy.shutdown()