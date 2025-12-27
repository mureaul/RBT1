from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory
import os


def generate_launch_description():

    bringup_dir = get_package_share_directory("RBT1_bringup")
    map_file = os.path.join(bringup_dir, "maps", "map.yaml")

    map_server = Node(
        package="nav2_map_server",
        executable="map_server",
        name="map_server",
        output="screen",
        parameters=[{"yaml_filename": map_file}]
    )

    lifecycle_manager = Node(
        package="nav2_lifecycle_manager",
        executable="lifecycle_manager",
        name="lifecycle_manager_map",
        output="screen",
        parameters=[{
            "use_sim_time": False,
            "autostart": True,
            "node_names": ["map_server"]
        }]
    )

    return LaunchDescription([
        map_server,
        lifecycle_manager
    ])

