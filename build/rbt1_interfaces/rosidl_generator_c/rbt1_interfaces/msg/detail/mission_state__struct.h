// generated from rosidl_generator_c/resource/idl__struct.h.em
// with input from rbt1_interfaces:msg/MissionState.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/msg/mission_state.h"


#ifndef RBT1_INTERFACES__MSG__DETAIL__MISSION_STATE__STRUCT_H_
#define RBT1_INTERFACES__MSG__DETAIL__MISSION_STATE__STRUCT_H_

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
// Member 'state'
// Member 'current_step'
// Member 'info'
#include "rosidl_runtime_c/string.h"

/// Struct defined in msg/MissionState in the package rbt1_interfaces.
typedef struct rbt1_interfaces__msg__MissionState
{
  rosidl_runtime_c__String mission_id;
  /// IDLE | PRECHECK | RUNNING | PAUSED | DONE | ERROR | ABORTED
  rosidl_runtime_c__String state;
  /// TRANSIT | PERIMETER | COVERAGE | RETURNING | DOCKED | NONE
  rosidl_runtime_c__String current_step;
  /// message libre (debug, cause erreur)
  rosidl_runtime_c__String info;
} rbt1_interfaces__msg__MissionState;

// Struct for a sequence of rbt1_interfaces__msg__MissionState.
typedef struct rbt1_interfaces__msg__MissionState__Sequence
{
  rbt1_interfaces__msg__MissionState * data;
  /// The number of valid items in data
  size_t size;
  /// The number of allocated items in data
  size_t capacity;
} rbt1_interfaces__msg__MissionState__Sequence;

#ifdef __cplusplus
}
#endif

#endif  // RBT1_INTERFACES__MSG__DETAIL__MISSION_STATE__STRUCT_H_
