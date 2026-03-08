// generated from rosidl_typesupport_fastrtps_c/resource/idl__type_support_c.cpp.em
// with input from rbt1_interfaces:msg/MissionCommand.idl
// generated code does not contain a copyright notice
#include "rbt1_interfaces/msg/detail/mission_command__rosidl_typesupport_fastrtps_c.h"


#include <cassert>
#include <cstddef>
#include <limits>
#include <string>
#include "rosidl_typesupport_fastrtps_c/identifier.h"
#include "rosidl_typesupport_fastrtps_c/serialization_helpers.hpp"
#include "rosidl_typesupport_fastrtps_c/wstring_conversion.hpp"
#include "rosidl_typesupport_fastrtps_cpp/message_type_support.h"
#include "rbt1_interfaces/msg/rosidl_typesupport_fastrtps_c__visibility_control.h"
#include "rbt1_interfaces/msg/detail/mission_command__struct.h"
#include "rbt1_interfaces/msg/detail/mission_command__functions.h"
#include "fastcdr/Cdr.h"

#ifndef _WIN32
# pragma GCC diagnostic push
# pragma GCC diagnostic ignored "-Wunused-parameter"
# ifdef __clang__
#  pragma clang diagnostic ignored "-Wdeprecated-register"
#  pragma clang diagnostic ignored "-Wreturn-type-c-linkage"
# endif
#endif
#ifndef _WIN32
# pragma GCC diagnostic pop
#endif

// includes and forward declarations of message dependencies and their conversion functions

#if defined(__cplusplus)
extern "C"
{
#endif

#include "rosidl_runtime_c/string.h"  // mission_id, mission_type, zone
#include "rosidl_runtime_c/string_functions.h"  // mission_id, mission_type, zone

// forward declare type support functions


using _MissionCommand__ros_msg_type = rbt1_interfaces__msg__MissionCommand;


ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
bool cdr_serialize_rbt1_interfaces__msg__MissionCommand(
  const rbt1_interfaces__msg__MissionCommand * ros_message,
  eprosima::fastcdr::Cdr & cdr)
{
  // Field name: mission_id
  {
    const rosidl_runtime_c__String * str = &ros_message->mission_id;
    if (str->capacity == 0 || str->capacity <= str->size) {
      fprintf(stderr, "string capacity not greater than size\n");
      return false;
    }
    if (str->data[str->size] != '\0') {
      fprintf(stderr, "string not null-terminated\n");
      return false;
    }
    cdr << str->data;
  }

  // Field name: zone
  {
    const rosidl_runtime_c__String * str = &ros_message->zone;
    if (str->capacity == 0 || str->capacity <= str->size) {
      fprintf(stderr, "string capacity not greater than size\n");
      return false;
    }
    if (str->data[str->size] != '\0') {
      fprintf(stderr, "string not null-terminated\n");
      return false;
    }
    cdr << str->data;
  }

  // Field name: mission_type
  {
    const rosidl_runtime_c__String * str = &ros_message->mission_type;
    if (str->capacity == 0 || str->capacity <= str->size) {
      fprintf(stderr, "string capacity not greater than size\n");
      return false;
    }
    if (str->data[str->size] != '\0') {
      fprintf(stderr, "string not null-terminated\n");
      return false;
    }
    cdr << str->data;
  }

  // Field name: min_battery_percent
  {
    cdr << ros_message->min_battery_percent;
  }

  return true;
}

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
bool cdr_deserialize_rbt1_interfaces__msg__MissionCommand(
  eprosima::fastcdr::Cdr & cdr,
  rbt1_interfaces__msg__MissionCommand * ros_message)
{
  // Field name: mission_id
  {
    std::string tmp;
    cdr >> tmp;
    if (!ros_message->mission_id.data) {
      rosidl_runtime_c__String__init(&ros_message->mission_id);
    }
    bool succeeded = rosidl_runtime_c__String__assign(
      &ros_message->mission_id,
      tmp.c_str());
    if (!succeeded) {
      fprintf(stderr, "failed to assign string into field 'mission_id'\n");
      return false;
    }
  }

  // Field name: zone
  {
    std::string tmp;
    cdr >> tmp;
    if (!ros_message->zone.data) {
      rosidl_runtime_c__String__init(&ros_message->zone);
    }
    bool succeeded = rosidl_runtime_c__String__assign(
      &ros_message->zone,
      tmp.c_str());
    if (!succeeded) {
      fprintf(stderr, "failed to assign string into field 'zone'\n");
      return false;
    }
  }

  // Field name: mission_type
  {
    std::string tmp;
    cdr >> tmp;
    if (!ros_message->mission_type.data) {
      rosidl_runtime_c__String__init(&ros_message->mission_type);
    }
    bool succeeded = rosidl_runtime_c__String__assign(
      &ros_message->mission_type,
      tmp.c_str());
    if (!succeeded) {
      fprintf(stderr, "failed to assign string into field 'mission_type'\n");
      return false;
    }
  }

  // Field name: min_battery_percent
  {
    cdr >> ros_message->min_battery_percent;
  }

  return true;
}  // NOLINT(readability/fn_size)


ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
size_t get_serialized_size_rbt1_interfaces__msg__MissionCommand(
  const void * untyped_ros_message,
  size_t current_alignment)
{
  const _MissionCommand__ros_msg_type * ros_message = static_cast<const _MissionCommand__ros_msg_type *>(untyped_ros_message);
  (void)ros_message;
  size_t initial_alignment = current_alignment;

  const size_t padding = 4;
  const size_t wchar_size = 4;
  (void)padding;
  (void)wchar_size;

  // Field name: mission_id
  current_alignment += padding +
    eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
    (ros_message->mission_id.size + 1);

  // Field name: zone
  current_alignment += padding +
    eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
    (ros_message->zone.size + 1);

  // Field name: mission_type
  current_alignment += padding +
    eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
    (ros_message->mission_type.size + 1);

  // Field name: min_battery_percent
  {
    size_t item_size = sizeof(ros_message->min_battery_percent);
    current_alignment += item_size +
      eprosima::fastcdr::Cdr::alignment(current_alignment, item_size);
  }

  return current_alignment - initial_alignment;
}


ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
size_t max_serialized_size_rbt1_interfaces__msg__MissionCommand(
  bool & full_bounded,
  bool & is_plain,
  size_t current_alignment)
{
  size_t initial_alignment = current_alignment;

  const size_t padding = 4;
  const size_t wchar_size = 4;
  size_t last_member_size = 0;
  (void)last_member_size;
  (void)padding;
  (void)wchar_size;

  full_bounded = true;
  is_plain = true;

  // Field name: mission_id
  {
    size_t array_size = 1;
    full_bounded = false;
    is_plain = false;
    for (size_t index = 0; index < array_size; ++index) {
      current_alignment += padding +
        eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
        1;
    }
  }

  // Field name: zone
  {
    size_t array_size = 1;
    full_bounded = false;
    is_plain = false;
    for (size_t index = 0; index < array_size; ++index) {
      current_alignment += padding +
        eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
        1;
    }
  }

  // Field name: mission_type
  {
    size_t array_size = 1;
    full_bounded = false;
    is_plain = false;
    for (size_t index = 0; index < array_size; ++index) {
      current_alignment += padding +
        eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
        1;
    }
  }

  // Field name: min_battery_percent
  {
    size_t array_size = 1;
    last_member_size = array_size * sizeof(uint32_t);
    current_alignment += array_size * sizeof(uint32_t) +
      eprosima::fastcdr::Cdr::alignment(current_alignment, sizeof(uint32_t));
  }


  size_t ret_val = current_alignment - initial_alignment;
  if (is_plain) {
    // All members are plain, and type is not empty.
    // We still need to check that the in-memory alignment
    // is the same as the CDR mandated alignment.
    using DataType = rbt1_interfaces__msg__MissionCommand;
    is_plain =
      (
      offsetof(DataType, min_battery_percent) +
      last_member_size
      ) == ret_val;
  }
  return ret_val;
}

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
bool cdr_serialize_key_rbt1_interfaces__msg__MissionCommand(
  const rbt1_interfaces__msg__MissionCommand * ros_message,
  eprosima::fastcdr::Cdr & cdr)
{
  // Field name: mission_id
  {
    const rosidl_runtime_c__String * str = &ros_message->mission_id;
    if (str->capacity == 0 || str->capacity <= str->size) {
      fprintf(stderr, "string capacity not greater than size\n");
      return false;
    }
    if (str->data[str->size] != '\0') {
      fprintf(stderr, "string not null-terminated\n");
      return false;
    }
    cdr << str->data;
  }

  // Field name: zone
  {
    const rosidl_runtime_c__String * str = &ros_message->zone;
    if (str->capacity == 0 || str->capacity <= str->size) {
      fprintf(stderr, "string capacity not greater than size\n");
      return false;
    }
    if (str->data[str->size] != '\0') {
      fprintf(stderr, "string not null-terminated\n");
      return false;
    }
    cdr << str->data;
  }

  // Field name: mission_type
  {
    const rosidl_runtime_c__String * str = &ros_message->mission_type;
    if (str->capacity == 0 || str->capacity <= str->size) {
      fprintf(stderr, "string capacity not greater than size\n");
      return false;
    }
    if (str->data[str->size] != '\0') {
      fprintf(stderr, "string not null-terminated\n");
      return false;
    }
    cdr << str->data;
  }

  // Field name: min_battery_percent
  {
    cdr << ros_message->min_battery_percent;
  }

  return true;
}

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
size_t get_serialized_size_key_rbt1_interfaces__msg__MissionCommand(
  const void * untyped_ros_message,
  size_t current_alignment)
{
  const _MissionCommand__ros_msg_type * ros_message = static_cast<const _MissionCommand__ros_msg_type *>(untyped_ros_message);
  (void)ros_message;

  size_t initial_alignment = current_alignment;

  const size_t padding = 4;
  const size_t wchar_size = 4;
  (void)padding;
  (void)wchar_size;

  // Field name: mission_id
  current_alignment += padding +
    eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
    (ros_message->mission_id.size + 1);

  // Field name: zone
  current_alignment += padding +
    eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
    (ros_message->zone.size + 1);

  // Field name: mission_type
  current_alignment += padding +
    eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
    (ros_message->mission_type.size + 1);

  // Field name: min_battery_percent
  {
    size_t item_size = sizeof(ros_message->min_battery_percent);
    current_alignment += item_size +
      eprosima::fastcdr::Cdr::alignment(current_alignment, item_size);
  }

  return current_alignment - initial_alignment;
}

ROSIDL_TYPESUPPORT_FASTRTPS_C_PUBLIC_rbt1_interfaces
size_t max_serialized_size_key_rbt1_interfaces__msg__MissionCommand(
  bool & full_bounded,
  bool & is_plain,
  size_t current_alignment)
{
  size_t initial_alignment = current_alignment;

  const size_t padding = 4;
  const size_t wchar_size = 4;
  size_t last_member_size = 0;
  (void)last_member_size;
  (void)padding;
  (void)wchar_size;

  full_bounded = true;
  is_plain = true;
  // Field name: mission_id
  {
    size_t array_size = 1;
    full_bounded = false;
    is_plain = false;
    for (size_t index = 0; index < array_size; ++index) {
      current_alignment += padding +
        eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
        1;
    }
  }

  // Field name: zone
  {
    size_t array_size = 1;
    full_bounded = false;
    is_plain = false;
    for (size_t index = 0; index < array_size; ++index) {
      current_alignment += padding +
        eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
        1;
    }
  }

  // Field name: mission_type
  {
    size_t array_size = 1;
    full_bounded = false;
    is_plain = false;
    for (size_t index = 0; index < array_size; ++index) {
      current_alignment += padding +
        eprosima::fastcdr::Cdr::alignment(current_alignment, padding) +
        1;
    }
  }

  // Field name: min_battery_percent
  {
    size_t array_size = 1;
    last_member_size = array_size * sizeof(uint32_t);
    current_alignment += array_size * sizeof(uint32_t) +
      eprosima::fastcdr::Cdr::alignment(current_alignment, sizeof(uint32_t));
  }

  size_t ret_val = current_alignment - initial_alignment;
  if (is_plain) {
    // All members are plain, and type is not empty.
    // We still need to check that the in-memory alignment
    // is the same as the CDR mandated alignment.
    using DataType = rbt1_interfaces__msg__MissionCommand;
    is_plain =
      (
      offsetof(DataType, min_battery_percent) +
      last_member_size
      ) == ret_val;
  }
  return ret_val;
}


static bool _MissionCommand__cdr_serialize(
  const void * untyped_ros_message,
  eprosima::fastcdr::Cdr & cdr)
{
  if (!untyped_ros_message) {
    fprintf(stderr, "ros message handle is null\n");
    return false;
  }
  const rbt1_interfaces__msg__MissionCommand * ros_message = static_cast<const rbt1_interfaces__msg__MissionCommand *>(untyped_ros_message);
  (void)ros_message;
  return cdr_serialize_rbt1_interfaces__msg__MissionCommand(ros_message, cdr);
}

static bool _MissionCommand__cdr_deserialize(
  eprosima::fastcdr::Cdr & cdr,
  void * untyped_ros_message)
{
  if (!untyped_ros_message) {
    fprintf(stderr, "ros message handle is null\n");
    return false;
  }
  rbt1_interfaces__msg__MissionCommand * ros_message = static_cast<rbt1_interfaces__msg__MissionCommand *>(untyped_ros_message);
  (void)ros_message;
  return cdr_deserialize_rbt1_interfaces__msg__MissionCommand(cdr, ros_message);
}

static uint32_t _MissionCommand__get_serialized_size(const void * untyped_ros_message)
{
  return static_cast<uint32_t>(
    get_serialized_size_rbt1_interfaces__msg__MissionCommand(
      untyped_ros_message, 0));
}

static size_t _MissionCommand__max_serialized_size(char & bounds_info)
{
  bool full_bounded;
  bool is_plain;
  size_t ret_val;

  ret_val = max_serialized_size_rbt1_interfaces__msg__MissionCommand(
    full_bounded, is_plain, 0);

  bounds_info =
    is_plain ? ROSIDL_TYPESUPPORT_FASTRTPS_PLAIN_TYPE :
    full_bounded ? ROSIDL_TYPESUPPORT_FASTRTPS_BOUNDED_TYPE : ROSIDL_TYPESUPPORT_FASTRTPS_UNBOUNDED_TYPE;
  return ret_val;
}


static message_type_support_callbacks_t __callbacks_MissionCommand = {
  "rbt1_interfaces::msg",
  "MissionCommand",
  _MissionCommand__cdr_serialize,
  _MissionCommand__cdr_deserialize,
  _MissionCommand__get_serialized_size,
  _MissionCommand__max_serialized_size,
  nullptr
};

static rosidl_message_type_support_t _MissionCommand__type_support = {
  rosidl_typesupport_fastrtps_c__identifier,
  &__callbacks_MissionCommand,
  get_message_typesupport_handle_function,
  &rbt1_interfaces__msg__MissionCommand__get_type_hash,
  &rbt1_interfaces__msg__MissionCommand__get_type_description,
  &rbt1_interfaces__msg__MissionCommand__get_type_description_sources,
};

const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_fastrtps_c, rbt1_interfaces, msg, MissionCommand)() {
  return &_MissionCommand__type_support;
}

#if defined(__cplusplus)
}
#endif
