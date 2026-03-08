// generated from rosidl_typesupport_c/resource/idl__type_support.cpp.em
// with input from rbt1_interfaces:srv/LoadZone.idl
// generated code does not contain a copyright notice

#include "cstddef"
#include "rosidl_runtime_c/message_type_support_struct.h"
#include "rbt1_interfaces/srv/detail/load_zone__struct.h"
#include "rbt1_interfaces/srv/detail/load_zone__type_support.h"
#include "rbt1_interfaces/srv/detail/load_zone__functions.h"
#include "rosidl_typesupport_c/identifier.h"
#include "rosidl_typesupport_c/message_type_support_dispatch.h"
#include "rosidl_typesupport_c/type_support_map.h"
#include "rosidl_typesupport_c/visibility_control.h"
#include "rosidl_typesupport_interface/macros.h"

namespace rbt1_interfaces
{

namespace srv
{

namespace rosidl_typesupport_c
{

typedef struct _LoadZone_Request_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _LoadZone_Request_type_support_ids_t;

static const _LoadZone_Request_type_support_ids_t _LoadZone_Request_message_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_c",  // ::rosidl_typesupport_fastrtps_c::typesupport_identifier,
    "rosidl_typesupport_introspection_c",  // ::rosidl_typesupport_introspection_c::typesupport_identifier,
  }
};

typedef struct _LoadZone_Request_type_support_symbol_names_t
{
  const char * symbol_name[2];
} _LoadZone_Request_type_support_symbol_names_t;

#define STRINGIFY_(s) #s
#define STRINGIFY(s) STRINGIFY_(s)

static const _LoadZone_Request_type_support_symbol_names_t _LoadZone_Request_message_typesupport_symbol_names = {
  {
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_fastrtps_c, rbt1_interfaces, srv, LoadZone_Request)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, LoadZone_Request)),
  }
};

typedef struct _LoadZone_Request_type_support_data_t
{
  void * data[2];
} _LoadZone_Request_type_support_data_t;

static _LoadZone_Request_type_support_data_t _LoadZone_Request_message_typesupport_data = {
  {
    0,  // will store the shared library later
    0,  // will store the shared library later
  }
};

static const type_support_map_t _LoadZone_Request_message_typesupport_map = {
  2,
  "rbt1_interfaces",
  &_LoadZone_Request_message_typesupport_ids.typesupport_identifier[0],
  &_LoadZone_Request_message_typesupport_symbol_names.symbol_name[0],
  &_LoadZone_Request_message_typesupport_data.data[0],
};

static const rosidl_message_type_support_t LoadZone_Request_message_type_support_handle = {
  rosidl_typesupport_c__typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_LoadZone_Request_message_typesupport_map),
  rosidl_typesupport_c__get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__LoadZone_Request__get_type_hash,
  &rbt1_interfaces__srv__LoadZone_Request__get_type_description,
  &rbt1_interfaces__srv__LoadZone_Request__get_type_description_sources,
};

}  // namespace rosidl_typesupport_c

}  // namespace srv

}  // namespace rbt1_interfaces

#ifdef __cplusplus
extern "C"
{
#endif

const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_c, rbt1_interfaces, srv, LoadZone_Request)() {
  return &::rbt1_interfaces::srv::rosidl_typesupport_c::LoadZone_Request_message_type_support_handle;
}

#ifdef __cplusplus
}
#endif

// already included above
// #include "cstddef"
// already included above
// #include "rosidl_runtime_c/message_type_support_struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__type_support.h"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__functions.h"
// already included above
// #include "rosidl_typesupport_c/identifier.h"
// already included above
// #include "rosidl_typesupport_c/message_type_support_dispatch.h"
// already included above
// #include "rosidl_typesupport_c/type_support_map.h"
// already included above
// #include "rosidl_typesupport_c/visibility_control.h"
// already included above
// #include "rosidl_typesupport_interface/macros.h"

namespace rbt1_interfaces
{

namespace srv
{

namespace rosidl_typesupport_c
{

typedef struct _LoadZone_Response_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _LoadZone_Response_type_support_ids_t;

static const _LoadZone_Response_type_support_ids_t _LoadZone_Response_message_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_c",  // ::rosidl_typesupport_fastrtps_c::typesupport_identifier,
    "rosidl_typesupport_introspection_c",  // ::rosidl_typesupport_introspection_c::typesupport_identifier,
  }
};

typedef struct _LoadZone_Response_type_support_symbol_names_t
{
  const char * symbol_name[2];
} _LoadZone_Response_type_support_symbol_names_t;

#define STRINGIFY_(s) #s
#define STRINGIFY(s) STRINGIFY_(s)

static const _LoadZone_Response_type_support_symbol_names_t _LoadZone_Response_message_typesupport_symbol_names = {
  {
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_fastrtps_c, rbt1_interfaces, srv, LoadZone_Response)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, LoadZone_Response)),
  }
};

typedef struct _LoadZone_Response_type_support_data_t
{
  void * data[2];
} _LoadZone_Response_type_support_data_t;

static _LoadZone_Response_type_support_data_t _LoadZone_Response_message_typesupport_data = {
  {
    0,  // will store the shared library later
    0,  // will store the shared library later
  }
};

static const type_support_map_t _LoadZone_Response_message_typesupport_map = {
  2,
  "rbt1_interfaces",
  &_LoadZone_Response_message_typesupport_ids.typesupport_identifier[0],
  &_LoadZone_Response_message_typesupport_symbol_names.symbol_name[0],
  &_LoadZone_Response_message_typesupport_data.data[0],
};

static const rosidl_message_type_support_t LoadZone_Response_message_type_support_handle = {
  rosidl_typesupport_c__typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_LoadZone_Response_message_typesupport_map),
  rosidl_typesupport_c__get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__LoadZone_Response__get_type_hash,
  &rbt1_interfaces__srv__LoadZone_Response__get_type_description,
  &rbt1_interfaces__srv__LoadZone_Response__get_type_description_sources,
};

}  // namespace rosidl_typesupport_c

}  // namespace srv

}  // namespace rbt1_interfaces

#ifdef __cplusplus
extern "C"
{
#endif

const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_c, rbt1_interfaces, srv, LoadZone_Response)() {
  return &::rbt1_interfaces::srv::rosidl_typesupport_c::LoadZone_Response_message_type_support_handle;
}

#ifdef __cplusplus
}
#endif

// already included above
// #include "cstddef"
// already included above
// #include "rosidl_runtime_c/message_type_support_struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__type_support.h"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__functions.h"
// already included above
// #include "rosidl_typesupport_c/identifier.h"
// already included above
// #include "rosidl_typesupport_c/message_type_support_dispatch.h"
// already included above
// #include "rosidl_typesupport_c/type_support_map.h"
// already included above
// #include "rosidl_typesupport_c/visibility_control.h"
// already included above
// #include "rosidl_typesupport_interface/macros.h"

namespace rbt1_interfaces
{

namespace srv
{

namespace rosidl_typesupport_c
{

typedef struct _LoadZone_Event_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _LoadZone_Event_type_support_ids_t;

static const _LoadZone_Event_type_support_ids_t _LoadZone_Event_message_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_c",  // ::rosidl_typesupport_fastrtps_c::typesupport_identifier,
    "rosidl_typesupport_introspection_c",  // ::rosidl_typesupport_introspection_c::typesupport_identifier,
  }
};

typedef struct _LoadZone_Event_type_support_symbol_names_t
{
  const char * symbol_name[2];
} _LoadZone_Event_type_support_symbol_names_t;

#define STRINGIFY_(s) #s
#define STRINGIFY(s) STRINGIFY_(s)

static const _LoadZone_Event_type_support_symbol_names_t _LoadZone_Event_message_typesupport_symbol_names = {
  {
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_fastrtps_c, rbt1_interfaces, srv, LoadZone_Event)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, LoadZone_Event)),
  }
};

typedef struct _LoadZone_Event_type_support_data_t
{
  void * data[2];
} _LoadZone_Event_type_support_data_t;

static _LoadZone_Event_type_support_data_t _LoadZone_Event_message_typesupport_data = {
  {
    0,  // will store the shared library later
    0,  // will store the shared library later
  }
};

static const type_support_map_t _LoadZone_Event_message_typesupport_map = {
  2,
  "rbt1_interfaces",
  &_LoadZone_Event_message_typesupport_ids.typesupport_identifier[0],
  &_LoadZone_Event_message_typesupport_symbol_names.symbol_name[0],
  &_LoadZone_Event_message_typesupport_data.data[0],
};

static const rosidl_message_type_support_t LoadZone_Event_message_type_support_handle = {
  rosidl_typesupport_c__typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_LoadZone_Event_message_typesupport_map),
  rosidl_typesupport_c__get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__LoadZone_Event__get_type_hash,
  &rbt1_interfaces__srv__LoadZone_Event__get_type_description,
  &rbt1_interfaces__srv__LoadZone_Event__get_type_description_sources,
};

}  // namespace rosidl_typesupport_c

}  // namespace srv

}  // namespace rbt1_interfaces

#ifdef __cplusplus
extern "C"
{
#endif

const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_c, rbt1_interfaces, srv, LoadZone_Event)() {
  return &::rbt1_interfaces::srv::rosidl_typesupport_c::LoadZone_Event_message_type_support_handle;
}

#ifdef __cplusplus
}
#endif

// already included above
// #include "cstddef"
#include "rosidl_runtime_c/service_type_support_struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__type_support.h"
// already included above
// #include "rosidl_typesupport_c/identifier.h"
#include "rosidl_typesupport_c/service_type_support_dispatch.h"
// already included above
// #include "rosidl_typesupport_c/type_support_map.h"
// already included above
// #include "rosidl_typesupport_interface/macros.h"
#include "service_msgs/msg/service_event_info.h"
#include "builtin_interfaces/msg/time.h"

namespace rbt1_interfaces
{

namespace srv
{

namespace rosidl_typesupport_c
{
typedef struct _LoadZone_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _LoadZone_type_support_ids_t;

static const _LoadZone_type_support_ids_t _LoadZone_service_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_c",  // ::rosidl_typesupport_fastrtps_c::typesupport_identifier,
    "rosidl_typesupport_introspection_c",  // ::rosidl_typesupport_introspection_c::typesupport_identifier,
  }
};

typedef struct _LoadZone_type_support_symbol_names_t
{
  const char * symbol_name[2];
} _LoadZone_type_support_symbol_names_t;

#define STRINGIFY_(s) #s
#define STRINGIFY(s) STRINGIFY_(s)

static const _LoadZone_type_support_symbol_names_t _LoadZone_service_typesupport_symbol_names = {
  {
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_SYMBOL_NAME(rosidl_typesupport_fastrtps_c, rbt1_interfaces, srv, LoadZone)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, LoadZone)),
  }
};

typedef struct _LoadZone_type_support_data_t
{
  void * data[2];
} _LoadZone_type_support_data_t;

static _LoadZone_type_support_data_t _LoadZone_service_typesupport_data = {
  {
    0,  // will store the shared library later
    0,  // will store the shared library later
  }
};

static const type_support_map_t _LoadZone_service_typesupport_map = {
  2,
  "rbt1_interfaces",
  &_LoadZone_service_typesupport_ids.typesupport_identifier[0],
  &_LoadZone_service_typesupport_symbol_names.symbol_name[0],
  &_LoadZone_service_typesupport_data.data[0],
};

static const rosidl_service_type_support_t LoadZone_service_type_support_handle = {
  rosidl_typesupport_c__typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_LoadZone_service_typesupport_map),
  rosidl_typesupport_c__get_service_typesupport_handle_function,
  &LoadZone_Request_message_type_support_handle,
  &LoadZone_Response_message_type_support_handle,
  &LoadZone_Event_message_type_support_handle,
  ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_CREATE_EVENT_MESSAGE_SYMBOL_NAME(
    rosidl_typesupport_c,
    rbt1_interfaces,
    srv,
    LoadZone
  ),
  ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_DESTROY_EVENT_MESSAGE_SYMBOL_NAME(
    rosidl_typesupport_c,
    rbt1_interfaces,
    srv,
    LoadZone
  ),
  &rbt1_interfaces__srv__LoadZone__get_type_hash,
  &rbt1_interfaces__srv__LoadZone__get_type_description,
  &rbt1_interfaces__srv__LoadZone__get_type_description_sources,
};

}  // namespace rosidl_typesupport_c

}  // namespace srv

}  // namespace rbt1_interfaces

#ifdef __cplusplus
extern "C"
{
#endif

const rosidl_service_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_SYMBOL_NAME(rosidl_typesupport_c, rbt1_interfaces, srv, LoadZone)() {
  return &::rbt1_interfaces::srv::rosidl_typesupport_c::LoadZone_service_type_support_handle;
}

#ifdef __cplusplus
}
#endif
