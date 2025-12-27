#!/usr/bin/env python3

from launch import LaunchDescription
from launch_ros.actions import Node
from launch.substitutions import Command, PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare
from launch.substitutions import FindExecutable


def generate_launch_description():

    robot_description = Command([
        FindExecutable(name='xacro'),
        ' ',
        PathJoinSubstitution([
            FindPackageShare('rbt1_description'),
            'urdf',
            'rbt1.urdf.xacro'
        ])
    ])

    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        output='screen',
        parameters=[{'robot_description': robot_description}]
    )

    ros2_control_config = PathJoinSubstitution([
        FindPackageShare('rbt1_control'),
        'config',
        'rbt1_control.yaml'
    ])

    ros2_control_node = Node(
        package='controller_manager',
        executable='ros2_control_node',
        output='screen',
        parameters=[
            {'robot_description': robot_description},
            ros2_control_config
        ],
    )

    joint_state_broadcaster_spawner = Node(
        package='controller_manager',
        executable='spawner',
        arguments=[
            'joint_state_broadcaster',
            '-c',
            '/controller_manager'
        ],
        output='screen'
    )

    rbt1diff_drive_controller = Node(
        package='controller_manager',
        executable='spawner',
        arguments=[
            'rbt1_drive_controller',
            '-c',
            '/controller_manager'
        ],
        output='screen'
    )
    return LaunchDescription([
        robot_state_publisher,
        ros2_control_node,
        joint_state_broadcaster_spawner,
        rbt1diff_drive_controller,
    ])

