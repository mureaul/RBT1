// generated from rosidl_generator_c/resource/idl__struct.h.em
// with input from rbt1_interfaces:msg/MissionCommand.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/msg/mission_command.h"


#ifndef RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__STRUCT_H_
#define RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__STRUCT_H_

#ifdef __cplusplus
extern "C"
{
#endif

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

// Constants defined in the message

// Include directives for member types
// Member 'mission_id'
// Member 'zone'
// Member 'mission_type'
#include "rosidl_runtime_c/string.h"

/// Struct defined in msg/MissionCommand in the package rbt1_interfaces.
typedef struct rbt1_interfaces__msg__MissionCommand
{
  rosidl_runtime_c__String mission_id;
  rosidl_runtime_c__String zone;
  /// transit | perimeter | coverage | dock | inspection
  rosidl_runtime_c__String mission_type;
  float min_battery_percent;
} rbt1_interfaces__msg__MissionCommand;

// Struct for a sequence of rbt1_interfaces__msg__MissionCommand.
typedef struct rbt1_interfaces__msg__MissionCommand__Sequence
{
  rbt1_interfaces__msg__MissionCommand * data;
  /// The number of valid items in data
  size_t size;
  /// The number of allocated items in data
  size_t capacity;
} rbt1_interfaces__msg__MissionCommand__Sequence;

#ifdef __cplusplus
}
#endif

#endif  // RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__STRUCT_H_
