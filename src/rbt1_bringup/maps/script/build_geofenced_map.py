#!/usr/bin/env python3
import xml.etree.ElementTree as ET
import numpy as np
from pyproj import Proj, Transformer
from PIL import Image, ImageDraw
import yaml

# ---------------------------
# 1. LOAD MAP + METADATA
# ---------------------------

def load_map(map_yaml_path):
    with open(map_yaml_path, "r") as f:
        map_info = yaml.safe_load(f)

    #map_img = Image.open(map_info["image"]).convert("RGB")
    map_img_path = map_info["image"]
    resolution = map_info["resolution"]  # meters per pixel
    origin = map_info["origin"]          # [x, y, yaw]

    return map_img_path, resolution, origin


# ---------------------------
# 2. PARSE KML POLYGON
# ---------------------------

def load_kml_polygon(kml_path):
    tree = ET.parse(kml_path)
    root = tree.getroot()

    # namespace for KML
    ns = {"kml": "http://www.opengis.net/kml/2.2"}

    coords_text = root.find(".//kml:coordinates", ns).text.strip()

    points = []
    for line in coords_text.split():
        lon, lat, alt = map(float, line.split(","))
        points.append((lat, lon))

    return points


# ---------------------------
# 3. CONVERT GPS → LOCAL XY (ENU)
# ---------------------------

def convert_gps_to_local(points_gps, ref_lat, ref_lon):
    """
    Convert (lat,lon) → ENU local tangent plane.
    """
    transformer = Transformer.from_crs(
        "epsg:4326",
        f"+proj=tmerc +lat_0={ref_lat} +lon_0={ref_lon} +k=1 +x_0=0 +y_0=0",
        always_xy=True,
    )

    local_points = []
    for lat, lon in points_gps:
        x, y = transformer.transform(lon, lat)
        local_points.append((x, y))  # meters

    return local_points


# ---------------------------
# 4. LOCAL XY → PIXELS (MAP)
# ---------------------------

def local_to_pixels(points_local, origin, resolution):
    origin_x, origin_y, _ = origin

    px_points = []
    for x, y in points_local:
        px = int((x - origin_x) / resolution)
        py = int((origin_y - y) / resolution)  # inverted Y-axis
        px_points.append((px, py))

    return px_points


# ---------------------------
# 5. DRAW POLYGON ON MAP
# ---------------------------

def draw_polygon_on_map(map_img, polygon_pixels, color=(255, 0, 0), width=3):
    draw = ImageDraw.Draw(map_img)
    draw.line(polygon_pixels + [polygon_pixels[0]], fill=color, width=width)
    return map_img

# --------------------------------------------------------------------------
# Construction du mask et fusion avec carte originale
# --------------------------------------------------------------------------

def build_geofenced_map(pixel_polygon, map_pgm_path, output_path):
    print("[INFO] Chargement de la carte...")
    base_img = Image.open(map_pgm_path).convert("L")
    w, h = base_img.size

    print(f"[INFO] Taille carte : {w}×{h}")

    print("[INFO] Construction du mask (zone autorisée)...")
    mask = Image.new("L", (w, h), 0)  # 0 = interdit
    draw = ImageDraw.Draw(mask)
    draw.polygon(pixel_polygon, fill=255)  # 255 = autorisé

    print("[INFO] Fusion : zones extérieures interdites (noir)...")
    base_np = np.array(base_img)
    mask_np = np.array(mask)

    # 0 = obstacles ; 205 = inconnu ; 254 = libre
    # On force l'extérieur à être un obstacle noir (0)
    fused = np.where(mask_np == 255, base_np, 0).astype(np.uint8)

    fused_img = Image.fromarray(fused, mode="L")
    fused_img.save(output_path)

    print(f"[OK] Carte fusionnée sauvegardée → {output_path}")

def generate_map_nav2(MAP_YAML,KML_FILE,OUTPUT):
    # load map
    print("[INFO] Chargement des données d'image...")
    map_img_path, resolution, origin = load_map(MAP_YAML)
    #print("[INFO] chemin de l'image:",map_img_path)
    #print("[INFO] résolution:",resolution)  
    #print("[INFO] origines",origin)  
    
    # load polygon from KML
    print("[INFO] Loading KML polygon…")
    gps_points = load_kml_polygon(KML_FILE)

    # reference for projection = first GPS point
    ref_lat, ref_lon = gps_points[0]

    # GPS → local coordinates
    print("[INFO] Projecting GPS to local XY…")
    local_points = convert_gps_to_local(gps_points, ref_lat, ref_lon)

    # XY → pixel coords
    print("[INFO] Converting local XY to pixel coordinates…")
    pixel_points = local_to_pixels(local_points, origin, resolution)

    build_geofenced_map(pixel_points, map_img_path, OUTPUT)
    
    # draw polygon
    #print("[INFO] Drawing polygon on map…")
    #result_img = draw_polygon_on_map(map_img, pixel_points)

    #result_img.save(OUTPUT)
    #print(f"[OK] Generated: {OUTPUT}")
    
# ---------------------------
# 6. FULL PIPELINE
# ---------------------------

def main():
    MAP_YAML = "/home/ludovic/RBT1 project/V2/src/RBT1_bringup/maps/map_Zone1.yaml"
    KML_FILE = "/home/ludovic/RBT1 project/V2/src/RBT1_bringup/maps/Zone1_offline.kml"
    OUTPUT = "/home/ludovic/RBT1 project/V2/src/RBT1_bringup/maps/nav2_maps/map_Zone1.png"
    generate_map_nav2(MAP_YAML,KML_FILE,OUTPUT)

    MAP_YAML = "/home/ludovic/RBT1 project/V2/src/RBT1_bringup/maps/map_Zone2.yaml"
    KML_FILE = "/home/ludovic/RBT1 project/V2/src/RBT1_bringup/maps/Zone2_offline.kml"
    OUTPUT = "/home/ludovic/RBT1 project/V2/src/RBT1_bringup/maps/nav2_maps/map_Zone2.png"
    generate_map_nav2(MAP_YAML,KML_FILE,OUTPUT)



if __name__ == "__main__":
    main()

