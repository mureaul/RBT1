/******************************************************************************
 * RBT1 Robot Control Interface
 * core/config.js
 *
 * Central Configuration Manager
 ******************************************************************************/

import { log } from "./utils.js";
import { emit, on, off } from "./events.js";

/******************************************************************************
 * PRIVATE STATE
 ******************************************************************************/

let config = {};

/******************************************************************************
 * INIT
 ******************************************************************************/

export function initConfig(initialConfig) {

    config = structuredClone(initialConfig);

    log("⚙ Config manager initialized");

}

/******************************************************************************
 * GET FULL CONFIG
 ******************************************************************************/

export function getConfig() {

    return config;

}

/******************************************************************************
 * GET VALUE
 ******************************************************************************/

export function getValue(path, defaultValue = null) {

    const value = path
        .split(".")
        .reduce((obj, key) => obj?.[key], config);

    return value === undefined ? defaultValue : value;

}

/******************************************************************************
 * SET VALUE
 ******************************************************************************/

export function setValue(path, value) {

    const keys = path.split(".");

    let obj = config;

    while (keys.length > 1) {

        const key = keys.shift();

        if (!(key in obj))
            obj[key] = {};

        obj = obj[key];

    }

    obj[keys[0]] = value;

    // Compatibilité
    emit("config:changed", {
        path,
        value,
        config
    });

    // Nouvelle API
    emitBranch(path, value);

}

/******************************************************************************
 * MERGE
 ******************************************************************************/

export function mergeConfig(values) {

    config = {

        ...config,

        ...values

    };

    emit("config:merged", config);
    emit("config", getConfig());

}

/******************************************************************************
 * EXPORT
 ******************************************************************************/

export function exportConfig() {

    return structuredClone(config);

}

/******************************************************************************
 * IMPORT
 ******************************************************************************/

export function importConfig(newConfig) {

    config = structuredClone(newConfig);

    emit("config:imported", config);
    emit("config", getConfig());

}

/******************************************************************************
 * RESET
 ******************************************************************************/

export function resetConfig(defaultConfig) {

    config = structuredClone(defaultConfig);

    emit("config:reset", config);
    emit("config", getConfig());

}

/******************************************************************************
 * INTERNAL
 ******************************************************************************/

function emitBranch(path, value) {

    emit("config", getConfig());

    const keys = path.split(".");

    let current = "";

    keys.forEach((key, index) => {

        current += (index ? "." : "") + key;

        emit(`config.${current}`, getValue(current));

    });

}

/******************************************************************************
 * LISTENERS
 ******************************************************************************/



export function onConfigChanged(callback) {

    on("config", callback);

}

export function offConfigChanged(callback) {

    off("config", callback);

}

export function onConfig(path, callback) {

    on(`config.${path}`, callback);

}

export function offConfig(path, callback) {

    off(`config.${path}`, callback);

}