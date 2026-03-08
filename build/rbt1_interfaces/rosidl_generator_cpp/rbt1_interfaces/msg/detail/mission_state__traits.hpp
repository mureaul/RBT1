// generated from rosidl_generator_cpp/resource/idl__traits.hpp.em
// with input from rbt1_interfaces:msg/MissionState.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/msg/mission_state.hpp"


#ifndef RBT1_INTERFACES__MSG__DETAIL__MISSION_STATE__TRAITS_HPP_
#define RBT1_INTERFACES__MSG__DETAIL__MISSION_STATE__TRAITS_HPP_

#include <stdint.h>

#include <sstream>
#include <string>
#include <type_traits>

#include "rbt1_interfaces/msg/detail/mission_state__struct.hpp"
#include "rosidl_runtime_cpp/traits.hpp"

namespace rbt1_interfaces
{

namespace msg
{

inline void to_flow_style_yaml(
  const MissionState & msg,
  std::ostream & out)
{
  out << "{";
  // member: mission_id
  {
    out << "mission_id: ";
    rosidl_generator_traits::value_to_yaml(msg.mission_id, out);
    out << ", ";
  }

  // member: state
  {
    out << "state: ";
    rosidl_generator_traits::value_to_yaml(msg.state, out);
    out << ", ";
  }

  // member: current_step
  {
    out << "current_step: ";
    rosidl_generator_traits::value_to_yaml(msg.current_step, out);
    out << ", ";
  }

  // member: info
  {
    out << "info: ";
    rosidl_generator_traits::value_to_yaml(msg.info, out);
  }
  out << "}";
}  // NOLINT(readability/fn_size)

inline void to_block_style_yaml(
  const MissionState & msg,
  std::ostream & out, size_t indentation = 0)
{
  // member: mission_id
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    out << "mission_id: ";
    rosidl_generator_traits::value_to_yaml(msg.mission_id, out);
    out << "\n";
  }

  // member: state
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    out << "state: ";
    rosidl_generator_traits::value_to_yaml(msg.state, out);
    out << "\n";
  }

  // member: current_step
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    out << "current_step: ";
    rosidl_generator_traits::value_to_yaml(msg.current_step, out);
    out << "\n";
  }

  // member: info
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    out << "info: ";
    rosidl_generator_traits::value_to_yaml(msg.info, out);
    out << "\n";
  }
}  // NOLINT(readability/fn_size)

inline std::string to_yaml(const MissionState & msg, bool use_flow_style = false)
{
  std::ostringstream out;
  if (use_flow_style) {
    to_flow_style_yaml(msg, out);
  } else {
    to_block_style_yaml(msg, out);
  }
  return out.str();
}

}  // namespace msg

}  // namespace rbt1_interfaces

namespace rosidl_generator_traits
{

[[deprecated("use rbt1_interfaces::msg::to_block_style_yaml() instead")]]
inline void to_yaml(
  const rbt1_interfaces::msg::MissionState & msg,
  std::ostream & out, size_t indentation = 0)
{
  rbt1_interfaces::msg::to_block_style_yaml(msg, out, indentation);
}

[[deprecated("use rbt1_interfaces::msg::to_yaml() instead")]]
inline std::string to_yaml(const rbt1_interfaces::msg::MissionState & msg)
{
  return rbt1_interfaces::msg::to_yaml(msg);
}

template<>
inline const char * data_type<rbt1_interfaces::msg::MissionState>()
{
  return "rbt1_interfaces::msg::MissionState";
}

template<>
inline const char * name<rbt1_interfaces::msg::MissionState>()
{
  return "rbt1_interfaces/msg/MissionState";
}

template<>
struct has_fixed_size<rbt1_interfaces::msg::MissionState>
  : std::integral_constant<bool, false> {};

template<>
struct has_bounded_size<rbt1_interfaces::msg::MissionState>
  : std::integral_constant<bool, false> {};

template<>
struct is_message<rbt1_interfaces::msg::MissionState>
  : std::true_type {};

}  // namespace rosidl_generator_traits

#endif  // RBT1_INTERFACES__MSG__DETAIL__MISSION_STATE__TRAITS_HPP_
