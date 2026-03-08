// generated from rosidl_generator_c/resource/idl__functions.c.em
// with input from rbt1_interfaces:msg/MissionCommand.idl
// generated code does not contain a copyright notice
#include "rbt1_interfaces/msg/detail/mission_command__functions.h"

#include <assert.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>

#include "rcutils/allocator.h"


// Include directives for member types
// Member `mission_id`
// Member `zone`
// Member `mission_type`
#include "rosidl_runtime_c/string_functions.h"

bool
rbt1_interfaces__msg__MissionCommand__init(rbt1_interfaces__msg__MissionCommand * msg)
{
  if (!msg) {
    return false;
  }
  // mission_id
  if (!rosidl_runtime_c__String__init(&msg->mission_id)) {
    rbt1_interfaces__msg__MissionCommand__fini(msg);
    return false;
  }
  // zone
  if (!rosidl_runtime_c__String__init(&msg->zone)) {
    rbt1_interfaces__msg__MissionCommand__fini(msg);
    return false;
  }
  // mission_type
  if (!rosidl_runtime_c__String__init(&msg->mission_type)) {
    rbt1_interfaces__msg__MissionCommand__fini(msg);
    return false;
  }
  // min_battery_percent
  return true;
}

void
rbt1_interfaces__msg__MissionCommand__fini(rbt1_interfaces__msg__MissionCommand * msg)
{
  if (!msg) {
    return;
  }
  // mission_id
  rosidl_runtime_c__String__fini(&msg->mission_id);
  // zone
  rosidl_runtime_c__String__fini(&msg->zone);
  // mission_type
  rosidl_runtime_c__String__fini(&msg->mission_type);
  // min_battery_percent
}

bool
rbt1_interfaces__msg__MissionCommand__are_equal(const rbt1_interfaces__msg__MissionCommand * lhs, const rbt1_interfaces__msg__MissionCommand * rhs)
{
  if (!lhs || !rhs) {
    return false;
  }
  // mission_id
  if (!rosidl_runtime_c__String__are_equal(
      &(lhs->mission_id), &(rhs->mission_id)))
  {
    return false;
  }
  // zone
  if (!rosidl_runtime_c__String__are_equal(
      &(lhs->zone), &(rhs->zone)))
  {
    return false;
  }
  // mission_type
  if (!rosidl_runtime_c__String__are_equal(
      &(lhs->mission_type), &(rhs->mission_type)))
  {
    return false;
  }
  // min_battery_percent
  if (lhs->min_battery_percent != rhs->min_battery_percent) {
    return false;
  }
  return true;
}

bool
rbt1_interfaces__msg__MissionCommand__copy(
  const rbt1_interfaces__msg__MissionCommand * input,
  rbt1_interfaces__msg__MissionCommand * output)
{
  if (!input || !output) {
    return false;
  }
  // mission_id
  if (!rosidl_runtime_c__String__copy(
      &(input->mission_id), &(output->mission_id)))
  {
    return false;
  }
  // zone
  if (!rosidl_runtime_c__String__copy(
      &(input->zone), &(output->zone)))
  {
    return false;
  }
  // mission_type
  if (!rosidl_runtime_c__String__copy(
      &(input->mission_type), &(output->mission_type)))
  {
    return false;
  }
  // min_battery_percent
  output->min_battery_percent = input->min_battery_percent;
  return true;
}

rbt1_interfaces__msg__MissionCommand *
rbt1_interfaces__msg__MissionCommand__create(void)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__msg__MissionCommand * msg = (rbt1_interfaces__msg__MissionCommand *)allocator.allocate(sizeof(rbt1_interfaces__msg__MissionCommand), allocator.state);
  if (!msg) {
    return NULL;
  }
  memset(msg, 0, sizeof(rbt1_interfaces__msg__MissionCommand));
  bool success = rbt1_interfaces__msg__MissionCommand__init(msg);
  if (!success) {
    allocator.deallocate(msg, allocator.state);
    return NULL;
  }
  return msg;
}

void
rbt1_interfaces__msg__MissionCommand__destroy(rbt1_interfaces__msg__MissionCommand * msg)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  if (msg) {
    rbt1_interfaces__msg__MissionCommand__fini(msg);
  }
  allocator.deallocate(msg, allocator.state);
}


bool
rbt1_interfaces__msg__MissionCommand__Sequence__init(rbt1_interfaces__msg__MissionCommand__Sequence * array, size_t size)
{
  if (!array) {
    return false;
  }
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__msg__MissionCommand * data = NULL;

  if (size) {
    data = (rbt1_interfaces__msg__MissionCommand *)allocator.zero_allocate(size, sizeof(rbt1_interfaces__msg__MissionCommand), allocator.state);
    if (!data) {
      return false;
    }
    // initialize all array elements
    size_t i;
    for (i = 0; i < size; ++i) {
      bool success = rbt1_interfaces__msg__MissionCommand__init(&data[i]);
      if (!success) {
        break;
      }
    }
    if (i < size) {
      // if initialization failed finalize the already initialized array elements
      for (; i > 0; --i) {
        rbt1_interfaces__msg__MissionCommand__fini(&data[i - 1]);
      }
      allocator.deallocate(data, allocator.state);
      return false;
    }
  }
  array->data = data;
  array->size = size;
  array->capacity = size;
  return true;
}

void
rbt1_interfaces__msg__MissionCommand__Sequence__fini(rbt1_interfaces__msg__MissionCommand__Sequence * array)
{
  if (!array) {
    return;
  }
  rcutils_allocator_t allocator = rcutils_get_default_allocator();

  if (array->data) {
    // ensure that data and capacity values are consistent
    assert(array->capacity > 0);
    // finalize all array elements
    for (size_t i = 0; i < array->capacity; ++i) {
      rbt1_interfaces__msg__MissionCommand__fini(&array->data[i]);
    }
    allocator.deallocate(array->data, allocator.state);
    array->data = NULL;
    array->size = 0;
    array->capacity = 0;
  } else {
    // ensure that data, size, and capacity values are consistent
    assert(0 == array->size);
    assert(0 == array->capacity);
  }
}

rbt1_interfaces__msg__MissionCommand__Sequence *
rbt1_interfaces__msg__MissionCommand__Sequence__create(size_t size)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__msg__MissionCommand__Sequence * array = (rbt1_interfaces__msg__MissionCommand__Sequence *)allocator.allocate(sizeof(rbt1_interfaces__msg__MissionCommand__Sequence), allocator.state);
  if (!array) {
    return NULL;
  }
  bool success = rbt1_interfaces__msg__MissionCommand__Sequence__init(array, size);
  if (!success) {
    allocator.deallocate(array, allocator.state);
    return NULL;
  }
  return array;
}

void
rbt1_interfaces__msg__MissionCommand__Sequence__destroy(rbt1_interfaces__msg__MissionCommand__Sequence * array)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  if (array) {
    rbt1_interfaces__msg__MissionCommand__Sequence__fini(array);
  }
  allocator.deallocate(array, allocator.state);
}

bool
rbt1_interfaces__msg__MissionCommand__Sequence__are_equal(const rbt1_interfaces__msg__MissionCommand__Sequence * lhs, const rbt1_interfaces__msg__MissionCommand__Sequence * rhs)
{
  if (!lhs || !rhs) {
    return false;
  }
  if (lhs->size != rhs->size) {
    return false;
  }
  for (size_t i = 0; i < lhs->size; ++i) {
    if (!rbt1_interfaces__msg__MissionCommand__are_equal(&(lhs->data[i]), &(rhs->data[i]))) {
      return false;
    }
  }
  return true;
}

bool
rbt1_interfaces__msg__MissionCommand__Sequence__copy(
  const rbt1_interfaces__msg__MissionCommand__Sequence * input,
  rbt1_interfaces__msg__MissionCommand__Sequence * output)
{
  if (!input || !output) {
    return false;
  }
  if (output->capacity < input->size) {
    const size_t allocation_size =
      input->size * sizeof(rbt1_interfaces__msg__MissionCommand);
    rcutils_allocator_t allocator = rcutils_get_default_allocator();
    rbt1_interfaces__msg__MissionCommand * data =
      (rbt1_interfaces__msg__MissionCommand *)allocator.reallocate(
      output->data, allocation_size, allocator.state);
    if (!data) {
      return false;
    }
    // If reallocation succeeded, memory may or may not have been moved
    // to fulfill the allocation request, invalidating output->data.
    output->data = data;
    for (size_t i = output->capacity; i < input->size; ++i) {
      if (!rbt1_interfaces__msg__MissionCommand__init(&output->data[i])) {
        // If initialization of any new item fails, roll back
        // all previously initialized items. Existing items
        // in output are to be left unmodified.
        for (; i-- > output->capacity; ) {
          rbt1_interfaces__msg__MissionCommand__fini(&output->data[i]);
        }
        return false;
      }
    }
    output->capacity = input->size;
  }
  output->size = input->size;
  for (size_t i = 0; i < input->size; ++i) {
    if (!rbt1_interfaces__msg__MissionCommand__copy(
        &(input->data[i]), &(output->data[i])))
    {
      return false;
    }
  }
  return true;
}
