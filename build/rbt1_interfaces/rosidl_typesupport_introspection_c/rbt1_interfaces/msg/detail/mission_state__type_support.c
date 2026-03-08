// generated from rosidl_typesupport_introspection_c/resource/idl__type_support.c.em
// with input from rbt1_interfaces:msg/MissionState.idl
// generated code does not contain a copyright notice

#include <stddef.h>
#include "rbt1_interfaces/msg/detail/mission_state__rosidl_typesupport_introspection_c.h"
#include "rbt1_interfaces/msg/rosidl_typesupport_introspection_c__visibility_control.h"
#include "rosidl_typesupport_introspection_c/field_types.h"
#include "rosidl_typesupport_introspection_c/identifier.h"
#include "rosidl_typesupport_introspection_c/message_introspection.h"
#include "rbt1_interfaces/msg/detail/mission_state__functions.h"
#include "rbt1_interfaces/msg/detail/mission_state__struct.h"


// Include directives for member types
// Member `mission_id`
// Member `state`
// Member `current_step`
// Member `info`
#include "rosidl_runtime_c/string_functions.h"

#ifdef __cplusplus
extern "C"
{
#endif

void rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_init_function(
  void * message_memory, enum rosidl_runtime_c__message_initialization _init)
{
  // TODO(karsten1987): initializers are not yet implemented for typesupport c
  // see https://github.com/ros2/ros2/issues/397
  (void) _init;
  rbt1_interfaces__msg__MissionState__init(message_memory);
}

void rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_fini_function(void * message_memory)
{
  rbt1_interfaces__msg__MissionState__fini(message_memory);
}

static rosidl_typesupport_introspection_c__MessageMember rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_message_member_array[4] = {
  {
    "mission_id",  // name
    rosidl_typesupport_introspection_c__ROS_TYPE_STRING,  // type
    0,  // upper bound of string
    NULL,  // members of sub message
    false,  // is key
    false,  // is array
    0,  // array size
    false,  // is upper bound
    offsetof(rbt1_interfaces__msg__MissionState, mission_id),  // bytes offset in struct
    NULL,  // default value
    NULL,  // size() function pointer
    NULL,  // get_const(index) function pointer
    NULL,  // get(index) function pointer
    NULL,  // fetch(index, &value) function pointer
    NULL,  // assign(index, value) function pointer
    NULL  // resize(index) function pointer
  },
  {
    "state",  // name
    rosidl_typesupport_introspection_c__ROS_TYPE_STRING,  // type
    0,  // upper bound of string
    NULL,  // members of sub message
    false,  // is key
    false,  // is array
    0,  // array size
    false,  // is upper bound
    offsetof(rbt1_interfaces__msg__MissionState, state),  // bytes offset in struct
    NULL,  // default value
    NULL,  // size() function pointer
    NULL,  // get_const(index) function pointer
    NULL,  // get(index) function pointer
    NULL,  // fetch(index, &value) function pointer
    NULL,  // assign(index, value) function pointer
    NULL  // resize(index) function pointer
  },
  {
    "current_step",  // name
    rosidl_typesupport_introspection_c__ROS_TYPE_STRING,  // type
    0,  // upper bound of string
    NULL,  // members of sub message
    false,  // is key
    false,  // is array
    0,  // array size
    false,  // is upper bound
    offsetof(rbt1_interfaces__msg__MissionState, current_step),  // bytes offset in struct
    NULL,  // default value
    NULL,  // size() function pointer
    NULL,  // get_const(index) function pointer
    NULL,  // get(index) function pointer
    NULL,  // fetch(index, &value) function pointer
    NULL,  // assign(index, value) function pointer
    NULL  // resize(index) function pointer
  },
  {
    "info",  // name
    rosidl_typesupport_introspection_c__ROS_TYPE_STRING,  // type
    0,  // upper bound of string
    NULL,  // members of sub message
    false,  // is key
    false,  // is array
    0,  // array size
    false,  // is upper bound
    offsetof(rbt1_interfaces__msg__MissionState, info),  // bytes offset in struct
    NULL,  // default value
    NULL,  // size() function pointer
    NULL,  // get_const(index) function pointer
    NULL,  // get(index) function pointer
    NULL,  // fetch(index, &value) function pointer
    NULL,  // assign(index, value) function pointer
    NULL  // resize(index) function pointer
  }
};

static const rosidl_typesupport_introspection_c__MessageMembers rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_message_members = {
  "rbt1_interfaces__msg",  // message namespace
  "MissionState",  // message name
  4,  // number of fields
  sizeof(rbt1_interfaces__msg__MissionState),
  false,  // has_any_key_member_
  rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_message_member_array,  // message members
  rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_init_function,  // function to initialize message memory (memory has to be allocated)
  rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_fini_function  // function to terminate message instance (will not free memory)
};

// this is not const since it must be initialized on first access
// since C does not allow non-integral compile-time constants
static rosidl_message_type_support_t rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_message_type_support_handle = {
  0,
  &rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_message_members,
  get_message_typesupport_handle_function,
  &rbt1_interfaces__msg__MissionState__get_type_hash,
  &rbt1_interfaces__msg__MissionState__get_type_description,
  &rbt1_interfaces__msg__MissionState__get_type_description_sources,
};

ROSIDL_TYPESUPPORT_INTROSPECTION_C_EXPORT_rbt1_interfaces
const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, msg, MissionState)() {
  if (!rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_message_type_support_handle.typesupport_identifier) {
    rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_message_type_support_handle.typesupport_identifier =
      rosidl_typesupport_introspection_c__identifier;
  }
  return &rbt1_interfaces__msg__MissionState__rosidl_typesupport_introspection_c__MissionState_message_type_support_handle;
}
#ifdef __cplusplus
}
#endif
