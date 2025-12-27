cmake_minimum_required(VERSION 3.8)
project(rbt1_coupe_motor)

# Dépendances
find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(std_msgs REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(GPIOD REQUIRED libgpiod)

# Node
add_executable(coupe_motor_node
  src/coupe_motor_node.cpp
)

ament_target_dependencies(coupe_motor_node
  rclcpp
  std_msgs
)

target_include_directories(coupe_motor_node PRIVATE ${GPIOD_INCLUDE_DIRS})
target_link_libraries(coupe_motor_node ${GPIOD_LIBRARIES})
target_compile_options(coupe_motor_node PRIVATE ${GPIOD_CFLAGS_OTHER})

install(TARGETS coupe_motor_node
  DESTINATION lib/${PROJECT_NAME}
)

install(DIRECTORY launch config
  DESTINATION share/${PROJECT_NAME}
)

ament_package()

