/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/command/modeToggleWidget.js
 ******************************************************************************/

import { log } from "../core/utils.js";
import { getROS } from "../core/ros.js";

let root = null;
let modeLabel = null;
let toggleBtn = null;
let modeSubscriber = null;
let currentState = "IDLE";

function getRosInstance() { const ros = getROS(); return (ros && ros.isConnected) ? ros : null; }

function createModeToggle() {
    return `
<section class="card widgets-card">
    <div class="widgets-header"><h3>⚙️ &nbsp; System Mode</h3></div>
    <div class="mode-body">
        <div class="mode-status-display">
            <span id="mode-status-label" class="mode-value">AUTO</span>
        </div>
        <button id="mode-toggle-btn" class="btn-action">BASCULER MODE</button>
    </div>
</section>
`;
}

function initModeToggle(container) {
    root = container;
    modeLabel = root.querySelector("#mode-status-label");
    toggleBtn = root.querySelector("#mode-toggle-btn");

    let modeSubscriber = new ROSLIB.Topic({
        ros: getROS(),
        name: '/state',
        messageType: 'std_msgs/msg/String'
    });
    if(modeSubscriber){
        modeSubscriber.subscribe((msg) => {
            currentState = msg.data;
            render();
        });
    }
        
    if (toggleBtn) toggleBtn.addEventListener("click", onToggleClick);
    log("bouton créé");
}

function render() {
    if (!modeLabel || !root) return;
    modeLabel.textContent = currentState;
    const card = root.querySelector(".mode-toggle-card");
    if (card) card.className = `card mode-toggle-card mode-${currentState.toLowerCase()}`;
}

function onToggleClick() {
    // Instanciation à la volée (identique à votre code qui fonctionne)
    let modeService = new ROSLIB.Service({
        ros: getRosInstance(),
        name: '/mode_manager/toggle_mode',
        serviceType: 'std_srvs/srv/Trigger'
    });

    modeService.callService(new ROSLIB.ServiceRequest({}), (result) => {
        if (result.success) {
            currentState = result.message;
            render();
        } else {
            log("❌ Erreur lors du changement de mode.");
        }
    });
}

function destroyModeToggle() {
    if (modeSubscriber) modeSubscriber.unsubscribe();
    if (toggleBtn) toggleBtn.removeEventListener("click", onToggleClick);
    root = modeLabel = toggleBtn = modeSubscriber = null;
}

export const modeToggleWidget = {
    name: "ModeToggle",
    create: createModeToggle,
    init: initModeToggle,
    render: render,
    destroy: destroyModeToggle
};