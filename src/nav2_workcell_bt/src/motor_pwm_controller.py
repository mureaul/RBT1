#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import Bool
import time
import threading
import pigpio
import math


PWM_PIN = 18           # pin PWM (GPIO18 supporte PWM hardware)
PWM_FREQ = 1000        # fréquence PWM en Hz

RAMP_UP_TIME = 3.0     # durée rampe accélération
RAMP_DOWN_TIME = 2.0   # durée rampe décélération
PWM_MAX = 100          # pigpio dutycycle = 0–255

class MotorPWMController(Node):

    def __init__(self):
        super().__init__('motor_pwm_controller')

        # Initialisation pigpio
        self.pi = pigpio.pi()
        if not self.pi.connected:
            raise RuntimeError("Impossible de se connecter à pigpio. Assure-toi que 'pigpiod' tourne.")

        # config PWM
        self.pi.set_PWM_frequency(PWM_PIN, PWM_FREQ)
        self.pi.set_PWM_range(PWM_PIN, PWM_MAX)
        self.pi.set_PWM_dutycycle(PWM_PIN, 0)

        self.motor_running = False
        self.lock = threading.Lock()

        self.subscription = self.create_subscription(
            Bool,
            '/motor_rotate',
            self.motor_callback,
            10
        )

        self.get_logger().info("Motor PWM controller (pigpio) started.")

    # -------------------------------
    # Callback ROS /motor_rotate
    # -------------------------------
    def motor_callback(self, msg):
        with self.lock:
            if msg.data and not self.motor_running:
                self.motor_running = True
                threading.Thread(target=self.ramp_up, daemon=True).start()

            elif not msg.data and self.motor_running:
                self.motor_running = False
                threading.Thread(target=self.ramp_down, daemon=True).start()

    # -------------------------------
    # RAMP UP
    # -------------------------------
    def ramp_up(self):
        self.get_logger().info("S-curve ramp up starting...")

        steps = 200
        for i in range(steps + 1):
            if not self.motor_running:
                break

            # S-curve (sigmoid)
            x = (i / steps) * 12 - 6        # map [0,1] → [-6, +6]
            s = 1 / (1 + math.exp(-x))      # sigmoid
            duty = int(s * PWM_MAX)

            self.pi.set_PWM_dutycycle(PWM_PIN, duty)
            time.sleep(RAMP_UP_TIME / steps)

        self.get_logger().info("S-curve ramp up complete.")

    # -------------------------------
    # RAMP DOWN
    # -------------------------------
    def ramp_down(self):
        self.get_logger().info("S-curve ramp down starting...")

        steps = 200
        for i in range(steps + 1):

            # S-curve inverse
            x = (i / steps) * 12 - 6
            s = 1 / (1 + math.exp(-x))
            duty = int((1 - s) * PWM_MAX)

            self.pi.set_PWM_dutycycle(PWM_PIN, duty)
            time.sleep(RAMP_DOWN_TIME / steps)

        self.pi.set_PWM_dutycycle(PWM_PIN, 0)
        self.get_logger().info("S-curve ramp down complete.")
   

    # -------------------------------
    # Nettoyage
    # -------------------------------
    def destroy_node(self):
        self.pi.set_PWM_dutycycle(PWM_PIN, 0)
        self.pi.stop()
        super().destroy_node()


def main(args=None):
    rclpy.init(args=args)
    node = MotorPWMController()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()

