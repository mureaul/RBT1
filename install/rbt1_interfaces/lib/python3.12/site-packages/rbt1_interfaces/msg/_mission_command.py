# generated from rosidl_generator_py/resource/_idl.py.em
# with input from rbt1_interfaces:msg/MissionCommand.idl
# generated code does not contain a copyright notice

# This is being done at the module level and not on the instance level to avoid looking
# for the same variable multiple times on each instance. This variable is not supposed to
# change during runtime so it makes sense to only look for it once.
from os import getenv

ros_python_check_fields = getenv('ROS_PYTHON_CHECK_FIELDS', default='')


# Import statements for member types

import builtins  # noqa: E402, I100

import math  # noqa: E402, I100

import rosidl_parser.definition  # noqa: E402, I100


class Metaclass_MissionCommand(type):
    """Metaclass of message 'MissionCommand'."""

    _CREATE_ROS_MESSAGE = None
    _CONVERT_FROM_PY = None
    _CONVERT_TO_PY = None
    _DESTROY_ROS_MESSAGE = None
    _TYPE_SUPPORT = None

    __constants = {
    }

    @classmethod
    def __import_type_support__(cls):
        try:
            from rosidl_generator_py import import_type_support
            module = import_type_support('rbt1_interfaces')
        except ImportError:
            import logging
            import traceback
            logger = logging.getLogger(
                'rbt1_interfaces.msg.MissionCommand')
            logger.debug(
                'Failed to import needed modules for type support:\n' +
                traceback.format_exc())
        else:
            cls._CREATE_ROS_MESSAGE = module.create_ros_message_msg__msg__mission_command
            cls._CONVERT_FROM_PY = module.convert_from_py_msg__msg__mission_command
            cls._CONVERT_TO_PY = module.convert_to_py_msg__msg__mission_command
            cls._TYPE_SUPPORT = module.type_support_msg__msg__mission_command
            cls._DESTROY_ROS_MESSAGE = module.destroy_ros_message_msg__msg__mission_command

    @classmethod
    def __prepare__(cls, name, bases, **kwargs):
        # list constant names here so that they appear in the help text of
        # the message class under "Data and other attributes defined here:"
        # as well as populate each message instance
        return {
        }


class MissionCommand(metaclass=Metaclass_MissionCommand):
    """Message class 'MissionCommand'."""

    __slots__ = [
        '_mission_id',
        '_zone',
        '_mission_type',
        '_min_battery_percent',
        '_check_fields',
    ]

    _fields_and_field_types = {
        'mission_id': 'string',
        'zone': 'string',
        'mission_type': 'string',
        'min_battery_percent': 'float',
    }

    # This attribute is used to store an rosidl_parser.definition variable
    # related to the data type of each of the components the message.
    SLOT_TYPES = (
        rosidl_parser.definition.UnboundedString(),  # noqa: E501
        rosidl_parser.definition.UnboundedString(),  # noqa: E501
        rosidl_parser.definition.UnboundedString(),  # noqa: E501
        rosidl_parser.definition.BasicType('float'),  # noqa: E501
    )

    def __init__(self, **kwargs):
        if 'check_fields' in kwargs:
            self._check_fields = kwargs['check_fields']
        else:
            self._check_fields = ros_python_check_fields == '1'
        if self._check_fields:
            assert all('_' + key in self.__slots__ for key in kwargs.keys()), \
                'Invalid arguments passed to constructor: %s' % \
                ', '.join(sorted(k for k in kwargs.keys() if '_' + k not in self.__slots__))
        self.mission_id = kwargs.get('mission_id', str())
        self.zone = kwargs.get('zone', str())
        self.mission_type = kwargs.get('mission_type', str())
        self.min_battery_percent = kwargs.get('min_battery_percent', float())

    def __repr__(self):
        typename = self.__class__.__module__.split('.')
        typename.pop()
        typename.append(self.__class__.__name__)
        args = []
        for s, t in zip(self.get_fields_and_field_types().keys(), self.SLOT_TYPES):
            field = getattr(self, s)
            fieldstr = repr(field)
            # We use Python array type for fields that can be directly stored
            # in them, and "normal" sequences for everything else.  If it is
            # a type that we store in an array, strip off the 'array' portion.
            if (
                isinstance(t, rosidl_parser.definition.AbstractSequence) and
                isinstance(t.value_type, rosidl_parser.definition.BasicType) and
                t.value_type.typename in ['float', 'double', 'int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32', 'int64', 'uint64']
            ):
                if len(field) == 0:
                    fieldstr = '[]'
                else:
                    if self._check_fields:
                        assert fieldstr.startswith('array(')
                    prefix = "array('X', "
                    suffix = ')'
                    fieldstr = fieldstr[len(prefix):-len(suffix)]
            args.append(s + '=' + fieldstr)
        return '%s(%s)' % ('.'.join(typename), ', '.join(args))

    def __eq__(self, other):
        if not isinstance(other, self.__class__):
            return False
        if self.mission_id != other.mission_id:
            return False
        if self.zone != other.zone:
            return False
        if self.mission_type != other.mission_type:
            return False
        if self.min_battery_percent != other.min_battery_percent:
            return False
        return True

    @classmethod
    def get_fields_and_field_types(cls):
        from copy import copy
        return copy(cls._fields_and_field_types)

    @builtins.property
    def mission_id(self):
        """Message field 'mission_id'."""
        return self._mission_id

    @mission_id.setter
    def mission_id(self, value):
        if self._check_fields:
            assert \
                isinstance(value, str), \
                "The 'mission_id' field must be of type 'str'"
        self._mission_id = value

    @builtins.property
    def zone(self):
        """Message field 'zone'."""
        return self._zone

    @zone.setter
    def zone(self, value):
        if self._check_fields:
            assert \
                isinstance(value, str), \
                "The 'zone' field must be of type 'str'"
        self._zone = value

    @builtins.property
    def mission_type(self):
        """Message field 'mission_type'."""
        return self._mission_type

    @mission_type.setter
    def mission_type(self, value):
        if self._check_fields:
            assert \
                isinstance(value, str), \
                "The 'mission_type' field must be of type 'str'"
        self._mission_type = value

    @builtins.property
    def min_battery_percent(self):
        """Message field 'min_battery_percent'."""
        return self._min_battery_percent

    @min_battery_percent.setter
    def min_battery_percent(self, value):
        if self._check_fields:
            assert \
                isinstance(value, float), \
                "The 'min_battery_percent' field must be of type 'float'"
            assert not (value < -3.402823466e+38 or value > 3.402823466e+38) or math.isinf(value), \
                "The 'min_battery_percent' field must be a float in [-3.402823466e+38, 3.402823466e+38]"
        self._min_battery_percent = value
