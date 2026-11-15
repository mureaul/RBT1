/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/command/joystick.js
 *
 * Command Joystick Widget
 ******************************************************************************/

import { log } from "../../core/utils.js";
import { getConfig } from "../../core/config.js";
import {
    getTargetState,
    setTargetState,
    onTargetChanged,
    offTargetChanged
} from "../../core/state.js";
import { getROS } from "../../core/ros.js"; 

/******************************************************************************
 * PRIVATE STATE
 ******************************************************************************/
let root = null;
let zone = null;
let nipple = null;
let linLabel = null;
let angLabel = null;
let currentMode = "IDLE"; // Mode par défaut


/******************************************************************************
 * CREATE (Identité Visuelle Unifiée)
 ******************************************************************************/
function createJoystick() {
    return `
<section class="card joystick-card">
    <div class="joystick-header" style="display: flex; justify-content: space-between; align-items: center;">
        <h3>🕹️ &nbsp; Joystick</h3>
    </div>

    <div class="joystick-body">
        <div class="joystick-container-pad">
            <div id="joystick-zone" class="joystick-zone"></div>
        </div>

        <div class="joystick-details-grid">
            <div class="linear-sub-grid">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue"><path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z"/></svg>
                </div>
                <div class="joystick-values-block format-left">
                    <span class="joystick-label">Linear</span>
                    <span id="linear-value" class="joystick-value">0.00</span>
                </div>
            </div>
            
            <div class="joystick-divider"></div>
            
            <div class="angular-sub-grid">
                <div class="joystick-values-block format-right">
                    <span class="joystick-label">Angular</span>
                    <span id="angular-value" class="joystick-value">0.00</span>
                </div>
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-4.54c-.26-.81-1.02-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V5h2c1.66 0 3 1.34 3 3v1.5c1.19.65 2 1.92 2 3.5 0 .91-.38 1.73-.9 2.39z"/></svg>
                </div>
            </div>
        </div>
    </div>
</section>
`;
}

/******************************************************************************
 * INIT
 ******************************************************************************/
function initJoystick(container) {
    log("🕹️ Joystick premium init");

    root = container;
    zone = root.querySelector("#joystick-zone");
    linLabel = root.querySelector("#linear-value");
    angLabel = root.querySelector("#angular-value");

    // Instanciation NippleJS aux couleurs de l'écosystème graphique
    nipple = nipplejs.create({
        zone,
        mode: "static",
        position: {
            left: "50%",
            top: "50%"
        },
        size: 140,
        color: "#29b6f6" // Teinte bleue lumineuse cohérente
    });

    nipple.on("move", onMove);
    nipple.on("end", onEnd);

    const modeSubscriber = new ROSLIB.Topic({
        ros: getROS(),
        name: '/state',
        messageType: 'std_msgs/String'
    });

    modeSubscriber.subscribe((msg) => {
        currentMode = msg.data;
        renderJoystick(); // Met à jour le comportement visuel
    });
    
    onTargetChanged(renderJoystick);
    renderJoystick();
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
function renderJoystick() {
    if (!root) return;

    const state = getTargetState();

    linLabel.textContent = (state.linear ?? 0).toFixed(2);
    angLabel.textContent = (state.angular ?? 0).toFixed(2);

    if (zone){
        const isManual = currentMode.toUpperCase() === "MANUAL";
        zone.classList.toggle("locked-joystick", !isManual);
    }
}

/******************************************************************************
 * MOVE
 ******************************************************************************/
function onMove(evt, data) {
    if (!data) return;

    const cfg = getConfig();
    const deadband = cfg.joystick.deadband;
    const expo = cfg.joystick.exponential;
    const maxLinear = cfg.limits.maxLinearSpeed;
    const maxAngular = cfg.limits.maxAngularSpeed;

    let distance = Math.min(data.distance / 120, 1);

    if (distance < deadband) {
        distance = 0;
    }

    distance = Math.pow(distance, expo);
    const angle = data.angle.radian;

    const linear = Math.sin(angle) * distance * maxLinear;
    const angular = -Math.cos(angle) * distance * maxAngular;

    setTargetState({
        linear,
        angular
    });
}

/******************************************************************************
 * END
 ******************************************************************************/
function onEnd() {
    setTargetState({
        linear: 0,
        angular: 0
    });
}

/******************************************************************************
 * DESTROY (Correction typo "destry" présente à l'origine)
 ******************************************************************************/
function destroyJoystick() {
    log("🧹 Destroy joystick premium");
    offTargetChanged(renderJoystick);
    if (nipple) nipple.destroy();
    nipple = zone = linLabel = angLabel = root = null;
}

/******************************************************************************
 * API/EXPORT
 ******************************************************************************/
export const joystickWidget = {
    name: "Joystick",
    create: createJoystick,
    init: initJoystick,
    render: renderJoystick,
    destroy: destroyJoystick
};