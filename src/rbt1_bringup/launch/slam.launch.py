from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory
import os

def generate_launch_description():
    # Placeholder slam launch (user can replace with actual slam_toolbox or gmapping)
    pkg = get_package_share_directory('RBT1_bringup')
    slam = Node(
        package='slam_toolbox',
        executable='sync_slam_toolbox_node',
        name='slam_toolbox',
        output='screen',
        parameters=[os.path.join(pkg, 'params', 'slam.yaml')]
    )
    return LaunchDescription([slam])

