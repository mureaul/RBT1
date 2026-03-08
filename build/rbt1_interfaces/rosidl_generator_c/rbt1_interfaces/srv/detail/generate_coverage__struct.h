// generated from rosidl_generator_c/resource/idl__struct.h.em
// with input from rbt1_interfaces:srv/GenerateCoverage.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/srv/generate_coverage.h"


#ifndef RBT1_INTERFACES__SRV__DETAIL__GENERATE_COVERAGE__STRUCT_H_
#define RBT1_INTERFACES__SRV__DETAIL__GENERATE_COVERAGE__STRUCT_H_

#ifdef __cplusplus
extern "C"
{
#endif

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>


// Constants defined in the message

// Include directives for member types
// Member 'zone_name'
#include "rosidl_runtime_c/string.h"

/// Struct defined in srv/GenerateCoverage in the package rbt1_interfaces.
typedef struct rbt1_interfaces__srv__GenerateCoverage_Request
{
  rosidl_runtime_c__String zone_name;
} rbt1_interfaces__srv__GenerateCoverage_Request;

// Struct for a sequence of rbt1_interfaces__srv__GenerateCoverage_Request.
typedef struct rbt1_interfaces__srv__GenerateCoverage_Request__Sequence
{
  rbt1_interfaces__srv__GenerateCoverage_Request * data;
  /// The number of valid items in data
  size_t size;
  /// The number of allocated items in data
  size_t capacity;
} rbt1_interfaces__srv__GenerateCoverage_Request__Sequence;

// Constants defined in the message

// Include directives for member types
// Member 'message'
// already included above
// #include "rosidl_runtime_c/string.h"

/// Struct defined in srv/GenerateCoverage in the package rbt1_interfaces.
typedef struct rbt1_interfaces__srv__GenerateCoverage_Response
{
  bool success;
  rosidl_runtime_c__String message;
} rbt1_interfaces__srv__GenerateCoverage_Response;

// Struct for a sequence of rbt1_interfaces__srv__GenerateCoverage_Response.
typedef struct rbt1_interfaces__srv__GenerateCoverage_Response__Sequence
{
  rbt1_interfaces__srv__GenerateCoverage_Response * data;
  /// The number of valid items in data
  size_t size;
  /// The number of allocated items in data
  size_t capacity;
} rbt1_interfaces__srv__GenerateCoverage_Response__Sequence;

// Constants defined in the message

// Include directives for member types
// Member 'info'
#include "service_msgs/msg/detail/service_event_info__struct.h"

// constants for array fields with an upper bound
// request
enum
{
  rbt1_interfaces__srv__GenerateCoverage_Event__request__MAX_SIZE = 1
};
// response
enum
{
  rbt1_interfaces__srv__GenerateCoverage_Event__response__MAX_SIZE = 1
};

/// Struct defined in srv/GenerateCoverage in the package rbt1_interfaces.
typedef struct rbt1_interfaces__srv__GenerateCoverage_Event
{
  service_msgs__msg__ServiceEventInfo info;
  rbt1_interfaces__srv__GenerateCoverage_Request__Sequence request;
  rbt1_interfaces__srv__GenerateCoverage_Response__Sequence response;
} rbt1_interfaces__srv__GenerateCoverage_Event;

// Struct for a sequence of rbt1_interfaces__srv__GenerateCoverage_Event.
typedef struct rbt1_interfaces__srv__GenerateCoverage_Event__Sequence
{
  rbt1_interfaces__srv__GenerateCoverage_Event * data;
  /// The number of valid items in data
  size_t size;
  /// The number of allocated items in data
  size_t capacity;
} rbt1_interfaces__srv__GenerateCoverage_Event__Sequence;

#ifdef __cplusplus
}
#endif

#endif  // RBT1_INTERFACES__SRV__DETAIL__GENERATE_COVERAGE__STRUCT_H_
