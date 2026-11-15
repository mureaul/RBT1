#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import BatteryState
from std_msgs.msg import String
from std_srvs.srv import Trigger
import json
import os
from datetime import datetime

class BatteryHistorian(Node):
    def __init__(self):
        super().__init__('battery_historian')
        
        # Configurations : 7 jours à raison d'un point toutes les 10 minutes
        self.declare_parameter('history_file_path', '/home/mureaul/RBT1/records/historian/battery_history.json')
        self.history_file = self.get_parameter('history_file_path').get_parameter_value().string_value
        
        self.max_points = 7200
        self.save_interval_seconds = 60 
        
        # État interne (clés standards issues de sensor_msgs/BatteryState)
        self.current_pct = None
        self.current_voltage = None
        self.current_current = None

        # Chargement ou initialisation
        self.history = self.load_history()

        # Souscription au topic de la batterie (adapté à l'architecture RBT1)
        self.battery_sub = self.create_subscription(BatteryState, '/battery', self.battery_callback, 10)
        self.sample_timer = self.create_timer(self.save_interval_seconds, self.sample_data_callback)
        self.srv = self.create_service(Trigger, '/battery_historian/get_history', self.get_history_callback)

        self.get_logger().info("Nœud Battery Historian (service mode) prêt et démarré")

    def battery_callback(self, msg):
        # Formatage standardisé des unités reçues
        raw_pct = msg.percentage
        if raw_pct > 0 and raw_pct <= 1.0:
            raw_pct *= 100
        self.current_pct = round(raw_pct, 1)
        self.current_voltage = round(msg.voltage, 2)
        self.current_current = round(msg.current, 2)

    def load_history(self):
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                self.get_logger().error(f"Erreur lors de la lecture du fichier d'historique : {e}")
        return {"timestamps": [], "percentages": [], "voltages": [], "currents": []}

    def save_history(self):
        try:
            # Création du dossier parent si nécessaire
            os.makedirs(os.path.dirname(self.history_file), exist_ok=True)
            with open(self.history_file, 'w') as f:
                json.dump(self.history, f)
        except Exception as e:
            self.get_logger().error(f"Erreur lors de l'écriture du fichier d'historique : {e}")

    def sample_data_callback(self):
        if self.current_pct is None and self.current_voltage is None and self.current_current is None:
            return
            
        now = datetime.now()
        time_label = now.strftime("%Y-%m-%d %H:%M")
        
        self.history["timestamps"].append(time_label)
        self.history["percentages"].append(self.current_pct)
        self.history["voltages"].append(self.current_voltage)
        self.history["currents"].append(self.current_current)
        
        # Nettoyage glissant (FIFO)
        if len(self.history["timestamps"]) > self.max_points:
            self.history["timestamps"].pop(0)
            self.history["percentages"].pop(0)
            self.history["voltages"].pop(0)
            self.history["currents"].pop(0)
            
        self.save_history()
        self.get_logger().info(f"Point enregistré : {self.current_pct}%, {self.current_voltage}V, {self.current_current}A")

    def get_history_callback(self, request, response):
        self.get_logger().info("Historique transmmis")
        response.success = True
        response.message = json.dumps(self.history)
        return response


def main(args=None):
    rclpy.init(args=args)
    node = BatteryHistorian()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()