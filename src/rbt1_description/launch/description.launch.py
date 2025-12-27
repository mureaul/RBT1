from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory
from launch.substitutions import Command
import os

def generate_launch_description():
    pkg = get_package_share_directory('RBT1_description')
    urdf = os.path.join(pkg, 'urdf', 'rbt1.urdf.xacro')
    robot_description = {'robot_description': Command(['xacro ', urdf])}

    rsp = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        output='screen',
        parameters=[robot_description]
    )
    return LaunchDescription([rsp])

