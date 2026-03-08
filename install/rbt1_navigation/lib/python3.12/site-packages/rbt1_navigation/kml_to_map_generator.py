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


DEFAULT_KML_DIR = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'maps', 'kml')
DEFAULT_OUT_DIR = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'maps')
DEFAULT_RESOLUTION = 0.05

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

        self.get_logger().info("=== KML → Nav2 Map + Coverage Generator (UTM mode) ===")

        if not os.path.exists(PARAMS_FILE):
            raise FileNotFoundError(f"Param file not found: {PARAMS_FILE}")

        with open(PARAMS_FILE, 'r') as f:
            params = yaml.safe_load(f)

        self.robot_width = params['robot_width']
        self.work_width = params['work_width']
        self.min_turn_radius = params['min_turn_radius']

        self.get_logger().info(
            f"Robot params: width={self.robot_width} work_width={self.work_width}"
        )

        self.process_all_kml()

        self.get_logger().info("=== All maps generated ===")


    def get_utm_epsg(self, lat, lon):

        zone = int((lon + 180) / 6) + 1

        if lat >= 0:
            return f"EPSG:{32600 + zone}"
        else:
            return f"EPSG:{32700 + zone}"


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

                lon, lat = token.split(",")[:2]
                coords.append((float(lon), float(lat)))

            polygons.append({"name": name, "coords": coords})

        if origin is None:
            raise RuntimeError("No origin point found in KML")

        return polygons, origin


    def process_all_kml(self):

        os.makedirs(self.out_dir, exist_ok=True)

        for file in os.listdir(self.kml_dir):

            if not file.lower().endswith(".kml"):
                continue

            kml_path = os.path.join(self.kml_dir, file)
            base_name = os.path.splitext(file)[0]

            self.get_logger().info(f"Processing: {file}")

            try:

                if self.needs_regeneration(kml_path, base_name):

                    self.get_logger().info("Regenerating map")
                    self.generate_map_and_coverage(kml_path, base_name)

                else:

                    self.get_logger().info("Skipping (unchanged)")

            except Exception as e:

                self.get_logger().error(f"Failed for {file}: {e}")


    def generate_map_and_coverage(self, kml_path, base_name):

        polygons_gps, (origin_lat, origin_lon) = self.parse_kml(kml_path)

        utm_epsg = self.get_utm_epsg(origin_lat, origin_lon)

        self.get_logger().info(f"Using projection {utm_epsg}")

        transformer = Transformer.from_crs(
            "EPSG:4326",
            utm_epsg,
            always_xy=True
        )

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

            elif "workcell" in poly["name"]:

                workcell_polys[poly["name"]] = shapely_poly


        if terrain_poly is None:
            raise RuntimeError("No terrain polygon detected")


        minx, miny, maxx, maxy = terrain_poly.bounds

        width_px = int(math.ceil((maxx - minx) / self.resolution))
        height_px = int(math.ceil((maxy - miny) / self.resolution))

        self.get_logger().info(f"Map size: {width_px} x {height_px} px")


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

        self.get_logger().info("Map generated")


        for wc_name, wc_poly in workcell_polys.items():

            lines = self.generate_coverage_lines(wc_poly)

            if not lines:
                continue

            coverage_file = os.path.join(self.out_dir, f"{wc_name}_coverage.yaml")

            self.save_lines_to_yaml_map(lines, coverage_file, minx, miny)

            self.get_logger().info(f"Coverage generated for {wc_name}")


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


    def save_lines_to_yaml_map(self, lines, filename, minx, miny):

        poses = []

        for line in lines:

            for x, y in line.coords:

                poses.append({
                    "x": float(x - minx),
                    "y": float(y - miny),
                    "yaw": 0.0
                })

        with open(filename, "w") as f:

            yaml.dump({"poses": poses}, f)


    def generate_navsat_yaml(self, base_name):

        navsat_config = {

            "navsat_transform": {

                "ros__parameters": {

                    "frequency": 10.0,
                    "delay": 3.0,

                    "magnetic_declination_radians": 0.0,
                    "yaw_offset": 0.0,

                    "zero_altitude": True,

                    "publish_tf": True,

                    "world_frame": "map",
                    "odom_frame": "odom_frame",
                    "base_link_frame": "base_link_frame",

                    "imu_topic": "imu/data",
                    "gps_topic": "gps/fix",

                    "broadcast_cartesian_transform": True,

                    "publish_filtered_gps": True,

                    "use_odometry_yaw": True,

                    "wait_for_datum": False
                }
            }
        }

        navsat_file = os.path.join(
            os.getenv('HOME'),
            'RBT1',
            'src',
            'rbt1_navigation',
            'config',
            f"{base_name}_navsat.yaml"
        )

        with open(navsat_file, "w") as f:

            yaml.dump(navsat_config, f)

        self.get_logger().info("navsat.yaml generated")


    def needs_regeneration(self, kml_path, base_name):

        pgm_file = os.path.join(self.out_dir, f"{base_name}.pgm")
        yaml_file = os.path.join(self.out_dir, f"{base_name}.yaml")

        if not os.path.exists(pgm_file) or not os.path.exists(yaml_file):
            return True

        kml_mtime = os.path.getmtime(kml_path)

        if kml_mtime > os.path.getmtime(pgm_file):
            return True

        if kml_mtime > os.path.getmtime(yaml_file):
            return True

        return False


def main(args=None):

    rclpy.init(args=args)

    node = KMLCoverageGenerator()

    node.destroy_node()

    rclpy.shutdown()


if __name__ == "__main__":

    main()