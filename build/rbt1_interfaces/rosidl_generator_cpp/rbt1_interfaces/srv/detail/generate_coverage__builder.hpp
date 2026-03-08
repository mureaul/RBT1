// generated from rosidl_generator_cpp/resource/idl__builder.hpp.em
// with input from rbt1_interfaces:srv/GenerateCoverage.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/srv/generate_coverage.hpp"


#ifndef RBT1_INTERFACES__SRV__DETAIL__GENERATE_COVERAGE__BUILDER_HPP_
#define RBT1_INTERFACES__SRV__DETAIL__GENERATE_COVERAGE__BUILDER_HPP_

#include <algorithm>
#include <utility>

#include "rbt1_interfaces/srv/detail/generate_coverage__struct.hpp"
#include "rosidl_runtime_cpp/message_initialization.hpp"


namespace rbt1_interfaces
{

namespace srv
{

namespace builder
{

class Init_GenerateCoverage_Request_zone_name
{
public:
  Init_GenerateCoverage_Request_zone_name()
  : msg_(::rosidl_runtime_cpp::MessageInitialization::SKIP)
  {}
  ::rbt1_interfaces::srv::GenerateCoverage_Request zone_name(::rbt1_interfaces::srv::GenerateCoverage_Request::_zone_name_type arg)
  {
    msg_.zone_name = std::move(arg);
    return std::move(msg_);
  }

private:
  ::rbt1_interfaces::srv::GenerateCoverage_Request msg_;
};

}  // namespace builder

}  // namespace srv

template<typename MessageType>
auto build();

template<>
inline
auto build<::rbt1_interfaces::srv::GenerateCoverage_Request>()
{
  return rbt1_interfaces::srv::builder::Init_GenerateCoverage_Request_zone_name();
}

}  // namespace rbt1_interfaces


namespace rbt1_interfaces
{

namespace srv
{

namespace builder
{

class Init_GenerateCoverage_Response_message
{
public:
  explicit Init_GenerateCoverage_Response_message(::rbt1_interfaces::srv::GenerateCoverage_Response & msg)
  : msg_(msg)
  {}
  ::rbt1_interfaces::srv::GenerateCoverage_Response message(::rbt1_interfaces::srv::GenerateCoverage_Response::_message_type arg)
  {
    msg_.message = std::move(arg);
    return std::move(msg_);
  }

private:
  ::rbt1_interfaces::srv::GenerateCoverage_Response msg_;
};

class Init_GenerateCoverage_Response_success
{
public:
  Init_GenerateCoverage_Response_success()
  : msg_(::rosidl_runtime_cpp::MessageInitialization::SKIP)
  {}
  Init_GenerateCoverage_Response_message success(::rbt1_interfaces::srv::GenerateCoverage_Response::_success_type arg)
  {
    msg_.success = std::move(arg);
    return Init_GenerateCoverage_Response_message(msg_);
  }

private:
  ::rbt1_interfaces::srv::GenerateCoverage_Response msg_;
};

}  // namespace builder

}  // namespace srv

template<typename MessageType>
auto build();

template<>
inline
auto build<::rbt1_interfaces::srv::GenerateCoverage_Response>()
{
  return rbt1_interfaces::srv::builder::Init_GenerateCoverage_Response_success();
}

}  // namespace rbt1_interfaces


namespace rbt1_interfaces
{

namespace srv
{

namespace builder
{

class Init_GenerateCoverage_Event_response
{
public:
  explicit Init_GenerateCoverage_Event_response(::rbt1_interfaces::srv::GenerateCoverage_Event & msg)
  : msg_(msg)
  {}
  ::rbt1_interfaces::srv::GenerateCoverage_Event response(::rbt1_interfaces::srv::GenerateCoverage_Event::_response_type arg)
  {
    msg_.response = std::move(arg);
    return std::move(msg_);
  }

private:
  ::rbt1_interfaces::srv::GenerateCoverage_Event msg_;
};

class Init_GenerateCoverage_Event_request
{
public:
  explicit Init_GenerateCoverage_Event_request(::rbt1_interfaces::srv::GenerateCoverage_Event & msg)
  : msg_(msg)
  {}
  Init_GenerateCoverage_Event_response request(::rbt1_interfaces::srv::GenerateCoverage_Event::_request_type arg)
  {
    msg_.request = std::move(arg);
    return Init_GenerateCoverage_Event_response(msg_);
  }

private:
  ::rbt1_interfaces::srv::GenerateCoverage_Event msg_;
};

class Init_GenerateCoverage_Event_info
{
public:
  Init_GenerateCoverage_Event_info()
  : msg_(::rosidl_runtime_cpp::MessageInitialization::SKIP)
  {}
  Init_GenerateCoverage_Event_request info(::rbt1_interfaces::srv::GenerateCoverage_Event::_info_type arg)
  {
    msg_.info = std::move(arg);
    return Init_GenerateCoverage_Event_request(msg_);
  }

private:
  ::rbt1_interfaces::srv::GenerateCoverage_Event msg_;
};

}  // namespace builder

}  // namespace srv

template<typename MessageType>
auto build();

template<>
inline
auto build<::rbt1_interfaces::srv::GenerateCoverage_Event>()
{
  return rbt1_interfaces::srv::builder::Init_GenerateCoverage_Event_info();
}

}  // namespace rbt1_interfaces

#endif  // RBT1_INTERFACES__SRV__DETAIL__GENERATE_COVERAGE__BUILDER_HPP_
