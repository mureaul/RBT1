// generated from rosidl_generator_cpp/resource/idl__builder.hpp.em
// with input from rbt1_interfaces:srv/LoadZone.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/srv/load_zone.hpp"


#ifndef RBT1_INTERFACES__SRV__DETAIL__LOAD_ZONE__BUILDER_HPP_
#define RBT1_INTERFACES__SRV__DETAIL__LOAD_ZONE__BUILDER_HPP_

#include <algorithm>
#include <utility>

#include "rbt1_interfaces/srv/detail/load_zone__struct.hpp"
#include "rosidl_runtime_cpp/message_initialization.hpp"


namespace rbt1_interfaces
{

namespace srv
{

namespace builder
{

class Init_LoadZone_Request_zone
{
public:
  Init_LoadZone_Request_zone()
  : msg_(::rosidl_runtime_cpp::MessageInitialization::SKIP)
  {}
  ::rbt1_interfaces::srv::LoadZone_Request zone(::rbt1_interfaces::srv::LoadZone_Request::_zone_type arg)
  {
    msg_.zone = std::move(arg);
    return std::move(msg_);
  }

private:
  ::rbt1_interfaces::srv::LoadZone_Request msg_;
};

}  // namespace builder

}  // namespace srv

template<typename MessageType>
auto build();

template<>
inline
auto build<::rbt1_interfaces::srv::LoadZone_Request>()
{
  return rbt1_interfaces::srv::builder::Init_LoadZone_Request_zone();
}

}  // namespace rbt1_interfaces


namespace rbt1_interfaces
{

namespace srv
{

namespace builder
{

class Init_LoadZone_Response_message
{
public:
  explicit Init_LoadZone_Response_message(::rbt1_interfaces::srv::LoadZone_Response & msg)
  : msg_(msg)
  {}
  ::rbt1_interfaces::srv::LoadZone_Response message(::rbt1_interfaces::srv::LoadZone_Response::_message_type arg)
  {
    msg_.message = std::move(arg);
    return std::move(msg_);
  }

private:
  ::rbt1_interfaces::srv::LoadZone_Response msg_;
};

class Init_LoadZone_Response_success
{
public:
  Init_LoadZone_Response_success()
  : msg_(::rosidl_runtime_cpp::MessageInitialization::SKIP)
  {}
  Init_LoadZone_Response_message success(::rbt1_interfaces::srv::LoadZone_Response::_success_type arg)
  {
    msg_.success = std::move(arg);
    return Init_LoadZone_Response_message(msg_);
  }

private:
  ::rbt1_interfaces::srv::LoadZone_Response msg_;
};

}  // namespace builder

}  // namespace srv

template<typename MessageType>
auto build();

template<>
inline
auto build<::rbt1_interfaces::srv::LoadZone_Response>()
{
  return rbt1_interfaces::srv::builder::Init_LoadZone_Response_success();
}

}  // namespace rbt1_interfaces


namespace rbt1_interfaces
{

namespace srv
{

namespace builder
{

class Init_LoadZone_Event_response
{
public:
  explicit Init_LoadZone_Event_response(::rbt1_interfaces::srv::LoadZone_Event & msg)
  : msg_(msg)
  {}
  ::rbt1_interfaces::srv::LoadZone_Event response(::rbt1_interfaces::srv::LoadZone_Event::_response_type arg)
  {
    msg_.response = std::move(arg);
    return std::move(msg_);
  }

private:
  ::rbt1_interfaces::srv::LoadZone_Event msg_;
};

class Init_LoadZone_Event_request
{
public:
  explicit Init_LoadZone_Event_request(::rbt1_interfaces::srv::LoadZone_Event & msg)
  : msg_(msg)
  {}
  Init_LoadZone_Event_response request(::rbt1_interfaces::srv::LoadZone_Event::_request_type arg)
  {
    msg_.request = std::move(arg);
    return Init_LoadZone_Event_response(msg_);
  }

private:
  ::rbt1_interfaces::srv::LoadZone_Event msg_;
};

class Init_LoadZone_Event_info
{
public:
  Init_LoadZone_Event_info()
  : msg_(::rosidl_runtime_cpp::MessageInitialization::SKIP)
  {}
  Init_LoadZone_Event_request info(::rbt1_interfaces::srv::LoadZone_Event::_info_type arg)
  {
    msg_.info = std::move(arg);
    return Init_LoadZone_Event_request(msg_);
  }

private:
  ::rbt1_interfaces::srv::LoadZone_Event msg_;
};

}  // namespace builder

}  // namespace srv

template<typename MessageType>
auto build();

template<>
inline
auto build<::rbt1_interfaces::srv::LoadZone_Event>()
{
  return rbt1_interfaces::srv::builder::Init_LoadZone_Event_info();
}

}  // namespace rbt1_interfaces

#endif  // RBT1_INTERFACES__SRV__DETAIL__LOAD_ZONE__BUILDER_HPP_
