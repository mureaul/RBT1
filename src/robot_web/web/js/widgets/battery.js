
/******************************************************************************
 * widgets/settings/battery.js
 ******************************************************************************/

import { log } from "../core/utils.js";
import { getFeedbackState, onFeedback, offFeedback } from "../core/state.js";
import { getROS } from "../core/ros.js";

let root = null;

let batteryLevelElement = null;
let percentElement = null;
let stateTextElement = null;
let voltageElement = null;
let currentElement = null;

let historyTopic = null;
let watchdogInterval = null;
let historianInterval = null;
let toggleBtnHandler = null;

let chartPctInstance = null;
let chartAmpsInstance = null;
let chartVoltsInstance = null;

let isBatteryNodeActive = false;
let isBatteryHistorianNodeActive = false;

const PERCENT_LEVEL_LOW = 50;
const PERCENT_LEVEL_VERY_LOW = 15;
const V_LEVEL_LOW = 24;
const V_LEVEL_VERY_LOW = 22.5;
const I_LEVEL_LOW = 2;
const I_LEVEL_VERY_LOW = 1;


// Configuration des nœuds surveillés (Architecture RBT1)
const NODE_BATTERY = "esp32_diff_drive"; 
const NODE_HISTORIAN = "battery_historian";

export const batteryWidget = {
    name: "Battery Widget",
    create: createBatteryWidget,
    init: initBatteryWidget,
    render: renderBatteryWidget,
    destroy: destroyBatteryWidget
};

function getRosInstance() {
    const ros = getROS();
    if (ros && ros.isConnected) return ros;
    return null;
}

/******************************************************************************
 * CREATE
 ******************************************************************************/
export function createBatteryWidget() {
    return `
<section class="card battery-card">
    <div class="battery-header">
        <h3>🔋 &nbsp; Batterie</h3>
        <!-- Bouton d'activation d'origine déplacé dans la section dédiée inférieure -->
    </div>

    <div class="battery-body">
        <div class="battery-main-row">
            <div class="battery-icon-container">
                <svg id="battery-svg" class="battery-svg" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="p-bat-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#3a3f4d"/>
                            <stop offset="30%" stop-color="#22262f"/>
                            <stop offset="100%" stop-color="#111317"/>
                        </linearGradient>
                        <linearGradient id="glow-green" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#52f28b"/>
                            <stop offset="40%" stop-color="#2ecc71"/>
                            <stop offset="100%" stop-color="#1e8449"/>
                        </linearGradient>
                        <linearGradient id="glow-orange" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#ffca28"/>
                            <stop offset="40%" stop-color="#f39c12"/>
                            <stop offset="100%" stop-color="#d35400"/>
                        </linearGradient>
                        <linearGradient id="glow-red" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#ff6b6b"/>
                            <stop offset="40%" stop-color="#e74c3c"/>
                            <stop offset="100%" stop-color="#922b21"/>
                        </linearGradient>
                        <filter id="p-shadow">
                            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.6"/>
                        </filter>
                    </defs>
                    <rect x="2" y="5" width="106" height="50" rx="11" class="battery-outline" fill="url(#p-bat-bg)" stroke="#4a5161" stroke-width="2.5" filter="url(#p-shadow)"/>
                    <path d="M108,20 C110,20 111,21 111,23 L111,37 C111,39 110,40 108,40 Z" fill="#4a5161"/>
                    <svg x="6" y="9" width="98" height="42">
                        <rect id="battery-level" class="battery-level" x="0" y="0" width="100%" height="100%" rx="6" fill="url(#glow-green)"/>
                    </svg>
                    <path id="battery-bolt" class="battery-bolt" d="M64,13 L49,30 L59,30 L54,47 L71,29 L59,29 Z" fill="#f1c40f" filter="drop-shadow(0px 0px 6px rgba(241, 196, 15, 0.8))"/>
                </svg>
            </div>
            <div class="battery-info-block">
                <div id="battery-percent" class="battery-percent">--%</div>
                <div id="battery-state-text" class="battery-state-text">Décharge</div>
            </div>
        </div>

        <div class="battery-details-grid">
            <div class="voltage-sub-grid">
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue">
                        <path d="M13,2 L4,14 L11,14 L9,22 L19,10 L12,10 Z"/>
                    </svg>
                </div>
                <div class="battery-values-block format-left">
                    <span class="battery-label">Tension</span>
                    <span id="battery-voltage" class="battery-value">--.- V</span>
                </div>
            </div>
            
            <div class="battery-divider"></div>
            
            <div class="current-sub-grid">
                <div class="battery-values-block format-right">
                    <span class="battery-label">Intensité</span>
                    <span id="battery-current" class="battery-value">--.- A</span>
                </div>
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue">
                        <path d="M3,12 L7,12 L10,4 L14,20 L17,12 L21,12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#29b6f6"/>
                    </svg>
                </div>
            </div>
        </div>

        <div class="charts-title-row">
            <span class="charts-title-text">HISTORIQUES</span>
            <button id="btn-toggle-battery-charts" class="btn-toggle-charts" title="Visualiser/Masquer l'historique">
                <svg id="toggle-battery-icon-svg" class="toggle-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
        </div>

        <!-- Conteneur Unique Unifié des Graphiques Historiques (Masqué par défaut) -->
        <div id="battery-charts-container" style="display: none; margin-top: 12px; width: 100%; flex-direction: column; gap: 12px;">
            
            <!-- Graphique 1: Capacité (%) -->
            <div class="chart-block" style="width: 100%;">
                <div class="chart-title" style="font-size: 0.70rem; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.5); margin-bottom: 4px; font-weight: 600;">📊 Niveau Batterie (%)</div>
                <div class="chart-container" style="position: relative; height: 75px; width: 100%;">
                    <canvas id="battery-pct-chart"></canvas>
                </div>
            </div>

            <!-- Graphique 2: Intensité (A) -->
            <div class="chart-block" style="width: 100%;">
                <div class="chart-title" style="font-size: 0.70rem; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.5); margin-bottom: 4px; font-weight: 600;">📉 Intensité (A)</div>
                <div class="chart-container" style="position: relative; height: 75px; width: 100%;">
                    <canvas id="battery-amps-chart"></canvas>
                </div>
            </div>

            <!-- Graphique 3: Tension (V) -->
            <div class="chart-block" style="width: 100%;">
                <div class="chart-title" style="font-size: 0.70rem; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.5); margin-bottom: 4px; font-weight: 600;">⚡ Tension (V)</div>
                <div class="chart-container" style="position: relative; height: 75px; width: 100%;">
                    <canvas id="battery-volts-chart"></canvas>
                </div>
            </div>
        </div>
    </div>

    <!-- Bandeau inférieur de surveillance des nœuds -->
    <div class="widget-pending-container" id="battery-pending-box">
        <div class="widget-pending-title">
            <span class="pending-pulse-dot"></span>
            En attente : <span id="battery-missing-nodes-list" style="font-family: monospace; opacity: 0.85;"></span>
        </div>
    </div>
</section>
`;
}

/******************************************************************************
 * INIT
 ******************************************************************************/
export function initBatteryWidget(container) {
    log("🔋 Battery widget detailed 3-charts init");
    root = container;

    batteryLevelElement = root.querySelector("#battery-level");
    percentElement = root.querySelector("#battery-percent");
    stateTextElement = root.querySelector("#battery-state-text");
    voltageElement = root.querySelector("#battery-voltage");
    currentElement = root.querySelector("#battery-current");

    isBatteryNodeActive = false;
    isBatteryHistorianNodeActive = false;

    // Logique d'affichage dynamique du conteneur des graphiques
    const toggleBtn = root.querySelector("#btn-toggle-battery-charts");
    const chartsContainer = root.querySelector("#battery-charts-container");
    const toggleIconSvg = root.querySelector("#toggle-battery-icon-svg");

    if (toggleBtn && chartsContainer) {
        toggleBtnHandler = () => {
            const isHidden = chartsContainer.style.display === "none";
            if (isHidden) {
                fetchHistory();
                chartsContainer.style.display = "flex";
                if (toggleIconSvg) toggleIconSvg.style.transform = "rotate(180deg)";
                toggleBtn.style.background = "rgba(255,255,255,0.12)";
                if (chartPctInstance) chartPctInstance.resize();
                if (chartAmpsInstance) chartAmpsInstance.resize();
                if (chartVoltsInstance) chartVoltsInstance.resize();
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
        chartScript.onload = () => initChart();
        document.head.appendChild(chartScript);
    } else {
        initChart();
    }

    checkActiveNodes();
    watchdogInterval = setInterval(checkActiveNodes, 3000);
    
    fetchHistory();
    historianInterval = setInterval(fetchHistory, 60000);

    onFeedback("battery", renderBatteryWidget);
    renderBatteryWidget();
}

/******************************************************************************
 * GENERATE DYNAMIC GRADIENTS (Rules for color ranges)
 ******************************************************************************/
function createDynamicGradient(ctx, chartArea, type, minY, maxY) {
    if (!chartArea) return "rgba(255,255,255,0.1)";
    
    const { top, bottom } = chartArea;
    const gradient = ctx.createLinearGradient(0, bottom, 0, top);

    const getOffset = (val) => {
        if (maxY === minY) return 0.5;
        const offset = (val - minY) / (maxY - minY);
        return Math.max(0, Math.min(1, offset));
    };

    const colors = {
        greenArea: "rgba(46, 204, 113, 0.8)",
        orangeArea: "rgba(243, 156, 18, 0.8)",
        redArea: "rgba(231, 76, 60, 0.8)"
    };

    if (type === 'pct') {
        gradient.addColorStop(getOffset(0), colors.redArea);
        gradient.addColorStop(getOffset(PERCENT_LEVEL_VERY_LOW), colors.redArea);
        gradient.addColorStop(getOffset(PERCENT_LEVEL_VERY_LOW+0.001), colors.orangeArea);
        gradient.addColorStop(getOffset(PERCENT_LEVEL_LOW), colors.orangeArea);
        gradient.addColorStop(getOffset(PERCENT_LEVEL_LOW+0.001), colors.greenArea);
        gradient.addColorStop(getOffset(100), colors.greenArea);
    } 
    else if (type === 'volts') {
        gradient.addColorStop(getOffset(minY), colors.redArea);
        gradient.addColorStop(getOffset(V_LEVEL_VERY_LOW), colors.redArea);
        gradient.addColorStop(getOffset(V_LEVEL_VERY_LOW+0.001), colors.orangeArea);
        gradient.addColorStop(getOffset(V_LEVEL_LOW), colors.orangeArea);
        gradient.addColorStop(getOffset(V_LEVEL_LOW+0.001), colors.greenArea);
        gradient.addColorStop(getOffset(maxY), colors.greenArea);
    } 
    else if (type === 'amps') {
        gradient.addColorStop(getOffset(minY), colors.greenArea);
        gradient.addColorStop(getOffset(I_LEVEL_VERY_LOW), colors.greenArea);
        gradient.addColorStop(getOffset(I_LEVEL_VERY_LOW+0.001), colors.orangeArea);
        gradient.addColorStop(getOffset(I_LEVEL_LOW), colors.orangeArea);
        gradient.addColorStop(getOffset(I_LEVEL_LOW+0.001), colors.redArea);
        gradient.addColorStop(getOffset(maxY), colors.redArea);
    }

    return gradient;
}

/******************************************************************************
 * CHART SETUP (3 STACKED INSTANCES WITH AREA FILL)
 ******************************************************************************/
function initChart() {
    if (!root) return;

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { display: false },
            annotation: false 
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "rgba(255,255,255,0.3)", font: { size: 8 }, maxTicksLimit: 6 }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { color: "rgba(255,255,255,0.03)" },
                ticks: { color: "rgba(255,255,255,0.5)", font: { size: 8 } },
                grace: '5%'
            }
        },
        elements: { 
            point: { radius: 0 },
            line: { 
                fill: false,
                borderWidth: 3,
                tension: 0.3
            }
        }
    };

    // 1. Capacité (%)
    const canvasPct = root.querySelector("#battery-pct-chart");
    if (canvasPct) {
        let opts = JSON.parse(JSON.stringify(commonOptions));
        opts.scales.y.min = 0;
        opts.scales.y.max = 100;
        chartPctInstance = new Chart(canvasPct.getContext("2d"), {
            type: 'line',
            data: { labels: [], datasets: [{ data: [], borderWidth: 1.5, tension: 0.1 }] },
            options: opts
        });
    }

    // 2. Intensité (A)
    const canvasAmps = root.querySelector("#battery-amps-chart");
    if (canvasAmps) {
        chartAmpsInstance = new Chart(canvasAmps.getContext("2d"), {
            type: 'line',
            data: { labels: [], datasets: [{ data: [], borderWidth: 1.5, tension: 0.1 }] },
            options: commonOptions
        });
    }

    // 3. Tension (V)
    const canvasVolts = root.querySelector("#battery-volts-chart");
    if (canvasVolts) {
        chartVoltsInstance = new Chart(canvasVolts.getContext("2d"), {
            type: 'line',
            data: { labels: [], datasets: [{ data: [], borderWidth: 1.5, tension: 0.1 }] },
            options: commonOptions
        });
    }
}

function updateHistoryChart(data) {
    if (!data.timestamps) return;

    const formattedLabels = data.timestamps.map(t => {
        const parts = t.split(' ');
        if (!parts[0]) return '';
        const dateParts = parts[0].split('-');
        return `${dateParts[1]}-${dateParts[2]} ${parts[1] || ''}`;
    });

    if (chartPctInstance) {
        chartPctInstance.data.labels = formattedLabels;
        chartPctInstance.data.datasets[0].data = data.percentages || [];
        
        const gradient = createDynamicGradient(
            chartPctInstance.ctx, 
            chartPctInstance.chartArea, 
            'pct', 0, 100
        );    
        chartPctInstance.data.datasets[0].borderColor = gradient; // Applique le dégradé à la ligne
        chartPctInstance.data.datasets[0].backgroundColor = 'transparent'; // Aucune couleur d'aire
        chartPctInstance.update();
    }

    if (chartAmpsInstance) {
        chartAmpsInstance.data.labels = formattedLabels;
        chartAmpsInstance.data.datasets[0].data = data.currents || [];
        const gradient = createDynamicGradient(
            chartAmpsInstance.ctx, 
            chartAmpsInstance.chartArea, 
            'amps', -2, 2
        );    
        chartAmpsInstance.data.datasets[0].borderColor = gradient; // Applique le dégradé à la ligne
        chartAmpsInstance.data.datasets[0].backgroundColor = 'transparent'; // Aucune couleur d'aire        
        chartAmpsInstance.update();
    }

    if (chartVoltsInstance) {
        chartVoltsInstance.data.labels = formattedLabels;
        chartVoltsInstance.data.datasets[0].data = data.voltages || [];
        const gradient = createDynamicGradient(
            chartVoltsInstance.ctx, 
            chartVoltsInstance.chartArea, 
            'volts', 20, 25.2
        );    
        chartVoltsInstance.data.datasets[0].borderColor = gradient; // Applique le dégradé à la ligne
        chartVoltsInstance.data.datasets[0].backgroundColor = 'transparent'; // Aucune couleur d'aire        
        chartVoltsInstance.update();
    }
}

function fetchHistory() {
    let historyClient = new ROSLIB.Service({
        ros: getROS(),
        name: '/battery_historian/get_history',
        serviceType: 'std_srvs/srv/Trigger'
    });
    historyClient.callService(new ROSLIB.ServiceRequest(), (result) => {
        if (result.success) {
            updateHistoryChart(JSON.parse(result.message));
        }
        else {
            log("❌ Battery historian : Impossible de joindre le service.");
        }
    });
}

/******************************************************************************
 * NODE MONITORING
 ******************************************************************************/
function checkActiveNodes() {
    const ros = getRosInstance();
    if (!ros) {
        isBatteryNodeActive = false;
        isBatteryHistorianNodeActive = false;
        renderNodeMonitoring();
        return;
    }

    ros.getNodes((nodes) => {
        isBatteryNodeActive = nodes.some(n => n.includes(NODE_BATTERY));
        isBatteryHistorianNodeActive = nodes.some(n => n.includes(NODE_HISTORIAN));
        renderNodeMonitoring();
    }, () => {
        isBatteryNodeActive = false;
        isBatteryHistorianNodeActive = false;
        renderNodeMonitoring();
    });
}

function renderNodeMonitoring() {
    if (!root) return;
    const pendingBox = root.querySelector("#battery-pending-box");
    const missingNodesListElement = root.querySelector("#battery-missing-nodes-list");
    const isMissing = !isBatteryNodeActive || !isBatteryHistorianNodeActive;

    if (pendingBox) {
        if (isMissing) {
            if (missingNodesListElement) {
                const missing = [];
                if (!isBatteryNodeActive) missing.push(`/${NODE_BATTERY}`);
                if (!isBatteryHistorianNodeActive) missing.push(`/${NODE_HISTORIAN}`);
                missingNodesListElement.innerHTML = "&nbsp;" + missing.join(" & ");
            }
            pendingBox.style.display = "block";
        } else {
            pendingBox.style.display = "none";
        }
    }
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
export function renderBatteryWidget() {
    if (!root) return;

    const feedback = getFeedbackState();
    const battery = feedback.battery ?? {};
    
    let rawLevel = battery.percentage ?? 0;
    if (rawLevel > 0 && rawLevel <= 1.0) {
        rawLevel = rawLevel * 100;
    }
    const level = Math.max(0, Math.min(100, rawLevel));

    const voltageVal = battery.voltage ?? 0;
    const currentVal = battery.current ?? 0;

    const status = battery.power_supply_status ?? 0;
    const isCharging = (status === 1) || (status === 0 && currentVal > 0.05); 

    percentElement.textContent = `${Math.round(level)}%`;
    voltageElement.textContent = `${voltageVal.toFixed(1)} V`;
    currentElement.textContent = `${Math.abs(currentVal).toFixed(1)} A`;

    if (stateTextElement) {
        if (status === 4) {
            stateTextElement.textContent = "Pleine";
        } else {
            stateTextElement.textContent = isCharging ? "En charge" : "Décharge";
        }
    }

    if (batteryLevelElement) {
        batteryLevelElement.style.width = `${level}%`;
    }

    root.classList.remove("is-charging", "status-low", "status-orange", "status-green");
    if (isCharging) root.classList.add("is-charging");

    if (level < PERCENT_LEVEL_VERY_LOW) {
        root.classList.add("status-low");
        batteryLevelElement.setAttribute("fill", "url(#glow-red)");
    } else if (level <= PERCENT_LEVEL_LOW) {
        root.classList.add("status-orange");
        batteryLevelElement.setAttribute("fill", "url(#glow-orange)");
    } else {
        root.classList.add("status-green");
        batteryLevelElement.setAttribute("fill", "url(#glow-green)");
    }
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/
export function destroyBatteryWidget() {
    log("🧹 Battery widget destroy");
    offFeedback("battery", renderBatteryWidget);
    
    const toggleBtn = root?.querySelector("#btn-toggle-battery-charts");
    if (toggleBtn && toggleBtnHandler) {
        toggleBtn.removeEventListener("click", toggleBtnHandler);
    }

    if (watchdogInterval) {
        clearInterval(watchdogInterval);
        watchdogInterval = null;
    }
    if (historyTopic) {
        historyTopic.unsubscribe();
        historyTopic = null;
    }
    if (chartPctInstance) { chartPctInstance.destroy(); chartPctInstance = null; }
    if (chartAmpsInstance) { chartAmpsInstance.destroy(); chartAmpsInstance = null; }
    if (chartVoltsInstance) { chartVoltsInstance.destroy(); chartVoltsInstance = null; }
    root = null;
}