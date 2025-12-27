from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='rbt1_coupe_motor',
            executable='coupe_motor_node',
            name='coupe_motor',
            output='screen',
            parameters=['config/motor_params.yaml']
        )
    ])
