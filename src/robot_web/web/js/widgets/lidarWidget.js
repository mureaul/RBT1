/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/telemetry/lidarWidget.js
 *
 * LiDAR 2D Planar Scan Widget (Version avec Footer d'attente & Watchdog intégré)
 ******************************************************************************/

import { log } from "../core/utils.js";
import { onFeedback, offFeedback, getFeedbackState } from "../core/state.js";
import { getROS } from "../core/ros.js"; // Importation de l'instance ROS centralisée

let root = null;
let canvas = null;
let ctx = null;
let resizeObserver = null;
let isMotorActive = true;
let watchdogInterval = null;

// ÉTAT DU NŒUD (Double validation calquée sur systemWidget)
let isNodeAliveInGraph = false; 
let lastReceivedTime = 0;       

const REQUIRED_NODE = "/rplidar_node";
const NODE_TIMEOUT_MS = 3000; // Repli si pas de message pendant 3s

const MAX_RANGE_METERS = 4.0;
const SAFETY_RECT = {
    xMin: -0.25, xMax: 0.25,
    yMin: -0.10, yMax: 0.40
};

//API
export const lidarWidget = {
    name: "LiDAR Widget",
    create: createLidarWidget,
    init: initLidarWidget,
    render: renderLidarWidget,
    destroy: destroyLidarWidget
};

/**
 * Récupère l'instance ROS active et connectée selon l'architecture du projet
 */
function getRosInstance() {
    const ros = getROS();
    if (ros && ros.isConnected) return ros;
    return null;
}

export function createLidarWidget() {
    return `
<section class="card lidar-card widget-state-pending">
    <div class="lidar-header">
        <h3>⚡ &nbsp; LiDAR 2D Euclidean Scan</h3>
        
        <!-- Toggle maintenant replacé dans le header pour l'alignement à droite -->
        <div class="lidar-controls">
            <div class="slider-control">
                <span class="slider-label">Moteur</span>
                <label class="switch">
                    <input type="checkbox" id="switch-lidar-motor" checked>
                    <span class="slider round"></span>
                </label>
            </div>
        </div>
    </div>

    <!-- Le canvas est au niveau racine de la card, hors du body de texte -->
    <div class="lidar-canvas-wrapper">
        <canvas id="lidar-canvas"></canvas>
    </div>

    <div class="widget-pending-container" id="lidar-pending-box">
        <div class="widget-pending-title">
            <span class="pending-pulse-dot"></span>
            En attente du nœud : <span style="font-family: monospace;">${REQUIRED_NODE}</span>
        </div>
    </div>
</section>
`;
}

export function initLidarWidget(container) {
    log("⚡ LiDAR Euclidean widget init");
    root = container;
    canvas = root.querySelector("#lidar-canvas");
    ctx = canvas.getContext("2d");

    const switchMotor = root.querySelector("#switch-lidar-motor");
    if (switchMotor) switchMotor.addEventListener("change", handleMotorToggle);

    resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(canvas.parentElement);
    resizeCanvas();

    // Remise à zéro des états
    isNodeAliveInGraph = false;
    lastReceivedTime = 0;

    // Abonnement aux données réseau réelles
    onFeedback("lidar", handleIncomingData);

    // Watchdog réseau + graphe : interroge le master ROS toutes les 3 secondes
    checkActiveNodes();
    watchdogInterval = setInterval(checkActiveNodes, 3000);

    // Forcer le mode en attente immédiatement au chargement
    applyPendingState();
}

/******************************************************************************
 * CALLBACK RÉSEAU
 ******************************************************************************/
function handleIncomingData() {
    lastReceivedTime = Date.now(); 
    renderLidarWidget();
}

/******************************************************************************
 * WATCHDOG GRAPHE (Vérifie la présence du nœud dans ROS)
 ******************************************************************************/
function checkActiveNodes() {
    const ros = getRosInstance();
    
    if (!ros) {
        isNodeAliveInGraph = false;
        applyPendingState();
        return;
    }

    ros.getNodes((nodes) => {
        isNodeAliveInGraph = nodes.includes(REQUIRED_NODE);
        renderLidarWidget();
    }, (err) => {
        console.error("[LIDAR-WIDGET] Erreur getNodes :", err);
        isNodeAliveInGraph = false;
        applyPendingState();
    });
}

function applyPendingState() {
    if (!root) return;
    const cardElement = root.querySelector(".lidar-card");
    if (cardElement && !cardElement.classList.contains("widget-state-pending")) {
        cardElement.classList.remove("widget-state-active");
        cardElement.classList.add("widget-state-pending");
    }
}

function handleMotorToggle(e) {
    isMotorActive = e.target.checked;
    const serviceName = isMotorActive ? '/start_motor' : '/stop_motor';
    log(`[LiDAR] Moteur LiDAR -> Appel du service : ${serviceName}`);
    
    const ros = getRosInstance();
    if (ros) {
        const motorService = new ROSLIB.Service({
            ros: ros,
            name: serviceName, 
            serviceType: 'std_srvs/srv/Empty'
        });

        const request = new ROSLIB.ServiceRequest({});

        motorService.callService(request, (result) => {
            log(`[LiDAR] Service ${serviceName} exécuté avec succès.`);
        }, (error) => {
            console.error(`[LiDAR] Échec de l'appel au service ${serviceName} :`, error);
            isMotorActive = !isMotorActive;
            const switchMotor = root.querySelector("#switch-lidar-motor");
            if (switchMotor) switchMotor.checked = isMotorActive;
        });
    } else {
        console.warn("[LiDAR] ROS non connecté. Impossible d'appeler le service.");
        isMotorActive = !isMotorActive;
        const switchMotor = root.querySelector("#switch-lidar-motor");
        if (switchMotor) switchMotor.checked = isMotorActive;
    }
}

function resizeCanvas() {
    if (!canvas) return;
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const newWidth = Math.floor(rect.width);
    const newHeight = Math.floor(rect.height);

    if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        renderLidarWidget();
    }
}

function getIntensityColor(intensity, maxFrameIntensity) {
    const maxVal = maxFrameIntensity > 0 ? maxFrameIntensity : 100;
    let factor = intensity / maxVal;
    factor = Math.max(0, Math.min(1, factor));

    const r = 0;
    const g = Math.round(40 * (1 - factor) + (245 * factor));
    const b = Math.round(255 * (1 - factor) + (100 * factor));

    return `rgb(${r}, ${g}, ${b})`;
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
export function renderLidarWidget() {
    if (!canvas || !ctx || !root) return;

    const cardElement = root.querySelector(".lidar-card");
    const hasFreshData = (Date.now() - lastReceivedTime) < NODE_TIMEOUT_MS;

    // VERROU : Si le nœud n'est plus vu ou s'il n'y a plus de flux frais, on affiche le footer
    if (!isNodeAliveInGraph || !hasFreshData) {
        applyPendingState();
        // Optionnel : Efface le résidu de points obsolètes sur le canvas en laissant la grille en transparence légère
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return; 
    }

    // Le nœud est repéré et transmet activement
    if (cardElement) {
        cardElement.classList.remove("widget-state-pending");
        cardElement.classList.add("widget-state-active");
    }

    const state = getFeedbackState();
    const scan = state.lidar;
    if (!scan || !scan.ranges) return;

    const width = canvas.width;
    const height = canvas.height;
    const center = { x: width / 2, y: height / 2 };
    const scale = (Math.min(width, height) / 2) / MAX_RANGE_METERS;

    ctx.clearRect(0, 0, width, height);

    // Repère euclidien arrière-plan
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, center.y); ctx.lineTo(width, center.y);
    ctx.moveTo(center.x, 0); ctx.lineTo(center.x, height);
    ctx.stroke();

    for (let m = 1; m <= MAX_RANGE_METERS; m++) {
        ctx.beginPath();
        ctx.arc(center.x, center.y, m * scale, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // Dessin boîte de sécurité
    const rectW = (SAFETY_RECT.xMax - SAFETY_RECT.xMin) * scale;
    const rectH = (SAFETY_RECT.yMax - SAFETY_RECT.yMin) * scale;
    const rectX = center.x - (SAFETY_RECT.xMax * scale);
    const rectY = center.y - (SAFETY_RECT.yMax * scale); 

    ctx.strokeStyle = "rgba(255, 23, 68, 0.35)";
    ctx.strokeRect(rectX, rectY, rectW, rectH);

    // Nuage de points
    if (scan.ranges.length > 0) {
        let currentAngle = scan.angle_min;
        const maxFrameIntensity = scan.intensities && scan.intensities.length > 0 
            ? Math.max(...scan.intensities) 
            : 100;

        for (let i = 0; i < scan.ranges.length; i++) {
            const range = scan.ranges[i];
            const intensity = (scan.intensities && scan.intensities[i]) ? scan.intensities[i] : 0;

            if (range > 0.15 && range <= MAX_RANGE_METERS) {
                const x_robot = range * Math.cos(currentAngle);
                const y_robot = range * Math.sin(currentAngle);

                const pixelX = center.x + (y_robot * scale);
                const pixelY = center.y + (x_robot * scale);

                const isInsideSafetyRect = (
                    -x_robot >= rectX && x_robot <= rectX+rectW &&
                    -y_robot >= rectY && y_robot <= rectY+rectH
                );

                if (isInsideSafetyRect) {
                    ctx.fillStyle = "#ff1744";
                } else {
                    ctx.fillStyle = getIntensityColor(intensity, maxFrameIntensity);
                }

                ctx.beginPath();
                ctx.arc(pixelX, pixelY, 1.0, 0, 2 * Math.PI);
                ctx.fill();
            }
            currentAngle += scan.angle_increment;
        }
    }

    // Centre Robot
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(center.x, center.y, 3.5, 0, 2 * Math.PI);
    ctx.fill();
}

export function destroyLidarWidget() {
    log("🧹 LiDAR widget destroy");
    offFeedback("lidar", handleIncomingData);
    if (watchdogInterval) {
        clearInterval(watchdogInterval);
        watchdogInterval = null;
    }
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
    canvas = null; ctx = null; root = null;
}