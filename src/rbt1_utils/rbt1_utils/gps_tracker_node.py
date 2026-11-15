#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
import sqlite3
import json
import os
from math import radians, cos, sin, asin, sqrt

# Messages et Services ROS 2
from sensor_msgs.msg import NavSatFix
from std_srvs.srv import Trigger # Remplacement temporaire pour l'exemple standard
# Note : Pour une implémentation de production, remplace par tes fichiers srv custom définis plus bas :
# from rbt1_interfaces.srv import GetMissionsList, GetGpsHistory


#Lorsque le RBT1 change de tâche ou démarre une nouvelle session 
# ex: piloté par ton automate principal ou un bouton de ton interface), 
# il te suffit de mettre à jour le paramètre dynamique current_mission_id du nœud depuis un terminal 
# ou un autre script pour segmenter le fichier SQLite instantanément :
# ros2 param set /gps_tracker_node current_mission_id "mission_ronde_nuit_12"



class GpsTrackerNode(Node):

    def __init__(self):
        super().__init__('gps_tracker_node')
        
        # PARAMÈTRES
        self.declare_parameter('db_path', 'rbt1_missions.db')
        self.declare_parameter('current_mission_id', 'mission_default')
        self.declare_parameter('min_distance_meters', 0.5) # Seuil de déplacement minimum
        
        self.db_path = self.get_parameter('db_path').get_parameter_value().string_value
        self.current_mission = self.get_parameter('current_mission_id').get_parameter_value().string_value
        self.min_dist = self.get_parameter('min_distance_meters').get_parameter_value().double_value
        
        self.last_saved_gps = None
        
        # INITIALISATION BDD
        self.init_database()
        
        # SOUSCRIPTION GPS
        self.gps_sub = self.create_subscription(
            NavSatFix,
            '/ublox_gps_node/fix',
            self.gps_callback,
            10
        )
        
        # SERVICES (Ajuste les types avec tes .srv custom si nécessaire)
        # Ici configuré avec l'interface générique pour la compatibilité immédiate
        self.srv_missions = self.create_service(
            Trigger, 
            '/get_missions_list', 
            self.get_missions_list_callback
        )
        self.srv_history = self.create_service(
            Trigger, # Remplacer par GetGpsHistory en production
            '/get_gps_history', 
            self.get_gps_history_callback
        )
        
        self.get_logger().info(f"🛰️ Nœud GPS Tracker initialisé. Mission actuelle : {self.current_mission}")

    def init_database(self):
        """ Crée le fichier SQLite et la table si inexistants. """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS gps_tracks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mission_id TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    def haversine_distance(self, lon1, lat1, lon2, lat2):
        """ Calcule la distance en mètres entre deux coordonnées géographiques """
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371000 # Rayon de la Terre en mètres
        return c * r

    def gps_callback(self, msg):
        """ Traite les coordonnées reçues en direct """
        # Ignorer si le fix GPS est mauvais
        if msg.status.status < 0:
            return

        current_lat = msg.latitude
        current_lon = msg.longitude

        # Vérification du déplacement minimal
        if self.last_saved_gps is not None:
            dist = self.haversine_distance(
                self.last_saved_gps[1], self.last_saved_gps[0],
                current_lon, current_lat
            )
            if dist < self.min_dist:
                return # Le robot n'a pas assez bougé, on n'enregistre rien

        # Sauvegarde en BDD
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO gps_tracks (mission_id, latitude, longitude) VALUES (?, ?, ?)",
                (self.current_mission, current_lat, current_lon)
            )
            conn.commit()
            conn.close()
            
            self.last_saved_gps = (current_lat, current_lon)
        except Exception as e:
            self.get_logger().error(f"Erreur écriture SQLite : {e}")

    def get_missions_list_callback(self, request, response):
        """ Retourne la liste unique de toutes les missions enregistrées """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT mission_id FROM gps_tracks ORDER BY id DESC")
            rows = cursor.fetchall()
            conn.close()
            
            missions = [row[0] for row in rows]
            
            # Formatage de la réponse attendue par le widget Web
            # Si tu passes par le service Trigger standard, on dévie le résultat dans 'message'
            response.success = True
            response.message = json.dumps(missions) 
        except Exception as e:
            response.success = False
            response.message = str(e)
        return response

    def get_gps_history_callback(self, request, response):
        """ Retourne le tracé complet d'une mission demandée """
        # Note d'adaptation : Si tu utilises Trigger pour tester rapidement, 
        # tu peux lire une mission via une variable ou tricher temporairement.
        # Avec ton srv custom, tu liras : mission_id = request.mission_id
        
        # Simulation d'extraction (Ici on récupère la mission courante ou la dernière si Trigger)
        mission_id = self.current_mission 
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute(
                "SELECT latitude, longitude FROM gps_tracks WHERE mission_id = ? ORDER BY id ASC",
                (mission_id,)
            )
            rows = cursor.fetchall()
            conn.close()
            
            # Conversion au format attendu par Leaflet: [ {"lat": X, "lon": Y}, ... ]
            points = [{"lat": row[0], "lon": row[1]} for row in rows]
            
            response.success = True
            response.message = json.dumps(points)
        except Exception as e:
            response.success = False
            response.message = str(e)
        return response

def main(args=None):
    rclpy.init(args=args)
    node = GpsTrackerNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()