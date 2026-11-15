from setuptools import setup

package_name = 'rbt1_utils'

setup(
    name=package_name,
    version='0.0.0',
    packages=[package_name],
    data_files=[
    # Marker ament index (OBLIGATOIRE)
        ('share/ament_index/resource_index/packages',
         ['resource/' + package_name]),
        # package.xml (OBLIGATOIRE)
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='mureaul',
    maintainer_email='mureaul@todo.todo',
    description='Utility nodes for RBT1 robot',
    license='Apache License 2.0',
    entry_points={
        'console_scripts': [
            'heartbeat_node = rbt1_utils.heartbeat_node:main',
            'weather_monitor_node = rbt1_utils.weather_monitor:main',
            'bringup_orchestrator = rbt1_utils.bringup_orchestrator:main',
            'ekf2pose = rbt1_utils.ekf2pose:main',
            'system_monitor_node = rbt1_utils.system_monitor_node:main',
            'gps_tracker_node = rbt1_utils.gps_tracker_node:main',
            'gps_zone_recorder_node = rbt1_utils.gps_zone_recorder_node:main',
            'workcell_provider = rbt1_utils.workcell_provider:main',
            'blade_relay = rbt1_utils.blade_relay:main',
            'ambiance_historian = rbt1_utils.ambiance_historian:main',
            'blade_historian = rbt1_utils.blade_historian:main',
            'battery_historian = rbt1_utils.battery_historian:main',
            'mode_manager = rbt1_utils.mode_manager:main',
            'wifi_monitor = rbt1_utils.wifi_monitor:main',
            'mission_planner = rbt1_utils.mission_planner:main',
        ],
    },
)
