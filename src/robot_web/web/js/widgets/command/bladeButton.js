/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/command/bladeButton.js
 *
 * Blade ON/OFF Quick Button Widget - 100% State.js Architecture
 ******************************************************************************/

import { log } from "../../core/utils.js";
import { getConfig, onConfig, offConfig } from "../../core/config.js";
import { 
    getTargetState, 
    setTargetState, 
    onTarget, 
    offTarget,
    getFeedbackState,
    onFeedback,
    offFeedback
} from "../../core/state.js";
import { getROS } from "../../core/ros.js"; 

/******************************************************************************
 * PRIVATE STATE
 ******************************************************************************/
let root = null;
let button = null;
let valueLabel = null;
let currentMode = "IDLE";
let modeSubscriber = null;

/******************************************************************************
 * API / EXPORT
 ******************************************************************************/
export const bladeButtonWidget = {
    name: "Blade Button",
    create: createBladeButton,
    init: initBladeButton,
    render: renderBladeButton,
    destroy: destroyBladeButton
};

/******************************************************************************
 * CREATE
 ******************************************************************************/
function createBladeButton() {
    // Note : Utilisation des classes communes card, header et body pour l'harmonisation
    return `
<section class="card bladebtn-card">
    <div class="bladebtn-header">
        <h3>🔪 &nbsp; BLADE CONTROLLER</h3>
    </div>

    <div class="bladebtn-body">
        
        <div id="blade-toggle-button" class="blade-toggle-container">
            <div class="blade-toggle-slider"></div>
        </div>

        <div class="blade-btn-columns-wrapper">
            
            <div class="blade-btn-column-item format-left">
                <span class="blade-btn-label">Blade Status</span>
                <span id="blade-status-text" class="blade-btn-status">READY</span>
            </div>

            <div class="blade-btn-column-item format-right">
                <span class="blade-btn-label">Current Speed</span>
                <div class="blade-btn-value-wrapper">
                    <span id="blade-feedback-value" class="blade-btn-value">0</span>
                    <span class="blade-btn-unit">RPM</span>
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
function initBladeButton(container) {
    log("🔪 Blade Button widget init");
    root = container;

    setTimeout(() => {
        button = root.querySelector("#blade-toggle-button");
        valueLabel = root.querySelector("#blade-feedback-value");

        if (!button || !valueLabel) return;

        onConfig("limits.maxBladeSpeed", renderBladeButton);
        onTarget("blade", renderBladeButton);
        onFeedback("blade_telemetry", renderBladeButton);

        button.addEventListener("click", onButtonClicked);
        renderBladeButton();
    }, 0);
        
    modeSubscriber = new ROSLIB.Topic({
        ros: getROS(),
        name: '/state',
        messageType: 'std_msgs/String'
    });
    
    modeSubscriber.subscribe((msg) => {
        currentMode = msg.data;
        renderBladeButton();
    });
        
}

/******************************************************************************
 * EVENTS
 ******************************************************************************/
function onButtonClicked() {
    const cfg = getConfig();
    const state = getTargetState();
    const maxSpeed = cfg.limits.maxBladeSpeed;
    
    setTargetState({ blade: (state.blade === 0) ? maxSpeed : 0 });
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
function renderBladeButton() {
    if (!button || !root) return;

    const target = getTargetState();
    const feedback = getFeedbackState();
    const cardSection = root.querySelector(".bladebtn-card");
    const statusText = root.querySelector("#blade-status-text");
    const btnText = root.querySelector("#blade-btn-text");
    
    let currentSpeed = 0;
    let espStatus = "";

    if (feedback.blade_telemetry) {
        try {
            const data = (typeof feedback.blade_telemetry === 'string') 
                ? JSON.parse(feedback.blade_telemetry) 
                : feedback.blade_telemetry;
            currentSpeed = data.cr !== undefined ? Number(data.cr) : 0;
            espStatus = data.st !== undefined ? String(data.st).toUpperCase() : "";
        } catch (err) {}
    }

    if (valueLabel) valueLabel.textContent = Math.round(currentSpeed);

    // Mise à jour visuelle des états
    if (target.blade > 0) {
        if (btnText) btnText.textContent = "STOP";
        cardSection.classList.add("is-active");
    } else {
        if (btnText) btnText.textContent = "START";
        cardSection.classList.remove("is-active");
    }

    if (statusText) {
        statusText.textContent = espStatus || (target.blade > 0 ? "STARTING..." : "READY");
        statusText.style.color = (espStatus === "ERROR" || espStatus === "FAULT") ? "#f44336" : "#29b6f6";
    }

    if (button){
        const isManual = currentMode.toUpperCase() === "MANUAL";
        button.classList.toggle("locked-blade-toggle", !isManual);
    }
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/
function destroyBladeButton() {
    offConfig("limits.maxBladeSpeed", renderBladeButton);
    offTarget("blade", renderBladeButton);
    offFeedback("blade_telemetry", renderBladeButton);
    if (button) button.removeEventListener("click", onButtonClicked);
    root = null;
}