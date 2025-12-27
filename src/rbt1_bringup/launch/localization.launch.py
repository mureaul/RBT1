from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory
import os

def generate_launch_description():
    bringup_dir = get_package_share_directory('RBT1_bringup')
    ekf = Node(
        package='robot_localization',
        executable='ekf_node',
        name='ekf_filter_node',
        output='screen',
        parameters=[os.path.join(bringup_dir, 'params', 'ekf.yaml')]
    )
    navsat = Node(
        package='robot_localization',
        executable='navsat_transform_node',
        name='navsat_transform',
        output='screen',
        parameters=[os.path.join(bringup_dir, 'params', 'navsat.yaml')]
    )
    return LaunchDescription([ekf, navsat])

