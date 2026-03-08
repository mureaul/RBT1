// generated from rosidl_generator_c/resource/idl__functions.c.em
// with input from rbt1_interfaces:srv/GenerateCoverage.idl
// generated code does not contain a copyright notice
#include "rbt1_interfaces/srv/detail/generate_coverage__functions.h"

#include <assert.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>

#include "rcutils/allocator.h"

// Include directives for member types
// Member `zone_name`
#include "rosidl_runtime_c/string_functions.h"

bool
rbt1_interfaces__srv__GenerateCoverage_Request__init(rbt1_interfaces__srv__GenerateCoverage_Request * msg)
{
  if (!msg) {
    return false;
  }
  // zone_name
  if (!rosidl_runtime_c__String__init(&msg->zone_name)) {
    rbt1_interfaces__srv__GenerateCoverage_Request__fini(msg);
    return false;
  }
  return true;
}

void
rbt1_interfaces__srv__GenerateCoverage_Request__fini(rbt1_interfaces__srv__GenerateCoverage_Request * msg)
{
  if (!msg) {
    return;
  }
  // zone_name
  rosidl_runtime_c__String__fini(&msg->zone_name);
}

bool
rbt1_interfaces__srv__GenerateCoverage_Request__are_equal(const rbt1_interfaces__srv__GenerateCoverage_Request * lhs, const rbt1_interfaces__srv__GenerateCoverage_Request * rhs)
{
  if (!lhs || !rhs) {
    return false;
  }
  // zone_name
  if (!rosidl_runtime_c__String__are_equal(
      &(lhs->zone_name), &(rhs->zone_name)))
  {
    return false;
  }
  return true;
}

bool
rbt1_interfaces__srv__GenerateCoverage_Request__copy(
  const rbt1_interfaces__srv__GenerateCoverage_Request * input,
  rbt1_interfaces__srv__GenerateCoverage_Request * output)
{
  if (!input || !output) {
    return false;
  }
  // zone_name
  if (!rosidl_runtime_c__String__copy(
      &(input->zone_name), &(output->zone_name)))
  {
    return false;
  }
  return true;
}

rbt1_interfaces__srv__GenerateCoverage_Request *
rbt1_interfaces__srv__GenerateCoverage_Request__create(void)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__srv__GenerateCoverage_Request * msg = (rbt1_interfaces__srv__GenerateCoverage_Request *)allocator.allocate(sizeof(rbt1_interfaces__srv__GenerateCoverage_Request), allocator.state);
  if (!msg) {
    return NULL;
  }
  memset(msg, 0, sizeof(rbt1_interfaces__srv__GenerateCoverage_Request));
  bool success = rbt1_interfaces__srv__GenerateCoverage_Request__init(msg);
  if (!success) {
    allocator.deallocate(msg, allocator.state);
    return NULL;
  }
  return msg;
}

void
rbt1_interfaces__srv__GenerateCoverage_Request__destroy(rbt1_interfaces__srv__GenerateCoverage_Request * msg)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  if (msg) {
    rbt1_interfaces__srv__GenerateCoverage_Request__fini(msg);
  }
  allocator.deallocate(msg, allocator.state);
}


bool
rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__init(rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * array, size_t size)
{
  if (!array) {
    return false;
  }
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__srv__GenerateCoverage_Request * data = NULL;

  if (size) {
    data = (rbt1_interfaces__srv__GenerateCoverage_Request *)allocator.zero_allocate(size, sizeof(rbt1_interfaces__srv__GenerateCoverage_Request), allocator.state);
    if (!data) {
      return false;
    }
    // initialize all array elements
    size_t i;
    for (i = 0; i < size; ++i) {
      bool success = rbt1_interfaces__srv__GenerateCoverage_Request__init(&data[i]);
      if (!success) {
        break;
      }
    }
    if (i < size) {
      // if initialization failed finalize the already initialized array elements
      for (; i > 0; --i) {
        rbt1_interfaces__srv__GenerateCoverage_Request__fini(&data[i - 1]);
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
rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__fini(rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * array)
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
      rbt1_interfaces__srv__GenerateCoverage_Request__fini(&array->data[i]);
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

rbt1_interfaces__srv__GenerateCoverage_Request__Sequence *
rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__create(size_t size)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * array = (rbt1_interfaces__srv__GenerateCoverage_Request__Sequence *)allocator.allocate(sizeof(rbt1_interfaces__srv__GenerateCoverage_Request__Sequence), allocator.state);
  if (!array) {
    return NULL;
  }
  bool success = rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__init(array, size);
  if (!success) {
    allocator.deallocate(array, allocator.state);
    return NULL;
  }
  return array;
}

void
rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__destroy(rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * array)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  if (array) {
    rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__fini(array);
  }
  allocator.deallocate(array, allocator.state);
}

bool
rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__are_equal(const rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * lhs, const rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * rhs)
{
  if (!lhs || !rhs) {
    return false;
  }
  if (lhs->size != rhs->size) {
    return false;
  }
  for (size_t i = 0; i < lhs->size; ++i) {
    if (!rbt1_interfaces__srv__GenerateCoverage_Request__are_equal(&(lhs->data[i]), &(rhs->data[i]))) {
      return false;
    }
  }
  return true;
}

bool
rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__copy(
  const rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * input,
  rbt1_interfaces__srv__GenerateCoverage_Request__Sequence * output)
{
  if (!input || !output) {
    return false;
  }
  if (output->capacity < input->size) {
    const size_t allocation_size =
      input->size * sizeof(rbt1_interfaces__srv__GenerateCoverage_Request);
    rcutils_allocator_t allocator = rcutils_get_default_allocator();
    rbt1_interfaces__srv__GenerateCoverage_Request * data =
      (rbt1_interfaces__srv__GenerateCoverage_Request *)allocator.reallocate(
      output->data, allocation_size, allocator.state);
    if (!data) {
      return false;
    }
    // If reallocation succeeded, memory may or may not have been moved
    // to fulfill the allocation request, invalidating output->data.
    output->data = data;
    for (size_t i = output->capacity; i < input->size; ++i) {
      if (!rbt1_interfaces__srv__GenerateCoverage_Request__init(&output->data[i])) {
        // If initialization of any new item fails, roll back
        // all previously initialized items. Existing items
        // in output are to be left unmodified.
        for (; i-- > output->capacity; ) {
          rbt1_interfaces__srv__GenerateCoverage_Request__fini(&output->data[i]);
        }
        return false;
      }
    }
    output->capacity = input->size;
  }
  output->size = input->size;
  for (size_t i = 0; i < input->size; ++i) {
    if (!rbt1_interfaces__srv__GenerateCoverage_Request__copy(
        &(input->data[i]), &(output->data[i])))
    {
      return false;
    }
  }
  return true;
}


// Include directives for member types
// Member `message`
// already included above
// #include "rosidl_runtime_c/string_functions.h"

bool
rbt1_interfaces__srv__GenerateCoverage_Response__init(rbt1_interfaces__srv__GenerateCoverage_Response * msg)
{
  if (!msg) {
    return false;
  }
  // success
  // message
  if (!rosidl_runtime_c__String__init(&msg->message)) {
    rbt1_interfaces__srv__GenerateCoverage_Response__fini(msg);
    return false;
  }
  return true;
}

void
rbt1_interfaces__srv__GenerateCoverage_Response__fini(rbt1_interfaces__srv__GenerateCoverage_Response * msg)
{
  if (!msg) {
    return;
  }
  // success
  // message
  rosidl_runtime_c__String__fini(&msg->message);
}

bool
rbt1_interfaces__srv__GenerateCoverage_Response__are_equal(const rbt1_interfaces__srv__GenerateCoverage_Response * lhs, const rbt1_interfaces__srv__GenerateCoverage_Response * rhs)
{
  if (!lhs || !rhs) {
    return false;
  }
  // success
  if (lhs->success != rhs->success) {
    return false;
  }
  // message
  if (!rosidl_runtime_c__String__are_equal(
      &(lhs->message), &(rhs->message)))
  {
    return false;
  }
  return true;
}

bool
rbt1_interfaces__srv__GenerateCoverage_Response__copy(
  const rbt1_interfaces__srv__GenerateCoverage_Response * input,
  rbt1_interfaces__srv__GenerateCoverage_Response * output)
{
  if (!input || !output) {
    return false;
  }
  // success
  output->success = input->success;
  // message
  if (!rosidl_runtime_c__String__copy(
      &(input->message), &(output->message)))
  {
    return false;
  }
  return true;
}

rbt1_interfaces__srv__GenerateCoverage_Response *
rbt1_interfaces__srv__GenerateCoverage_Response__create(void)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__srv__GenerateCoverage_Response * msg = (rbt1_interfaces__srv__GenerateCoverage_Response *)allocator.allocate(sizeof(rbt1_interfaces__srv__GenerateCoverage_Response), allocator.state);
  if (!msg) {
    return NULL;
  }
  memset(msg, 0, sizeof(rbt1_interfaces__srv__GenerateCoverage_Response));
  bool success = rbt1_interfaces__srv__GenerateCoverage_Response__init(msg);
  if (!success) {
    allocator.deallocate(msg, allocator.state);
    return NULL;
  }
  return msg;
}

void
rbt1_interfaces__srv__GenerateCoverage_Response__destroy(rbt1_interfaces__srv__GenerateCoverage_Response * msg)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  if (msg) {
    rbt1_interfaces__srv__GenerateCoverage_Response__fini(msg);
  }
  allocator.deallocate(msg, allocator.state);
}


bool
rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__init(rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * array, size_t size)
{
  if (!array) {
    return false;
  }
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__srv__GenerateCoverage_Response * data = NULL;

  if (size) {
    data = (rbt1_interfaces__srv__GenerateCoverage_Response *)allocator.zero_allocate(size, sizeof(rbt1_interfaces__srv__GenerateCoverage_Response), allocator.state);
    if (!data) {
      return false;
    }
    // initialize all array elements
    size_t i;
    for (i = 0; i < size; ++i) {
      bool success = rbt1_interfaces__srv__GenerateCoverage_Response__init(&data[i]);
      if (!success) {
        break;
      }
    }
    if (i < size) {
      // if initialization failed finalize the already initialized array elements
      for (; i > 0; --i) {
        rbt1_interfaces__srv__GenerateCoverage_Response__fini(&data[i - 1]);
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
rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__fini(rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * array)
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
      rbt1_interfaces__srv__GenerateCoverage_Response__fini(&array->data[i]);
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

rbt1_interfaces__srv__GenerateCoverage_Response__Sequence *
rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__create(size_t size)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * array = (rbt1_interfaces__srv__GenerateCoverage_Response__Sequence *)allocator.allocate(sizeof(rbt1_interfaces__srv__GenerateCoverage_Response__Sequence), allocator.state);
  if (!array) {
    return NULL;
  }
  bool success = rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__init(array, size);
  if (!success) {
    allocator.deallocate(array, allocator.state);
    return NULL;
  }
  return array;
}

void
rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__destroy(rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * array)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  if (array) {
    rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__fini(array);
  }
  allocator.deallocate(array, allocator.state);
}

bool
rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__are_equal(const rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * lhs, const rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * rhs)
{
  if (!lhs || !rhs) {
    return false;
  }
  if (lhs->size != rhs->size) {
    return false;
  }
  for (size_t i = 0; i < lhs->size; ++i) {
    if (!rbt1_interfaces__srv__GenerateCoverage_Response__are_equal(&(lhs->data[i]), &(rhs->data[i]))) {
      return false;
    }
  }
  return true;
}

bool
rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__copy(
  const rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * input,
  rbt1_interfaces__srv__GenerateCoverage_Response__Sequence * output)
{
  if (!input || !output) {
    return false;
  }
  if (output->capacity < input->size) {
    const size_t allocation_size =
      input->size * sizeof(rbt1_interfaces__srv__GenerateCoverage_Response);
    rcutils_allocator_t allocator = rcutils_get_default_allocator();
    rbt1_interfaces__srv__GenerateCoverage_Response * data =
      (rbt1_interfaces__srv__GenerateCoverage_Response *)allocator.reallocate(
      output->data, allocation_size, allocator.state);
    if (!data) {
      return false;
    }
    // If reallocation succeeded, memory may or may not have been moved
    // to fulfill the allocation request, invalidating output->data.
    output->data = data;
    for (size_t i = output->capacity; i < input->size; ++i) {
      if (!rbt1_interfaces__srv__GenerateCoverage_Response__init(&output->data[i])) {
        // If initialization of any new item fails, roll back
        // all previously initialized items. Existing items
        // in output are to be left unmodified.
        for (; i-- > output->capacity; ) {
          rbt1_interfaces__srv__GenerateCoverage_Response__fini(&output->data[i]);
        }
        return false;
      }
    }
    output->capacity = input->size;
  }
  output->size = input->size;
  for (size_t i = 0; i < input->size; ++i) {
    if (!rbt1_interfaces__srv__GenerateCoverage_Response__copy(
        &(input->data[i]), &(output->data[i])))
    {
      return false;
    }
  }
  return true;
}


// Include directives for member types
// Member `info`
#include "service_msgs/msg/detail/service_event_info__functions.h"
// Member `request`
// Member `response`
// already included above
// #include "rbt1_interfaces/srv/detail/generate_coverage__functions.h"

bool
rbt1_interfaces__srv__GenerateCoverage_Event__init(rbt1_interfaces__srv__GenerateCoverage_Event * msg)
{
  if (!msg) {
    return false;
  }
  // info
  if (!service_msgs__msg__ServiceEventInfo__init(&msg->info)) {
    rbt1_interfaces__srv__GenerateCoverage_Event__fini(msg);
    return false;
  }
  // request
  if (!rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__init(&msg->request, 0)) {
    rbt1_interfaces__srv__GenerateCoverage_Event__fini(msg);
    return false;
  }
  // response
  if (!rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__init(&msg->response, 0)) {
    rbt1_interfaces__srv__GenerateCoverage_Event__fini(msg);
    return false;
  }
  return true;
}

void
rbt1_interfaces__srv__GenerateCoverage_Event__fini(rbt1_interfaces__srv__GenerateCoverage_Event * msg)
{
  if (!msg) {
    return;
  }
  // info
  service_msgs__msg__ServiceEventInfo__fini(&msg->info);
  // request
  rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__fini(&msg->request);
  // response
  rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__fini(&msg->response);
}

bool
rbt1_interfaces__srv__GenerateCoverage_Event__are_equal(const rbt1_interfaces__srv__GenerateCoverage_Event * lhs, const rbt1_interfaces__srv__GenerateCoverage_Event * rhs)
{
  if (!lhs || !rhs) {
    return false;
  }
  // info
  if (!service_msgs__msg__ServiceEventInfo__are_equal(
      &(lhs->info), &(rhs->info)))
  {
    return false;
  }
  // request
  if (!rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__are_equal(
      &(lhs->request), &(rhs->request)))
  {
    return false;
  }
  // response
  if (!rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__are_equal(
      &(lhs->response), &(rhs->response)))
  {
    return false;
  }
  return true;
}

bool
rbt1_interfaces__srv__GenerateCoverage_Event__copy(
  const rbt1_interfaces__srv__GenerateCoverage_Event * input,
  rbt1_interfaces__srv__GenerateCoverage_Event * output)
{
  if (!input || !output) {
    return false;
  }
  // info
  if (!service_msgs__msg__ServiceEventInfo__copy(
      &(input->info), &(output->info)))
  {
    return false;
  }
  // request
  if (!rbt1_interfaces__srv__GenerateCoverage_Request__Sequence__copy(
      &(input->request), &(output->request)))
  {
    return false;
  }
  // response
  if (!rbt1_interfaces__srv__GenerateCoverage_Response__Sequence__copy(
      &(input->response), &(output->response)))
  {
    return false;
  }
  return true;
}

rbt1_interfaces__srv__GenerateCoverage_Event *
rbt1_interfaces__srv__GenerateCoverage_Event__create(void)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__srv__GenerateCoverage_Event * msg = (rbt1_interfaces__srv__GenerateCoverage_Event *)allocator.allocate(sizeof(rbt1_interfaces__srv__GenerateCoverage_Event), allocator.state);
  if (!msg) {
    return NULL;
  }
  memset(msg, 0, sizeof(rbt1_interfaces__srv__GenerateCoverage_Event));
  bool success = rbt1_interfaces__srv__GenerateCoverage_Event__init(msg);
  if (!success) {
    allocator.deallocate(msg, allocator.state);
    return NULL;
  }
  return msg;
}

void
rbt1_interfaces__srv__GenerateCoverage_Event__destroy(rbt1_interfaces__srv__GenerateCoverage_Event * msg)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  if (msg) {
    rbt1_interfaces__srv__GenerateCoverage_Event__fini(msg);
  }
  allocator.deallocate(msg, allocator.state);
}


bool
rbt1_interfaces__srv__GenerateCoverage_Event__Sequence__init(rbt1_interfaces__srv__GenerateCoverage_Event__Sequence * array, size_t size)
{
  if (!array) {
    return false;
  }
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__srv__GenerateCoverage_Event * data = NULL;

  if (size) {
    data = (rbt1_interfaces__srv__GenerateCoverage_Event *)allocator.zero_allocate(size, sizeof(rbt1_interfaces__srv__GenerateCoverage_Event), allocator.state);
    if (!data) {
      return false;
    }
    // initialize all array elements
    size_t i;
    for (i = 0; i < size; ++i) {
      bool success = rbt1_interfaces__srv__GenerateCoverage_Event__init(&data[i]);
      if (!success) {
        break;
      }
    }
    if (i < size) {
      // if initialization failed finalize the already initialized array elements
      for (; i > 0; --i) {
        rbt1_interfaces__srv__GenerateCoverage_Event__fini(&data[i - 1]);
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
rbt1_interfaces__srv__GenerateCoverage_Event__Sequence__fini(rbt1_interfaces__srv__GenerateCoverage_Event__Sequence * array)
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
      rbt1_interfaces__srv__GenerateCoverage_Event__fini(&array->data[i]);
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

rbt1_interfaces__srv__GenerateCoverage_Event__Sequence *
rbt1_interfaces__srv__GenerateCoverage_Event__Sequence__create(size_t size)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  rbt1_interfaces__srv__GenerateCoverage_Event__Sequence * array = (rbt1_interfaces__srv__GenerateCoverage_Event__Sequence *)allocator.allocate(sizeof(rbt1_interfaces__srv__GenerateCoverage_Event__Sequence), allocator.state);
  if (!array) {
    return NULL;
  }
  bool success = rbt1_interfaces__srv__GenerateCoverage_Event__Sequence__init(array, size);
  if (!success) {
    allocator.deallocate(array, allocator.state);
    return NULL;
  }
  return array;
}

void
rbt1_interfaces__srv__GenerateCoverage_Event__Sequence__destroy(rbt1_interfaces__srv__GenerateCoverage_Event__Sequence * array)
{
  rcutils_allocator_t allocator = rcutils_get_default_allocator();
  if (array) {
    rbt1_interfaces__srv__GenerateCoverage_Event__Sequence__fini(array);
  }
  allocator.deallocate(array, allocator.state);
}

bool
rbt1_interfaces__srv__GenerateCoverage_Event__Sequence__are_equal(const rbt1_interfaces__srv__GenerateCoverage_Event__Sequence * lhs, const rbt1_interfaces__srv__GenerateCoverage_Event__Sequence * rhs)
{
  if (!lhs || !rhs) {
    return false;
  }
  if (lhs->size != rhs->size) {
    return false;
  }
  for (size_t i = 0; i < lhs->size; ++i) {
    if (!rbt1_interfaces__srv__GenerateCoverage_Event__are_equal(&(lhs->data[i]), &(rhs->data[i]))) {
      return false;
    }
  }
  return true;
}

bool
rbt1_interfaces__srv__GenerateCoverage_Event__Sequence__copy(
  const rbt1_interfaces__srv__GenerateCoverage_Event__Sequence * input,
  rbt1_interfaces__srv__GenerateCoverage_Event__Sequence * output)
{
  if (!input || !output) {
    return false;
  }
  if (output->capacity < input->size) {
    const size_t allocation_size =
      input->size * sizeof(rbt1_interfaces__srv__GenerateCoverage_Event);
    rcutils_allocator_t allocator = rcutils_get_default_allocator();
    rbt1_interfaces__srv__GenerateCoverage_Event * data =
      (rbt1_interfaces__srv__GenerateCoverage_Event *)allocator.reallocate(
      output->data, allocation_size, allocator.state);
    if (!data) {
      return false;
    }
    // If reallocation succeeded, memory may or may not have been moved
    // to fulfill the allocation request, invalidating output->data.
    output->data = data;
    for (size_t i = output->capacity; i < input->size; ++i) {
      if (!rbt1_interfaces__srv__GenerateCoverage_Event__init(&output->data[i])) {
        // If initialization of any new item fails, roll back
        // all previously initialized items. Existing items
        // in output are to be left unmodified.
        for (; i-- > output->capacity; ) {
          rbt1_interfaces__srv__GenerateCoverage_Event__fini(&output->data[i]);
        }
        return false;
      }
    }
    output->capacity = input->size;
  }
  output->size = input->size;
  for (size_t i = 0; i < input->size; ++i) {
    if (!rbt1_interfaces__srv__GenerateCoverage_Event__copy(
        &(input->data[i]), &(output->data[i])))
    {
      return false;
    }
  }
  return true;
}
