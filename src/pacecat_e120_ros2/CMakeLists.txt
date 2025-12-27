cmake_minimum_required(VERSION 3.8)
project(pacecat_e120_ros2)

add_compile_options(-O3 -Wall -Wextra)

find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(sensor_msgs REQUIRED)
find_package(diagnostic_msgs REQUIRED)

include_directories(include)

add_executable(e120_node src/e120_driver.cpp)
ament_target_dependencies(e120_node rclcpp sensor_msgs diagnostic_msgs)

install(TARGETS e120_node DESTINATION lib/${PROJECT_NAME})
install(DIRECTORY include/ DESTINATION include)
install(DIRECTORY launch DESTINATION share/${PROJECT_NAME})
install(DIRECTORY udev DESTINATION share/${PROJECT_NAME})

ament_package()
