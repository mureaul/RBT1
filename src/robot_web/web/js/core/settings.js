/**
 * ============================================================================
 * RBT1 Robot Control Interface
 * core/settings.js
 *
 * Charge et normalise toute la configuration de l'application.
 *
 * Une seule source de vérité :
 *      AppState.config
 * ============================================================================
 */

import { log } from "./utils.js";

/* ============================================================================
 * CONFIGURATION PAR DEFAUT
 * ==========================================================================*/

const DEFAULT_CONFIG = {

    rosbridge: {
        host: "localhost",
        port: 9090
    },

    publishRate: 3,

    limits: {
        maxLinearSpeed: 0.1,
        maxAngularSpeed: 0.8,
        maxBladeSpeed: 15000
    },

    joystick: {
        deadband: 0.05,
        exponential: 2.2
    },

    topics: {

        cmd_vel: "/cmd_vel_smoothed",

        blade_speed: "/cmd/lame_speed",

        gps: "/gps/fix",

        imu: "/imu/data",

        battery: "/battery",

        scan: "/scan",

        costmap: "/local_costmap/costmap",

        robot_mode: "/robot_mode",

        fsm: "/fsm"

    }

};

/* ============================================================================
 * CONFIG COURANTE
 * ==========================================================================*/

let CONFIG = structuredClone(DEFAULT_CONFIG);

/* ============================================================================
 * LOAD CONFIG
 * ==========================================================================*/

export async function loadConfig() {

    log("📦 Loading configuration...");

    try {

        const [settingsRes, topicsRes] = await Promise.all([

            fetch("/config/settings.json"),
            fetch("/config/topics.json")

        ]);

        /* -------------------------------------------------------------- */
        /* settings.json                                                  */
        /* -------------------------------------------------------------- */

        if (settingsRes.ok) {

            const s = await settingsRes.json();

            CONFIG.rosbridge.host =
                s.rosbridge_host ?? CONFIG.rosbridge.host;

            CONFIG.rosbridge.port =
                s.rosbridge_port ?? CONFIG.rosbridge.port;

            CONFIG.publishRate =
                s.publish_rate ?? CONFIG.publishRate;

            CONFIG.limits.maxLinearSpeed =
                s.max_linear_speed ?? CONFIG.limits.maxLinearSpeed;

            CONFIG.limits.maxAngularSpeed =
                s.max_angular_speed ?? CONFIG.limits.maxAngularSpeed;

            CONFIG.limits.maxBladeSpeed =
                s.max_blade_speed ?? CONFIG.limits.maxBladeSpeed;

            CONFIG.joystick.deadband =
                s.joystick_deadband ?? CONFIG.joystick.deadband;

            CONFIG.joystick.exponential =
                s.joystick_exponential ?? CONFIG.joystick.exponential;

            log("✔ settings.json loaded");

        }
        else {

            log("⚠ settings.json missing → defaults");

        }

        /* -------------------------------------------------------------- */
        /* topics.json                                                    */
        /* -------------------------------------------------------------- */

        if (topicsRes.ok) {

            const topics = await topicsRes.json();

            CONFIG.topics = {

                ...CONFIG.topics,

                ...topics

            };

            log("✔ topics.json loaded");

        }
        else {

            log("⚠ topics.json missing → defaults");

        }

    }
    catch (err) {

        console.error(err);

        log("❌ Configuration load failed");

    }

    validateConfig();

    log("📦 Final configuration :", CONFIG);

    return CONFIG;

}

/* ============================================================================
 * VALIDATION
 * ==========================================================================*/

function validateConfig() {

    if (CONFIG.publishRate < 1)
        CONFIG.publishRate = 1;

    if (CONFIG.publishRate > 50)
        CONFIG.publishRate = 50;

    if (CONFIG.limits.maxLinearSpeed <= 0)
        CONFIG.limits.maxLinearSpeed = 0.05;

    if (CONFIG.limits.maxAngularSpeed <= 0)
        CONFIG.limits.maxAngularSpeed = 0.8;

    if (CONFIG.limits.maxBladeSpeed <= 0)
        CONFIG.limits.maxBladeSpeed = 15000;

}

/* ============================================================================
 * GETTERS
 * ==========================================================================*/

export function getConfig() {

    return CONFIG;

}

export function getTopics() {

    return CONFIG.topics;

}

export function getRosbridgeConfig() {

    return CONFIG.rosbridge;

}

export function getJoystickConfig() {

    return CONFIG.joystick;

}

export function getLimits() {

    return CONFIG.limits;

}

export function getPublishRate() {

    return CONFIG.publishRate;

}