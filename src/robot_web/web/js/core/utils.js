/**
 * RBT1 Utils
 */

export function log(...args) {

    console.log("[RBT1]", ...args);

}

export function clamp(value, min, max) {

    return Math.min(Math.max(value, min), max);

}

export function now() {

    return performance.now();

}