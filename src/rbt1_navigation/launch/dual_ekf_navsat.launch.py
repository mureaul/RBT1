import launch_ros.actions
import os
import launch.actions

from launch import LaunchDescription
from ament_index_python.packages import get_package_share_directory
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution, PythonExpression



def generate_launch_description():
    gps_wpf_dir = get_package_share_directory("rbt1_navigation")
    rl_params_file = os.path.join(gps_wpf_dir, "config", "dual_ekf_navsat_params.yaml")
    config_dir = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'config')

    # 🗺️ Argument zone
    declare_zone_arg = DeclareLaunchArgument(
        'zone',
        default_value='zone1',
        description='Zone/carte à utiliser'
    )

    # NavSat config spécifique zone
    navsat_yaml_file = PathJoinSubstitution([
        config_dir,
        PythonExpression(["'", LaunchConfiguration('zone'), "_navsat.yaml'"])
    ])

    return LaunchDescription(
        [
            declare_zone_arg,
            launch.actions.DeclareLaunchArgument(
                "output_final_position", default_value="false"
            ),
            launch.actions.DeclareLaunchArgument(
                "output_location", default_value="~/dual_ekf_navsat_example_debug.txt"
            ),
            launch_ros.actions.Node(
                package="robot_localization",
                executable="ekf_node",
                name="ekf_filter_node_odom",
                output="screen",
                parameters=[rl_params_file, {"use_sim_time": False}],
                remappings=[("odometry/filtered", "/odometry/local")],
            ),
            launch_ros.actions.Node(
                package="robot_localization",
                executable="ekf_node",
                name="ekf_filter_node_map",
                output="screen",
                parameters=[rl_params_file, {"use_sim_time": False}],
                remappings=[("odometry/filtered", "/odometry/global")],
            ),
            launch_ros.actions.Node(
                package="robot_localization",
                executable="navsat_transform_node",
                name="navsat_transform",
                output="screen",
                parameters=[navsat_yaml_file, {"use_sim_time": False}],
                remappings=[
                    ("gps/fix","/ublox_gps_node/fix"),
                    ("imu", "/imu/data"),
                    ("odometry/filtered", "/odometry/local"),
                ],
            ),
        ]
    )