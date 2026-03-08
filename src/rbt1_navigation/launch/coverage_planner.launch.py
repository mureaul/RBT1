from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='rbt1_navigation',
            executable='coverage_planner',
            name='coverage_planner',
            output='screen'
        )
    ])