// generated from rosidl_generator_cpp/resource/idl__traits.hpp.em
// with input from rbt1_interfaces:msg/MissionCommand.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/msg/mission_command.hpp"


#ifndef RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__TRAITS_HPP_
#define RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__TRAITS_HPP_

#include <stdint.h>

#include <sstream>
#include <string>
#include <type_traits>

#include "rbt1_interfaces/msg/detail/mission_command__struct.hpp"
#include "rosidl_runtime_cpp/traits.hpp"

namespace rbt1_interfaces
{

namespace msg
{

inline void to_flow_style_yaml(
  const MissionCommand & msg,
  std::ostream & out)
{
  out << "{";
  // member: mission_id
  {
    out << "mission_id: ";
    rosidl_generator_traits::value_to_yaml(msg.mission_id, out);
    out << ", ";
  }

  // member: zone
  {
    out << "zone: ";
    rosidl_generator_traits::value_to_yaml(msg.zone, out);
    out << ", ";
  }

  // member: mission_type
  {
    out << "mission_type: ";
    rosidl_generator_traits::value_to_yaml(msg.mission_type, out);
    out << ", ";
  }

  // member: min_battery_percent
  {
    out << "min_battery_percent: ";
    rosidl_generator_traits::value_to_yaml(msg.min_battery_percent, out);
  }
  out << "}";
}  // NOLINT(readability/fn_size)

inline void to_block_style_yaml(
  const MissionCommand & msg,
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

  // member: zone
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    out << "zone: ";
    rosidl_generator_traits::value_to_yaml(msg.zone, out);
    out << "\n";
  }

  // member: mission_type
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    out << "mission_type: ";
    rosidl_generator_traits::value_to_yaml(msg.mission_type, out);
    out << "\n";
  }

  // member: min_battery_percent
  {
    if (indentation > 0) {
      out << std::string(indentation, ' ');
    }
    out << "min_battery_percent: ";
    rosidl_generator_traits::value_to_yaml(msg.min_battery_percent, out);
    out << "\n";
  }
}  // NOLINT(readability/fn_size)

inline std::string to_yaml(const MissionCommand & msg, bool use_flow_style = false)
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
  const rbt1_interfaces::msg::MissionCommand & msg,
  std::ostream & out, size_t indentation = 0)
{
  rbt1_interfaces::msg::to_block_style_yaml(msg, out, indentation);
}

[[deprecated("use rbt1_interfaces::msg::to_yaml() instead")]]
inline std::string to_yaml(const rbt1_interfaces::msg::MissionCommand & msg)
{
  return rbt1_interfaces::msg::to_yaml(msg);
}

template<>
inline const char * data_type<rbt1_interfaces::msg::MissionCommand>()
{
  return "rbt1_interfaces::msg::MissionCommand";
}

template<>
inline const char * name<rbt1_interfaces::msg::MissionCommand>()
{
  return "rbt1_interfaces/msg/MissionCommand";
}

template<>
struct has_fixed_size<rbt1_interfaces::msg::MissionCommand>
  : std::integral_constant<bool, false> {};

template<>
struct has_bounded_size<rbt1_interfaces::msg::MissionCommand>
  : std::integral_constant<bool, false> {};

template<>
struct is_message<rbt1_interfaces::msg::MissionCommand>
  : std::true_type {};

}  // namespace rosidl_generator_traits

#endif  // RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__TRAITS_HPP_
