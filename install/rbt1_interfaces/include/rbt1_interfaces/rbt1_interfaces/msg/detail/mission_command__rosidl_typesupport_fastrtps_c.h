// generated from rosidl_typesupport_fastrtps_c/resource/idl__rosidl_typesupport_fastrtps_c.h.em
// with input from rbt1_interfaces:msg/MissionCommand.idl
// generated code does not contain a copyright notice
#ifndef RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__ROSIDL_TYPESUPPORT_FASTRTPS_C_H_
#define RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__ROSIDL_TYPESUPPORT_FASTRTPS_C_H_


#include <stddef.h>
#include "rosidl_runtime_c/message_type_support_struct.h"
#include "rosidl_typesupport_interface/macros.h"
#include "rbt1_interfaces/msg/rosidl_typesupport_fastrtps_c__visibility_control.h"
#include "rbt1_interfaces/msg/detail/mission_command__struct.h"
#include "fastcdr/Cdr.h"

#ifdef __cplusplus
extern "C"
{
#endif

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
bool cdr_serialize_rbt1_interfaces__msg__MissionCommand(
  const rbt1_interfaces__msg__MissionCommand * ros_message,
  eprosima::fastcdr::Cdr & cdr);

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
bool cdr_deserialize_rbt1_interfaces__msg__MissionCommand(
  eprosima::fastcdr::Cdr &,
  rbt1_interfaces__msg__MissionCommand * ros_message);

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
size_t get_serialized_size_rbt1_interfaces__msg__MissionCommand(
  const void * untyped_ros_message,
  size_t current_alignment);

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
size_t max_serialized_size_rbt1_interfaces__msg__MissionCommand(
  bool & full_bounded,
  bool & is_plain,
  size_t current_alignment);

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
bool cdr_serialize_key_rbt1_interfaces__msg__MissionCommand(
  const rbt1_interfaces__msg__MissionCommand * ros_message,
  eprosima::fastcdr::Cdr & cdr);

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
size_t get_serialized_size_key_rbt1_interfaces__msg__MissionCommand(
  const void * untyped_ros_message,
  size_t current_alignment);

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
size_t max_serialized_size_key_rbt1_interfaces__msg__MissionCommand(
  bool & full_bounded,
  bool & is_plain,
  size_t current_alignment);

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_fastrtps_c, rbt1_interfaces, msg, MissionCommand)();

#ifdef __cplusplus
}
#endif

#endif  // RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__ROSIDL_TYPESUPPORT_FASTRTPS_C_H_
