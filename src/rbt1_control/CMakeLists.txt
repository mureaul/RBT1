cmake_minimum_required(VERSION 3.8)
project(rbt1_control)

# --- ROS2 dependencies ---
find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(rclcpp_lifecycle REQUIRED)
find_package(hardware_interface REQUIRED)
find_package(controller_manager REQUIRED)
find_package(pluginlib REQUIRED)
find_package(ament_index_cpp REQUIRED)
find_package(class_loader REQUIRED)

# --- Libgpiod via pkg-config ---
find_package(PkgConfig REQUIRED)
pkg_check_modules(GPIOD REQUIRED libgpiod)
include_directories(${GPIOD_INCLUDE_DIRS})
message(STATUS "GPIOD_LIBRARIES=${GPIOD_LIBRARIES}")
message(STATUS "GPIOD_INCLUDE_DIRS=${GPIOD_INCLUDE_DIRS}")

# --- Library ---
add_library(rbt1_control SHARED
  src/rbt1_hw_interface.cpp
)

target_compile_features(rbt1_control PUBLIC cxx_std_17)

target_include_directories(rbt1_control
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
    $<BUILD_INTERFACE:/usr/include> 
    $<INSTALL_INTERFACE:include>
)

ament_target_dependencies(rbt1_control
  rclcpp
  rclcpp_lifecycle
  hardware_interface
  controller_manager
  pluginlib
  ament_index_cpp
  class_loader
)

# --- Plugin export ---
pluginlib_export_plugin_description_file(
  hardware_interface
  resource/rbt1_hw_interface_plugin.xml
)

# --- Link libraries ---
target_link_libraries(rbt1_control
  gpiod
  pthread
  rt
)

# --- Install targets ---
install(
  TARGETS rbt1_control
  ARCHIVE DESTINATION lib
  LIBRARY DESTINATION lib
  RUNTIME DESTINATION bin
)

install(
  DIRECTORY include/
  DESTINATION include
)

install(
  FILES resource/rbt1_hw_interface_plugin.xml
  DESTINATION share/${PROJECT_NAME}
)

install(
  DIRECTORY config launch
  DESTINATION share/${PROJECT_NAME}
)

ament_package()

