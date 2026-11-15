/**
 * Central topic definitions (fallback layer)
 */

export const Topics = {

    cmd_vel: "/cmd_vel_smoothed",
    blade_speed: "/cmd/lame_speed",

    gps: "/gps/fix",
    imu: "/imu/data",

    scan: "/scan",
    costmap: "/local_costmap/costmap"

};

export function getTopic(key) {

    return Topics[key] || null;

}