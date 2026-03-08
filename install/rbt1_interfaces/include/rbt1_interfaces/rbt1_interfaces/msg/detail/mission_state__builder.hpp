// generated from rosidl_generator_cpp/resource/idl__builder.hpp.em
// with input from rbt1_interfaces:msg/MissionState.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/msg/mission_state.hpp"


#ifndef RBT1_INTERFACES__MSG__DETAIL__MISSION_STATE__BUILDER_HPP_
#define RBT1_INTERFACES__MSG__DETAIL__MISSION_STATE__BUILDER_HPP_

#include <algorithm>
#include <utility>

#include "rbt1_interfaces/msg/detail/mission_state__struct.hpp"
#include "rosidl_runtime_cpp/message_initialization.hpp"


namespace rbt1_interfaces
{

namespace msg
{

namespace builder
{

class Init_MissionState_info
{
public:
  explicit Init_MissionState_info(::rbt1_interfaces::msg::MissionState & msg)
  : msg_(msg)
  {}
  ::rbt1_interfaces::msg::MissionState info(::rbt1_interfaces::msg::MissionState::_info_type arg)
  {
    msg_.info = std::move(arg);
    return std::move(msg_);
  }

private:
  ::rbt1_interfaces::msg::MissionState msg_;
};

class Init_MissionState_current_step
{
public:
  explicit Init_MissionState_current_step(::rbt1_interfaces::msg::MissionState & msg)
  : msg_(msg)
  {}
  Init_MissionState_info current_step(::rbt1_interfaces::msg::MissionState::_current_step_type arg)
  {
    msg_.current_step = std::move(arg);
    return Init_MissionState_info(msg_);
  }

private:
  ::rbt1_interfaces::msg::MissionState msg_;
};

class Init_MissionState_state
{
public:
  explicit Init_MissionState_state(::rbt1_interfaces::msg::MissionState & msg)
  : msg_(msg)
  {}
  Init_MissionState_current_step state(::rbt1_interfaces::msg::MissionState::_state_type arg)
  {
    msg_.state = std::move(arg);
    return Init_MissionState_current_step(msg_);
  }

private:
  ::rbt1_interfaces::msg::MissionState msg_;
};

class Init_MissionState_mission_id
{
public:
  Init_MissionState_mission_id()
  : msg_(::rosidl_runtime_cpp::MessageInitialization::SKIP)
  {}
  Init_MissionState_state mission_id(::rbt1_interfaces::msg::MissionState::_mission_id_type arg)
  {
    msg_.mission_id = std::move(arg);
    return Init_MissionState_state(msg_);
  }

private:
  ::rbt1_interfaces::msg::MissionState msg_;
};

}  // namespace builder

}  // namespace msg

template<typename MessageType>
auto build();

template<>
inline
auto build<::rbt1_interfaces::msg::MissionState>()
{
  return rbt1_interfaces::msg::builder::Init_MissionState_mission_id();
}

}  // namespace rbt1_interfaces

#endif  // RBT1_INTERFACES__MSG__DETAIL__MISSION_STATE__BUILDER_HPP_
