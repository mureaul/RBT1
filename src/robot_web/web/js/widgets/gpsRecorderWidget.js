/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/telemetry/gpsRecorderWidget.js
 ******************************************************************************/

import { log } from "../core/utils.js";
import { getROS } from "../core/ros.js";

/******************************************************************************
 * PRIVATE STATE
 ******************************************************************************/
let root = null;
let statusLabel = null;
let pointsLabel = null;
let btnStart = null;
let btnStop = null;

let localPointsCount = 0;
let gpsIntervalSubscriber = null;

function getRosInstance() {
    const ros = getROS();
    return (ros && ros.isConnected) ? ros : null;
}

export const gpsRecorderWidget = {
    name: "GPS Zone Recorder Widget",
    create: createGpsRecorderWidget,
    init: initGpsRecorderWidget,
    render: renderGpsRecorderWidget,
    destroy: destroyGpsRecorderWidget
};

/******************************************************************************
 * PRIVATE HANDLERS
 ******************************************************************************/
function handleStartRecording() {
    const ros = getRosInstance();
    if (!ros) { alert("Erreur : Interface non connectée."); return; }

    const inputElement = root ? root.querySelector("#gps-zone-name-input") : null;
    let zoneNameStr = inputElement ? inputElement.value.trim() : "zone_custom";

    if (!zoneNameStr) {
        zoneNameStr = "zone_custom";
        if (inputElement) inputElement.value = "zone_custom";
    }

    if (btnStart) btnStart.disabled = true;
    if (inputElement) inputElement.disabled = true;
    if (statusLabel) statusLabel.textContent = "Action...";

    const startService = new ROSLIB.Service({
        ros: ros,
        name: '/gps_zone_recorder_node/start_recording',
        serviceType: 'rbt1_interfaces/srv/ZoneRecord'
    });

    startService.callService(new ROSLIB.ServiceRequest({ zone_name: zoneNameStr }), (result) => {
        if (result.success) {
            if (btnStop) btnStop.disabled = false;
            if (statusLabel) {
                statusLabel.textContent = "En cours";
                statusLabel.style.color = "#ef4444";
            }
            localPointsCount = 0;
            if (pointsLabel) pointsLabel.textContent = "0";

            gpsIntervalSubscriber = new ROSLIB.Topic({
                ros: ros,
                name: '/ublox_gps_node/fix',
                messageType: 'sensor_msgs/msg/NavSatFix'
            });

            gpsIntervalSubscriber.subscribe((msg) => {
                if (msg.status && msg.status.status >= 0) {
                    localPointsCount++;
                    if (pointsLabel) pointsLabel.textContent = localPointsCount;
                }
            });
        } else {
            alert(`Erreur Robot : ${result.message}`);
            resetWidgetUI();
        }
    }, (error) => {
        log("❌ GpsRecorder : Échec service", error);
        resetWidgetUI();
    });
}

function handleStopRecording() {
    const ros = getRosInstance();
    if (!ros) { alert("Erreur : Connexion ROS introuvable."); return; }

    if (btnStop) btnStop.disabled = true;
    if (statusLabel) statusLabel.textContent = "Calculs...";

    if (gpsIntervalSubscriber) {
        gpsIntervalSubscriber.unsubscribe();
        gpsIntervalSubscriber = null;
    }

    const stopService = new ROSLIB.Service({
        ros: ros,
        name: '/gps_zone_recorder_node/stop_recording',
        serviceType: 'std_srvs/srv/Trigger'
    });

    stopService.callService(new ROSLIB.ServiceRequest({}), (result) => {
        if (result.success) alert(`Succès : ${result.message}`);
        else alert(`Erreur : ${result.message}`);
        resetWidgetUI();
    }, () => resetWidgetUI());
}

function resetWidgetUI() {
    if (btnStart) btnStart.disabled = false;
    if (btnStop) btnStop.disabled = true;
    const inputElement = root ? root.querySelector("#gps-zone-name-input") : null;
    if (inputElement) inputElement.disabled = false;
    if (statusLabel) {
        statusLabel.textContent = "Prêt";
        statusLabel.style.color = "";
    }
}

/******************************************************************************
 * CREATE
 ******************************************************************************/
export function createGpsRecorderWidget() {
    return `
<section class="card gpsrecorder-card">
    <div class="gpsrecorder-header">
        <h3>📍 &nbsp; GPS Zone Recorder</h3>
    </div>

    <div class="gpsrecorder-body">
        <div class="gpsrecorder-grid">
            <div class="gpsrecorder-item">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <div class="format-left">
                    <span class="gpsrecorder-label">Statut</span>
                    <span id="gps-record-status" class="gpsrecorder-value">Prêt</span>
                </div>
            </div>

            <div class="gpsrecorder-item">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue"><path d="M12 2c-4 0-7 3.05-7 7 0 4.25 7 13 7 13s7-8.75 7-13c0-3.95-3-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>
                <div class="format-left">
                    <span class="gpsrecorder-label">Points</span>
                    <span id="gps-record-points" class="gpsrecorder-value">0</span>
                </div>
            </div>
        </div>

        <div class="gpsrecorder-input-wrapper">
            <label class="gpsrecorder-label">Nom de la Zone</label>
            <input type="text" id="gps-zone-name-input" class="gpsrecorder-input" value="zone_custom"/>
        </div>

        <div class="gpsrecorder-actions-row">
            <button id="btn-gps-start" class="gpsrecorder-btn gpsrecorder-btn-gps-start">● Démarrer</button>
            <button id="btn-gps-stop" class="gpsrecorder-btn gpsrecorder-btn-gps-stop" disabled>■ Terminer</button>
        </div>
    </div>
</section>
`;
}

/******************************************************************************
 * INIT, RENDER & DESTROY
 ******************************************************************************/
export function initGpsRecorderWidget(container) {
    root = container;
    statusLabel = root.querySelector("#gps-record-status");
    pointsLabel = root.querySelector("#gps-record-points");
    btnStart = root.querySelector("#btn-gps-start");
    btnStop = root.querySelector("#btn-gps-stop");
    btnStart?.addEventListener('click', handleStartRecording);
    btnStop?.addEventListener('click', handleStopRecording);
}

export function renderGpsRecorderWidget() {}

export function destroyGpsRecorderWidget() {
    gpsIntervalSubscriber?.unsubscribe();
    btnStart?.removeEventListener('click', handleStartRecording);
    btnStop?.removeEventListener('click', handleStopRecording);
    root = null;
}