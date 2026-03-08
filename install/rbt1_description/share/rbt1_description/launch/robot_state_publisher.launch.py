import os

from launch import LaunchDescription
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare


def generate_launch_description():

    # ------------------- Robot Description -------------------
    urdf_file = os.path.join(
        FindPackageShare('rbt1_description').find('rbt1_description'),
        'urdf',
        'rbt1.urdf'
    )

    with open(urdf_file, 'r') as infp:
        robot_desc = infp.read()

    robot_state_publisher_node = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        name='robot_state_publisher',
        output='screen',
        parameters=[{
            'robot_description': robot_desc,
            'use_sim_time': False,
            'publish_frequency': 50.0  # pour les TF dynamiques (ex: roues)
        }]
    )

    return LaunchDescription(
        [robot_state_publisher_node]
    )