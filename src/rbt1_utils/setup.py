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
        ],
    },
)
