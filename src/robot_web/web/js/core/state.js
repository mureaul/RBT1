/******************************************************************************
 * RBT1 Robot Control Interface
 * core/state.js
 *
 * Central State Manager
 *
 * Source unique de vérité de l'application.
 *
 *  - targetState    → commandes robot
 *  - feedbackState  → retours ROS
 *  - uiState        → état interface
 *
 ******************************************************************************/

import { emit, on, off } from "./events.js";

/******************************************************************************
 * PRIVATE STATE
 ******************************************************************************/

const targetState = {
    linear: 0,
    angular: 0,
    blade: 0
};

const feedbackState = {
    battery: null,
    gps: null,
    imu: null,
    fsm: null,
    mode: null,
    wheelLeft: 0,
    wheelRight: 0,
    bladeSpeed: 0,
    system: {
        cpu: 0,
        ram: 0,
        temp: 0
    },
    lidar: {
        angle_min: -3.14,
        angle_increment: 0.008,
        ranges: null,
        intensities: null,
        t: 1
    },
    wifi: {
        ssid: "deconnecte",
        ip: "0.0.0.0",
        rssi: -100
    }
};

const uiState = {
    page: "command",
    connected: false,
    fullscreen: false,
    debug: false,
    theme: "dark",
    sidebarCollapsed: false
};

let lastUserInputTime = Date.now();

/*****************************************************************************
 * WATCHDOG
 * ***************************************************************************/

export function markUserInput() {
    lastUserInputTime = Date.now();
}

export function getLastInputTime() {
    return lastUserInputTime;
}

/******************************************************************************
 * INTERNAL
 ******************************************************************************/

function emitGroup(prefix, object) {

    emit(prefix, structuredClone(object));

    Object.entries(object).forEach(([key, value]) => {

        emit(`${prefix}.${key}`, value);

    });

}

/******************************************************************************
 * TARGET STATE
 ******************************************************************************/

export function getTargetState() {

    return structuredClone(targetState);

}

export function setTargetState(values = {}) {

    let changed = false;

    Object.entries(values).forEach(([key, value]) => {

        if (targetState[key] !== value) {

            targetState[key] = value;
            changed = true;

        }

    });

    if (changed) {

        emitGroup("state:target", targetState);

    }

}

export function resetTargetState() {

    targetState.linear = 0;
    targetState.angular = 0;
    targetState.blade = 0;

    emitGroup("state:target", targetState);

}

/******************************************************************************
 * FEEDBACK STATE
 ******************************************************************************/

export function getFeedbackState() {

    return structuredClone(feedbackState);

}

export function setFeedbackState(values = {}) {

    let changed = false;

    Object.entries(values).forEach(([key, value]) => {

        if (feedbackState[key] !== value) {

            feedbackState[key] = value;
            changed = true;

        }

    });

    if (changed) {

        emitGroup("state:feedback", feedbackState);

    }

}

/******************************************************************************
 * UI STATE
 ******************************************************************************/

export function getUIState() {

    return structuredClone(uiState);

}

export function setUIState(values = {}) {

    let changed = false;

    Object.entries(values).forEach(([key, value]) => {

        if (uiState[key] !== value) {

            uiState[key] = value;
            changed = true;

        }

    });

    if (changed) {

        emitGroup("state:ui", uiState);

    }

}

/******************************************************************************
 * SHORTCUTS
 ******************************************************************************/

export function setConnected(value) {

    setUIState({
        connected: value
    });

}

export function setCurrentPage(page) {

    setUIState({
        page
    });

}

/******************************************************************************
 * TARGET HELPERS
 ******************************************************************************/

export function setLinearSpeed(value) {

    setTargetState({
        linear: value
    });

}

export function setAngularSpeed(value) {

    setTargetState({
        angular: value
    });

}

export function setBladeSpeed(value) {

    setTargetState({
        blade: value
    });

}

/******************************************************************************
 * FEEDBACK HELPERS
 ******************************************************************************/

export function setBattery(value) {

    setFeedbackState({
        battery: value
    });

}

export function setGPS(value) {

    setFeedbackState({
        gps: value
    });

}

export function setIMU(value) {

    setFeedbackState({
        imu: value
    });

}

export function setFSM(value) {

    setFeedbackState({
        fsm: value
    });

}

export function setRobotMode(value) {
    setFeedbackState({
        mode: value
    });
}

export function setSystemTelemetry(values = {}) {
    setFeedbackState({
        system: {
            ...feedbackState.system,
            ...values
        }
    });
}

export function setLidarTelemetry(angleMin, angleIncrement, ranges, intensities) {
    // 1. Mise à jour directe des valeurs primitives et du tableau
    feedbackState.lidar.angle_min = angleMin;
    feedbackState.lidar.angle_increment = angleIncrement;
    feedbackState.lidar.ranges = ranges; // Assigne le tableau propre nettoyé
    feedbackState.lidar.intensities = intensities;
    feedbackState.lidar.t = Date.now();  // Force le changement de timestamp

    // 2. On court-circuite la validation superficielle et on émet DIRECTEMENT 
    // l'événement pour le widget LiDAR et l'événement global
    emit("state:feedback.lidar", structuredClone(feedbackState.lidar));
    emit("state:feedback", structuredClone(feedbackState));
}

/******************************************************************************
 * HELPERS
 ******************************************************************************/

export function toggleSidebar() {

    setUIState({sidebarCollapsed:!uiState.sidebarCollapsed});

}

/******************************************************************************
 * LISTENERS (GLOBAL)
 ******************************************************************************/

export function onTargetChanged(cb) {

    on("state:target", cb);

}

export function offTargetChanged(cb) {

    off("state:target", cb);

}

export function onFeedbackChanged(cb) {

    on("state:feedback", cb);

}

export function offFeedbackChanged(cb) {

    off("state:feedback", cb);

}

export function onUIChanged(cb) {

    on("state:ui", cb);

}

export function offUIChanged(cb) {

    off("state:ui", cb);

}

/******************************************************************************
 * LISTENERS (PROPERTY)
 ******************************************************************************/

export function onTarget(key, cb) {

    on(`state:target.${key}`, cb);

}

export function offTarget(key, cb) {

    off(`state:target.${key}`, cb);

}

export function onFeedback(key, cb) {

    on(`state:feedback.${key}`, cb);

}

export function offFeedback(key, cb) {

    off(`state:feedback.${key}`, cb);

}

export function onUI(key, cb) {

    on(`state:ui.${key}`, cb);

}

export function offUI(key, cb) {

    off(`state:ui.${key}`, cb);

}

/******************************************************************************
 * SNAPSHOT
 ******************************************************************************/

export function exportState() {

    return {

        targetState: getTargetState(),

        feedbackState: getFeedbackState(),

        uiState: getUIState()

    };

}

/******************************************************************************
 * DEBUG
 ******************************************************************************/

export function dumpState() {

    console.table({

        ...targetState,

        ...feedbackState,

        ...uiState

    });

}