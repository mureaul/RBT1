cmake_minimum_required(VERSION 3.8)
project(rbt1_description)

# Utilisation de C++17 pour certains plugins éventuels
if(NOT CMAKE_CXX_STANDARD)
  set(CMAKE_CXX_STANDARD 17)
endif()

# --- Trouver les dépendances ROS 2 nécessaires ---
find_package(ament_cmake REQUIRED)
find_package(xacro REQUIRED)
find_package(ros2_control REQUIRED)
find_package(controller_manager REQUIRED)
find_package(hardware_interface REQUIRED)
find_package(transmission_interface REQUIRED)
find_package(sensor_msgs REQUIRED)
find_package(robot_state_publisher REQUIRED)
find_package(std_msgs REQUIRED)

# --- Copier les fichiers XACRO/URDF dans l'espace d'installation ---
install(DIRECTORY urdf launch
  DESTINATION share/${PROJECT_NAME}
)

# --- Optionnel : générer un fichier URDF à partir du XACRO lors de l'installation ---
# Cela permet de toujours installer le URDF "final"
find_program(XACRO_EXECUTABLE xacro)
if(XACRO_EXECUTABLE)
  add_custom_target(generate_urdf ALL
    COMMAND ${XACRO_EXECUTABLE} ${CMAKE_CURRENT_SOURCE_DIR}/urdf/rbt1.urdf.xacro
            -o ${CMAKE_CURRENT_BINARY_DIR}/rbt1.urdf
    DEPENDS ${CMAKE_CURRENT_SOURCE_DIR}/urdf/rbt1.urdf.xacro
    COMMENT "Generating URDF from XACRO"
  )
  install(FILES ${CMAKE_CURRENT_BINARY_DIR}/rbt1.urdf
    DESTINATION share/${PROJECT_NAME}/urdf
  )
endif()

# --- Déclaration du package ---
ament_package()

