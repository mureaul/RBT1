#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32, String
from std_srvs.srv import Trigger
import json
import os
from datetime import datetime

class AmbianceHistorian(Node):
    def __init__(self):
        super().__init__('ambiance_historian')
        
        # Configurations
        self.declare_parameter('history_file_path', '/home/mureaul/RBT1/records/historian/ambiance_history.json')
        self.history_file = self.get_parameter('history_file_path').get_parameter_value().string_value
        
        self.max_points = 7200
        self.save_interval_seconds = 60
        
        # État interne des dernières mesures reçues
        self.current_temp = None
        self.current_hum = None
        self.current_pressure = None

        # Chargement de l'historique existant ou initialisation
        self.history = self.load_history()

        # Souscriptions aux capteurs (reprend les topics configurés de votre robot)
        self.temp_sub = self.create_subscription(Float32, '/state/internal_temperature', self.temp_callback, 10)
        self.hum_sub = self.create_subscription(Float32, '/state/internal_humidity', self.hum_callback, 10)
        self.pressure_sub = self.create_subscription(Float32, '/state/internal_bmp180_pressure', self.pressure_callback, 10)
        
        self.srv = self.create_service(Trigger, '/ambiance_historian/get_history', self.get_history_callback)

        # Timers : Un pour l'échantillonnage de l'historique, un pour la publication régulière vers l'interface
        self.sample_timer = self.create_timer(self.save_interval_seconds, self.sample_data_callback)
        
        self.get_logger().info("Nœud Ambiance Historian (service mode) prêt et démarré.")

    def temp_callback(self, msg):
        self.current_temp = round(msg.data, 1)

    def hum_callback(self, msg):
        self.current_hum = round(msg.data, 0)

    def pressure_callback(self, msg):
        self.current_pressure = round(msg.data, 0)

    def load_history(self):
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                self.get_logger().error(f"Erreur lors de la lecture du fichier d'historique : {e}")
        return {"timestamps": [], "temperatures": [], "humidities": [], "pressures": [] }

    def save_history(self):
        try:
            with open(self.history_file, 'w') as f:
                json.dump(self.history, f)
        except Exception as e:
            self.get_logger().error(f"Erreur lors de l'écriture du fichier d'historique : {e}")

    def sample_data_callback(self):
        # N'enregistre que si au moins une donnée est disponible
        if self.current_temp is None and self.current_hum is None and self.current_pressure is None:
            return
            
        now = datetime.now()
        time_label = now.strftime("%Y-%m-%d %H:%M")
        
        self.history["timestamps"].append(time_label)
        self.history["temperatures"].append(self.current_temp)
        self.history["humidities"].append(self.current_hum)
        self.history["pressures"].append(self.current_pressure)
        
        # Limite de l'historique glissant
        if len(self.history["timestamps"]) > self.max_points:
            self.history["timestamps"].pop(0)
            self.history["temperatures"].pop(0)
            self.history["humidities"].pop(0)
            self.history["pressuress"].pop(0)
            
        self.save_history()
        self.get_logger().info(f"Nouveau point d'historique enregistré : T={self.current_temp}°C, H={self.current_hum}%, P={self.current_pressure}hPa")

    def get_history_callback(self, request, response):
        self.get_logger().info("Transmission de l'historique réussi")
        response.success = True
        response.message = json.dumps(self.history)
        return response


def main(args=None):
    rclpy.init(args=args)
    node = AmbianceHistorian()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()