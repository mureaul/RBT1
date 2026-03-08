// generated from rosidl_generator_cpp/resource/idl__traits.hpp.em
// with input from rbt1_interfaces:srv/NavigationStatus.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/srv/navigation_status.hpp"


#ifndef RBT1_INTERFACES__SRV__DETAIL__NAVIGATION_STATUS__TRAITS_HPP_
#define RBT1_INTERFACES__SRV__DETAIL__NAVIGATION_STATUS__TRAITS_HPP_

#include <stdint.h>

#include <sstream>
#include <string>
#include <type_traits>

#include "rbt1_interfaces/srv/detail/navigation_status__struct.hpp"
#include "rosidl_runtime_cpp/traits.hpp"

namespace rbt1_interfaces
{

namespace srv
{

inline void to_flow_style_yaml(
  const NavigationStatus_Request & msg,
  std::ostream & out)
{
  (void)msg;
  out << "null";
}  // NOLINT(readability/fn_size)

inline void to_block_style_yaml(
  const NavigationStatus_Request & msg,
  std::ostream & out, size_t indentation = 0)
{
  (void)msg;
  (void)indentation;
  out << "null\n";
}  // NOLINT(readability/fn_size)

inline std::string to_yaml(const NavigationStatus_Request & msg, bool use_flow_style = false)
{
  std::ostringstream out;
  if (use_flow_style) {
    to_flow_style_yaml(msg, out);
  } else {
    to_block_style_yaml(msg, out);
  }
  return out.str();
}

}  // namespace srv

}  // namespace rbt1_interfaces

namespace rosidl_generator_traits
{

[[deprecated("use rbt1_interfaces::srv::to_block_style_yaml() instead")]]
inline void to_yaml(
  const rbt1_interfaces::srv::NavigationStatus_Request & msg,
  std::ostream & out, size_t indentation = 0)
{
  rbt1_interfaces::srv::to_block_style_yaml(msg, out, indentation);
}

[[deprecated("use rbt1_interfaces::srv::to_yaml() instead")]]
inline std::string to_yaml(const rbt1_interfaces::srv::NavigationStatus_Request & msg)
{
  return rbt1_interfaces::srv::to_yaml(msg);
}

template<>
inline const char * data_type<rbt1_interfaces::srv::NavigationStatus_Request>()
{
  return "rbt1_interfaces::srv::NavigationStatus_Request";
}

template<>
inline const char * name<rbt1_interfaces::srv::NavigationStatus_Request>()
{
  return "rbt1_interfaces/srv/NavigationStatus_Request";
}

template<>
struct has_fixed_size<rbt1_interfaces::srv::NavigationStatus_Request>
  : std::integral_constant<bool, true> {};

template<>
struct has_bounded_size<rbt1_interfaces::srv::NavigationStatus_Request>
  : std::integral_constant<bool, true> {};

template<>
struct is_message<rbt1_interfaces::srv::NavigationStatus_Request>
  : std::true_type {};

}  // namespace rosidl_generator_traits

namespace rbt1_interfaces
{

namespace srv
{

inline void to_flow_style_yaml(
  const NavigationStatus_Response & msg,
  std::ostream & out)
{
  out << "{";
  // member: ready
  {
    out << "ready: ";
    rosidl_generator_traits::value_to_yaml(msg.ready, out);
    out << ", ";
  }

  // member: current_zone
  {
    out << "current_zone: ";
    rosidl_generator_traits::value_to_yaml(msg.current_zone, out);
  }
  out << "}";
}  // NOLINT(readability/fn_size)

inline void to_block_style_yaml(
  const NavigationStatus_Response & msg,
  std::ostream & out, size_t indentation = 0)
{
  // member: ready
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    out << "ready: ";
    rosidl_generator_traits::value_to_yaml(msg.ready, out);
    out << "\n";
  }

  // member: current_zone
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    out << "current_zone: ";
    rosidl_generator_traits::value_to_yaml(msg.current_zone, out);
    out << "\n";
  }
}  // NOLINT(readability/fn_size)

inline std::string to_yaml(const NavigationStatus_Response & msg, bool use_flow_style = false)
{
  std::ostringstream out;
  if (use_flow_style) {
    to_flow_style_yaml(msg, out);
  } else {
    to_block_style_yaml(msg, out);
  }
  return out.str();
}

}  // namespace srv

}  // namespace rbt1_interfaces

namespace rosidl_generator_traits
{

[[deprecated("use rbt1_interfaces::srv::to_block_style_yaml() instead")]]
inline void to_yaml(
  const rbt1_interfaces::srv::NavigationStatus_Response & msg,
  std::ostream & out, size_t indentation = 0)
{
  rbt1_interfaces::srv::to_block_style_yaml(msg, out, indentation);
}

[[deprecated("use rbt1_interfaces::srv::to_yaml() instead")]]
inline std::string to_yaml(const rbt1_interfaces::srv::NavigationStatus_Response & msg)
{
  return rbt1_interfaces::srv::to_yaml(msg);
}

template<>
inline const char * data_type<rbt1_interfaces::srv::NavigationStatus_Response>()
{
  return "rbt1_interfaces::srv::NavigationStatus_Response";
}

template<>
inline const char * name<rbt1_interfaces::srv::NavigationStatus_Response>()
{
  return "rbt1_interfaces/srv/NavigationStatus_Response";
}

template<>
struct has_fixed_size<rbt1_interfaces::srv::NavigationStatus_Response>
  : std::integral_constant<bool, false> {};

template<>
struct has_bounded_size<rbt1_interfaces::srv::NavigationStatus_Response>
  : std::integral_constant<bool, false> {};

template<>
struct is_message<rbt1_interfaces::srv::NavigationStatus_Response>
  : std::true_type {};

}  // namespace rosidl_generator_traits

// Include directives for member types
// Member 'info'
#include "service_msgs/msg/detail/service_event_info__traits.hpp"

namespace rbt1_interfaces
{

namespace srv
{

inline void to_flow_style_yaml(
  const NavigationStatus_Event & msg,
  std::ostream & out)
{
  out << "{";
  // member: info
  {
    out << "info: ";
    to_flow_style_yaml(msg.info, out);
    out << ", ";
  }

  // member: request
  {
    if (msg.request.size() == 0) {
      out << "request: []";
    } else {
      out << "request: [";
      size_t pending_items = msg.request.size();
      for (auto item : msg.request) {
        to_flow_style_yaml(item, out);
        if (--pending_items > 0) {
          out << ", ";
        }
      }
      out << "]";
    }
    out << ", ";
  }

  // member: response
  {
    if (msg.response.size() == 0) {
      out << "response: []";
    } else {
      out << "response: [";
      size_t pending_items = msg.response.size();
      for (auto item : msg.response) {
        to_flow_style_yaml(item, out);
        if (--pending_items > 0) {
          out << ", ";
        }
      }
      out << "]";
    }
  }
  out << "}";
}  // NOLINT(readability/fn_size)

inline void to_block_style_yaml(
  const NavigationStatus_Event & msg,
  std::ostream & out, size_t indentation = 0)
{
  // member: info
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    out << "info:\n";
    to_block_style_yaml(msg.info, out, indentation + 2);
  }

  // member: request
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    if (msg.request.size() == 0) {
      out << "request: []\n";
    } else {
      out << "request:\n";
      for (auto item : msg.request) {
        if (indentation > 0) {
          out << std::string(indentation, ' ');
        }
        out << "-\n";
        to_block_style_yaml(item, out, indentation + 2);
      }
    }
  }

  // member: response
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    if (msg.response.size() == 0) {
      out << "response: []\n";
    } else {
      out << "response:\n";
      for (auto item : msg.response) {
        if (indentation > 0) {
          out << std::string(indentation, ' ');
        }
        out << "-\n";
        to_block_style_yaml(item, out, indentation + 2);
      }
    }
  }
}  // NOLINT(readability/fn_size)

inline std::string to_yaml(const NavigationStatus_Event & msg, bool use_flow_style = false)
{
  std::ostringstream out;
  if (use_flow_style) {
    to_flow_style_yaml(msg, out);
  } else {
    to_block_style_yaml(msg, out);
  }
  return out.str();
}

}  // namespace srv

}  // namespace rbt1_interfaces

namespace rosidl_generator_traits
{

[[deprecated("use rbt1_interfaces::srv::to_block_style_yaml() instead")]]
inline void to_yaml(
  const rbt1_interfaces::srv::NavigationStatus_Event & msg,
  std::ostream & out, size_t indentation = 0)
{
  rbt1_interfaces::srv::to_block_style_yaml(msg, out, indentation);
}

[[deprecated("use rbt1_interfaces::srv::to_yaml() instead")]]
inline std::string to_yaml(const rbt1_interfaces::srv::NavigationStatus_Event & msg)
{
  return rbt1_interfaces::srv::to_yaml(msg);
}

template<>
inline const char * data_type<rbt1_interfaces::srv::NavigationStatus_Event>()
{
  return "rbt1_interfaces::srv::NavigationStatus_Event";
}

template<>
inline const char * name<rbt1_interfaces::srv::NavigationStatus_Event>()
{
  return "rbt1_interfaces/srv/NavigationStatus_Event";
}

template<>
struct has_fixed_size<rbt1_interfaces::srv::NavigationStatus_Event>
  : std::integral_constant<bool, false> {};

template<>
struct has_bounded_size<rbt1_interfaces::srv::NavigationStatus_Event>
  : std::integral_constant<bool, has_bounded_size<rbt1_interfaces::srv::NavigationStatus_Request>::value && has_bounded_size<rbt1_interfaces::srv::NavigationStatus_Response>::value && has_bounded_size<service_msgs::msg::ServiceEventInfo>::value> {};

template<>
struct is_message<rbt1_interfaces::srv::NavigationStatus_Event>
  : std::true_type {};

}  // namespace rosidl_generator_traits

namespace rosidl_generator_traits
{

template<>
inline const char * data_type<rbt1_interfaces::srv::NavigationStatus>()
{
  return "rbt1_interfaces::srv::NavigationStatus";
}

template<>
inline const char * name<rbt1_interfaces::srv::NavigationStatus>()
{
  return "rbt1_interfaces/srv/NavigationStatus";
}

template<>
struct has_fixed_size<rbt1_interfaces::srv::NavigationStatus>
  : std::integral_constant<
    bool,
    has_fixed_size<rbt1_interfaces::srv::NavigationStatus_Request>::value &&
    has_fixed_size<rbt1_interfaces::srv::NavigationStatus_Response>::value
  >
{
};

template<>
struct has_bounded_size<rbt1_interfaces::srv::NavigationStatus>
  : std::integral_constant<
    bool,
    has_bounded_size<rbt1_interfaces::srv::NavigationStatus_Request>::value &&
    has_bounded_size<rbt1_interfaces::srv::NavigationStatus_Response>::value
  >
{
};

template<>
struct is_service<rbt1_interfaces::srv::NavigationStatus>
  : std::true_type
{
};

template<>
struct is_service_request<rbt1_interfaces::srv::NavigationStatus_Request>
  : std::true_type
{
};

template<>
struct is_service_response<rbt1_interfaces::srv::NavigationStatus_Response>
  : std::true_type
{
};

}  // namespace rosidl_generator_traits

#endif  // RBT1_INTERFACES__SRV__DETAIL__NAVIGATION_STATUS__TRAITS_HPP_
