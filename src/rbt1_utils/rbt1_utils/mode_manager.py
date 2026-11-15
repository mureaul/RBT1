# ~/RBT1/src/rbt1_utils/mode_manager_node.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from std_srvs.srv import Trigger

# Import de ton service custom (adapte 'rbt1_interfaces' au nom réel de ton package)
from rbt1_interfaces.srv import SetMode

class ModeManager(Node):
    def __init__(self):
        super().__init__('mode_manager')
        self.mode = "IDLE" # Mode par défaut
        self.valid_modes = ["IDLE", "AUTO", "MANUAL", "STARTUP", "SHUTDOWN"]
        
        self.pub = self.create_publisher(String, '/state', 10)
        
        # Services distincts
        self.toggle_srv = self.create_service(Trigger, '/mode_manager/toggle_mode', self.toggle_callback)
        self.set_srv = self.create_service(SetMode, '/mode_manager/set_mode', self.set_callback)
        
        self.timer = self.create_timer(1.0, self.publish_mode)
        self.get_logger().info("🚀 Nœud mode_manager (avec SetMode.srv) démarré !")

    def publish_mode(self):
        msg = String()
        msg.data = self.mode
        self.pub.publish(msg)

    def set_callback(self, request, response):
        if request.mode in self.valid_modes:
            self.mode = request.mode
            msg = String()
            msg.data = self.mode
            self.pub.publish(msg)
            
            response.success = True
            response.message = f"Mode mis à jour avec succès : {self.mode}"
            self.get_logger().info(f"Mode système défini via service sur : {self.mode}")
        else:
            response.success = False
            response.message = f"Mode invalide : '{request.data}'. Modes autorisés : {', '.join(self.valid_modes)}"
            self.get_logger().warning(f"Tentative de définition d'un mode invalide : {request.data}")
            
        return response

    def toggle_callback(self, request, response):
        # Bascule entre AUTO et MANUAL
        if self.mode == "AUTO" or self.mode == "MANUAL":
            self.mode = "MANUAL" if self.mode == "AUTO" else "AUTO"
            response.success = True
            response.message = f"{self.mode}"
            
            msg = String()
            msg.data = self.mode
            self.pub.publish(msg)
            
            self.get_logger().info(f"Mode système basculé sur : {self.mode}")
        else:
            response.success = False
            response.message = f"Impossible de basculer depuis le mode {self.mode}"
            
        return response

def main():
    rclpy.init()
    node = ModeManager()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()