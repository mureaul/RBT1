// generated from rosidl_typesupport_introspection_c/resource/idl__type_support.c.em
// with input from rbt1_interfaces:srv/GenerateCoverage.idl
// generated code does not contain a copyright notice

#include <stddef.h>
#include "rbt1_interfaces/srv/detail/generate_coverage__rosidl_typesupport_introspection_c.h"
#include "rbt1_interfaces/msg/rosidl_typesupport_introspection_c__visibility_control.h"
#include "rosidl_typesupport_introspection_c/field_types.h"
#include "rosidl_typesupport_introspection_c/identifier.h"
#include "rosidl_typesupport_introspection_c/message_introspection.h"
#include "rbt1_interfaces/srv/detail/generate_coverage__functions.h"
#include "rbt1_interfaces/srv/detail/generate_coverage__struct.h"


// Include directives for member types
// Member `zone_name`
#include "rosidl_runtime_c/string_functions.h"

#ifdef __cplusplus
extern "C"
{
#endif

void rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_init_function(
  void * message_memory, enum rosidl_runtime_c__message_initialization _init)
{
  // TODO(karsten1987): initializers are not yet implemented for typesupport c
  // see https://github.com/ros2/ros2/issues/397
  (void) _init;
  rbt1_interfaces__srv__GenerateCoverage_Request__init(message_memory);
}

void rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_fini_function(void * message_memory)
{
  rbt1_interfaces__srv__GenerateCoverage_Request__fini(message_memory);
}

static rosidl_typesupport_introspection_c__MessageMember rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_message_member_array[1] = {
  {
    "zone_name",  // name
    rosidl_typesupport_introspection_c__ROS_TYPE_STRING,  // type
    0,  // upper bound of string
    NULL,  // members of sub message
    false,  // is key
    false,  // is array
    0,  // array size
    false,  // is upper bound
    offsetof(rbt1_interfaces__srv__GenerateCoverage_Request, zone_name),  // bytes offset in struct
    NULL,  // default value
    NULL,  // size() function pointer
    NULL,  // get_const(index) function pointer
    NULL,  // get(index) function pointer
    NULL,  // fetch(index, &value) function pointer
    NULL,  // assign(index, value) function pointer
    NULL  // resize(index) function pointer
  }
};

static const rosidl_typesupport_introspection_c__MessageMembers rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_message_members = {
  "rbt1_interfaces__srv",  // message namespace
  "GenerateCoverage_Request",  // message name
  1,  // number of fields
  sizeof(rbt1_interfaces__srv__GenerateCoverage_Request),
  false,  // has_any_key_member_
  rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_message_member_array,  // message members
  rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_init_function,  // function to initialize message memory (memory has to be allocated)
  rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_fini_function  // function to terminate message instance (will not free memory)
};

// this is not const since it must be initialized on first access
// since C does not allow non-integral compile-time constants
static rosidl_message_type_support_t rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_message_type_support_handle = {
  0,
  &rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_message_members,
  get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__GenerateCoverage_Request__get_type_hash,
  &rbt1_interfaces__srv__GenerateCoverage_Request__get_type_description,
  &rbt1_interfaces__srv__GenerateCoverage_Request__get_type_description_sources,
};

ROSIDL_TYPESUPPORT_INTROSPECTION_C_EXPORT_rbt1_interfaces
const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Request)() {
  if (!rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_message_type_support_handle.typesupport_identifier) {
    rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_message_type_support_handle.typesupport_identifier =
      rosidl_typesupport_introspection_c__identifier;
  }
  return &rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_message_type_support_handle;
}
#ifdef __cplusplus
}
#endif

// already included above
// #include <stddef.h>
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__rosidl_typesupport_introspection_c.h"
// already included above
// #include "rbt1_interfaces/msg/rosidl_typesupport_introspection_c__visibility_control.h"
// already included above
// #include "rosidl_typesupport_introspection_c/field_types.h"
// already included above
// #include "rosidl_typesupport_introspection_c/identifier.h"
// already included above
// #include "rosidl_typesupport_introspection_c/message_introspection.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__functions.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__struct.h"


// Include directives for member types
// Member `message`
// already included above
// #include "rosidl_runtime_c/string_functions.h"

#ifdef __cplusplus
extern "C"
{
#endif

void rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_init_function(
  void * message_memory, enum rosidl_runtime_c__message_initialization _init)
{
  // TODO(karsten1987): initializers are not yet implemented for typesupport c
  // see https://github.com/ros2/ros2/issues/397
  (void) _init;
  rbt1_interfaces__srv__GenerateCoverage_Response__init(message_memory);
}

void rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_fini_function(void * message_memory)
{
  rbt1_interfaces__srv__GenerateCoverage_Response__fini(message_memory);
}

static rosidl_typesupport_introspection_c__MessageMember rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_message_member_array[2] = {
  {
    "success",  // name
    rosidl_typesupport_introspection_c__ROS_TYPE_BOOLEAN,  // type
    0,  // upper bound of string
    NULL,  // members of sub message
    false,  // is key
    false,  // is array
    0,  // array size
    false,  // is upper bound
    offsetof(rbt1_interfaces__srv__GenerateCoverage_Response, success),  // bytes offset in struct
    NULL,  // default value
    NULL,  // size() function pointer
    NULL,  // get_const(index) function pointer
    NULL,  // get(index) function pointer
    NULL,  // fetch(index, &value) function pointer
    NULL,  // assign(index, value) function pointer
    NULL  // resize(index) function pointer
  },
  {
    "message",  // name
    rosidl_typesupport_introspection_c__ROS_TYPE_STRING,  // type
    0,  // upper bound of string
    NULL,  // members of sub message
    false,  // is key
    false,  // is array
    0,  // array size
    false,  // is upper bound
    offsetof(rbt1_interfaces__srv__GenerateCoverage_Response, message),  // bytes offset in struct
    NULL,  // default value
    NULL,  // size() function pointer
    NULL,  // get_const(index) function pointer
    NULL,  // get(index) function pointer
    NULL,  // fetch(index, &value) function pointer
    NULL,  // assign(index, value) function pointer
    NULL  // resize(index) function pointer
  }
};

static const rosidl_typesupport_introspection_c__MessageMembers rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_message_members = {
  "rbt1_interfaces__srv",  // message namespace
  "GenerateCoverage_Response",  // message name
  2,  // number of fields
  sizeof(rbt1_interfaces__srv__GenerateCoverage_Response),
  false,  // has_any_key_member_
  rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_message_member_array,  // message members
  rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_init_function,  // function to initialize message memory (memory has to be allocated)
  rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_fini_function  // function to terminate message instance (will not free memory)
};

// this is not const since it must be initialized on first access
// since C does not allow non-integral compile-time constants
static rosidl_message_type_support_t rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_message_type_support_handle = {
  0,
  &rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_message_members,
  get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__GenerateCoverage_Response__get_type_hash,
  &rbt1_interfaces__srv__GenerateCoverage_Response__get_type_description,
  &rbt1_interfaces__srv__GenerateCoverage_Response__get_type_description_sources,
};

ROSIDL_TYPESUPPORT_INTROSPECTION_C_EXPORT_rbt1_interfaces
const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Response)() {
  if (!rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_message_type_support_handle.typesupport_identifier) {
    rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_message_type_support_handle.typesupport_identifier =
      rosidl_typesupport_introspection_c__identifier;
  }
  return &rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_message_type_support_handle;
}
#ifdef __cplusplus
}
#endif

// already included above
// #include <stddef.h>
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__rosidl_typesupport_introspection_c.h"
// already included above
// #include "rbt1_interfaces/msg/rosidl_typesupport_introspection_c__visibility_control.h"
// already included above
// #include "rosidl_typesupport_introspection_c/field_types.h"
// already included above
// #include "rosidl_typesupport_introspection_c/identifier.h"
// already included above
// #include "rosidl_typesupport_introspection_c/message_introspection.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__functions.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__struct.h"


// Include directives for member types
// Member `info`
#include "service_msgs/msg/service_event_info.h"
// Member `info`
#include "service_msgs/msg/detail/service_event_info__rosidl_typesupport_introspection_c.h"
// Member `request`
// Member `response`
#include "rbt1_interfaces/srv/generate_coverage.h"
// Member `request`
// Member `response`
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__rosidl_typesupport_introspection_c.h"

#ifdef __cplusplus
extern "C"
{
#endif

void rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_init_function(
  void * message_memory, enum rosidl_runtime_c__message_initialization _init)
{
  // TODO(karsten1987): initializers are not yet implemented for typesupport c
  // see https://github.com/ros2/ros2/issues/397
  (void) _init;
  rbt1_interfaces__srv__GenerateCoverage_Event__init(message_memory);
}

void rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_fini_function(void * message_memory)
{
  rbt1_interfaces__srv__GenerateCoverage_Event__fini(message_memory);
}

size_t rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__size_function__GenerateCoverage_Event__request(
  const void * untyped_member)
{
  const rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * member =
    (const rbt1_interfaces__srv__GenerateCoverage_Request__Sequence *)(untyped_member);
  return member->size;
}

const void * rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_const_function__GenerateCoverage_Event__request(
  const void * untyped_member, size_t index)
{
  const rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * member =
    (const rbt1_interfaces__srv__GenerateCoverage_Request__Sequence *)(untyped_member);
  return &member->data[index];
}

void * rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_function__GenerateCoverage_Event__request(
  void * untyped_member, size_t index)
{
  rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * member =
    (rbt1_interfaces__srv__GenerateCoverage_Request__Sequence *)(untyped_member);
  return &member->data[index];
}

void rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__fetch_function__GenerateCoverage_Event__request(
  const void * untyped_member, size_t index, void * untyped_value)
{
  const rbt1_interfaces__srv__GenerateCoverage_Request * item =
    ((const rbt1_interfaces__srv__GenerateCoverage_Request *)
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_const_function__GenerateCoverage_Event__request(untyped_member, index));
  rbt1_interfaces__srv__GenerateCoverage_Request * value =
    (rbt1_interfaces__srv__GenerateCoverage_Request *)(untyped_value);
  *value = *item;
}

void rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__assign_function__GenerateCoverage_Event__request(
  void * untyped_member, size_t index, const void * untyped_value)
{
  rbt1_interfaces__srv__GenerateCoverage_Request * item =
    ((rbt1_interfaces__srv__GenerateCoverage_Request *)
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_function__GenerateCoverage_Event__request(untyped_member, index));
  const rbt1_interfaces__srv__GenerateCoverage_Request * value =
    (const rbt1_interfaces__srv__GenerateCoverage_Request *)(untyped_value);
  *item = *value;
}

bool rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__resize_function__GenerateCoverage_Event__request(
  void * untyped_member, size_t size)
{
  rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * member =
    (rbt1_interfaces__srv__GenerateCoverage_Request__Sequence *)(untyped_member);
  rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__fini(member);
  return rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__init(member, size);
}

size_t rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__size_function__GenerateCoverage_Event__response(
  const void * untyped_member)
{
  const rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * member =
    (const rbt1_interfaces__srv__GenerateCoverage_Response__Sequence *)(untyped_member);
  return member->size;
}

const void * rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_const_function__GenerateCoverage_Event__response(
  const void * untyped_member, size_t index)
{
  const rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * member =
    (const rbt1_interfaces__srv__GenerateCoverage_Response__Sequence *)(untyped_member);
  return &member->data[index];
}

void * rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_function__GenerateCoverage_Event__response(
  void * untyped_member, size_t index)
{
  rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * member =
    (rbt1_interfaces__srv__GenerateCoverage_Response__Sequence *)(untyped_member);
  return &member->data[index];
}

void rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__fetch_function__GenerateCoverage_Event__response(
  const void * untyped_member, size_t index, void * untyped_value)
{
  const rbt1_interfaces__srv__GenerateCoverage_Response * item =
    ((const rbt1_interfaces__srv__GenerateCoverage_Response *)
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_const_function__GenerateCoverage_Event__response(untyped_member, index));
  rbt1_interfaces__srv__GenerateCoverage_Response * value =
    (rbt1_interfaces__srv__GenerateCoverage_Response *)(untyped_value);
  *value = *item;
}

void rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__assign_function__GenerateCoverage_Event__response(
  void * untyped_member, size_t index, const void * untyped_value)
{
  rbt1_interfaces__srv__GenerateCoverage_Response * item =
    ((rbt1_interfaces__srv__GenerateCoverage_Response *)
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_function__GenerateCoverage_Event__response(untyped_member, index));
  const rbt1_interfaces__srv__GenerateCoverage_Response * value =
    (const rbt1_interfaces__srv__GenerateCoverage_Response *)(untyped_value);
  *item = *value;
}

bool rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__resize_function__GenerateCoverage_Event__response(
  void * untyped_member, size_t size)
{
  rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * member =
    (rbt1_interfaces__srv__GenerateCoverage_Response__Sequence *)(untyped_member);
  rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__fini(member);
  return rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__init(member, size);
}

static rosidl_typesupport_introspection_c__MessageMember rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_member_array[3] = {
  {
    "info",  // name
    rosidl_typesupport_introspection_c__ROS_TYPE_MESSAGE,  // type
    0,  // upper bound of string
    NULL,  // members of sub message (initialized later)
    false,  // is key
    false,  // is array
    0,  // array size
    false,  // is upper bound
    offsetof(rbt1_interfaces__srv__GenerateCoverage_Event, info),  // bytes offset in struct
    NULL,  // default value
    NULL,  // size() function pointer
    NULL,  // get_const(index) function pointer
    NULL,  // get(index) function pointer
    NULL,  // fetch(index, &value) function pointer
    NULL,  // assign(index, value) function pointer
    NULL  // resize(index) function pointer
  },
  {
    "request",  // name
    rosidl_typesupport_introspection_c__ROS_TYPE_MESSAGE,  // type
    0,  // upper bound of string
    NULL,  // members of sub message (initialized later)
    false,  // is key
    true,  // is array
    1,  // array size
    true,  // is upper bound
    offsetof(rbt1_interfaces__srv__GenerateCoverage_Event, request),  // bytes offset in struct
    NULL,  // default value
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__size_function__GenerateCoverage_Event__request,  // size() function pointer
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_const_function__GenerateCoverage_Event__request,  // get_const(index) function pointer
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_function__GenerateCoverage_Event__request,  // get(index) function pointer
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__fetch_function__GenerateCoverage_Event__request,  // fetch(index, &value) function pointer
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__assign_function__GenerateCoverage_Event__request,  // assign(index, value) function pointer
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__resize_function__GenerateCoverage_Event__request  // resize(index) function pointer
  },
  {
    "response",  // name
    rosidl_typesupport_introspection_c__ROS_TYPE_MESSAGE,  // type
    0,  // upper bound of string
    NULL,  // members of sub message (initialized later)
    false,  // is key
    true,  // is array
    1,  // array size
    true,  // is upper bound
    offsetof(rbt1_interfaces__srv__GenerateCoverage_Event, response),  // bytes offset in struct
    NULL,  // default value
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__size_function__GenerateCoverage_Event__response,  // size() function pointer
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_const_function__GenerateCoverage_Event__response,  // get_const(index) function pointer
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__get_function__GenerateCoverage_Event__response,  // get(index) function pointer
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__fetch_function__GenerateCoverage_Event__response,  // fetch(index, &value) function pointer
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__assign_function__GenerateCoverage_Event__response,  // assign(index, value) function pointer
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__resize_function__GenerateCoverage_Event__response  // resize(index) function pointer
  }
};

static const rosidl_typesupport_introspection_c__MessageMembers rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_members = {
  "rbt1_interfaces__srv",  // message namespace
  "GenerateCoverage_Event",  // message name
  3,  // number of fields
  sizeof(rbt1_interfaces__srv__GenerateCoverage_Event),
  false,  // has_any_key_member_
  rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_member_array,  // message members
  rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_init_function,  // function to initialize message memory (memory has to be allocated)
  rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_fini_function  // function to terminate message instance (will not free memory)
};

// this is not const since it must be initialized on first access
// since C does not allow non-integral compile-time constants
static rosidl_message_type_support_t rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_type_support_handle = {
  0,
  &rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_members,
  get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__GenerateCoverage_Event__get_type_hash,
  &rbt1_interfaces__srv__GenerateCoverage_Event__get_type_description,
  &rbt1_interfaces__srv__GenerateCoverage_Event__get_type_description_sources,
};

ROSIDL_TYPESUPPORT_INTROSPECTION_C_EXPORT_rbt1_interfaces
const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Event)() {
  rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_member_array[0].members_ =
    ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, service_msgs, msg, ServiceEventInfo)();
  rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_member_array[1].members_ =
    ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Request)();
  rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_member_array[2].members_ =
    ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Response)();
  if (!rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_type_support_handle.typesupport_identifier) {
    rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_type_support_handle.typesupport_identifier =
      rosidl_typesupport_introspection_c__identifier;
  }
  return &rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_type_support_handle;
}
#ifdef __cplusplus
}
#endif

#include "rosidl_runtime_c/service_type_support_struct.h"
// already included above
// #include "rbt1_interfaces/msg/rosidl_typesupport_introspection_c__visibility_control.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__rosidl_typesupport_introspection_c.h"
// already included above
// #include "rosidl_typesupport_introspection_c/identifier.h"
#include "rosidl_typesupport_introspection_c/service_introspection.h"

// this is intentionally not const to allow initialization later to prevent an initialization race
static rosidl_typesupport_introspection_c__ServiceMembers rbt1_interfaces__srv__detail__generate_coverage__rosidl_typesupport_introspection_c__GenerateCoverage_service_members = {
  "rbt1_interfaces__srv",  // service namespace
  "GenerateCoverage",  // service name
  // the following fields are initialized below on first access
  NULL,  // request message
  // rbt1_interfaces__srv__detail__generate_coverage__rosidl_typesupport_introspection_c__GenerateCoverage_Request_message_type_support_handle,
  NULL,  // response message
  // rbt1_interfaces__srv__detail__generate_coverage__rosidl_typesupport_introspection_c__GenerateCoverage_Response_message_type_support_handle
  NULL  // event_message
  // rbt1_interfaces__srv__detail__generate_coverage__rosidl_typesupport_introspection_c__GenerateCoverage_Response_message_type_support_handle
};


static rosidl_service_type_support_t rbt1_interfaces__srv__detail__generate_coverage__rosidl_typesupport_introspection_c__GenerateCoverage_service_type_support_handle = {
  0,
  &rbt1_interfaces__srv__detail__generate_coverage__rosidl_typesupport_introspection_c__GenerateCoverage_service_members,
  get_service_typesupport_handle_function,
  &rbt1_interfaces__srv__GenerateCoverage_Request__rosidl_typesupport_introspection_c__GenerateCoverage_Request_message_type_support_handle,
  &rbt1_interfaces__srv__GenerateCoverage_Response__rosidl_typesupport_introspection_c__GenerateCoverage_Response_message_type_support_handle,
  &rbt1_interfaces__srv__GenerateCoverage_Event__rosidl_typesupport_introspection_c__GenerateCoverage_Event_message_type_support_handle,
  ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_CREATE_EVENT_MESSAGE_SYMBOL_NAME(
    rosidl_typesupport_c,
    rbt1_interfaces,
    srv,
    GenerateCoverage
  ),
  ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_DESTROY_EVENT_MESSAGE_SYMBOL_NAME(
    rosidl_typesupport_c,
    rbt1_interfaces,
    srv,
    GenerateCoverage
  ),
  &rbt1_interfaces__srv__GenerateCoverage__get_type_hash,
  &rbt1_interfaces__srv__GenerateCoverage__get_type_description,
  &rbt1_interfaces__srv__GenerateCoverage__get_type_description_sources,
};

// Forward declaration of message type support functions for service members
const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Request)(void);

const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Response)(void);

const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Event)(void);

ROSIDL_TYPESUPPORT_INTROSPECTION_C_EXPORT_rbt1_interfaces
const rosidl_service_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage)(void) {
  if (!rbt1_interfaces__srv__detail__generate_coverage__rosidl_typesupport_introspection_c__GenerateCoverage_service_type_support_handle.typesupport_identifier) {
    rbt1_interfaces__srv__detail__generate_coverage__rosidl_typesupport_introspection_c__GenerateCoverage_service_type_support_handle.typesupport_identifier =
      rosidl_typesupport_introspection_c__identifier;
  }
  rosidl_typesupport_introspection_c__ServiceMembers * service_members =
    (rosidl_typesupport_introspection_c__ServiceMembers *)rbt1_interfaces__srv__detail__generate_coverage__rosidl_typesupport_introspection_c__GenerateCoverage_service_type_support_handle.data;

  if (!service_members->request_members_) {
    service_members->request_members_ =
      (const rosidl_typesupport_introspection_c__MessageMembers *)
      ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Request)()->data;
  }
  if (!service_members->response_members_) {
    service_members->response_members_ =
      (const rosidl_typesupport_introspection_c__MessageMembers *)
      ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Response)()->data;
  }
  if (!service_members->event_members_) {
    service_members->event_members_ =
      (const rosidl_typesupport_introspection_c__MessageMembers *)
      ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Event)()->data;
  }

  return &rbt1_interfaces__srv__detail__generate_coverage__rosidl_typesupport_introspection_c__GenerateCoverage_service_type_support_handle;
}
