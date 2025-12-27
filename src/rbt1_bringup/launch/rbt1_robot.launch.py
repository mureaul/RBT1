from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import Command, PathJoinSubstitution
from ament_index_python.packages import get_package_share_directory
import os


def generate_launch_description():

    bringup_dir = get_package_share_directory('RBT1_bringup')
    pkg_description = get_package_share_directory('RBT1_description')
    pkg_control = get_package_share_directory('RBT1_control')
    pkg_gps = get_package_share_directory('RBT1_gps')
    pkg_imu = get_package_share_directory('RBT1_imu')
    pkg_lidar = get_package_share_directory('RBT1_lidar')
    map_file = os.path.join(bringup_dir, "maps", "map.yaml")
    
    # -------------------------------
    #  ROBOT DESCRIPTION (URDF + XACRO)
    # -------------------------------
    robot_description_content = Command([
        "xacro ",
        os.path.join(pkg_description, "urdf", "rbt1.urdf.xacro")
    ])

    robot_description = {"robot_description": robot_description_content}

    # -------------------------------
    #  GPS Module
    # -------------------------------

    # -------------------------------
    #  IMU Module
    # -------------------------------

    # -------------------------------
    #  LIDAR Module
    # -------------------------------

    # -------------------------------
    #  EKF Localisation
    # -------------------------------
    ekf = Node(
        package='robot_localization',
        executable='ekf_node',
        name='ekf_filter_node',
        output='screen',
        parameters=[os.path.join(bringup_dir, 'params', 'ekf.yaml')]
    )

    # -------------------------------
    #  NavSat Transform
    # -------------------------------
    navsat = Node(
        package='robot_localization',
        executable='navsat_transform_node',
        name='navsat_transform',
        output='screen',
        parameters=[os.path.join(bringup_dir, 'params', 'navsat.yaml')]
    )

    # -------------------------------
    #  MAPS SERVER
    # -------------------------------
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

    # -------------------------------
    #  NAV2
    # -------------------------------
    nav2 = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(
                get_package_share_directory('nav2_bringup'),
                'launch',
                'bringup_launch.py'
            )
        ),
        launch_arguments={
            'params_file': os.path.join(bringup_dir, 'params', 'nav2_params.yaml')
        }.items()
    )

    # -------------------------------
    #  SLAM
    # -------------------------------
    slam = Node(
        package='slam_toolbox',
        executable='sync_slam_toolbox_node',
        name='slam_toolbox',
        output='screen',
        parameters=[os.path.join(bringup_dir, 'params', 'slam.yaml')]
    )



    # -------------------------------
    #  ROS2 CONTROL
    # -------------------------------
    ros2_control_node = Node(
        package="controller_manager",
        executable="ros2_control_node",
        output="screen",
        parameters=[
            robot_description,
            PathJoinSubstitution([pkg_control, "config", "rbt1_control.yaml"])
        ]
    )

    # -------------------------------
    #  Return full launch description
    # -------------------------------
    return LaunchDescription([
        ekf,
        navsat,
        nav2,
        ros2_control_node
    ])

