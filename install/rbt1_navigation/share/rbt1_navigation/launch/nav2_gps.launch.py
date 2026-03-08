import os

from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, LogInfo, IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution, PythonExpression
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory


def generate_launch_description():

    # 📁 Dossiers
    maps_dir = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'maps')
    config_dir = os.path.join(os.getenv('HOME'), 'RBT1', 'src', 'rbt1_navigation', 'config')

    # 🗺️ Argument zone
    declare_zone_arg = DeclareLaunchArgument(
        'zone',
        default_value='RBT1 - Map',
        description='Zone/carte à utiliser'
    )

    # Map
    map_yaml_file = PathJoinSubstitution([
        maps_dir,
        PythonExpression(["'", LaunchConfiguration('zone'), ".yaml'"])
    ])

    # ================= EKF + NAVSAT BRINGUP =================
    ekf_node = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(
                get_package_share_directory('rbt1_navigation'),
                'launch',
                'dual_ekf_navsat.launch.py'
            )
        ),
        launch_arguments={
            'zone': LaunchConfiguration('zone'),
        }.items()
    )

    # ================= NAV2 BRINGUP =================
    nav2_bringup = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(
                get_package_share_directory('nav2_bringup'),
                'launch',
                'bringup_launch.py'
            )
        ),
        launch_arguments={
            'map': map_yaml_file,
            'use_sim_time': 'False',
            'params_file': os.path.join(config_dir, 'nav2_gps_params.yaml'),
            'autostart': 'True',
        }.items()
    )

    log_zone = LogInfo(msg=["🚀 Navigation GPS active for zone: ", LaunchConfiguration('zone')])

    return LaunchDescription([
        declare_zone_arg,
        log_zone,
        ekf_node,
        #navsat_node,
        nav2_bringup
    ])
