// generated from rosidl_generator_cpp/resource/idl__struct.hpp.em
// with input from rbt1_interfaces:msg/MissionCommand.idl
// generated code does not contain a copyright notice

// IWYU pragma: private, include "rbt1_interfaces/msg/mission_command.hpp"


#ifndef RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__STRUCT_HPP_
#define RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__STRUCT_HPP_

#include <algorithm>
#include <array>
#include <memory>
#include <string>
#include <vector>

#include "rosidl_runtime_cpp/bounded_vector.hpp"
#include "rosidl_runtime_cpp/message_initialization.hpp"


#ifndef _WIN32
# define DEPRECATED__rbt1_interfaces__msg__MissionCommand __attribute__((deprecated))
#else
# define DEPRECATED__rbt1_interfaces__msg__MissionCommand __declspec(deprecated)
#endif

namespace rbt1_interfaces
{

namespace msg
{

// message struct
template<class ContainerAllocator>
struct MissionCommand_
{
  using Type = MissionCommand_<ContainerAllocator>;

  explicit MissionCommand_(rosidl_runtime_cpp::MessageInitialization _init = rosidl_runtime_cpp::MessageInitialization::ALL)
  {
    if (rosidl_runtime_cpp::MessageInitialization::ALL == _init ||
      rosidl_runtime_cpp::MessageInitialization::ZERO == _init)
    {
      this->mission_id = "";
      this->zone = "";
      this->mission_type = "";
      this->min_battery_percent = 0.0f;
    }
  }

  explicit MissionCommand_(const ContainerAllocator & _alloc, rosidl_runtime_cpp::MessageInitialization _init = rosidl_runtime_cpp::MessageInitialization::ALL)
  : mission_id(_alloc),
    zone(_alloc),
    mission_type(_alloc)
  {
    if (rosidl_runtime_cpp::MessageInitialization::ALL == _init ||
      rosidl_runtime_cpp::MessageInitialization::ZERO == _init)
    {
      this->mission_id = "";
      this->zone = "";
      this->mission_type = "";
      this->min_battery_percent = 0.0f;
    }
  }

  // field types and members
  using _mission_id_type =
    std::basic_string<char, std::char_traits<char>, typename std::allocator_traits<ContainerAllocator>::template rebind_alloc<char>>;
  _mission_id_type mission_id;
  using _zone_type =
    std::basic_string<char, std::char_traits<char>, typename std::allocator_traits<ContainerAllocator>::template rebind_alloc<char>>;
  _zone_type zone;
  using _mission_type_type =
    std::basic_string<char, std::char_traits<char>, typename std::allocator_traits<ContainerAllocator>::template rebind_alloc<char>>;
  _mission_type_type mission_type;
  using _min_battery_percent_type =
    float;
  _min_battery_percent_type min_battery_percent;

  // setters for named parameter idiom
  Type & set__mission_id(
    const std::basic_string<char, std::char_traits<char>, typename std::allocator_traits<ContainerAllocator>::template rebind_alloc<char>> & _arg)
  {
    this->mission_id = _arg;
    return *this;
  }
  Type & set__zone(
    const std::basic_string<char, std::char_traits<char>, typename std::allocator_traits<ContainerAllocator>::template rebind_alloc<char>> & _arg)
  {
    this->zone = _arg;
    return *this;
  }
  Type & set__mission_type(
    const std::basic_string<char, std::char_traits<char>, typename std::allocator_traits<ContainerAllocator>::template rebind_alloc<char>> & _arg)
  {
    this->mission_type = _arg;
    return *this;
  }
  Type & set__min_battery_percent(
    const float & _arg)
  {
    this->min_battery_percent = _arg;
    return *this;
  }

  // constant declarations

  // pointer types
  using RawPtr =
    rbt1_interfaces::msg::MissionCommand_<ContainerAllocator> *;
  using ConstRawPtr =
    const rbt1_interfaces::msg::MissionCommand_<ContainerAllocator> *;
  using SharedPtr =
    std::shared_ptr<rbt1_interfaces::msg::MissionCommand_<ContainerAllocator>>;
  using ConstSharedPtr =
    std::shared_ptr<rbt1_interfaces::msg::MissionCommand_<ContainerAllocator> const>;

  template<typename Deleter = std::default_delete<
      rbt1_interfaces::msg::MissionCommand_<ContainerAllocator>>>
  using UniquePtrWithDeleter =
    std::unique_ptr<rbt1_interfaces::msg::MissionCommand_<ContainerAllocator>, Deleter>;

  using UniquePtr = UniquePtrWithDeleter<>;

  template<typename Deleter = std::default_delete<
      rbt1_interfaces::msg::MissionCommand_<ContainerAllocator>>>
  using ConstUniquePtrWithDeleter =
    std::unique_ptr<rbt1_interfaces::msg::MissionCommand_<ContainerAllocator> const, Deleter>;
  using ConstUniquePtr = ConstUniquePtrWithDeleter<>;

  using WeakPtr =
    std::weak_ptr<rbt1_interfaces::msg::MissionCommand_<ContainerAllocator>>;
  using ConstWeakPtr =
    std::weak_ptr<rbt1_interfaces::msg::MissionCommand_<ContainerAllocator> const>;

  // pointer types similar to ROS 1, use SharedPtr / ConstSharedPtr instead
  // NOTE: Can't use 'using' here because GNU C++ can't parse attributes properly
  typedef DEPRECATED__rbt1_interfaces__msg__MissionCommand
    std::shared_ptr<rbt1_interfaces::msg::MissionCommand_<ContainerAllocator>>
    Ptr;
  typedef DEPRECATED__rbt1_interfaces__msg__MissionCommand
    std::shared_ptr<rbt1_interfaces::msg::MissionCommand_<ContainerAllocator> const>
    ConstPtr;

  // comparison operators
  bool operator==(const MissionCommand_ & other) const
  {
    if (this->mission_id != other.mission_id) {
      return false;
    }
    if (this->zone != other.zone) {
      return false;
    }
    if (this->mission_type != other.mission_type) {
      return false;
    }
    if (this->min_battery_percent != other.min_battery_percent) {
      return false;
    }
    return true;
  }
  bool operator!=(const MissionCommand_ & other) const
  {
    return !this->operator==(other);
  }
};  // struct MissionCommand_

// alias to use template instance with default allocator
using MissionCommand =
  rbt1_interfaces::msg::MissionCommand_<std::allocator<void>>;

// constant definitions

}  // namespace msg

}  // namespace rbt1_interfaces

#endif  // RBT1_INTERFACES__MSG__DETAIL__MISSION_COMMAND__STRUCT_HPP_
