from setuptools import setup, find_packages
from glob import glob
import os

package_name = 'rbt1_navigation'

setup(
    name=package_name,
    version='0.0.1',
    packages=find_packages(exclude=['test']),
    data_files=[
        # Pour ament_index
        ('share/ament_index/resource_index/packages',
         ['resource/' + package_name]),
        # package.xml pour ROS 2
        ('share/' + package_name, ['package.xml']),
        # launch files
        ('share/' + package_name + '/launch', glob('launch/*.py')),
        # config files
        ('share/' + package_name + '/config', glob('config/*.yaml')),
        # maps
        ('share/' + package_name + '/maps', glob('maps/*.yaml')),
    ],
    install_requires=['setuptools','pyyaml', 'shapely', 'fastkml', 'simplekml'],
    zip_safe=True,
    maintainer='mureaul',
    maintainer_email='mureaul@example.com',
    description='GPS Navigation stack with multi-zone maps',
    license='Apache-2.0',
    entry_points={
        'console_scripts': [
            'mission_manager = rbt1_navigation.mission_manager:main',
            'mission_orchestrator = rbt1_navigation.mission_orchestrator:main',
            'map_generator = rbt1_navigation.kml_to_map_generator:main',
            ],
    },
)