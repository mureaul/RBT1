/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/command/stopButton.js
 *
 * Emergency Stop Widget
 ******************************************************************************/

import { log } from "../../core/utils.js";
import { emergencyStop } from "../../core/ros.js";
import { onUI, offUI, getUIState } from "../../core/state.js";

/******************************************************************************
 * PRIVATE STATE
 ******************************************************************************/
let root = null;
let button = null;

/******************************************************************************
 * CREATE (Structure Unifiée Premium & Sécurité Industrielle)
 ******************************************************************************/
export function createStopButton() {
    return `
<section class="card stop-card">
    <div class="stop-header">
        <h3>🚨 &nbsp; Emergency Stop</h3>
    </div>

    <div class="stop-body">
        <div class="stop-action-container">
            <button id="stop-button" class="stop-button" aria-label="Emergency Stop">
                <span>STOP</span>
            </button>
        </div>

        <div class="stop-details-grid">
            <div class="stop-sub-grid">
                <div class="stop-values-block format-left">
                    <span class="stop-label">Relay Status</span>
                    <span id="stop-status-text" class="stop-value">ESTOP READY</span>
                </div>
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm1-15v5h4v2h-6V7h2z"/>
                    </svg>
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
function initStopButton(container) {
    log("🛑 Stop button premium init");

    root = container;
    button = root.querySelector("#stop-button");

    if (!button) {
        console.error("StopButton : DOM not found");
        return;
    }

    button.addEventListener("click", onStopClicked);
    onUI("connected", renderStopButton);

    renderStopButton();
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
function renderStopButton() {
    if (!button || !root) return;

    const ui = getUIState();
    const statusText = root.querySelector("#stop-status-text");

    button.disabled = !ui.connected;

    if (ui.connected) {
        root.classList.remove("is-disabled");
        root.classList.add("is-active");
        if (statusText) statusText.textContent = "ESTOP ARMED";
    } else {
        root.classList.remove("is-active");
        root.classList.add("is-disabled");
        if (statusText) statusText.textContent = "DISCONNECTED";
    }
}

/******************************************************************************
 * EVENTS
 ******************************************************************************/
function onStopClicked() {
    emergencyStop();
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/
function destroyStopButton() {
    log("🧹 Stop button premium destroy");

    offUI("connected", renderStopButton);
    button?.removeEventListener("click", onStopClicked);

    button = null;
    root = null;
}

/******************************************************************************
 * API/EXPORT
 ******************************************************************************/
export const stopButtonWidget = {
    name: "stopButton",
    create: createStopButton,
    init: initStopButton,
    render: renderStopButton,
    destroy: destroyStopButton
};