#!/usr/bin/env python3
"""
kml_to_nav2_params_both_with_origin_kml_and_dock.py
Now includes: docking station orientation (heading → quaternion)
"""

import os
import argparse
import xml.etree.ElementTree as ET
import json
import yaml
from pyproj import Transformer
import math


# -------------------------------
# Utility functions
# -------------------------------

def heading_to_quaternion(deg):
    """Convert heading (degrees) to quaternion (ROS convention).
       0° = North, 90° = East."""
    rad = math.radians(deg)
    return {
        "x": 0.0,
        "y": 0.0,
        "z": math.sin(rad / 2.0),
        "w": math.cos(rad / 2.0)
    }


def parse_kml_coordinates(kml_file):
    tree = ET.parse(kml_file)
    root = tree.getroot()
    ns = {"kml": "http://www.opengis.net/kml/2.2"}

    coords_node = root.find(".//kml:coordinates", ns)
    if coords_node is None or coords_node.text is None:
        raise ValueError(f"No <coordinates> found in {kml_file}")

    coords = []
    for token in coords_node.text.strip().split():
        parts = token.split(",")
        if len(parts) >= 2:
            coords.append((float(parts[0]), float(parts[1])))

    if len(coords) < 3:
        raise ValueError(f"Not enough polygon points in {kml_file}")

    return coords


def extract_origin_from_kml(kml_file):
    """Extract base point (lon, lat) from a KML <Point>."""
    tree = ET.parse(kml_file)
    root = tree.getroot()
    ns = {"kml": "http://www.opengis.net/kml/2.2"}

    coords_node = root.find(".//kml:Point/kml:coordinates", ns)
    if coords_node is None:
        raise ValueError(f"No <Point><coordinates> found in {kml_file}")

    parts = coords_node.text.strip().split(",")
    if len(parts) < 2:
        raise ValueError(f"Invalid <Point> coordinates in {kml_file}")

    lon = float(parts[0])
    lat = float(parts[1])

    return lat, lon


def write_geojson(coords, out_path, name):
    data = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {"name": name},
            "geometry": {"type": "Polygon", "coordinates": [[list(p) for p in coords]]}
        }]
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def classify_zone(filename):
    """Workcells vs keepouts based on filename."""
    f = filename.lower()
    if "keepout" in f or "forbidden" in f:
        return "keepout"
    return "workcell"


def generate_nav2_yaml(workcells, keepouts, dock_position, dock_orientation, out_yaml_path):
    """Assemble final Nav2 parameter structure."""
    data = {
        "nav2_params": {
            "polygon_layer": {
                "ros__parameters": {
                    "workcells": workcells,
                    "keepouts": keepouts
                }
            },
            "docking_station": {
                "frame_id": "map",
                "position": dock_position,
                "orientation": dock_orientation
            }
        }
    }

    with open(out_yaml_path, "w", encoding="utf-8") as f:
        yaml.safe_dump(data, f, sort_keys=False)


# -------------------------------
# Main
# -------------------------------

def main():
    p = argparse.ArgumentParser(description="Convert KML polygons to Nav2 params including docking station + orientation.")
    p.add_argument("--origin-kml", required=True, help="KML containing a <Point> (base point).")
    p.add_argument("--kml", nargs="+", required=True, help="Polygon KML files.")
    p.add_argument("--out-dir", required=True, help="Output directory.")
    p.add_argument("--yaml", default="nav2_params.yaml", help="Generated YAML filename.")

    # NEW: dock orientation
    p.add_argument("--dock-heading", type=float, default=0.0,
                   help="Dock orientation in degrees (0°=North, 90°=East).")

    args = p.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)

    # Load origin (charging dock)
    origin_lat, origin_lon = extract_origin_from_kml(args.origin_kml)
    print(f"Origin / docking station from {args.origin_kml}: lat={origin_lat}, lon={origin_lon}")

    # ENU transform
    proj_str = (
        f"+proj=aeqd +lat_0={origin_lat} +lon_0={origin_lon} "
        "+ellps=WGS84 +units=m +no_defs"
    )
    transformer = Transformer.from_crs("epsg:4326", proj_str, always_xy=True)

    # Dock is always at ENU (0,0)
    dock_position = [0.0, 0.0]
    dock_orientation = heading_to_quaternion(args.dock_heading)

    workcells = []
    keepouts = []

    # Process polygons
    for kml_path in args.kml:
        coords = parse_kml_coordinates(kml_path)
        name = os.path.splitext(os.path.basename(kml_path))[0]

        # Save GeoJSON
        geojson_path = os.path.join(args.out_dir, f"{name}.geojson")
        write_geojson(coords, geojson_path, name)
        print(f"✔ GeoJSON: {geojson_path}")

        # Convert polygon → ENU
        enu_pts = []
        for lon, lat in coords:
            x, y = transformer.transform(lon, lat)
            enu_pts.append([float(x), float(y)])

        # Close polygon
        if enu_pts[0] != enu_pts[-1]:
            enu_pts.append(list(enu_pts[0]))

        entry = {"name": name, "frame_id": "map", "footprint": enu_pts}
        if classify_zone(name) == "keepout":
            keepouts.append(entry)
            print(f" → {name}: KEEP OUT")
        else:
            workcells.append(entry)
            print(f" → {name}: WORKCELL")

    # Write YAML
    out_yaml = os.path.join(args.out_dir, args.yaml)
    generate_nav2_yaml(workcells, keepouts, dock_position, dock_orientation, out_yaml)

    print(f"\n✔ nav2_params.yaml written: {out_yaml}")
    print(f"   • {len(workcells)} workcells")
    print(f"   • {len(keepouts)} keepouts")
    print(f"   • docking station: ENU {dock_position}, heading={args.dock_heading}°")


if __name__ == "__main__":
    main()

