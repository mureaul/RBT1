#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
import os
import xml.etree.ElementTree as ET
import math
import yaml
import numpy as np

from pyproj import Transformer
from shapely.geometry import Polygon, LineString
from PIL import Image, ImageDraw
from std_srvs.srv import Trigger

DEFAULT_KML_DIR = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'maps', 'kml')
DEFAULT_OUT_DIR = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'maps')
DEFAULT_RESOLUTION = 0.05

GLOBAL_MAP_YAML = os.path.join(
    os.getenv('HOME'),
    'RBT1',
    'src',
    'rbt1_navigation',
    'maps',
    'RBT1 - map.yaml'
)

PARAMS_FILE = os.path.join(
    os.getenv('HOME'),
    'RBT1',
    'src',
    'rbt1_navigation',
    'config',
    'rbt1_params.yaml'
)


class KMLCoverageGenerator(Node):

    def __init__(self):
        super().__init__('kml_coverage_generator')

        self.declare_parameter('kml_dir', DEFAULT_KML_DIR)
        self.declare_parameter('resolution', DEFAULT_RESOLUTION)
        self.declare_parameter('out_dir', DEFAULT_OUT_DIR)

        self.kml_dir = self.get_parameter('kml_dir').value
        self.resolution = self.get_parameter('resolution').value
        self.out_dir = self.get_parameter('out_dir').value

        self.get_logger().info("=== Initialisation du Nœud KML → Nav2 Map ===")

        if not os.path.exists(PARAMS_FILE):
            self.get_logger().error(f"Fichier de paramètres introuvable : {PARAMS_FILE}")
            # On met des valeurs par défaut pour éviter le crash immédiat au démarrage
            self.robot_width = 0.6
            self.work_width = 0.5
            self.min_turn_radius = 0.4
        else:
            with open(PARAMS_FILE, 'r') as f:
                params = yaml.safe_load(f)
            self.robot_width = params.get('robot_width', 0.6)
            self.work_width = params.get('work_width', 0.5)
            self.min_turn_radius = params.get('min_turn_radius', 0.4)

        # Variables d'origine globale unique
        self.global_minx = None
        self.global_miny = None

        # CRÉATION DU SERVICE (Doit être fait avant tout traitement pour être enregistré par ROS)
        self.srv = self.create_service(Trigger, 'trigger_kml_processing', self.trigger_callback)
        self.get_logger().info("Service '/trigger_kml_processing' en attente...")

        # Utilisation d'un timer single-shot (0.1s) pour exécuter la première passe 
        # APRÈS que le constructeur ait fini. Ça garantit que le spin() démarre bien !
        self.start_timer = self.create_timer(0.1, self.initial_process_callback)

    def initial_process_callback(self):
        """ Exécuté une seule fois juste après le lancement du nœud """
        self.start_timer.cancel() # On détruit le timer pour qu'il ne boucle pas
        self.get_logger().info("Exécution de la première passe automatique au démarrage...")
        try:
            self.process_all_kml()
        except Exception as e:
            self.get_logger().error(f"Erreur lors de la passe initiale (Nœud maintenu en vie malgré tout) : {e}")

    def trigger_callback(self, request, response):
        self.get_logger().info("🔔 Requête reçue sur '/trigger_kml_processing' !")
        try:
            self.process_all_kml()
            response.success = True
            response.message = "Traitement KML et trajectoires terminés avec succès."
        except Exception as e:
            response.success = False
            response.message = f"Erreur service : {str(e)}"
            self.get_logger().error(response.message)
        return response

    def get_utm_epsg(self, lat, lon):
        zone = int((lon + 180) / 6) + 1
        return f"EPSG:{32600 + zone}" if lat >= 0 else f"EPSG:{32700 + zone}"

    def parse_kml(self, kml_file):
        tree = ET.parse(kml_file)
        root = tree.getroot()
        ns = {"kml": "http://www.opengis.net/kml/2.2"}

        polygons = []
        origin = None

        for placemark in root.findall(".//kml:Placemark", ns):
            name_node = placemark.find("kml:name", ns)
            name = name_node.text.strip().lower() if name_node is not None else "unnamed"

            point_node = placemark.find(".//kml:Point/kml:coordinates", ns)
            if point_node is not None:
                lon, lat = point_node.text.strip().split(",")[:2]
                origin = (float(lat), float(lon))
                continue

            coords_node = placemark.find(".//kml:Polygon//kml:coordinates", ns)
            if coords_node is None:
                continue

            coords = []
            for token in coords_node.text.strip().split():
                if "," in token:
                    lon, lat = token.split(",")[:2]
                    coords.append((float(lon), float(lat)))

            polygons.append({"name": name, "coords": coords})

        if origin is None and polygons and polygons[0]["coords"]:
            origin = (polygons[0]["coords"][0][1], polygons[0]["coords"][0][0])

        if origin is None:
            raise RuntimeError("Aucun point ou polygone valide dans le KML.")

        return polygons, origin

    def process_all_kml(self):
        if not os.path.exists(self.kml_dir):
            self.get_logger().warn(f"Le dossier KML n'existe pas encore : {self.kml_dir}")
            return

        os.makedirs(self.out_dir, exist_ok=True)
        files = [f for f in os.listdir(self.kml_dir) if f.lower().endswith(".kml")]
        
        # Tri : RBT1 - map.kml passe obligatoirement en premier
        files.sort(key=lambda x: 0 if x.lower() == "rbt1 - map.kml" else 1)

        self.global_minx = None
        self.global_miny = None

        for file in files:
            kml_path = os.path.join(self.kml_dir, file)
            base_name = os.path.splitext(file)[0]
            is_main_map = (file.lower() == "rbt1 - map.kml")

            try:
                if self.needs_regeneration(kml_path, base_name):
                    self.get_logger().info(f"Régénération requise pour : {file}")
                    self.generate_map_and_coverage(kml_path, base_name, is_main_map)
                else:
                    self.get_logger().info(f"Fichier inchangé (skip) : {file}")
                    
                    if is_main_map and os.path.exists(GLOBAL_MAP_YAML):
                        with open(GLOBAL_MAP_YAML, 'r') as f:
                            global_map_data = yaml.safe_load(f)
                        self.global_minx = float(global_map_data['origin'][0])
                        self.global_miny = float(global_map_data['origin'][1])

            except Exception as e:
                self.get_logger().error(f"Erreur sur le fichier {file} : {e}")

    def generate_map_and_coverage(self, kml_path, base_name, is_main_map):
        polygons_gps, (origin_lat, origin_lon) = self.parse_kml(kml_path)
        utm_epsg = self.get_utm_epsg(origin_lat, origin_lon)

        transformer = Transformer.from_crs("EPSG:4326", utm_epsg, always_xy=True)

        terrain_poly = None
        keepout_polys = []
        workcell_polys = {}

        for poly in polygons_gps:
            utm_pts = [transformer.transform(lon, lat) for lon, lat in poly["coords"]]
            shapely_poly = Polygon(utm_pts)

            if "keepout" in poly["name"] or "forbidden" in poly["name"]:
                keepout_polys.append(shapely_poly)
            elif "contour" in poly["name"]:
                terrain_poly = shapely_poly
            elif "workcell" in poly["name"] or "wokcell" in poly["name"]:
                workcell_polys[poly["name"]] = shapely_poly

        if terrain_poly is None and workcell_polys:
            first_key = list(workcell_polys.keys())[0]
            terrain_poly = workcell_polys[first_key]

        if terrain_poly is None:
            raise RuntimeError("Aucun polygone de type 'contour' ou 'workcell' trouvé.")

        minx, miny, maxx, maxy = terrain_poly.bounds
        
        if is_main_map:
            self.global_minx = float(minx)
            self.global_miny = float(miny)
        elif self.global_minx is None:
            if os.path.exists(GLOBAL_MAP_YAML):
                with open(GLOBAL_MAP_YAML, 'r') as f:
                    global_map_data = yaml.safe_load(f)
                self.global_minx = float(global_map_data['origin'][0])
                self.global_miny = float(global_map_data['origin'][1])
            else:
                self.global_minx = float(minx)
                self.global_miny = float(miny)

        width_px = int(math.ceil((maxx - minx) / self.resolution))
        height_px = int(math.ceil((maxy - miny) / self.resolution))

        img = Image.new("L", (width_px, height_px), 0)
        draw = ImageDraw.Draw(img)

        def world_to_pixel(x, y):
            px = int((x - minx) / self.resolution)
            py = int((maxy - y) / self.resolution)
            return px, py

        terrain_pixels = [world_to_pixel(x, y) for x, y in terrain_poly.exterior.coords]
        draw.polygon(terrain_pixels, fill=254)

        for kp in keepout_polys:
            geoms = kp.geoms if kp.geom_type == "MultiPolygon" else [kp]
            for poly in geoms:
                pts = [world_to_pixel(x, y) for x, y in poly.exterior.coords]
                draw.polygon(pts, fill=200)

        pgm_file = os.path.join(self.out_dir, f"{base_name}.pgm")
        img.save(pgm_file)

        yaml_file = os.path.join(self.out_dir, f"{base_name}.yaml")
        map_yaml = {
            "image": pgm_file,
            "resolution": self.resolution,
            "origin": [float(minx), float(miny), 0.0],
            "negate": 0,
            "occupied_thresh": 0.65,
            "free_thresh": 0.196
        }

        with open(yaml_file, "w") as f:
            yaml.dump(map_yaml, f)

        for wc_name, wc_poly in workcell_polys.items():
            lines = self.generate_coverage_lines(wc_poly)
            if not lines:
                continue

            coverage_file = os.path.join(self.out_dir, f"{wc_name}_coverage.yaml")
            self.save_lines_to_yaml_map(lines, coverage_file, self.global_minx, self.global_miny)

        self.generate_navsat_yaml(base_name)

    def generate_coverage_lines(self, polygon):
        safe_poly = polygon.buffer(-self.robot_width / 2)
        if safe_poly.is_empty:
            return []

        lines = []
        current_poly = safe_poly

        for i in range(3):
            if current_poly.is_empty:
                break
            if current_poly.geom_type == "MultiPolygon":
                current_poly = max(current_poly.geoms, key=lambda g: g.area)
            lines.append(LineString(list(current_poly.exterior.coords)))
            current_poly = current_poly.buffer(-self.work_width)

        rotated_poly = current_poly if not current_poly.is_empty else safe_poly
        minx, miny, maxx, maxy = rotated_poly.bounds

        y = miny
        index = 0

        while y <= maxy:
            line = LineString([(minx, y), (maxx, y)])
            clipped = line.intersection(rotated_poly)
            if clipped.is_empty:
                y += self.work_width
                continue

            segments = list(clipped.geoms) if clipped.geom_type == "MultiLineString" else [clipped]
            for seg in segments:
                coords = list(seg.coords)
                if len(coords) < 2:
                    continue
                if index % 2 == 1:
                    coords.reverse()
                lines.append(LineString(coords))
                index += 1
            y += self.work_width

        return lines

    def save_lines_to_yaml_map(self, lines, filename, origin_x, origin_y):
        poses = []
        for line in lines:
            for x, y in line.coords:
                poses.append({
                    "x": float(x - origin_x),
                    "y": float(y - origin_y),
                    "yaw": 0.0
                })
        with open(filename, "w") as f:
            yaml.dump({"poses": poses}, f)

    def generate_navsat_yaml(self, base_name):
        navsat_config = {
            "navsat_transform": {
                "ros__parameters": {
                    "frequency": 10.0, "delay": 3.0,
                    "magnetic_declination_radians": 0.0, "yaw_offset": 0.0,
                    "zero_altitude": True, "publish_tf": True,
                    "world_frame": "map", "odom_frame": "odom_frame", "base_link_frame": "base_link_frame",
                    "imu_topic": "imu/data", "gps_topic": "gps/fix",
                    "broadcast_cartesian_transform": True, "publish_filtered_gps": True,
                    "use_odometry_yaw": True, "wait_for_datum": False
                }
            }
        }
        navsat_file = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'config', f"{base_name}_navsat.yaml")
        with open(navsat_file, "w") as f:
            yaml.dump(navsat_config, f)

    def needs_regeneration(self, kml_path, base_name):
        pgm_file = os.path.join(self.out_dir, f"{base_name}.pgm")
        yaml_file = os.path.join(self.out_dir, f"{base_name}.yaml")

        if not os.path.exists(pgm_file) or not os.path.exists(yaml_file):
            return True

        kml_mtime = os.path.getmtime(kml_path)
        if kml_mtime > os.path.getmtime(pgm_file) or kml_mtime > os.path.getmtime(yaml_file):
            return True
        return False


def main(args=None):
    rclpy.init(args=args)
    node = KMLCoverageGenerator()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == "__main__":
    main()