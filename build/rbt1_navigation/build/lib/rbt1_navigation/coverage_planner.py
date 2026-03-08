#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
import os
import xml.etree.ElementTree as ET
import math
import yaml
import numpy as np
from pyproj import Transformer
from shapely.geometry import Polygon, Point, LineString
from PIL import Image

# ----------------------------
# Default paths & params
# ----------------------------
DEFAULT_KML_DIR = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'maps', 'kml')
DEFAULT_OUT_DIR = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'maps')
DEFAULT_RESOLUTION = 0.05
PARAMS_FILE = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'config', 'rbt1_params.yaml')


class KMLCoverageGenerator(Node):
    def __init__(self):
        super().__init__('kml_coverage_generator')

        # Paramètres
        self.declare_parameter('kml_dir', DEFAULT_KML_DIR)
        self.declare_parameter('resolution', DEFAULT_RESOLUTION)
        self.declare_parameter('out_dir', DEFAULT_OUT_DIR)

        self.kml_dir = self.get_parameter('kml_dir').value
        self.resolution = self.get_parameter('resolution').value
        self.out_dir = self.get_parameter('out_dir').value

        self.get_logger().info("=== Batch KML → Nav2 Map & Coverage Generator ===")
        self.get_logger().info(f"KML directory: {self.kml_dir}")
        self.get_logger().info(f"Resolution: {self.resolution}")
        self.get_logger().info(f"Output directory: {self.out_dir}")

        # Chargement paramètres robot pour coverage
        if not os.path.exists(PARAMS_FILE):
            raise FileNotFoundError(f"Param file not found: {PARAMS_FILE}")
        with open(PARAMS_FILE, 'r') as f:
            params = yaml.safe_load(f)
        self.robot_width = params['robot_width']
        self.work_width = params['work_width']
        self.min_turn_radius = params['min_turn_radius']
        self.get_logger().info(f"Robot params: width={self.robot_width}, work_width={self.work_width}, min_turn_radius={self.min_turn_radius}")

        # Traitement
        self.process_all_kml()
        self.get_logger().info("=== All maps & coverage files generated ===")
        rclpy.shutdown()

    # ----------------------------
    # KML parsing
    # ----------------------------
    def parse_kml(self, kml_file):
        tree = ET.parse(kml_file)
        root = tree.getroot()
        ns = {"kml": "http://www.opengis.net/kml/2.2"}

        polygons = []
        origin = None

        for placemark in root.findall(".//kml:Placemark", ns):
            name_node = placemark.find("kml:name", ns)
            name = name_node.text.strip() if name_node is not None else "unnamed"

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

            polygons.append({
                "name": name.lower(),
                "coords": coords
            })

        if origin is None:
            raise RuntimeError(f"No <Point> origin found in {kml_file}")

        return polygons, origin

    # ----------------------------
    # Process all KMLs
    # ----------------------------
    def process_all_kml(self):
        os.makedirs(self.out_dir, exist_ok=True)
        for file in os.listdir(self.kml_dir):
            if not file.lower().endswith(".kml"):
                continue
            kml_path = os.path.join(self.kml_dir, file)
            base_name = os.path.splitext(file)[0]
            self.get_logger().info(f"Processing: {file}")
            try:
                self.generate_map_and_coverage(kml_path, base_name)
            except Exception as e:
                self.get_logger().error(f"Failed for {file}: {str(e)}")

    # ----------------------------
    # Generate map & coverage
    # ----------------------------
    def generate_map_and_coverage(self, kml_path, base_name):
        polygons_gps, (origin_lat, origin_lon) = self.parse_kml(kml_path)
        self.get_logger().info(f"Origin: lat={origin_lat}, lon={origin_lon}")
        self.get_logger().info(f"{len(polygons_gps)} polygons detected")

        proj_str = f"+proj=aeqd +lat_0={origin_lat} +lon_0={origin_lon} +ellps=WGS84 +units=m +no_defs"
        transformer = Transformer.from_crs("epsg:4326", proj_str, always_xy=True)

        terrain_poly = None
        keepout_polys = []
        workcell_polys = {}

        for poly in polygons_gps:
            enu_pts = [transformer.transform(lon, lat) for lon, lat in poly["coords"]]
            shapely_poly = Polygon(enu_pts)

            if "keepout" in poly["name"] or "forbidden" in poly["name"]:
                keepout_polys.append(shapely_poly)
                self.get_logger().info(f"{poly['name']} → KEEP OUT")
            elif "contour" in poly["name"]:
                terrain_poly = shapely_poly
                self.get_logger().info(f"{poly['name']} → TERRAIN")
            elif "workcell" in poly["name"]:
                workcell_polys[poly["name"]] = shapely_poly
                self.get_logger().info(f"{poly['name']} → WORKCELL")

        if terrain_poly is None:
            raise RuntimeError("No terrain polygon detected")

        # ----------------------------
        # Generate PGM map
        # ----------------------------
        minx, miny, maxx, maxy = terrain_poly.bounds
        width_px = int(math.ceil((maxx - minx) / self.resolution))
        height_px = int(math.ceil((maxy - miny) / self.resolution))
        self.get_logger().info(f"Map size: {width_px} x {height_px} px")

        grid = np.full((height_px, width_px), 205, dtype=np.uint8)
        for y in range(height_px):
            for x in range(width_px):
                wx = minx + x * self.resolution
                wy = miny + y * self.resolution
                pt = Point(wx, wy)
                img_y = height_px - y - 1
                if not terrain_poly.contains(pt) or any(kp.contains(pt) for kp in keepout_polys):
                    grid[img_y, x] = 0
                else:
                    grid[img_y, x] = 254

        pgm_file = os.path.join(self.out_dir, f"{base_name}.pgm")
        Image.fromarray(grid).save(pgm_file)
        yaml_file = os.path.join(self.out_dir, f"{base_name}.yaml")
        map_yaml = {"image": f"{base_name}.pgm", "resolution": self.resolution,
                    "origin": [float(minx), float(miny), 0.0], "negate": 0,
                    "occupied_thresh": 0.65, "free_thresh": 0.196}
        with open(yaml_file, "w") as f:
            yaml.dump(map_yaml, f)
        self.get_logger().info(f"✔ Map generated: {pgm_file}, {yaml_file}")

        # ----------------------------
        # Generate coverage YAML for each workcell
        # ----------------------------
        for wc_name, wc_poly in workcell_polys.items():
            lines = self.generate_coverage_lines(wc_poly)
            coverage_file = os.path.join(self.out_dir, f"{wc_name}_coverage.yaml")
            self.save_lines_to_yaml_gps(lines, coverage_file)
            self.get_logger().info(f"✔ Coverage YAML generated: {coverage_file}")

    # ----------------------------
    # Coverage generation (3 perimeters + raster lines)
    # ----------------------------
    def generate_coverage_lines(self, polygon: Polygon):
        safe_poly = polygon.buffer(-self.robot_width / 2)
        if safe_poly.is_empty:
            self.get_logger().warning("Safe polygon empty after buffer")
            return []

        lines = []

        # 3 initial perimeters
        current_poly = safe_poly
        for i in range(3):
            if current_poly.is_empty:
                break
            if current_poly.geom_type == "MultiPolygon":
                current_poly = max(current_poly.geoms, key=lambda g: g.area)
            lines.append(LineString(list(current_poly.exterior.coords)))
            current_poly = current_poly.buffer(-self.work_width)

        # Generate raster coverage lines
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
            segments = list(clipped.geoms) if clipped.geom_type == 'MultiLineString' else [clipped]
            for seg in segments:
                coords = list(seg.coords)
                if index % 2 == 1:
                    coords.reverse()
                lines.append(LineString(coords))
                index += 1
            y += self.work_width
        return lines

    # ----------------------------
    # Save coverage lines to YAML GPS
    # ----------------------------
    def save_lines_to_yaml_gps(self, lines, filename):
        waypoints = []
        for line in lines:
            for x, y in line.coords:
                waypoints.append({"latitude": float(y), "longitude": float(x), "yaw": 0.0})
        with open(filename, "w") as f:
            yaml.dump({"waypoints": waypoints}, f, default_flow_style=False)


def main(args=None):
    rclpy.init(args=args)
    node = KMLCoverageGenerator()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()