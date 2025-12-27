from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='pacecat_e120_ros2',
            executable='e120_node',
            parameters=[{'port': '/dev/ttyUSB1'}]
        )
    ])
