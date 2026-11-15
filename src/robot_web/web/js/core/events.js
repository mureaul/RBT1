/******************************************************************************
 * RBT1 Robot Control Interface
 * core/events.js
 *
 * EventBus central
 ******************************************************************************/

const listeners = {};

/******************************************************************************
 * SUBSCRIBE
 ******************************************************************************/

export function on(event, callback) {

    if (!listeners[event]) {

        listeners[event] = [];

    }

    listeners[event].push(callback);

}

/******************************************************************************
 * UNSUBSCRIBE
 ******************************************************************************/

export function off(event, callback) {

    if (!listeners[event]) return;

    listeners[event] =
        listeners[event].filter(cb => cb !== callback);

}

/******************************************************************************
 * EMIT
 ******************************************************************************/

export function emit(event, data = null) {

    if (!listeners[event]) return;

    listeners[event].forEach(cb => {

        try {

            cb(data);

        }

        catch (e) {

            console.error(e);

        }

    });

}