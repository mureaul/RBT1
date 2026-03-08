// generated from rosidl_generator_cpp/resource/idl__builder.hpp.em
// with input from rbt1_interfaces:srv/NavigationStatus.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/srv/navigation_status.hpp"


#ifndef RBT1_INTERFACES__SRV__DETAIL__NAVIGATION_STATUS__BUILDER_HPP_
#define RBT1_INTERFACES__SRV__DETAIL__NAVIGATION_STATUS__BUILDER_HPP_

#include <algorithm>
#include <utility>

#include "rbt1_interfaces/srv/detail/navigation_status__struct.hpp"
#include "rosidl_runtime_cpp/message_initialization.hpp"


namespace rbt1_interfaces
{

namespace srv
{


}  // namespace srv

template<typename MessageType>
auto build();

template<>
inline
auto build<::rbt1_interfaces::srv::NavigationStatus_Request>()
{
  return ::rbt1_interfaces::srv::NavigationStatus_Request(rosidl_runtime_cpp::MessageInitialization::ZERO);
}

}  // namespace rbt1_interfaces


namespace rbt1_interfaces
{

namespace srv
{

namespace builder
{

class Init_NavigationStatus_Response_current_zone
{
public:
  explicit Init_NavigationStatus_Response_current_zone(::rbt1_interfaces::srv::NavigationStatus_Response & msg)
  : msg_(msg)
  {}
  ::rbt1_interfaces::srv::NavigationStatus_Response current_zone(::rbt1_interfaces::srv::NavigationStatus_Response::_current_zone_type arg)
  {
    msg_.current_zone = std::move(arg);
    return std::move(msg_);
  }

private:
  ::rbt1_interfaces::srv::NavigationStatus_Response msg_;
};

class Init_NavigationStatus_Response_ready
{
public:
  Init_NavigationStatus_Response_ready()
  : msg_(::rosidl_runtime_cpp::MessageInitialization::SKIP)
  {}
  Init_NavigationStatus_Response_current_zone ready(::rbt1_interfaces::srv::NavigationStatus_Response::_ready_type arg)
  {
    msg_.ready = std::move(arg);
    return Init_NavigationStatus_Response_current_zone(msg_);
  }

private:
  ::rbt1_interfaces::srv::NavigationStatus_Response msg_;
};

}  // namespace builder

}  // namespace srv

template<typename MessageType>
auto build();

template<>
inline
auto build<::rbt1_interfaces::srv::NavigationStatus_Response>()
{
  return rbt1_interfaces::srv::builder::Init_NavigationStatus_Response_ready();
}

}  // namespace rbt1_interfaces


namespace rbt1_interfaces
{

namespace srv
{

namespace builder
{

class Init_NavigationStatus_Event_response
{
public:
  explicit Init_NavigationStatus_Event_response(::rbt1_interfaces::srv::NavigationStatus_Event & msg)
  : msg_(msg)
  {}
  ::rbt1_interfaces::srv::NavigationStatus_Event response(::rbt1_interfaces::srv::NavigationStatus_Event::_response_type arg)
  {
    msg_.response = std::move(arg);
    return std::move(msg_);
  }

private:
  ::rbt1_interfaces::srv::NavigationStatus_Event msg_;
};

class Init_NavigationStatus_Event_request
{
public:
  explicit Init_NavigationStatus_Event_request(::rbt1_interfaces::srv::NavigationStatus_Event & msg)
  : msg_(msg)
  {}
  Init_NavigationStatus_Event_response request(::rbt1_interfaces::srv::NavigationStatus_Event::_request_type arg)
  {
    msg_.request = std::move(arg);
    return Init_NavigationStatus_Event_response(msg_);
  }

private:
  ::rbt1_interfaces::srv::NavigationStatus_Event msg_;
};

class Init_NavigationStatus_Event_info
{
public:
  Init_NavigationStatus_Event_info()
  : msg_(::rosidl_runtime_cpp::MessageInitialization::SKIP)
  {}
  Init_NavigationStatus_Event_request info(::rbt1_interfaces::srv::NavigationStatus_Event::_info_type arg)
  {
    msg_.info = std::move(arg);
    return Init_NavigationStatus_Event_request(msg_);
  }

private:
  ::rbt1_interfaces::srv::NavigationStatus_Event msg_;
};

}  // namespace builder

}  // namespace srv

template<typename MessageType>
auto build();

template<>
inline
auto build<::rbt1_interfaces::srv::NavigationStatus_Event>()
{
  return rbt1_interfaces::srv::builder::Init_NavigationStatus_Event_info();
}

}  // namespace rbt1_interfaces

#endif  // RBT1_INTERFACES__SRV__DETAIL__NAVIGATION_STATUS__BUILDER_HPP_
