// generated from rosidl_generator_c/resource/idl__description.c.em
// with input from rbt1_interfaces:msg/MissionState.idl
// generated code does not contain a copyright notice

#include "rbt1_interfaces/msg/detail/mission_state__functions.h"

ROSIDL_GENERATOR_C_PUBLIC_rbt1_interfaces
const rosidl_type_hash_t *
rbt1_interfaces__msg__MissionState__get_type_hash(
  const rosidl_message_type_support_t * type_support)
{
  (void)type_support;
  static rosidl_type_hash_t hash = {1, {
      0x2f, 0xb9, 0x6b, 0x08, 0xe1, 0xf0, 0x64, 0xe6,
      0x59, 0xc9, 0xe0, 0x86, 0x3d, 0x1e, 0x81, 0x9c,
      0xa1, 0x46, 0xae, 0x1c, 0xc3, 0x33, 0x69, 0xa2,
      0x95, 0xe9, 0x01, 0x0a, 0x34, 0xe2, 0x61, 0x93,
    }};
  return &hash;
}

#include <assert.h>
#include <string.h>

// Include directives for referenced types

// Hashes for external referenced types
#ifndef NDEBUG
#endif

static char rbt1_interfaces__msg__MissionState__TYPE_NAME[] = "rbt1_interfaces/msg/MissionState";

// Define type names, field names, and default values
static char rbt1_interfaces__msg__MissionState__FIELD_NAME__mission_id[] = "mission_id";
static char rbt1_interfaces__msg__MissionState__FIELD_NAME__state[] = "state";
static char rbt1_interfaces__msg__MissionState__FIELD_NAME__current_step[] = "current_step";
static char rbt1_interfaces__msg__MissionState__FIELD_NAME__info[] = "info";

static rosidl_runtime_c__type_description__Field rbt1_interfaces__msg__MissionState__FIELDS[] = {
  {
    {rbt1_interfaces__msg__MissionState__FIELD_NAME__mission_id, 10, 10},
    {
      rosidl_runtime_c__type_description__FieldType__FIELD_TYPE_STRING,
      0,
      0,
      {NULL, 0, 0},
    },
    {NULL, 0, 0},
  },
  {
    {rbt1_interfaces__msg__MissionState__FIELD_NAME__state, 5, 5},
    {
      rosidl_runtime_c__type_description__FieldType__FIELD_TYPE_STRING,
      0,
      0,
      {NULL, 0, 0},
    },
    {NULL, 0, 0},
  },
  {
    {rbt1_interfaces__msg__MissionState__FIELD_NAME__current_step, 12, 12},
    {
      rosidl_runtime_c__type_description__FieldType__FIELD_TYPE_STRING,
      0,
      0,
      {NULL, 0, 0},
    },
    {NULL, 0, 0},
  },
  {
    {rbt1_interfaces__msg__MissionState__FIELD_NAME__info, 4, 4},
    {
      rosidl_runtime_c__type_description__FieldType__FIELD_TYPE_STRING,
      0,
      0,
      {NULL, 0, 0},
    },
    {NULL, 0, 0},
  },
};

const rosidl_runtime_c__type_description__TypeDescription *
rbt1_interfaces__msg__MissionState__get_type_description(
  const rosidl_message_type_support_t * type_support)
{
  (void)type_support;
  static bool constructed = false;
  static const rosidl_runtime_c__type_description__TypeDescription description = {
    {
      {rbt1_interfaces__msg__MissionState__TYPE_NAME, 32, 32},
      {rbt1_interfaces__msg__MissionState__FIELDS, 4, 4},
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
  "string state          # IDLE | PRECHECK | RUNNING | PAUSED | DONE | ERROR | ABORTED\n"
  "string current_step   # TRANSIT | PERIMETER | COVERAGE | RETURNING | DOCKED | NONE\n"
  "string info           # message libre (debug, cause erreur)";

static char msg_encoding[] = "msg";

// Define all individual source functions

const rosidl_runtime_c__type_description__TypeSource *
rbt1_interfaces__msg__MissionState__get_individual_type_description_source(
  const rosidl_message_type_support_t * type_support)
{
  (void)type_support;
  static const rosidl_runtime_c__type_description__TypeSource source = {
    {rbt1_interfaces__msg__MissionState__TYPE_NAME, 32, 32},
    {msg_encoding, 3, 3},
    {toplevel_type_raw_source, 244, 244},
  };
  return &source;
}

const rosidl_runtime_c__type_description__TypeSource__Sequence *
rbt1_interfaces__msg__MissionState__get_type_description_sources(
  const rosidl_message_type_support_t * type_support)
{
  (void)type_support;
  static rosidl_runtime_c__type_description__TypeSource sources[1];
  static const rosidl_runtime_c__type_description__TypeSource__Sequence source_sequence = {sources, 1, 1};
  static bool constructed = false;
  if (!constructed) {
    sources[0] = *rbt1_interfaces__msg__MissionState__get_individual_type_description_source(NULL),
    constructed = true;
  }
  return &source_sequence;
}
