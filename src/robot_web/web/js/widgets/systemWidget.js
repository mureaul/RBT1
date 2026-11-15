/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/telemetry/systemWidget.js
 *
 * Raspberry Pi System Monitor Widget (Identité Premium & Correction Rétractation)
 ******************************************************************************/

import { log } from "../core/utils.js";
import { getFeedbackState, onFeedback, offFeedback } from "../core/state.js";
import { getROS } from "../core/ros.js"; 

/******************************************************************************
 * PRIVATE STATE
 ******************************************************************************/
let root = null;
let cpuLabel = null;
let ramLabel = null;
let tempLabel = null;
let watchdogInterval = null; 

let isNodeAliveInGraph = false; 
let lastReceivedTime = 0;       

const REQUIRED_NODE = "/system_monitor_node";
const NODE_TIMEOUT_MS = 3000;  

/******************************************************************************
 * API
 ******************************************************************************/
export const systemWidget = {
    name: "System Widget",
    create: createSystemWidget,
    init: initSystemWidget,
    render: renderSystemWidget,
    destroy: destroySystemWidget
};

function getRosInstance() {
    const ros = getROS();
    if (ros && ros.isConnected) return ros;
    return null;
}

/******************************************************************************
 * CREATE
 ******************************************************************************/
export function createSystemWidget() {
    return `
<section class="card system-card widget-state-pending">
    <div class="system-header">
        <h3>🍓 &nbsp; RPi System</h3>
    </div>

    <div class="system-body">
        <div class="system-columns-grid">
            
            <!-- CPU Load -->
            <div class="system-column-item" id="sys-block-cpu">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-status">
                        <path d="M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2h-2V9h2V7h-2V5c0-1.1-.9-2-2-2h-2V1h-2v2H9V1H7v2H5c-1.1 0-2 .9-2 2v2H1v2h2v2H1v2h2v2H1v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2v2h2v-2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2zm-4 6H5V5h14v12z"/>
                    </svg>
                </div>
                <div class="system-values-block">
                    <span class="system-label">CPU Load</span>
                    <div class="system-value-wrapper">
                        <span id="system-cpu" class="system-value">--</span>
                        <span class="system-unit">%</span>
                    </div>
                </div>
            </div>

            <!-- RAM Usage -->
            <div class="system-column-item" id="sys-block-ram">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-status">
                        <path d="M19 15c-1.1 0-2 .9-2 2v2H7v-2c0-1.1-.9-2-2-2s-2 .9-2 2v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2zM7 7h10V5H7v2zm14-4H3c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 7H3V5h18v5z"/>
                    </svg>
                </div>
                <div class="system-values-block">
                    <span class="system-label">RAM Usage</span>
                    <div class="system-value-wrapper">
                        <span id="system-ram" class="system-value">--</span>
                        <span class="system-unit">%</span>
                    </div>
                </div>
            </div>

            <!-- CPU Temp -->
            <div class="system-column-item" id="sys-block-temp">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-status">
                        <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-3 7c-1.66 0-3-1.34-3-3 0-1.12.61-2.1 1.5-2.58V5c0-.28.22-.5.5-.5s.5.22.5.5v6.42c.89.48 1.5 1.46 1.5 2.58 0 1.66-1.34 3-3 3z"/>
                    </svg>
                </div>
                <div class="system-values-block">
                    <span class="system-label">CPU Temp</span>
                    <div class="system-value-wrapper">
                        <span id="system-temp" class="system-value">--</span>
                        <span class="system-unit">°C</span>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Conteneur d'état en attente -->
    <div class="widget-pending-container" id="system-pending-box">
        <div class="widget-pending-title">
            <span class="pending-pulse-dot"></span>
            En attente du nœud : <span style="font-family: monospace; opacity: 0.85;">/system_monitor_node</span>
        </div>
    </div>
</section>
`;
}

/******************************************************************************
 * INIT
 ******************************************************************************/
export function initSystemWidget(container) {
    log("🍓 System widget premium init");
    root = container;

    cpuLabel = root.querySelector("#system-cpu");
    ramLabel = root.querySelector("#system-ram");
    tempLabel = root.querySelector("#system-temp");

    isNodeAliveInGraph = false;
    lastReceivedTime = 0;

    onFeedback("system", handleIncomingData);

    checkActiveNodes();
    watchdogInterval = setInterval(checkActiveNodes, 3000);

    applyPendingState();
}

function handleIncomingData() {
    lastReceivedTime = Date.now();
    renderSystemWidget();
}

function checkActiveNodes() {
    const ros = getRosInstance();
    if (!ros) {
        isNodeAliveInGraph = false;
        applyPendingState();
        return;
    }

    ros.getNodes((nodes) => {
        isNodeAliveInGraph = nodes.includes(REQUIRED_NODE);
        renderSystemWidget();
    }, (err) => {
        console.error("[SYSTEM-WIDGET] Erreur getNodes :", err);
        isNodeAliveInGraph = false;
        applyPendingState();
    });
}

function applyPendingState() {
    if (!root) return;
    const cardElement = root.querySelector(".system-card");
    if (cardElement && !cardElement.classList.contains("widget-state-pending")) {
        cardElement.classList.remove("widget-state-active");
        cardElement.classList.add("widget-state-pending");
    }
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
export function renderSystemWidget() {
    if (!root || !cpuLabel) return;

    const cardElement = root.querySelector(".system-card");
    const hasFreshData = (Date.now() - lastReceivedTime) < NODE_TIMEOUT_MS;
    const isPending = !isNodeAliveInGraph || !hasFreshData;

    // GESTION ETAT CARD (Affiche/Masque uniquement le footer via la classe CSS)
    if (cardElement) {
        if (isPending) {
            if (!cardElement.classList.contains("widget-state-pending")) {
                cardElement.classList.remove("widget-state-active");
                cardElement.classList.add("widget-state-pending");
            }
        } else {
            if (cardElement.classList.contains("widget-state-pending")) {
                cardElement.classList.remove("widget-state-pending");
                cardElement.classList.add("widget-state-active");
            }
        }
    }

    const cpuBlock = root.querySelector("#sys-block-cpu");
    const ramBlock = root.querySelector("#sys-block-ram");
    const tempBlock = root.querySelector("#sys-block-temp");

    // SI INACTIF : On bascule à '--' sans bloquer ni rétracter la carte
    if (isPending) {
        cpuLabel.textContent = "--";
        ramLabel.textContent = "--";
        tempLabel.textContent = "--";

        if (cpuBlock) cpuBlock.classList.remove("state-green", "state-red");
        if (ramBlock) ramBlock.classList.remove("state-green", "state-red");
        if (tempBlock) tempBlock.classList.remove("state-green", "state-orange", "state-red");
        return; // Fin du traitement (pas de données fraîches à exploiter)
    }

    // SI ACTIF : Rendu normal de l'identité premium
    const state = getFeedbackState();
    if (!state || !state.system) return;

    const system = state.system;

    cpuLabel.textContent = Math.round(system.cpu ?? 0);
    ramLabel.textContent = Math.round(system.ram ?? 0);
    tempLabel.textContent = Math.round(system.temp ?? 0);

    if (cpuBlock) {
        cpuBlock.classList.remove("state-green", "state-red");
        cpuBlock.classList.add(system.cpu > 90 ? "state-red" : "state-green");
    }
    if (ramBlock) {
        ramBlock.classList.remove("state-green", "state-red");
        ramBlock.classList.add(system.ram >= 65 ? "state-red" : "state-green");
    }
    if (tempBlock) {
        tempBlock.classList.remove("state-green", "state-orange", "state-red");
        if (system.temp < 60) tempBlock.classList.add("state-green");
        else if (system.temp >= 60 && system.temp < 65) tempBlock.classList.add("state-orange");
        else tempBlock.classList.add("state-red");
    }
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/
export function destroySystemWidget() {
    log("🧹 System widget premium destroy");
    offFeedback("system", handleIncomingData);
    if (watchdogInterval) {
        clearInterval(watchdogInterval);
        watchdogInterval = null;
    }
    isNodeAliveInGraph = false;
    cpuLabel = null; ramLabel = null; tempLabel = null; root = null;
}