// generated from rosidl_generator_c/resource/idl__description.c.em
// with input from rbt1_interfaces:msg/MissionCommand.idl
// generated code does not contain a copyright notice

#include "rbt1_interfaces/msg/detail/mission_command__functions.h"

ROSIDL_GENERATOR_C_PUBLIC_rbt1_interfaces
const rosidl_type_hash_t *
rbt1_interfaces__msg__MissionCommand__get_type_hash(
  const rosidl_message_type_support_t * type_support)
{
  (void)type_support;
  static rosidl_type_hash_t hash = {1, {
      0xf5, 0xc2, 0xba, 0x5d, 0x66, 0x2f, 0xf9, 0x75,
      0x07, 0x7c, 0x29, 0x55, 0x03, 0xd0, 0xdc, 0x7c,
      0xfd, 0x71, 0xd4, 0x34, 0x14, 0xc0, 0xf2, 0x01,
      0xc0, 0x1b, 0x83, 0x2e, 0xfb, 0xa8, 0x17, 0x2e,
    }};
  return &hash;
}

#include <assert.h>
#include <string.h>

// Include directives for referenced types

// Hashes for external referenced types
#ifndef NDEBUG
#endif

static char rbt1_interfaces__msg__MissionCommand__TYPE_NAME[] = "rbt1_interfaces/msg/MissionCommand";

// Define type names, field names, and default values
static char rbt1_interfaces__msg__MissionCommand__FIELD_NAME__mission_id[] = "mission_id";
static char rbt1_interfaces__msg__MissionCommand__FIELD_NAME__zone[] = "zone";
static char rbt1_interfaces__msg__MissionCommand__FIELD_NAME__mission_type[] = "mission_type";
static char rbt1_interfaces__msg__MissionCommand__FIELD_NAME__min_battery_percent[] = "min_battery_percent";

static rosidl_runtime_c__type_description__Field rbt1_interfaces__msg__MissionCommand__FIELDS[] = {
  {
    {rbt1_interfaces__msg__MissionCommand__FIELD_NAME__mission_id, 10, 10},
    {
      rosidl_runtime_c__type_description__FieldType__FIELD_TYPE_STRING,
      0,
      0,
      {NULL, 0, 0},
    },
    {NULL, 0, 0},
  },
  {
    {rbt1_interfaces__msg__MissionCommand__FIELD_NAME__zone, 4, 4},
    {
      rosidl_runtime_c__type_description__FieldType__FIELD_TYPE_STRING,
      0,
      0,
      {NULL, 0, 0},
    },
    {NULL, 0, 0},
  },
  {
    {rbt1_interfaces__msg__MissionCommand__FIELD_NAME__mission_type, 12, 12},
    {
      rosidl_runtime_c__type_description__FieldType__FIELD_TYPE_STRING,
      0,
      0,
      {NULL, 0, 0},
    },
    {NULL, 0, 0},
  },
  {
    {rbt1_interfaces__msg__MissionCommand__FIELD_NAME__min_battery_percent, 19, 19},
    {
      rosidl_runtime_c__type_description__FieldType__FIELD_TYPE_FLOAT,
      0,
      0,
      {NULL, 0, 0},
    },
    {NULL, 0, 0},
  },
};

const rosidl_runtime_c__type_description__TypeDescription *
rbt1_interfaces__msg__MissionCommand__get_type_description(
  const rosidl_message_type_support_t * type_support)
{
  (void)type_support;
  static bool constructed = false;
  static const rosidl_runtime_c__type_description__TypeDescription description = {
    {
      {rbt1_interfaces__msg__MissionCommand__TYPE_NAME, 34, 34},
      {rbt1_interfaces__msg__MissionCommand__FIELDS, 4, 4},
    },
    {NULL, 0, 0},
  };
  if (!constructed) {
    constructed = true;
  }
  return &description;
}

static char toplevel_type_raw_source[] =
  "string mission_id\n"
  "string zone\n"
  "string mission_type   # transit | perimeter | coverage | dock | inspection\n"
  "float32 min_battery_percent";

static char msg_encoding[] = "msg";

// Define all individual source functions

const rosidl_runtime_c__type_description__TypeSource *
rbt1_interfaces__msg__MissionCommand__get_individual_type_description_source(
  const rosidl_message_type_support_t * type_support)
{
  (void)type_support;
  static const rosidl_runtime_c__type_description__TypeSource source = {
    {rbt1_interfaces__msg__MissionCommand__TYPE_NAME, 34, 34},
    {msg_encoding, 3, 3},
    {toplevel_type_raw_source, 132, 132},
  };
  return &source;
}

const rosidl_runtime_c__type_description__TypeSource__Sequence *
rbt1_interfaces__msg__MissionCommand__get_type_description_sources(
  const rosidl_message_type_support_t * type_support)
{
  (void)type_support;
  static rosidl_runtime_c__type_description__TypeSource sources[1];
  static const rosidl_runtime_c__type_description__TypeSource__Sequence source_sequence = {sources, 1, 1};
  static bool constructed = false;
  if (!constructed) {
    sources[0] = *rbt1_interfaces__msg__MissionCommand__get_individual_type_description_source(NULL),
    constructed = true;
  }
  return &source_sequence;
}
