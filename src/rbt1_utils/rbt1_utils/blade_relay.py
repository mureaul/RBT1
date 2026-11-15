#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32

class BladeRelay(Node):
    def __init__(self):
        super().__init__('blade_relay')
        
        # 1. Souscription au topic instable du Web (2 Hz suffisent maintenant)
        self.sub = self.create_subscription(
            Float32,
            '/cmd/lame_speed_web',
            self.web_callback,
            10
        )
        
        # 2. Publication sur le vrai topic attendu par la lame
        self.pub = self.create_publisher(Float32, '/cmd/lame_speed', 10)
        
        # Variables d'état
        self.last_blade_speed = 0.0
        self.last_msg_time = self.get_clock().now()
        
        # 3. Boucle haute fréquence (20 Hz -> toutes les 0.05 secondes)
        self.timer_publish = self.create_timer(0.5, self.publish_loop)
        
        # 4. Chien de garde (Watchdog) à 1 Hz pour vérifier la connexion web
        self.timer_watchdog = self.create_timer(10, self.watchdog_check)
        
        self.get_logger().info("✅ Relais de sécurité pour la lame démarré !")

    def web_callback(self, msg):
        # On stocke la consigne reçue et on rafraîchit le timestamp
        self.last_blade_speed = msg.data
        self.last_msg_time = self.get_clock().now()

    def publish_loop(self):
        # On publie en boucle continue la dernière consigne connue
        msg = Float32()
        msg.data = self.last_blade_speed
        self.pub.publish(msg)

    def watchdog_check(self):
        # Si aucun message du web depuis plus de 1 seconde -> Arrêt d'urgence
        now = self.get_clock().now()
        duration = now - self.last_msg_time
        
        if duration.nanoseconds > 1e9 and self.last_blade_speed != 0.0:
            self.get_logger().warn("🚨 Perte du signal Web ! Arrêt de sécurité de la lame.")
            self.last_blade_speed = 0.0

def main(args=None):
    rclpy.init(args=args)
    node = BladeRelay()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()