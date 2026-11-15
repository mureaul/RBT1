/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/icons/modeToggleIconWidget.js
 *
 * Mode Toggle Icon Widget (Topbar - Clic enabled) - Minimal LED Style with Pulse
 ******************************************************************************/

import { getROS } from "../../core/ros.js";
import { log } from "../../core/utils.js";

let modeSubscriber = null;
let currentState = "IDLE";
let isSubscribed = false;

export const modeToggleIconWidget = {
    name: "Mode Icon Widget",
    init: initModeIconWidget,
    create: createModeIconWidget,
    render: renderModeIcon,
    destroy: destroyModeIconWidget
};

function getRosInstance() { 
    const ros = getROS(); 
    return (ros && ros.isConnected) ? ros : null; 
}

function createModeIconWidget() {
    return `
        <div id="topbar-mode-icon-container" 
             class="mode-minimal-wrapper mode-idle" 
             style="cursor: pointer; pointer-events: auto !important; position: relative; z-index: 9999;" 
             data-mode="IDLE">
            <div class="mode-led-indicator"></div>
            <span id="topbar-mode-text" class="topbar-mode-value" style="pointer-events: none;">IDLE</span>
        </div>
    `;
}

function initModeIconWidget() {
    log("⚙️ Init ModeIconWidget démarré");

    document.removeEventListener("pointerdown", handleGlobalClick);
    document.addEventListener("pointerdown", handleGlobalClick);

    trySubscribeROS();

    const rosCheckInterval = setInterval(() => {
        if (isSubscribed) {
            clearInterval(rosCheckInterval);
            return;
        }
        trySubscribeROS();
    }, 500);

    renderModeIcon();
}

function trySubscribeROS() {
    if (isSubscribed) return;

    const ros = getRosInstance();
    if (!ros) return;

    modeSubscriber = new ROSLIB.Topic({
        ros: ros,
        name: '/state',
        messageType: 'std_msgs/msg/String'
    });

    modeSubscriber.subscribe((msg) => {
        if (msg && msg.data !== undefined) {
            currentState = String(msg.data).trim();
            renderModeIcon();
        }
    });

    isSubscribed = true;
}

function handleGlobalClick(event) {
    const container = event.target.closest("#topbar-mode-icon-container");
    if (!container) return;
    onToggleClick();
}

function onToggleClick() {
    const ros = getRosInstance();
    if (!ros) {
        log("❌ Impossible d'appeler le service : ROS non connecté");
        return;
    }

    let modeService = new ROSLIB.Service({
        ros: ros,
        name: '/mode_manager/toggle_mode',
        serviceType: 'std_srvs/srv/Trigger'
    });

    modeService.callService(new ROSLIB.ServiceRequest({}), (result) => {
        if (!(result && result.success)) {
            log("❌ Erreur lors de l'appel au service de bascule.");
        }
    });
}

function renderModeIcon() {
    const container = document.getElementById("topbar-mode-icon-container");
    if (!container) return;
    
    const textSpan = container.querySelector("#topbar-mode-text") || container.querySelector(".topbar-mode-value");
    const isAuto = (currentState.toUpperCase() === "AUTO");
    const isManual = (currentState.toUpperCase() === "MANUAL");


    container.dataset.mode = currentState;
    if (isAuto) {container.className = `mode-minimal-wrapper mode-auto`;}
    if (isManual) {container.className = `mode-minimal-wrapper mode-manual`;}
    if (!isAuto && !isManual){container.className = `mode-minimal-wrapper mode-idle`;}

    if (textSpan) {
        textSpan.textContent = currentState;
    }
}

function destroyModeIconWidget() {
    document.removeEventListener("pointerdown", handleGlobalClick);
    if (modeSubscriber) modeSubscriber.unsubscribe();
    modeSubscriber = null;
    isSubscribed = false;
}