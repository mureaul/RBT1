// generated from rosidl_generator_cpp/resource/idl__builder.hpp.em
// with input from rbt1_interfaces:msg/MissionCommand.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/msg/mission_command.hpp"


#ifndef RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__BUILDER_HPP_
#define RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__BUILDER_HPP_

#include <algorithm>
#include <utility>

#include "rbt1_interfaces/msg/detail/mission_command__struct.hpp"
#include "rosidl_runtime_cpp/message_initialization.hpp"


namespace rbt1_interfaces
{

namespace msg
{

namespace builder
{

class Init_MissionCommand_min_battery_percent
{
public:
  explicit Init_MissionCommand_min_battery_percent(::rbt1_interfaces::msg::MissionCommand & msg)
  : msg_(msg)
  {}
  ::rbt1_interfaces::msg::MissionCommand min_battery_percent(::rbt1_interfaces::msg::MissionCommand::_min_battery_percent_type arg)
  {
    msg_.min_battery_percent = std::move(arg);
    return std::move(msg_);
  }

private:
  ::rbt1_interfaces::msg::MissionCommand msg_;
};

class Init_MissionCommand_mission_type
{
public:
  explicit Init_MissionCommand_mission_type(::rbt1_interfaces::msg::MissionCommand & msg)
  : msg_(msg)
  {}
  Init_MissionCommand_min_battery_percent mission_type(::rbt1_interfaces::msg::MissionCommand::_mission_type_type arg)
  {
    msg_.mission_type = std::move(arg);
    return Init_MissionCommand_min_battery_percent(msg_);
  }

private:
  ::rbt1_interfaces::msg::MissionCommand msg_;
};

class Init_MissionCommand_zone
{
public:
  explicit Init_MissionCommand_zone(::rbt1_interfaces::msg::MissionCommand & msg)
  : msg_(msg)
  {}
  Init_MissionCommand_mission_type zone(::rbt1_interfaces::msg::MissionCommand::_zone_type arg)
  {
    msg_.zone = std::move(arg);
    return Init_MissionCommand_mission_type(msg_);
  }

private:
  ::rbt1_interfaces::msg::MissionCommand msg_;
};

class Init_MissionCommand_mission_id
{
public:
  Init_MissionCommand_mission_id()
  : msg_(::rosidl_runtime_cpp::MessageInitialization::SKIP)
  {}
  Init_MissionCommand_zone mission_id(::rbt1_interfaces::msg::MissionCommand::_mission_id_type arg)
  {
    msg_.mission_id = std::move(arg);
    return Init_MissionCommand_zone(msg_);
  }

private:
  ::rbt1_interfaces::msg::MissionCommand msg_;
};

}  // namespace builder

}  // namespace msg

template<typename MessageType>
auto build();

template<>
inline
auto build<::rbt1_interfaces::msg::MissionCommand>()
{
  return rbt1_interfaces::msg::builder::Init_MissionCommand_mission_id();
}

}  // namespace rbt1_interfaces

#endif  // RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__BUILDER_HPP_
