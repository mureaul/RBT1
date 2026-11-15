/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/bladeTelemetryWidget.js
 ******************************************************************************/

import { log } from "../core/utils.js";
import { AppState } from "../core/app.js"; 
import { getROS } from "../core/ros.js";    

let root = null;
let stateLabel, speedLabel, currentLabel, voltageLabel, tempEscLabel, consumedLabel;
let stateBadge, speedBadge, currentBadge, voltageBadge, tempBadge, consumedBadge;

let telemetryTopic = null;
let historyTopic = null;
let updateCounter = 0;
const FETCH_INTERVAL = 50;

let chartCurrentInstance = null;
let chartSpeedInstance = null;
let chartStateInstance = null;
let chartVoltInstance = null;

let toggleBtnHandler = null;

const localState = {
    state: "UNKNOWN", targetSpeed: 0, currentSpeed: 0, motorCurrent: 0,
    inputVoltage: 0, escTemp: 0, consumedAh: 0
};

let isBladeNodeActive = false;
let isBladeHistorianNodeActive = false;
let watchdogInterval = null;
let historianInterval = null;

const NODE_BLADE = "esp32_diff_drive"; 
const NODE_HISTORIAN = "blade_historian";

const COLORS = {
    STOPPED: "#64748b", ACCEL: "#eab308", RUNNING: "#10b981", 
    DECEL: "#f97316", ERROR: "#ef4444", NEUTRAL: "rgba(255,255,255,0.3)"
};

const STATE_LABELS = ["UNKNOWN", "STOPPED", "ACCEL", "RUNNING", "DECEL", "ERROR"];
const STATE_MAP = {
    "UNKNOWN": 0, "STOPPED": 1, "ACCEL": 2, 
    "RUNNING": 3, "DECEL": 4, "ERROR": 5
};

const ICONS = {
    RPM: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v10l5 5"></path></svg>`,
    AMP: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>`,
    VOLT: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 7h16v10H2z"></path></svg>`,
    TEMP: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.5V4a2 2 0 0 0-4 0v10.5a4 4 0 1 0 4 0z"></path></svg>`,
    AH: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20"></path></svg>`
};

function getStateColor(state) { return COLORS[state] || COLORS.NEUTRAL; }
function getCurrentColor(val) { return val < 4.0 ? COLORS.RUNNING : (val < 6.0 ? COLORS.DECEL : COLORS.ERROR); }
function gettempColor(val) { return val < 30.0 ? COLORS.RUNNING : (val > 40.0 ? COLORS.ERROR : COLORS.ACCEL); }
function getVoltColor(val) { return val < 22 ? COLORS.ERROR : (val > 23.3 ? COLORS.RUNNING : COLORS.ACCEL); }

function fetchHistory() {
    let historyClient = new ROSLIB.Service({
        ros: getROS(),
        name: '/blade_historian/get_history',
        serviceType: 'std_srvs/srv/Trigger'
    });
    historyClient.callService(new ROSLIB.ServiceRequest(), (result) => {
        if (result.success) {
            updateHistoryCharts(JSON.parse(result.message));
        }
        else {
            log("❌ Blade Télémetrie : Impossible de joindre le service.");
        }
    });
}

function applyBadgeContent(badgeElement, colorHex, iconSvg) {
    if (!badgeElement) return;
    badgeElement.innerHTML = iconSvg;
    badgeElement.style.color = colorHex;
    badgeElement.style.backgroundColor = `${colorHex}15`;
    badgeElement.style.border = `1px solid ${colorHex}40`;
    badgeElement.style.boxShadow = `0 4px 12px ${colorHex}25`;
}

export const bladeTelemetryWidget = {
    name: "Blade Telemetry Widget",
    create: createBladeTelemetryWidget,
    init: initBladeTelemetryWidget,
    render: renderBladeTelemetryWidget,
    destroy: destroyBladeTelemetryWidget
};

function getRosInstance() { const ros = getROS(); return (ros && ros.isConnected) ? ros : null; }

export function createBladeTelemetryWidget() {
    return `
<section class="bladeTelemetry-card">
    <div class="bladeTelemetry-header">
        <h3>⚔️ &nbsp; Télémétrie Lame</h3>
        <span id="blade-state-text" style="font-size: 0.7rem; font-weight: 600; padding: 4px 8px; border-radius: 6px; background: rgba(255,255,255,0.05);">--</span>
    </div>
    <div class="bladeTelemetry-body">
        <div class="bladeTelemetry-grid-3">
            ${createItem("ESC Temp (°C)", "blade-temp-esc", "badge-blade-temp", "°C")}
            <div class="widget-divider"></div>
            ${createItem("Int. (A)", "blade-current-val", "badge-blade-current", "A")}
            <div class="widget-divider"></div>
            ${createItem("Volt (V)", "blade-voltage-val", "badge-blade-voltage", "V")}
        </div>
        <div class="bladeTelemetry-grid-2">
            ${createItem("RPM", "blade-speed-val", "badge-blade-speed", "RPM")}    
            <div class="widget-divider"></div>
            ${createItem("Conso (Ah)", "blade-consumed-val", "badge-blade-ah", "Ah")}
        </div>
        <div class="charts-title-row">
            <span class="charts-title-text">HISTORIQUES</span>
            <button id="btn-toggle-blade-charts" class="btn-toggle-charts"><svg id="toggle-blade-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
        </div>
        <div id="blade-charts-container" class="bladeTelemetry-charts-section" style="display:none;">
            <div class="bladeTelemetry-chart-block"><canvas id="blade-current-chart"></canvas></div>
            <div class="bladeTelemetry-chart-block"><canvas id="blade-speed-chart"></canvas></div>
            <div class="bladeTelemetry-chart-block"><canvas id="blade-state-chart"></canvas></div>
            <div class="bladeTelemetry-chart-block"><canvas id="blade-volt-chart"></canvas></div>
        </div>
    </div>
    <div class="widget-pending-container" id="blade-pending-box" style="display:none;">
        <div class="widget-pending-title"><span class="pending-pulse-dot"></span>En attente : <span id="blade-missing-nodes-list"></span></div>
    </div>
</section>`;
}

function createItem(label, valId, badgeId, unit) {
    return `
    <div class="bladeTelemetry-item">
        <div id="${badgeId}" class="premium-badge-icon"></div>
        <div class="bladeTelemetry-values">
            <span class="bladeTelemetry-label">${label}</span>
            <div class="bladeTelemetry-value-wrapper">
                <span class="bladeTelemetry-val" id="${valId}">--</span>
                <span class="bladeTelemetry-unit">${unit || ''}</span>
            </div>
        </div>
    </div>`;
}

export function initBladeTelemetryWidget(container) {
    root = container;
    stateLabel = root.querySelector("#blade-state-text");
    speedLabel = root.querySelector("#blade-speed-val");
    currentLabel = root.querySelector("#blade-current-val");
    voltageLabel = root.querySelector("#blade-voltage-val");
    tempEscLabel = root.querySelector("#blade-temp-esc");
    consumedLabel = root.querySelector("#blade-consumed-val");

    stateBadge = root.querySelector("#badge-blade-speed");
    currentBadge = root.querySelector("#badge-blade-current");
    voltageBadge = root.querySelector("#badge-blade-voltage");
    tempBadge = root.querySelector("#badge-blade-temp");
    consumedBadge = root.querySelector("#badge-blade-ah");

    isBladeNodeActive = false;
    isBladeHistorianNodeActive = false;

    const toggleBtn = root.querySelector("#btn-toggle-blade-charts");
    const chartsContainer = root.querySelector("#blade-charts-container");
    const toggleIconSvg = root.querySelector("#toggle-blade-icon-svg");

    if (toggleBtn && chartsContainer) {
        toggleBtnHandler = () => {
            const isHidden = chartsContainer.style.display === "none";
            if (isHidden) {
                chartsContainer.style.display = "flex";
                if (toggleIconSvg) toggleIconSvg.style.transform = "rotate(180deg)";
                toggleBtn.style.background = "rgba(255,255,255,0.12)";
                
                if (chartCurrentInstance) chartCurrentInstance.resize();
                if (chartSpeedInstance) chartSpeedInstance.resize();
                if (chartStateInstance) chartStateInstance.resize();
                if (chartVoltInstance) chartVoltInstance.resize();
            } else {
                chartsContainer.style.display = "none";
                if (toggleIconSvg) toggleIconSvg.style.transform = "rotate(0deg)";
                toggleBtn.style.background = "rgba(255,255,255,0.04)";
            }
        };
        toggleBtn.addEventListener("click", toggleBtnHandler);
    }

    if (typeof Chart === "undefined") {
        const chartScript = document.createElement("script");
        chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
        chartScript.onload = () => initCharts();
        document.head.appendChild(chartScript);
    } else {
        initCharts();
    }

    const ros = getRosInstance();
    if (!ros) return;

    telemetryTopic = new ROSLIB.Topic({
        ros: ros,
        name: "/state/lame_telemetry",
        messageType: "std_msgs/String"
    });

    telemetryTopic.subscribe((msg) => {
        try {
            const d = JSON.parse(msg.data);
            localState.state = d.st;
            localState.currentSpeed = d.cr;
            localState.motorCurrent = d.i;
            localState.inputVoltage = d.v;
            localState.escTemp = d.te;
            localState.consumedAh = d.ah;
            renderBladeTelemetryWidget();
        } catch(e) { console.error(e); }
    });

    checkActiveNodes();
    fetchHistory();
    historianInterval = setInterval(fetchHistory, 60000);
    watchdogInterval = setInterval(checkActiveNodes, 3000);
}

function checkActiveNodes() {
    const ros = getRosInstance();
    if (!ros) {
        isBladeNodeActive = false;
        isBladeHistorianNodeActive = false;
        renderBladeTelemetryWidget();
        return;
    }

    ros.getNodes((nodes) => {
        isBladeNodeActive = nodes.some(n => n.includes(NODE_BLADE));
        isBladeHistorianNodeActive = nodes.some(n => n.includes(NODE_HISTORIAN));
        renderBladeTelemetryWidget();
    }, () => {
        isBladeNodeActive = false;
        isBladeHistorianNodeActive = false;
        renderBladeTelemetryWidget();
    });
}

function initCharts() {
    if (!root) return;

    // Configuration commune à l'ensemble des subplots de la pile
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: { left: 0, right: 10, top: 0, bottom: 0 }
        },
        plugins: { 
            legend: { display: false },
            annotation: false,
            title: {
            display: true,
            text: 'Titre par défaut', // Ce texte sera surchargé par graphique
            color: 'rgba(255,255,255,0.7)',
            font: { size: 10, weight: 'bold' },
            padding: { bottom: 10 }
            } 
        },
        scales: {
            x: { 
                grid: { display: false }, 
                ticks: { display: false } 
            },
            y: { 
                position: 'left',
                minRotation: 0, // 🌟 Empêche l'auto-rotation des textes longs
                maxRotation: 0,
                grid: { color: "rgba(255,255,255,0.03)" }, 
                ticks: { 
                    color: "rgba(255,255,255,0.4)", 
                    font: { size: 8 },
                    mirror: false, // Force le texte à rester à l'extérieur droit de sa boîte
                    padding: 4
                },
                afterFit: function(scaleInstance) {
                    // 🌟 FORCE VERROU TOTAL : On impose une dimension géométrique ferme (en pixels) à l'axe Y.
                    // Chart.js alignera obligatoirement le point 0 de la timeline X juste après cette dimension.
                    scaleInstance.width = 68; 
                }
            }
        },
        elements: { point: { radius: 0 }, line: { borderWidth: 1.5, tension: 0.15, fill: true } }
    };

    function getOptionsWithTitle(title,color) {
        let opts = JSON.parse(JSON.stringify(commonOptions));
        opts.plugins.title = {
            display: true,
            text: title,
            color: color,
            font: { size: 10, weight: 'normal' },
            padding: { bottom: 5 }
        };
        return opts;
    }

    // 1. Graphique Intensité
    const canvasCurrent = root.querySelector("#blade-current-chart");
    if (canvasCurrent) {
        chartCurrentInstance = new Chart(canvasCurrent.getContext("2d"), {
            type: 'line',
            data: { labels: [], datasets: [{ data: [], borderColor: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.08)" }] },
            options: getOptionsWithTitle('Intensité (A)',"#10b981")
        });
    }

    // 2. Graphique Vitesse
    const canvasSpeed = root.querySelector("#blade-speed-chart");
    if (canvasSpeed) {
        chartSpeedInstance = new Chart(canvasSpeed.getContext("2d"), {
            type: 'line',
            data: { labels: [], datasets: [{ data: [], borderColor: "#29b6f6", backgroundColor: "rgba(41, 182, 246, 0.08)" }] },
            options: getOptionsWithTitle('Vitesse (RPM)',"#29b6f6")
        });
    }

    // 3. Chronogramme Statut (Alignement verrouillé et forcé)
    const canvasState = root.querySelector("#blade-state-chart");
    if (canvasState) {
        let stateOpts = JSON.parse(JSON.stringify(commonOptions));
        stateOpts.elements.line.stepped = true; 
        stateOpts.scales.y.min = 0;
        stateOpts.scales.y.max = 5;
        stateOpts.scales.y.ticks.font = { size: 7 };
        // Callback strict pour s'assurer qu'aucun label fantôme ne dépasse du canevas
        stateOpts.scales.y.ticks.callback = function(value) { 
            return STATE_LABELS[value] || ''; 
        };

        chartStateInstance = new Chart(canvasState.getContext("2d"), {
            type: 'bar', // Utilisation de 'bar' plutôt que 'line'
            data: {
                labels: [], // Vos timestamps
                datasets: [{
                    label: 'État',
                    data: [], // Vos valeurs 0 à 5
                    backgroundColor: [], // Tableau de couleurs dynamique
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Chronogramme d\'état', color: '#fff' }
                },
                scales: {
                    x: { stacked: true, display: false }, // Barre unique continue
                    y: { display: false, min: 0, max: 1 } // Hauteur fixe
                }
            }
        });
    }

    // 4. Graphique Tension
    const canvasVolt = root.querySelector("#blade-volt-chart");
    if (canvasVolt) {
        chartVoltInstance = new Chart(canvasVolt.getContext("2d"), {
            type: 'line',
            data: { labels: [], datasets: [{ data: [], borderColor: "#ff6b6b", backgroundColor: "rgba(255, 107, 107, 0.08)" }] },
            options: getOptionsWithTitle('Tension Battery (V)',"#ff6b6b")
        });
    }
}

function updateHistoryCharts(data) {
    const labels = data.timestamps.map(t => t.split(' ')[1]?.substring(0, 5) || '');

    if (chartCurrentInstance && data.motor_current) {
        chartCurrentInstance.data.labels = labels;
        chartCurrentInstance.data.datasets[0].data = data.motor_current;
        chartCurrentInstance.update();
    }
    if (chartSpeedInstance && data.current_speed) {
        chartSpeedInstance.data.labels = labels;
        chartSpeedInstance.data.datasets[0].data = data.current_speed;
        chartSpeedInstance.update();
    }
    if (chartStateInstance && data.state) {
        const numericStates = data.state.map(s => STATE_MAP[s] ?? 0);
    
        // Mappage des états vers des couleurs spécifiques
        const colors = data.state.map(s => {
            switch(s) {
                case "RUNNING": return COLORS.RUNNING;
                case "STOPPED": return COLORS.STOPPED;
                case "ACCEL": return COLORS.ACCEL;
                case "DECEL": return COLORS.DECEL;
                case "ERROR": return COLORS.ERROR;
                default: return COLORS.NEUTRAL;
            }
        });

        chartStateInstance.data.labels = labels;
        chartStateInstance.data.datasets[0].data = numericStates.map(() => 1); // Toujours 1 pour remplir la hauteur
        chartStateInstance.data.datasets[0].backgroundColor = colors;
        chartStateInstance.update();
    }
    
    if (chartVoltInstance && data.input_voltage) {
        chartVoltInstance.data.labels = labels;
        chartVoltInstance.data.datasets[0].data = data.input_voltage;
        chartVoltInstance.update();
    }
}

export function renderBladeTelemetryWidget() {
    if (!root || !speedLabel) return;
    
    const stateCol = getStateColor(localState.state);
    stateLabel.textContent = localState.state;
    stateLabel.style.color = stateCol;

    speedLabel.textContent = Math.round(localState.currentSpeed);
    speedLabel.style.color = stateCol;
    applyBadgeContent(stateBadge, stateCol, ICONS.RPM);

    const curCol = getCurrentColor(localState.motorCurrent);
    currentLabel.textContent = localState.motorCurrent.toFixed(2);
    currentLabel.style.color = curCol;
    applyBadgeContent(currentBadge, curCol, ICONS.AMP);

    const voltCol = getVoltColor(localState.inputVoltage.toFixed(1));
    voltageLabel.textContent = localState.inputVoltage.toFixed(1);
    voltageLabel.style.color = voltCol;
    applyBadgeContent(voltageBadge, voltCol, ICONS.VOLT);
    
    const tempCol = gettempColor(localState.escTemp);
    tempEscLabel.textContent = Math.round(localState.escTemp);
    tempEscLabel.style.color = tempCol;
    applyBadgeContent(tempBadge, tempCol, ICONS.TEMP);

    consumedLabel.textContent = localState.consumedAh.toFixed(3);
    consumedLabel.style.color = COLORS.NEUTRAL;
    applyBadgeContent(consumedBadge, COLORS.NEUTRAL, ICONS.AH);
    
    const pendingBox = root.querySelector("#blade-pending-box");
    const missingNodesListElement = root.querySelector("#blade-missing-nodes-list");
    const dynamicWaiting = !isBladeNodeActive || !isBladeHistorianNodeActive;

    if (pendingBox) {
        if (dynamicWaiting) {
            if (missingNodesListElement) {
                const missing = [];
                if (!isBladeNodeActive) missing.push(`/${NODE_BLADE}`);
                if (!isBladeHistorianNodeActive) missing.push(`/${NODE_HISTORIAN}`);
                missingNodesListElement.innerHTML = "&nbsp;" + missing.join(" & ");
            }
            pendingBox.style.display = "block";
        } else {
            pendingBox.style.display = "none";
        }
    }

}

export function destroyBladeTelemetryWidget() {
    log("🧹 Blade Telemetry widget destroy");
    
    const toggleBtn = root?.querySelector("#btn-toggle-blade-charts");
    if (toggleBtn && toggleBtnHandler) {
        toggleBtn.removeEventListener("click", toggleBtnHandler);
    }

    if (watchdogInterval) {
        clearInterval(watchdogInterval);
        watchdogInterval = null;
    }
    if (telemetryTopic) {
        telemetryTopic.unsubscribe();
        telemetryTopic = null;
    }
    if (historyTopic) {
        historyTopic.unsubscribe();
        historyTopic = null;
    }
    
    if (chartCurrentInstance) { chartCurrentInstance.destroy(); chartCurrentInstance = null; }
    if (chartSpeedInstance) { chartSpeedInstance.destroy(); chartSpeedInstance = null; }
    if (chartStateInstance) { chartStateInstance.destroy(); chartStateInstance = null; }
    if (chartVoltInstance) { chartVoltInstance.destroy(); chartVoltInstance = null; }
    
    isBladeNodeActive = false;
    isBladeHistorianNodeActive = false;
    root = null;
}