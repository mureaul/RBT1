#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import NavSatFix
from std_srvs.srv import Trigger
from rbt1_interfaces.srv import ZoneRecord 

# Importation des bibliothèques ROS pour le multi-threading
from rclpy.callback_groups import ReentrantCallbackGroup
from rclpy.executors import MultiThreadedExecutor

from shapely.geometry import Polygon
import utm
import simplekml
import os

DEFAULT_KML_DIR = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'maps', 'kml')

class GpsZoneRecorder(Node):
    def __init__(self):
        super().__init__('gps_zone_recorder_node')

        # --- PARAMÈTRES ---
        self.declare_parameter('output_kml_path', DEFAULT_KML_DIR)
        self.declare_parameter('tolerance_meters', 0.1)      
        self.declare_parameter('inflation_meters', 0.3)      
        self.declare_parameter('min_distance_between_points', 0.2) 

        self.kml_dir = self.get_parameter('output_kml_path').get_parameter_value().string_value
        self.tolerance = self.get_parameter('tolerance_meters').get_parameter_value().double_value
        self.inflation = self.get_parameter('inflation_meters').get_parameter_value().double_value
        self.min_dist = self.get_parameter('min_distance_between_points').get_parameter_value().double_value

        # --- ÉTATS ---
        self.is_recording = False
        self.zone_name = "zone_custom"
        self.raw_gps_points = [] 
        self.last_utm_point = None

        # ÉVOLUTION CRITIQUE : Création d'un groupe de callback réentrant pour autoriser le multi-threading
        self.cb_group = ReentrantCallbackGroup()

        # --- ABONNEMENT GPS ---
        self.gps_sub = self.create_subscription(NavSatFix, '/ublox_gps_node/fix', self.gps_callback, 10)

        # --- SERVICES POUR L'INTERFACE WEB (Associés au groupe de callback) ---
        self.start_srv = self.create_service(
            ZoneRecord, 
            '/gps_zone_recorder_node/start_recording', 
            self.start_recording_callback,
            callback_group=self.cb_group
        )
        self.stop_srv = self.create_service(
            Trigger, 
            '/gps_zone_recorder_node/stop_recording', 
            self.stop_recording_callback,
            callback_group=self.cb_group
        )

        # --- CLIENT DE TRANSFORMATION DE COUVERTURE (Associé au groupe de callback) ---
        self.kml_processor_client = self.create_client(
            Trigger, 
            'trigger_kml_processing',
            callback_group=self.cb_group
        )

        self.get_logger().info("Nœud gps_zone_recorder prêt (Mode Multi-Threaded activé).")

    def start_recording_callback(self, request, response):
        if self.is_recording:
            response.success = False
            response.message = "L'enregistrement est déjà en cours."
            return response
        
        self.zone_name = request.zone_name if request.zone_name.strip() else "zone_custom"
        self.is_recording = True
        self.raw_gps_points.clear()
        self.last_utm_point = None
        
        self.get_logger().info(f"Début de l'enregistrement pour la zone : {self.zone_name}")
        response.success = True
        response.message = f"Enregistrement démarré pour '{self.zone_name}'."
        return response

    def gps_callback(self, msg: NavSatFix):
        if not self.is_recording or msg.status.status < 0:
            return

        current_lat = msg.latitude
        current_lon = msg.longitude
        u_east, u_north, zone_num, zone_letter = utm.from_latlon(current_lat, current_lon)

        if self.last_utm_point is not None:
            dist = ((u_east - self.last_utm_point[0])**2 + (u_north - self.last_utm_point[1])**2)**0.5
            if dist < self.min_dist:
                return 

        self.raw_gps_points.append((current_lat, current_lon))
        self.last_utm_point = (u_east, u_north)

    def stop_recording_callback(self, request, response):
        if not self.is_recording:
            response.success = False
            response.message = "L'enregistrement n'est pas actif."
            return response

        self.is_recording = False
        
        safe_zone_name = "".join([c if c.isalnum() else "_" for c in self.zone_name])
        full_kml_path = os.path.join(self.kml_dir, f"{safe_zone_name}_gpsrecord.kml")

        self.get_logger().info(f"Fin de l'enregistrement. Génération de {full_kml_path}...")

        if len(self.raw_gps_points) < 3:
            response.success = False
            response.message = f"Échec : Pas assez de points pour la zone '{self.zone_name}' (minimum 3)."
            return response

        try:
            utm_points = []
            utm_zone_num, utm_zone_letter = None, None

            for lat, lon in self.raw_gps_points:
                e, n, z_num, z_let = utm.from_latlon(lat, lon)
                utm_points.append((e, n))
                if utm_zone_num is None:
                    utm_zone_num, utm_zone_letter = z_num, z_let

            poly_utm = Polygon(utm_points)
            poly_smoothed = poly_utm.simplify(self.tolerance, preserve_topology=True)
            poly_inflated = poly_smoothed.buffer(self.inflation)

            final_gps_coords = []
            x_coords, y_coords = poly_inflated.exterior.coords.xy
            for x, y in zip(x_coords, y_coords):
                lat, lon = utm.to_latlon(x, y, utm_zone_num, utm_zone_letter)
                final_gps_coords.append((lon, lat))

            kml = simplekml.Kml()
            polygone_kml = kml.newpolygon(name=f"workcell_{safe_zone_name}_record", description=f"workcell_{safe_zone_name} record Gps")
            polygone_kml.outerboundaryis = final_gps_coords
            
            polygone_kml.style.polystyle.color = simplekml.Color.changealphaint(80, simplekml.Color.red)
            polygone_kml.style.linestyle.color = simplekml.Color.red
            polygone_kml.style.linestyle.width = 3

            kml.save(full_kml_path)
            self.get_logger().info(f"Fichier KML généré avec succès à : {full_kml_path}")

            # Déclenchement de l'appel
            self.trigger_costmap_update(full_kml_path)

            response.success = True
            response.message = f"Zone '{self.zone_name}' enregistrée avec succès dans {safe_zone_name}_gpsrecord.kml"

        except Exception as e:
            self.get_logger().error(f"Erreur traitement : {str(e)}")
            response.success = False
            response.message = f"Erreur interne : {str(e)}"

        return response

    def trigger_costmap_update(self, kml_file_path):
        self.get_logger().info("Vérification de la présence du service 'trigger_kml_processing'...")
        
        if not self.kml_processor_client.wait_for_service(timeout_sec=2.0):
            self.get_logger().warn("Le service 'trigger_kml_processing' n'est pas joignable.")
            return

        req = Trigger.Request()
        
        # Grâce au MultiThreadedExecutor, call_async() peut maintenant s'exécuter de façon fluide
        future = self.kml_processor_client.call_async(req)
        future.add_done_callback(self.kml_processor_response_callback)
        self.get_logger().info("Requête de traitement envoyée à 'trigger_kml_processing'.")

    def kml_processor_response_callback(self, future):
        try:
            response = future.result()
            if response.success:
                self.get_logger().info(f"🎉 Traitement map/waypoint réussi : {response.message}")
            else:
                self.get_logger().error(f"❌ Échec du traitement : {response.message}")
        except Exception as e:
            self.get_logger().error(f"Erreur retour service de couverture : {str(e)}")


def main(args=None):
    rclpy.init(args=args)
    node = GpsZoneRecorder()
    
    # ÉVOLUTION CRITIQUE : Remplacement de l'exécuteur standard par un exécuteur multi-threadé
    executor = MultiThreadedExecutor()
    executor.add_node(node)
    
    try:
        executor.spin()
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()