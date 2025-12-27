import rclpy
from launch import LaunchDescription
from launch.actions import OpaqueFunction, LogInfo
from launch.substitutions import Command, FindExecutable, PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare
from launch_ros.actions import Node

from controller_manager_msgs.srv import ListControllers

def wait_for_controller_manager(context, *args, **kwargs):
    """
    Attends que le service /controller_manager/list_controllers soit disponible.
    """
    rclpy.init()
    node = rclpy.create_node('wait_for_controller_manager')

    client = node.create_client(ListControllers, '/controller_manager/list_controllers')
    node.get_logger().info('Waiting for /controller_manager/list_controllers service...')

    import time
    timeout = 10.0  # secondes max
    start = time.time()
    while not client.wait_for_service(timeout_sec=0.5):
        if time.time() - start > timeout:
            node.get_logger().warn('Timeout waiting for controller_manager service!')
            break
        node.get_logger().info('Still waiting for controller_manager...')

    node.destroy_node()
    rclpy.shutdown()
    return []

def generate_launch_description():
    # Package shares
    pkg_desc = FindPackageShare('rbt1_description')
    pkg_control = FindPackageShare('rbt1_control')

    # Paths to files
    xacro_file = PathJoinSubstitution([pkg_desc, 'urdf', 'rbt1.urdf.xacro'])
    hw_config  = PathJoinSubstitution([pkg_control, 'config', 'rbt1_control.yaml'])
    ctrl_config = PathJoinSubstitution([pkg_control, 'config', 'diff_controllers.yaml'])

    # Generate robot_description from xacro at runtime
    robot_description_content = Command([FindExecutable(name='xacro'), ' ', xacro_file])
    robot_description = {"robot_description": robot_description_content}

    # ros2_control / controller_manager node
    ros2_control_node = Node(
        package='controller_manager',
        executable='ros2_control_node',
        name='controller_manager',
        output='screen',
        parameters=[robot_description, hw_config, ctrl_config],
    )

    # Spawner for joint_state_broadcaster
    spawn_joint_state_broadcaster = Node(
        package='controller_manager',
        executable='spawner',
        name='spawn_joint_state_broadcaster',
        output='screen',
        arguments=['joint_state_broadcaster', '--controller-manager', '/controller_manager']
    )

    # Spawner for diff_drive_controller
    spawn_diff_drive = Node(
        package='controller_manager',
        executable='spawner',
        name='spawn_diff_drive_controller',
        output='screen',
        arguments=['diff_drive_controller', '--controller-manager', '/controller_manager']
    )

    ld = LaunchDescription()
    ld.add_action(ros2_control_node)
    # Attendre que controller_manager soit prêt
    ld.add_action(OpaqueFunction(function=wait_for_controller_manager))
    ld.add_action(LogInfo(msg='Spawning joint_state_broadcaster...'))
    ld.add_action(spawn_joint_state_broadcaster)
    ld.add_action(LogInfo(msg='Spawning diff_drive_controller...'))
    ld.add_action(spawn_diff_drive)

    return ld

