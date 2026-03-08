// generated from rosidl_typesupport_c/resource/idl__type_support.cpp.em
// with input from rbt1_interfaces:srv/GenerateCoverage.idl
// generated code does not contain a copyright notice

#include "cstddef"
#include "rosidl_runtime_c/message_type_support_struct.h"
#include "rbt1_interfaces/srv/detail/generate_coverage__struct.h"
#include "rbt1_interfaces/srv/detail/generate_coverage__type_support.h"
#include "rbt1_interfaces/srv/detail/generate_coverage__functions.h"
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

typedef struct _GenerateCoverage_Request_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _GenerateCoverage_Request_type_support_ids_t;

static const _GenerateCoverage_Request_type_support_ids_t _GenerateCoverage_Request_message_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_c",  // ::rosidl_typesupport_fastrtps_c::typesupport_identifier,
    "rosidl_typesupport_introspection_c",  // ::rosidl_typesupport_introspection_c::typesupport_identifier,
  }
};

typedef struct _GenerateCoverage_Request_type_support_symbol_names_t
{
  const char * symbol_name[2];
} _GenerateCoverage_Request_type_support_symbol_names_t;

#define STRINGIFY_(s) #s
#define STRINGIFY(s) STRINGIFY_(s)

static const _GenerateCoverage_Request_type_support_symbol_names_t _GenerateCoverage_Request_message_typesupport_symbol_names = {
  {
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_fastrtps_c, rbt1_interfaces, srv, GenerateCoverage_Request)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Request)),
  }
};

typedef struct _GenerateCoverage_Request_type_support_data_t
{
  void * data[2];
} _GenerateCoverage_Request_type_support_data_t;

static _GenerateCoverage_Request_type_support_data_t _GenerateCoverage_Request_message_typesupport_data = {
  {
    0,  // will store the shared library later
    0,  // will store the shared library later
  }
};

static const type_support_map_t _GenerateCoverage_Request_message_typesupport_map = {
  2,
  "rbt1_interfaces",
  &_GenerateCoverage_Request_message_typesupport_ids.typesupport_identifier[0],
  &_GenerateCoverage_Request_message_typesupport_symbol_names.symbol_name[0],
  &_GenerateCoverage_Request_message_typesupport_data.data[0],
};

static const rosidl_message_type_support_t GenerateCoverage_Request_message_type_support_handle = {
  rosidl_typesupport_c__typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_GenerateCoverage_Request_message_typesupport_map),
  rosidl_typesupport_c__get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__GenerateCoverage_Request__get_type_hash,
  &rbt1_interfaces__srv__GenerateCoverage_Request__get_type_description,
  &rbt1_interfaces__srv__GenerateCoverage_Request__get_type_description_sources,
};

}  // namespace rosidl_typesupport_c

}  // namespace srv

}  // namespace rbt1_interfaces

#ifdef __cplusplus
extern "C"
{
#endif

const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_c, rbt1_interfaces, srv, GenerateCoverage_Request)() {
  return &::rbt1_interfaces::srv::rosidl_typesupport_c::GenerateCoverage_Request_message_type_support_handle;
}

#ifdef __cplusplus
}
#endif

// already included above
// #include "cstddef"
// already included above
// #include "rosidl_runtime_c/message_type_support_struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__type_support.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__functions.h"
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

typedef struct _GenerateCoverage_Response_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _GenerateCoverage_Response_type_support_ids_t;

static const _GenerateCoverage_Response_type_support_ids_t _GenerateCoverage_Response_message_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_c",  // ::rosidl_typesupport_fastrtps_c::typesupport_identifier,
    "rosidl_typesupport_introspection_c",  // ::rosidl_typesupport_introspection_c::typesupport_identifier,
  }
};

typedef struct _GenerateCoverage_Response_type_support_symbol_names_t
{
  const char * symbol_name[2];
} _GenerateCoverage_Response_type_support_symbol_names_t;

#define STRINGIFY_(s) #s
#define STRINGIFY(s) STRINGIFY_(s)

static const _GenerateCoverage_Response_type_support_symbol_names_t _GenerateCoverage_Response_message_typesupport_symbol_names = {
  {
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_fastrtps_c, rbt1_interfaces, srv, GenerateCoverage_Response)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Response)),
  }
};

typedef struct _GenerateCoverage_Response_type_support_data_t
{
  void * data[2];
} _GenerateCoverage_Response_type_support_data_t;

static _GenerateCoverage_Response_type_support_data_t _GenerateCoverage_Response_message_typesupport_data = {
  {
    0,  // will store the shared library later
    0,  // will store the shared library later
  }
};

static const type_support_map_t _GenerateCoverage_Response_message_typesupport_map = {
  2,
  "rbt1_interfaces",
  &_GenerateCoverage_Response_message_typesupport_ids.typesupport_identifier[0],
  &_GenerateCoverage_Response_message_typesupport_symbol_names.symbol_name[0],
  &_GenerateCoverage_Response_message_typesupport_data.data[0],
};

static const rosidl_message_type_support_t GenerateCoverage_Response_message_type_support_handle = {
  rosidl_typesupport_c__typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_GenerateCoverage_Response_message_typesupport_map),
  rosidl_typesupport_c__get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__GenerateCoverage_Response__get_type_hash,
  &rbt1_interfaces__srv__GenerateCoverage_Response__get_type_description,
  &rbt1_interfaces__srv__GenerateCoverage_Response__get_type_description_sources,
};

}  // namespace rosidl_typesupport_c

}  // namespace srv

}  // namespace rbt1_interfaces

#ifdef __cplusplus
extern "C"
{
#endif

const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_c, rbt1_interfaces, srv, GenerateCoverage_Response)() {
  return &::rbt1_interfaces::srv::rosidl_typesupport_c::GenerateCoverage_Response_message_type_support_handle;
}

#ifdef __cplusplus
}
#endif

// already included above
// #include "cstddef"
// already included above
// #include "rosidl_runtime_c/message_type_support_struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__type_support.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__functions.h"
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

typedef struct _GenerateCoverage_Event_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _GenerateCoverage_Event_type_support_ids_t;

static const _GenerateCoverage_Event_type_support_ids_t _GenerateCoverage_Event_message_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_c",  // ::rosidl_typesupport_fastrtps_c::typesupport_identifier,
    "rosidl_typesupport_introspection_c",  // ::rosidl_typesupport_introspection_c::typesupport_identifier,
  }
};

typedef struct _GenerateCoverage_Event_type_support_symbol_names_t
{
  const char * symbol_name[2];
} _GenerateCoverage_Event_type_support_symbol_names_t;

#define STRINGIFY_(s) #s
#define STRINGIFY(s) STRINGIFY_(s)

static const _GenerateCoverage_Event_type_support_symbol_names_t _GenerateCoverage_Event_message_typesupport_symbol_names = {
  {
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_fastrtps_c, rbt1_interfaces, srv, GenerateCoverage_Event)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage_Event)),
  }
};

typedef struct _GenerateCoverage_Event_type_support_data_t
{
  void * data[2];
} _GenerateCoverage_Event_type_support_data_t;

static _GenerateCoverage_Event_type_support_data_t _GenerateCoverage_Event_message_typesupport_data = {
  {
    0,  // will store the shared library later
    0,  // will store the shared library later
  }
};

static const type_support_map_t _GenerateCoverage_Event_message_typesupport_map = {
  2,
  "rbt1_interfaces",
  &_GenerateCoverage_Event_message_typesupport_ids.typesupport_identifier[0],
  &_GenerateCoverage_Event_message_typesupport_symbol_names.symbol_name[0],
  &_GenerateCoverage_Event_message_typesupport_data.data[0],
};

static const rosidl_message_type_support_t GenerateCoverage_Event_message_type_support_handle = {
  rosidl_typesupport_c__typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_GenerateCoverage_Event_message_typesupport_map),
  rosidl_typesupport_c__get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__GenerateCoverage_Event__get_type_hash,
  &rbt1_interfaces__srv__GenerateCoverage_Event__get_type_description,
  &rbt1_interfaces__srv__GenerateCoverage_Event__get_type_description_sources,
};

}  // namespace rosidl_typesupport_c

}  // namespace srv

}  // namespace rbt1_interfaces

#ifdef __cplusplus
extern "C"
{
#endif

const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_c, rbt1_interfaces, srv, GenerateCoverage_Event)() {
  return &::rbt1_interfaces::srv::rosidl_typesupport_c::GenerateCoverage_Event_message_type_support_handle;
}

#ifdef __cplusplus
}
#endif

// already included above
// #include "cstddef"
#include "rosidl_runtime_c/service_type_support_struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__type_support.h"
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
typedef struct _GenerateCoverage_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _GenerateCoverage_type_support_ids_t;

static const _GenerateCoverage_type_support_ids_t _GenerateCoverage_service_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_c",  // ::rosidl_typesupport_fastrtps_c::typesupport_identifier,
    "rosidl_typesupport_introspection_c",  // ::rosidl_typesupport_introspection_c::typesupport_identifier,
  }
};

typedef struct _GenerateCoverage_type_support_symbol_names_t
{
  const char * symbol_name[2];
} _GenerateCoverage_type_support_symbol_names_t;

#define STRINGIFY_(s) #s
#define STRINGIFY(s) STRINGIFY_(s)

static const _GenerateCoverage_type_support_symbol_names_t _GenerateCoverage_service_typesupport_symbol_names = {
  {
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_SYMBOL_NAME(rosidl_typesupport_fastrtps_c, rbt1_interfaces, srv, GenerateCoverage)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_SYMBOL_NAME(rosidl_typesupport_introspection_c, rbt1_interfaces, srv, GenerateCoverage)),
  }
};

typedef struct _GenerateCoverage_type_support_data_t
{
  void * data[2];
} _GenerateCoverage_type_support_data_t;

static _GenerateCoverage_type_support_data_t _GenerateCoverage_service_typesupport_data = {
  {
    0,  // will store the shared library later
    0,  // will store the shared library later
  }
};

static const type_support_map_t _GenerateCoverage_service_typesupport_map = {
  2,
  "rbt1_interfaces",
  &_GenerateCoverage_service_typesupport_ids.typesupport_identifier[0],
  &_GenerateCoverage_service_typesupport_symbol_names.symbol_name[0],
  &_GenerateCoverage_service_typesupport_data.data[0],
};

static const rosidl_service_type_support_t GenerateCoverage_service_type_support_handle = {
  rosidl_typesupport_c__typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_GenerateCoverage_service_typesupport_map),
  rosidl_typesupport_c__get_service_typesupport_handle_function,
  &GenerateCoverage_Request_message_type_support_handle,
  &GenerateCoverage_Response_message_type_support_handle,
  &GenerateCoverage_Event_message_type_support_handle,
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

}  // namespace rosidl_typesupport_c

}  // namespace srv

}  // namespace rbt1_interfaces

#ifdef __cplusplus
extern "C"
{
#endif

const rosidl_service_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_SYMBOL_NAME(rosidl_typesupport_c, rbt1_interfaces, srv, GenerateCoverage)() {
  return &::rbt1_interfaces::srv::rosidl_typesupport_c::GenerateCoverage_service_type_support_handle;
}

#ifdef __cplusplus
}
#endif
