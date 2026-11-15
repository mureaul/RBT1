/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/bringupOrchestratorWidget.js
 *
 * Bringup Orchestrator Watchdog - Basé exclusivement sur la détection des nœuds
 * actifs via l'API fiable de rosNodeState.js
 ******************************************************************************/

import { log } from "../core/utils.js";
import { AppState } from "../core/app.js"; 
import { getROS } from "../core/ros.js";    

/******************************************************************************
 * ÉTAT PRIVÉ
 ******************************************************************************/
let root = null;
let watchdogInterval = null;

// Structure de suivi : on associe chaque brique système exclusivement à son NOM DE NŒUD ROS2
const itemsStatus = {
    // 1. Core & Utils
    heartbeat: { name: "Heartbeat Node", targetNode: "/heartbeat_node", state: false, group: "core" },
    sys_monitor: { name: "System Monitor", targetNode: "/system_monitor_node", state: false, group: "core" },
    weather: { name: "Weather Monitor", targetNode: "/weather_monitor", state: false, group: "core" },
    robot_desc: { name: "URDF Model (State Pub)", targetNode: "/robot_state_publisher", state: false, group: "core" },

    // 2. micro-ROS & Hardware
    microros_lora: { name: "ESP32 LoRa (IMU)", targetNode: "/esp32_lora", state: false, group: "hardware" },
    microros_motors: { name: "ESP32 Motors (Speed)", targetNode: "/esp32_diff_drive", state: false, group: "hardware" },
    lidar: { name: "RPLidar Scan", targetNode: "/rplidar_node", state: false, group: "hardware" },
    gps: { name: "Ublox GPS Fix", targetNode: "/ublox_gps_node", state: false, group: "hardware" },

    // 3. Services & Data
    hist_ambiance: { name: "Historian Ambiance", targetNode: "/ambiance_historian", state: false, group: "services" },
    hist_blade: { name: "Historian Blade", targetNode: "/blade_historian", state: false, group: "services" },
    blade_relay: { name: "Blade Relay (Web)", targetNode: "/blade_relay", state: false, group: "services" },
    workcells: { name: "Workcell Provider", targetNode: "/workcell_provider", state: false, group: "services" },
    gps_recorder: { name: "GPS Zone Recorder", targetNode: "/gps_zone_recorder_node", state: false, group: "services" },
    gps_tracker: { name: "GPS Missions Tracker", targetNode: "/gps_tracker_node", state: false, group: "services" },
    map_gen: { name: "Map Generator (KML)", targetNode: "/map_generator", state: false, group: "services" },

    // 4. Navigation & Autonomy
    ekf_pose: { name: "EKF Pose (Localization)", targetNode: "/ekf_node", state: false, group: "nav2" },
    nav2_manager: { name: "Nav2 Lifecycle Mgr", targetNode: "/lifecycle_manager_navigation", state: false, group: "nav2" },
    amcl: { name: "AMCL (Localization Node)", targetNode: "/amcl", state: false, group: "nav2" },
    bt_navigator: { name: "Behavior Tree Navigator", targetNode: "/bt_navigator", state: false, group: "nav2" },

    // 5. Missions
    mission_mgr: { name: "Mission Manager", targetNode: "/mission_manager_node", state: false, group: "missions" },
    mission_orch: { name: "Mission Orchestrator", targetNode: "/mission_orchestrator_node", state: false, group: "missions" }
};

/******************************************************************************
 * API WIDGET
 ******************************************************************************/
export const bringupOrchestratorWidget = {
    name: "Bringup Orchestrator Watchdog",
    create: createBringupOrchestratorWidget,
    init: initBringupOrchestratorWidget,
    render: renderBringupOrchestratorWidget,
    destroy: destroyBringupOrchestratorWidget
};

function getRosInstance() {
    const ros = getROS();
    if (ros && ros.isConnected) return ros;
    return null;
}

/******************************************************************************
 * CREATE
 ******************************************************************************/
export function createBringupOrchestratorWidget() {
    return `
<section class="widgets-card bringup-card">
    <div class="widgets-header">
        <h3>🚜 &nbsp; Boot Séquenceur RBT1</h3>
        <span id="bringup-global-badge" class="bringup-global-badge" style="font-size: 0.72rem; padding: 0 8px; width: auto;">HORS-LIGNE</span>
    </div>

    <div class="widgets-body bringup-body">
        <div class="bringup-progress-wrapper">
            <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: rgba(255,255,255,0.5); text-transform: uppercase; margin-bottom: 6px;">
                <span>Progression du Bringup</span>
                <span id="bringup-percent-text" style="font-weight: bold; color: #10b981;">0%</span>
            </div>
            <div style="background: rgba(255,255,255,0.05); height: 6px; border-radius: 3px; overflow: hidden;">
                <div id="bringup-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #eab308 0%, #10b981 100%); transition: width 0.6s ease;"></div>
            </div>
        </div>

        <div class="bringup-grid">
            <div class="bringup-group">
                <div class="bringup-group-title">⚙️ Système & Coeur</div>
                <div id="group-core" class="bringup-items-container"></div>
            </div>
            <div class="bringup-group">
                <div class="bringup-group-title">🔌 Matériel & Capteurs</div>
                <div id="group-hardware" class="bringup-items-container"></div>
            </div>
            <div class="bringup-group">
                <div class="bringup-group-title">💾 Historiens & Services</div>
                <div id="group-services" class="bringup-items-container"></div>
            </div>
            <div class="bringup-group">
                <div class="bringup-group-title">🗺️ Cartographie & NAV2</div>
                <div id="group-nav2" class="bringup-items-container"></div>
            </div>
            <div class="bringup-group" style="border: none;">
                <div class="bringup-group-title">👑 Mission Manager & Orchestrateur</div>
                <div id="group-missions" class="bringup-items-container"></div>
            </div>
        </div>
    </div>
</section>
`;
}

/******************************************************************************
 * INIT
 ******************************************************************************/
export function initBringupOrchestratorWidget(container) {
    log("🔌 Bringup Watchdog (Pure Node Detection) init");
    root = container;

    generateItemsPlaceholders();

    // Premier appel direct puis rafraîchissement toutes les 4 secondes (synchro avec rosNodeState)
    checkRosGraphState();
    watchdogInterval = setInterval(checkRosGraphState, 4000);
}

/******************************************************************************
 * CRÉATION DES BADGES HTML DANS LE DOM
 ******************************************************************************/
function generateItemsPlaceholders() {
    if (!root) return;

    const groups = {
        core: root.querySelector("#group-core"),
        hardware: root.querySelector("#group-hardware"),
        services: root.querySelector("#group-services"),
        nav2: root.querySelector("#group-nav2"),
        missions: root.querySelector("#group-missions")
    };

    Object.values(groups).forEach(g => { if(g) g.innerHTML = ""; });

    Object.entries(itemsStatus).forEach(([key, item]) => {
        const parent = groups[item.group];
        if (!parent) return;

        const badgeHtml = `
            <div id="bringup-item-${key}" style="
                font-size: 0.65rem;
                font-weight: 500;
                padding: 4px 8px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                gap: 6px;
                background: rgba(255,255,255,0.02);
                border: 1px solid rgba(255,255,255,0.05);
                color: rgba(255,255,255,0.3);
                transition: all 0.25s ease;
            ">
                <span class="status-dot" style="width: 5px; height: 5px; border-radius: 50%; background: #64748b; transition: all 0.25s ease;"></span>
                ${item.name}
            </div>
        `;
        parent.insertAdjacentHTML('beforeend', badgeHtml);
    });
}

/******************************************************************************
 * DÉTECTION DIRECTE DES NŒUDS ACTIFS (Même logique que rosNodeState.js)
 ******************************************************************************/
function checkRosGraphState() {
    const ros = getRosInstance();
    if (!ros) {
        Object.keys(itemsStatus).forEach(key => { itemsStatus[key].state = false; });
        renderBringupOrchestratorWidget();
        return;
    }

    // Récupération unique et fiable des nœuds actifs du graphe ROS2
    ros.getNodes((activeNodes) => {
        const nodesList = activeNodes || [];

        Object.keys(itemsStatus).forEach(key => {
            const item = itemsStatus[key];
            // Validation stricte par correspondance exacte du nom du nœud
            item.state = nodesList.some(nodeName => nodeName === item.targetNode);
        });

        renderBringupOrchestratorWidget();
    }, (err) => {
        console.error("[BRINGUP-WATCHDOG] Erreur de récupération des nœuds :", err);
    });
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
export function renderBringupOrchestratorWidget() {
    if (!root) return;

    let totalItems = Object.keys(itemsStatus).length;
    let activeItemsCount = 0;

    Object.entries(itemsStatus).forEach(([key, item]) => {
        const badge = root.querySelector(`#bringup-item-${key}`);
        if (!badge) return;

        const dot = badge.querySelector(".status-dot");

        if (item.state) {
            activeItemsCount++;
            badge.style.color = "#10b981";
            badge.style.backgroundColor = "rgba(16, 185, 129, 0.05)";
            badge.style.borderColor = "rgba(16, 185, 129, 0.15)";
            if (dot) dot.style.background = "#10b981";
        } else {
            badge.style.color = "rgba(255,255,255,0.3)";
            badge.style.backgroundColor = "rgba(255,255,255,0.01)";
            badge.style.borderColor = "rgba(255,255,255,0.03)";
            if (dot) dot.style.background = "#64748b";
        }
    });

    const percentage = Math.round((activeItemsCount / totalItems) * 100);

    const progressBar = root.querySelector("#bringup-progress-bar");
    const percentText = root.querySelector("#bringup-percent-text");
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (percentText) percentText.textContent = `${percentage}%`;

    const globalBadge = root.querySelector("#bringup-global-badge");
    if (globalBadge) {
        const ros = getRosInstance();
        if (!ros) {
            globalBadge.textContent = "HORS-LIGNE";
            globalBadge.style.color = "#ef4444";
            globalBadge.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
        } else if (percentage === 100) {
            globalBadge.textContent = "READY ✔";
            globalBadge.style.color = "#10b981";
            globalBadge.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
        } else {
            globalBadge.textContent = `BOOTING (${activeItemsCount}/${totalItems})`;
            globalBadge.style.color = "#eab308";
            globalBadge.style.backgroundColor = "rgba(234, 179, 8, 0.1)";
        }
    }
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/
export function destroyBringupOrchestratorWidget() {
    log("🧹 Bringup Watchdog destroy");
    if (watchdogInterval) {
        clearInterval(watchdogInterval);
        watchdogInterval = null;
    }
    root = null;
}