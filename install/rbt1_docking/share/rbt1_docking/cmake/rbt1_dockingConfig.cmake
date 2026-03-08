# generated from ament/cmake/core/templates/nameConfig.cmake.in

# prevent multiple inclusion
if(_rbt1_docking_CONFIG_INCLUDED)
  # ensure to keep the found flag the same
  if(NOT DEFINED rbt1_docking_FOUND)
    # explicitly set it to FALSE, otherwise CMake will set it to TRUE
    set(rbt1_docking_FOUND FALSE)
  elseif(NOT rbt1_docking_FOUND)
    # use separate condition to avoid uninitialized variable warning
    set(rbt1_docking_FOUND FALSE)
  endif()
  return()
endif()
set(_rbt1_docking_CONFIG_INCLUDED TRUE)

# output package information
if(NOT rbt1_docking_FIND_QUIETLY)
  message(STATUS "Found rbt1_docking: 0.0.0 (${rbt1_docking_DIR})")
endif()

# warn when using a deprecated package
if(NOT "" STREQUAL "")
  set(_msg "Package 'rbt1_docking' is deprecated")
  # append custom deprecation text if available
  if(NOT "" STREQUAL "TRUE")
    set(_msg "${_msg} ()")
  endif()
  # optionally quiet the deprecation message
  if(NOT rbt1_docking_DEPRECATED_QUIET)
    message(DEPRECATION "${_msg}")
  endif()
endif()

# flag package as ament-based to distinguish it after being find_package()-ed
set(rbt1_docking_FOUND_AMENT_PACKAGE TRUE)

# include all config extra files
set(_extras "")
foreach(_extra ${_extras})
  include("${rbt1_docking_DIR}/${_extra}")
endforeach()
