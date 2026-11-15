/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/telemetry/imuWidget.js
 *
 * IMU Orientation Widget (Roll, Pitch, Yaw, Accelerometer)
 ******************************************************************************/

import { log } from "../core/utils.js";
import { getFeedbackState, onFeedback, offFeedback } from "../core/state.js";
import { getROS } from "../core/ros.js";  

/******************************************************************************
 * PRIVATE STATE
 ******************************************************************************/
let root = null;
const NODE_IMU = "esp32_lora"; 
let isImuNodeActive = false;
let watchdogInterval = null;

/******************************************************************************
 * HELPERS
 ******************************************************************************/
function checkActiveNodes() {
    const ros = getRosInstance();
    if (!ros) {
        isImuNodeActive = false;
        renderImuWidget();
        return;
    }

    ros.getNodes((nodes) => {
        isImuNodeActive = nodes.some(n => n.includes(NODE_IMU));
        renderImuWidget();
    }, () => {
        isImuNodeActive = false;
        renderImuWidget();
    });
}

function getRosInstance() { const ros = getROS(); return (ros && ros.isConnected) ? ros : null; }


/******************************************************************************
 * API
 ******************************************************************************/
export const imuWidget = {
    name: "IMU Widget",
    create: createImuWidget,
    init: initImuWidget,
    render: renderImuWidget,
    destroy: destroyImuWidget
};

/******************************************************************************
 * CREATE
 ******************************************************************************/
export function createImuWidget() {
    return `
<section class="card imu-card">
    <div class="imu-header">
        <h3>🧭 &nbsp; IMU Telemetry</h3>
    </div>

    <div class="imu-body">
        <div class="imu-columns-grid">
            <!-- Roll -->
            <div class="imu-column-item">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue"><path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-1 4h2v3h3v2h-3v3h-2v-3H8v-2h3V8z"/></svg>
                </div>
                <div class="imu-values-block">
                    <span class="imu-label">Roll<br>(Roulis)</span>
                    <div class="imu-value-wrapper">
                        <span id="imu-roll" class="imu-value">0.0</span>
                        <span class="imu-unit">°</span>
                    </div>
                </div>
            </div>

            <!-- Pitch -->
            <div class="imu-column-item">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue"><path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8 3.59 8 8 8zm-4-9h8v2H8v-2z"/></svg>
                </div>
                <div class="imu-values-block">
                    <span class="imu-label">Pitch<br>(Tangage)</span>
                    <div class="imu-value-wrapper">
                        <span id="imu-pitch" class="imu-value">0.0</span>
                        <span class="imu-unit">°</span>
                    </div>
                </div>
            </div>

            <!-- Yaw -->
            <div class="imu-column-item">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue"><path d="M7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.33 13.06L12 18l-1.33-2.94L7.73 13.73 10.67 12.4 12 9.47l1.33 2.93 2.94 1.33-2.94 1.33z"/></svg>
                </div>
                <div class="imu-values-block">
                    <span class="imu-label">Yaw<br>(Cap)</span>
                    <div class="imu-value-wrapper">
                        <span id="imu-yaw" class="imu-value">0.0</span>
                        <span class="imu-unit">°</span>
                    </div>
                </div>
            </div>

            <!-- AccX -->
            <div class="imu-column-item">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-orange"><path d="M19 13H5v-2h14v2zM12 5.5l5.5 5.5-1.42 1.42L13 9.34V19h-2V9.34L7.92 12.42 6.5 11 12 5.5z"/></svg>
                </div>
                <div class="imu-values-block">
                    <span class="imu-label">Acc X<br>(Linéaire)</span>
                    <div class="imu-value-wrapper">
                        <span id="imu-accx" class="imu-value">0.0</span>
                        <span class="imu-unit">m/s²</span>
                    </div>
                </div>
            </div>

            <!-- AccY -->
            <div class="imu-column-item">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-orange"><path d="M19 13H5v-2h14v2zM12 5.5l5.5 5.5-1.42 1.42L13 9.34V19h-2V9.34L7.92 12.42 6.5 11 12 5.5z"/></svg>
                </div>
                <div class="imu-values-block">
                    <span class="imu-label">Acc Y<br>(Latéral)</span>
                    <div class="imu-value-wrapper">
                        <span id="imu-accy" class="imu-value">0.0</span>
                        <span class="imu-unit">m/s²</span>
                    </div>
                </div>
            </div>

            <!-- AccZ -->
            <div class="imu-column-item">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-orange"><path d="M19 13H5v-2h14v2zM12 5.5l5.5 5.5-1.42 1.42L13 9.34V19h-2V9.34L7.92 12.42 6.5 11 12 5.5z"/></svg>
                </div>
                <div class="imu-values-block">
                    <span class="imu-label">Acc Z<br>(Vertical)</span>
                    <div class="imu-value-wrapper">
                        <span id="imu-accz" class="imu-value">9.8</span>
                        <span class="imu-unit">m/s²</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="widget-pending-container" id="imu-pending-box" style="display:none;">
        <div class="widget-pending-title"><span class="pending-pulse-dot"></span>En attente : <span id="imu-missing-nodes-list"></span></div>
    </div>
</section>
`;
}

/******************************************************************************
 * INIT
 ******************************************************************************/
export function initImuWidget(container) {
    log("🧭 IMU widget init");
    root = container;
    isImuNodeActive = false;
    onFeedback("imu", renderImuWidget);
    checkActiveNodes();
    watchdogInterval = setInterval(checkActiveNodes, 3000);
    renderImuWidget();
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
export function renderImuWidget() {
    if (!root) return;
    const state = getFeedbackState();
    const imu = state.imu || { roll: 0, pitch: 0, yaw: 0, accX: 0, accY: 0, accZ: 9.81 };

    const elements = {
        "#imu-roll": imu.roll,
        "#imu-pitch": imu.pitch,
        "#imu-yaw": imu.yaw,
        "#imu-accx": imu.accX,
        "#imu-accy": imu.accY,
        "#imu-accz": imu.accZ
    };

    for (const [selector, value] of Object.entries(elements)) {
        const el = root.querySelector(selector);
        if (el) el.textContent = Number(value).toFixed(1);
    }
    const missingNodesListElement = root.querySelector("#imu-missing-nodes-list");
    const pendingBox = root.querySelector("#imu-pending-box");
    const dynamicWaiting = !isImuNodeActive;

    if (pendingBox) {
        if (dynamicWaiting) {
            if (missingNodesListElement) {
                const missing = [];
                if (!isImuNodeActive) missing.push(`/${NODE_IMU}`);
                missingNodesListElement.innerHTML = "&nbsp;" + missing.join(" & ");
            }
            pendingBox.style.display = "block";
        } else {
            pendingBox.style.display = "none";
        }
    }
    
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/
export function destroyImuWidget() {
    log("🧹 IMU widget destroy");
    offFeedback("imu", renderImuWidget);
    root = null;
}