// generated from rosidl_typesupport_cpp/resource/idl__type_support.cpp.em
// with input from rbt1_interfaces:srv/LoadZone.idl
// generated code does not contain a copyright notice

#include "cstddef"
#include "rosidl_runtime_c/message_type_support_struct.h"
#include "rbt1_interfaces/srv/detail/load_zone__functions.h"
#include "rbt1_interfaces/srv/detail/load_zone__struct.hpp"
#include "rosidl_typesupport_cpp/identifier.hpp"
#include "rosidl_typesupport_cpp/message_type_support.hpp"
#include "rosidl_typesupport_c/type_support_map.h"
#include "rosidl_typesupport_cpp/message_type_support_dispatch.hpp"
#include "rosidl_typesupport_cpp/visibility_control.h"
#include "rosidl_typesupport_interface/macros.h"

namespace rbt1_interfaces
{

namespace srv
{

namespace rosidl_typesupport_cpp
{

typedef struct _LoadZone_Request_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _LoadZone_Request_type_support_ids_t;

static const _LoadZone_Request_type_support_ids_t _LoadZone_Request_message_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_cpp",  // ::rosidl_typesupport_fastrtps_cpp::typesupport_identifier,
    "rosidl_typesupport_introspection_cpp",  // ::rosidl_typesupport_introspection_cpp::typesupport_identifier,
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
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_fastrtps_cpp, rbt1_interfaces, srv, LoadZone_Request)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_cpp, rbt1_interfaces, srv, LoadZone_Request)),
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
  ::rosidl_typesupport_cpp::typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_LoadZone_Request_message_typesupport_map),
  ::rosidl_typesupport_cpp::get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__LoadZone_Request__get_type_hash,
  &rbt1_interfaces__srv__LoadZone_Request__get_type_description,
  &rbt1_interfaces__srv__LoadZone_Request__get_type_description_sources,
};

}  // namespace rosidl_typesupport_cpp

}  // namespace srv

}  // namespace rbt1_interfaces

namespace rosidl_typesupport_cpp
{

template<>
ROSIDL_TYPESUPPORT_CPP_PUBLIC
const rosidl_message_type_support_t *
get_message_type_support_handle<rbt1_interfaces::srv::LoadZone_Request>()
{
  return &::rbt1_interfaces::srv::rosidl_typesupport_cpp::LoadZone_Request_message_type_support_handle;
}

#ifdef __cplusplus
extern "C"
{
#endif

ROSIDL_TYPESUPPORT_CPP_PUBLIC
const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_cpp, rbt1_interfaces, srv, LoadZone_Request)() {
  return get_message_type_support_handle<rbt1_interfaces::srv::LoadZone_Request>();
}

#ifdef __cplusplus
}
#endif
}  // namespace rosidl_typesupport_cpp

// already included above
// #include "cstddef"
// already included above
// #include "rosidl_runtime_c/message_type_support_struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__functions.h"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__struct.hpp"
// already included above
// #include "rosidl_typesupport_cpp/identifier.hpp"
// already included above
// #include "rosidl_typesupport_cpp/message_type_support.hpp"
// already included above
// #include "rosidl_typesupport_c/type_support_map.h"
// already included above
// #include "rosidl_typesupport_cpp/message_type_support_dispatch.hpp"
// already included above
// #include "rosidl_typesupport_cpp/visibility_control.h"
// already included above
// #include "rosidl_typesupport_interface/macros.h"

namespace rbt1_interfaces
{

namespace srv
{

namespace rosidl_typesupport_cpp
{

typedef struct _LoadZone_Response_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _LoadZone_Response_type_support_ids_t;

static const _LoadZone_Response_type_support_ids_t _LoadZone_Response_message_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_cpp",  // ::rosidl_typesupport_fastrtps_cpp::typesupport_identifier,
    "rosidl_typesupport_introspection_cpp",  // ::rosidl_typesupport_introspection_cpp::typesupport_identifier,
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
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_fastrtps_cpp, rbt1_interfaces, srv, LoadZone_Response)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_cpp, rbt1_interfaces, srv, LoadZone_Response)),
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
  ::rosidl_typesupport_cpp::typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_LoadZone_Response_message_typesupport_map),
  ::rosidl_typesupport_cpp::get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__LoadZone_Response__get_type_hash,
  &rbt1_interfaces__srv__LoadZone_Response__get_type_description,
  &rbt1_interfaces__srv__LoadZone_Response__get_type_description_sources,
};

}  // namespace rosidl_typesupport_cpp

}  // namespace srv

}  // namespace rbt1_interfaces

namespace rosidl_typesupport_cpp
{

template<>
ROSIDL_TYPESUPPORT_CPP_PUBLIC
const rosidl_message_type_support_t *
get_message_type_support_handle<rbt1_interfaces::srv::LoadZone_Response>()
{
  return &::rbt1_interfaces::srv::rosidl_typesupport_cpp::LoadZone_Response_message_type_support_handle;
}

#ifdef __cplusplus
extern "C"
{
#endif

ROSIDL_TYPESUPPORT_CPP_PUBLIC
const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_cpp, rbt1_interfaces, srv, LoadZone_Response)() {
  return get_message_type_support_handle<rbt1_interfaces::srv::LoadZone_Response>();
}

#ifdef __cplusplus
}
#endif
}  // namespace rosidl_typesupport_cpp

// already included above
// #include "cstddef"
// already included above
// #include "rosidl_runtime_c/message_type_support_struct.h"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__functions.h"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__struct.hpp"
// already included above
// #include "rosidl_typesupport_cpp/identifier.hpp"
// already included above
// #include "rosidl_typesupport_cpp/message_type_support.hpp"
// already included above
// #include "rosidl_typesupport_c/type_support_map.h"
// already included above
// #include "rosidl_typesupport_cpp/message_type_support_dispatch.hpp"
// already included above
// #include "rosidl_typesupport_cpp/visibility_control.h"
// already included above
// #include "rosidl_typesupport_interface/macros.h"

namespace rbt1_interfaces
{

namespace srv
{

namespace rosidl_typesupport_cpp
{

typedef struct _LoadZone_Event_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _LoadZone_Event_type_support_ids_t;

static const _LoadZone_Event_type_support_ids_t _LoadZone_Event_message_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_cpp",  // ::rosidl_typesupport_fastrtps_cpp::typesupport_identifier,
    "rosidl_typesupport_introspection_cpp",  // ::rosidl_typesupport_introspection_cpp::typesupport_identifier,
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
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_fastrtps_cpp, rbt1_interfaces, srv, LoadZone_Event)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_introspection_cpp, rbt1_interfaces, srv, LoadZone_Event)),
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
  ::rosidl_typesupport_cpp::typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_LoadZone_Event_message_typesupport_map),
  ::rosidl_typesupport_cpp::get_message_typesupport_handle_function,
  &rbt1_interfaces__srv__LoadZone_Event__get_type_hash,
  &rbt1_interfaces__srv__LoadZone_Event__get_type_description,
  &rbt1_interfaces__srv__LoadZone_Event__get_type_description_sources,
};

}  // namespace rosidl_typesupport_cpp

}  // namespace srv

}  // namespace rbt1_interfaces

namespace rosidl_typesupport_cpp
{

template<>
ROSIDL_TYPESUPPORT_CPP_PUBLIC
const rosidl_message_type_support_t *
get_message_type_support_handle<rbt1_interfaces::srv::LoadZone_Event>()
{
  return &::rbt1_interfaces::srv::rosidl_typesupport_cpp::LoadZone_Event_message_type_support_handle;
}

#ifdef __cplusplus
extern "C"
{
#endif

ROSIDL_TYPESUPPORT_CPP_PUBLIC
const rosidl_message_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__MESSAGE_SYMBOL_NAME(rosidl_typesupport_cpp, rbt1_interfaces, srv, LoadZone_Event)() {
  return get_message_type_support_handle<rbt1_interfaces::srv::LoadZone_Event>();
}

#ifdef __cplusplus
}
#endif
}  // namespace rosidl_typesupport_cpp

// already included above
// #include "cstddef"
#include "rosidl_runtime_c/service_type_support_struct.h"
#include "rosidl_typesupport_cpp/service_type_support.hpp"
// already included above
// #include "rbt1_interfaces/srv/detail/load_zone__struct.hpp"
// already included above
// #include "rosidl_typesupport_cpp/identifier.hpp"
// already included above
// #include "rosidl_typesupport_c/type_support_map.h"
#include "rosidl_typesupport_cpp/service_type_support_dispatch.hpp"
// already included above
// #include "rosidl_typesupport_cpp/visibility_control.h"
// already included above
// #include "rosidl_typesupport_interface/macros.h"

namespace rbt1_interfaces
{

namespace srv
{

namespace rosidl_typesupport_cpp
{

typedef struct _LoadZone_type_support_ids_t
{
  const char * typesupport_identifier[2];
} _LoadZone_type_support_ids_t;

static const _LoadZone_type_support_ids_t _LoadZone_service_typesupport_ids = {
  {
    "rosidl_typesupport_fastrtps_cpp",  // ::rosidl_typesupport_fastrtps_cpp::typesupport_identifier,
    "rosidl_typesupport_introspection_cpp",  // ::rosidl_typesupport_introspection_cpp::typesupport_identifier,
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
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_SYMBOL_NAME(rosidl_typesupport_fastrtps_cpp, rbt1_interfaces, srv, LoadZone)),
    STRINGIFY(ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_SYMBOL_NAME(rosidl_typesupport_introspection_cpp, rbt1_interfaces, srv, LoadZone)),
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
  ::rosidl_typesupport_cpp::typesupport_identifier,
  reinterpret_cast<const type_support_map_t *>(&_LoadZone_service_typesupport_map),
  ::rosidl_typesupport_cpp::get_service_typesupport_handle_function,
  ::rosidl_typesupport_cpp::get_message_type_support_handle<rbt1_interfaces::srv::LoadZone_Request>(),
  ::rosidl_typesupport_cpp::get_message_type_support_handle<rbt1_interfaces::srv::LoadZone_Response>(),
  ::rosidl_typesupport_cpp::get_message_type_support_handle<rbt1_interfaces::srv::LoadZone_Event>(),
  &::rosidl_typesupport_cpp::service_create_event_message<rbt1_interfaces::srv::LoadZone>,
  &::rosidl_typesupport_cpp::service_destroy_event_message<rbt1_interfaces::srv::LoadZone>,
  &rbt1_interfaces__srv__LoadZone__get_type_hash,
  &rbt1_interfaces__srv__LoadZone__get_type_description,
  &rbt1_interfaces__srv__LoadZone__get_type_description_sources,
};

}  // namespace rosidl_typesupport_cpp

}  // namespace srv

}  // namespace rbt1_interfaces

namespace rosidl_typesupport_cpp
{

template<>
ROSIDL_TYPESUPPORT_CPP_PUBLIC
const rosidl_service_type_support_t *
get_service_type_support_handle<rbt1_interfaces::srv::LoadZone>()
{
  return &::rbt1_interfaces::srv::rosidl_typesupport_cpp::LoadZone_service_type_support_handle;
}

}  // namespace rosidl_typesupport_cpp

#ifdef __cplusplus
extern "C"
{
#endif

ROSIDL_TYPESUPPORT_CPP_PUBLIC
const rosidl_service_type_support_t *
ROSIDL_TYPESUPPORT_INTERFACE__SERVICE_SYMBOL_NAME(rosidl_typesupport_cpp, rbt1_interfaces, srv, LoadZone)() {
  return ::rosidl_typesupport_cpp::get_service_type_support_handle<rbt1_interfaces::srv::LoadZone>();
}

#ifdef __cplusplus
}
#endif
