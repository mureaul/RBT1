#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import subprocess
import json
import re

class WifiMonitorNode(Node):
    def __init__(self):
        super().__init__('wifi_monitor')
        
        self.declare_parameter('interface', 'wlan0')
        self.declare_parameter('publish_rate', 1.0) # en secondes
        
        self.interface = self.get_parameter('interface').value
        publish_rate = self.get_parameter('publish_rate').value
        
        self.publisher_ = self.create_publisher(String, '/state/wifi/status', 10)
        self.timer = self.create_timer(publish_rate, self.timer_callback)
        
        self.get_logger().info(f"Nœud wifi_monitor V7 démarré (Interface cible : {self.interface})")

    def timer_callback(self):
        wifi_data = self.get_wifi_info()
        
        msg = String()
        msg.data = json.dumps(wifi_data)
        self.publisher_.publish(msg)

    def get_wifi_info(self):
        ssid = "deconnecte"
        ip_address = "0.0.0.0"
        rssi = -100

        try:
            # 1. Récupération de l'adresse IP
            ip_proc = subprocess.run(['ip', '-4', 'addr', 'show', self.interface], capture_output=True, text=True, timeout=2)
            if ip_proc.returncode == 0:
                ip_match = re.search(r'inet\s+(\d+\.\d+\.\d+\.\d+)', ip_proc.stdout)
                if ip_match:
                    ip_address = ip_match.group(1)

            # 2. Récupération du RSSI (qui fonctionne désormais)
            try:
                with open('/proc/net/wireless', 'r') as f:
                    for line in f:
                        if self.interface in line:
                            parts = line.split()
                            if len(parts) >= 4:
                                rssi = int(float(parts[3]))
            except Exception:
                pass

            if rssi == -100 and ip_address != "0.0.0.0":
                link_proc = subprocess.run(['iw', 'dev', self.interface, 'link'], capture_output=True, text=True, timeout=2)
                if link_proc.returncode == 0:
                    signal_match = re.search(r'signal:\s*(-?\d+)\s*dBm', link_proc.stdout)
                    if signal_match:
                        rssi = int(signal_match.group(1))

            # 3. Récupération ciblée du SSID via iwgetid ou nmcli
            ssid_found = False
            
            # Essai 1 : iwgetid direct sur l'interface
            iwget_proc = subprocess.run(['iwgetid', '-r', self.interface], capture_output=True, text=True, timeout=2)
            if iwget_proc.returncode == 0 and iwget_proc.stdout.strip():
                ssid = iwget_proc.stdout.strip()
                ssid_found = True

            # Essai 2 : via nmcli si iwgetid échoue
            if not ssid_found:
                nmcli_proc = subprocess.run(['nmcli', '-t', '-f', 'ACTIVE,SSID', 'dev', 'wifi'], capture_output=True, text=True, timeout=2)
                if nmcli_proc.returncode == 0:
                    for line in nmcli_proc.stdout.splitlines():
                        parts = line.split(':')
                        if len(parts) >= 2 and parts[0] == 'yes' and parts[1].strip():
                            ssid = parts[1].replace('\\:', ':').strip()
                            ssid_found = True
                            break

            # Essai 3 : via iw dev link si le SSID y est exposé
            if not ssid_found and ip_address != "0.0.0.0":
                link_proc = subprocess.run(['iw', 'dev', self.interface, 'link'], capture_output=True, text=True, timeout=2)
                if link_proc.returncode == 0:
                    ssid_match = re.search(r'SSID:\s*(.+)', link_proc.stdout)
                    if ssid_match:
                        ssid = ssid_match.group(1).strip()
                        ssid_found = True

            # Repli final par défaut si connecté (IP ou RSSI valide) mais SSID non résolu
            if not ssid_found and (ip_address != "0.0.0.0" or rssi > -90):
                ssid = "WiFi Connecté"

        except Exception as e:
            self.get_logger().debug(f"Erreur lors de la récupération des infos WiFi : {e}")

        return {
            "ssid": ssid,
            "ip_address": ip_address,
            "rssi": rssi
        }

def main(args=None):
    rclpy.init(args=args)
    node = WifiMonitorNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()