/******************************************************************************
 * widgets/settings/wifi.js
 ******************************************************************************/

import { log } from "../../core/utils.js";
import { getFeedbackState, onFeedback, offFeedback } from "../../core/state.js";
import { getROS } from "../../core/ros.js";

let root = null;

let wifiSvgElement = null;
let watchdogInterval = null;
let isWifiNodeActive = false;

// Configuration du nœud surveillé
const NODE_WIFI = "wifi_monitor"; 

export const wifiIconWidget = {
    name: "WiFi Icon Widget",
    create: createWifiIconWidget,
    init: initWifiIconWidget,
    render: renderWifiIconWidget,
    destroy: destroyWifiIconWidget
};

function getRosInstance() {
    const ros = getROS();
    if (ros && ros.isConnected) return ros;
    return null;
}

/******************************************************************************
 * CREATE
 ******************************************************************************/
export function createWifiIconWidget() {
    return `
<section class="card wifi-card">
    <div class="wifi-body">
        <div class="wifi-main-row">
            <div class="wifi-icon-container">
                <svg id="wifi-svg" class="wifi-svg" viewBox="0 0 60 60" width="36" height="36" xmlns="http://www.w3.org/2000/svg" title="WiFi - Déconnecté">
                    <defs>
                        <linearGradient id="wifi-glow-green" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#52f28b"/>
                            <stop offset="100%" stop-color="#1e8449"/>
                        </linearGradient>
                        <linearGradient id="wifi-glow-orange" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#ffca28"/>
                            <stop offset="100%" stop-color="#d35400"/>
                        </linearGradient>
                        <linearGradient id="wifi-glow-red" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#ff6b6b"/>
                            <stop offset="100%" stop-color="#922b21"/>
                        </linearGradient>
                        <linearGradient id="wifi-glow-gray" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#a0a0a048"/>
                            <stop offset="100%" stop-color="#6060606d"/>
                        </linearGradient>
                        <filter id="wifi-shadow">
                            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.5"/>
                        </filter>
                    </defs>
                    <!-- Icône WiFi stylisée avec barres de signal modulables -->
                    <path class="wifi-arc wifi-bar-1" d="M30,45 A2,2 0 0,1 30,41 A2,2 0 0,1 30,45 Z" filter="url(#wifi-shadow)"/>
                    <path class="wifi-arc wifi-bar-2" d="M21,34 C25,30 35,30 39,34 L42,30 C36,24 24,24 18,30 Z" opacity="0.3" id="wifi-signal-arc-2"/>
                    <path class="wifi-arc wifi-bar-3" d="M15,27 C21,21 39,21 45,27 L48,23 C40,15 20,15 12,23 Z" opacity="0.3" id="wifi-signal-arc-3"/>
                    <path class="wifi-arc wifi-bar-4" d="M9,20 C17,11 43,11 51,20 L54,16 C43,5 17,5 6,16 Z" opacity="0.3" id="wifi-signal-arc-4"/>
                </svg>
            </div>
        </div>
    </div>
</section>
`;
}

/******************************************************************************
 * INIT
 ******************************************************************************/
export function initWifiIconWidget() {
    log("📶 WiFi Icon widget init");
    
    root = document.querySelector(".wifi-card") || document.body;
    wifiSvgElement = root.querySelector("#wifi-svg");

    isWifiNodeActive = false;

    checkActiveNodes();
    watchdogInterval = setInterval(checkActiveNodes, 3000);

    onFeedback("wifi", renderWifiIconWidget);
    renderWifiIconWidget();
}

/******************************************************************************
 * NODE MONITORING
 ******************************************************************************/
function checkActiveNodes() {
    const ros = getRosInstance();
    if (!ros) {
        isWifiNodeActive = false;
        renderNodeMonitoring();
        return;
    }

    ros.getNodes((nodes) => {
        isWifiNodeActive = nodes.some(n => n.includes(NODE_WIFI));
        renderNodeMonitoring();
    }, () => {
        isWifiNodeActive = false;
        renderNodeMonitoring();
    });
}

function renderNodeMonitoring() {
    if (!root) return;
    /*const pendingBox = root.querySelector("#wifi-pending-box");
    const missingNodesListElement = root.querySelector("#wifi-missing-nodes-list");
    const isMissing = !isWifiNodeActive;

    if (pendingBox) {
        if (isMissing) {
            if (missingNodesListElement) {
                missingNodesListElement.innerHTML = `&nbsp;/${NODE_WIFI}`;
            }
            pendingBox.style.display = "block";
        } else {
            pendingBox.style.display = "none";
        }
    }*/

    renderWifiIconWidget();
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
export function renderWifiIconWidget() {
    if (!root) return;

    const feedback = getFeedbackState();
    const wifi = feedback.wifi ?? {};
    
    const ssid = wifi.ssid ?? "Déconnecté";
    const ip = wifi.ip_address ?? "0.0.0.0";
    const rssi = wifi.rssi ?? -100; // en dBm
    
    const isConnected = rssi > -90 && ssid !== "Déconnecté";
    const stateText = isConnected ? "Connecté" : "Hors ligne";

    // Construction de l'infobulle (tooltip) au survol regroupant les informations détaillées
    if (wifiSvgElement) {
        wifiSvgElement.setAttribute("title", `WiFi: ${ssid}\nÉtat: ${stateText}\nIP: ${ip}\nSignal: ${rssi} dBm`);
    }
    
    const arcs = root.querySelectorAll(".wifi-arc");
    const targetGradient = isWifiNodeActive ? "url(#wifi-glow-green)" : "url(#wifi-glow-gray)";

    arcs.forEach(arc => {
        arc.setAttribute("fill", targetGradient);
    });


    // Gestion visuelle des arcs de signal selon le RSSI
    const arc2 = root.querySelector("#wifi-signal-arc-2");
    const arc3 = root.querySelector("#wifi-signal-arc-3");
    const arc4 = root.querySelector("#wifi-signal-arc-4");

    if (arc2 && arc3 && arc4) {
        if (rssi >= -80) arc2.style.opacity = "1"; else arc2.style.opacity = "0.3";
        if (rssi >= -70) arc3.style.opacity = "1"; else arc3.style.opacity = "0.3";
        if (rssi >= -60) arc4.style.opacity = "1"; else arc4.style.opacity = "0.3";
    }

    root.classList.remove("status-low", "status-orange", "status-green", "is-disconnected");
    
    if (!isWifiNodeActive || !isConnected) {
        root.classList.add("is-disconnected");
    } else if (rssi < -75) {
        root.classList.add("status-low");
    } else if (rssi < -65) {
        root.classList.add("status-orange");
    } else {
        root.classList.add("status-green");
    }
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/
export function destroyWifiIconWidget() {
    log("🧹 WiFi Icon widget destroy");
    offFeedback("wifi", renderWifiIconWidget);
    
    if (watchdogInterval) {
        clearInterval(watchdogInterval);
        watchdogInterval = null;
    }
    
    root = null;
}