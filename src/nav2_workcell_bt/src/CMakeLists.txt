cmake_minimum_required(VERSION 3.16)
project(nav2_workcell_bt)

find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(behaviortree_cpp_v3 REQUIRED)
find_package(std_msgs REQUIRED)
find_package(geometry_msgs REQUIRED)
find_package(nav_msgs REQUIRED)
find_package(ament_index_cpp REQUIRED)

add_library(nav2_workcell_bt_nodes SHARED
  src/motor_rotate_action.cpp
  src/is_in_workcell_condition.cpp
)

ament_target_dependencies(nav2_workcell_bt_nodes
  rclcpp
  behaviortree_cpp_v3
  std_msgs
  geometry_msgs
  nav_msgs
  ament_index_cpp
)

# Install library for behaviour tree factory to load
install(TARGETS nav2_workcell_bt_nodes
  ARCHIVE DESTINATION lib
  LIBRARY DESTINATION lib
  RUNTIME DESTINATION bin
)

# Install BT XML example
install(DIRECTORY bt_xml
  DESTINATION share/${PROJECT_NAME}
)

install(DIRECTORY launch
  DESTINATION share/${PROJECT_NAME}
  OPTIONAL
)

ament_package()

