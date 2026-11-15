/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/ambianceWidget.js
 ******************************************************************************/

import { log } from "../core/utils.js";
import { AppState } from "../core/app.js"; 
import { getROS } from "../core/ros.js";    

let root = null;
let tempBmpLabel, pressBmpLabel, tempDhtLabel, humDhtLabel;
let tempBmpBadge, pressBmpBadge, tempDhtBadge, humDhtBadge;
let tempBmpTopic, pressBmpTopic, tempDhtTopic, humDhtTopic, historyTopic;

const localState = { tempBmp: null, pressBmp: null, tempDht: null, humDht: null };
let tempChart, humChart, pressChart;

let isAmbianceNodeActive = false;
let isAmbianceNodeActive2 = false;
let isHistorianNodeActive = false;
let watchdogInterval = null;
let historianInterval = null;

const NODE_AMBIANCE = "esp32_diff_drive";
const NODE_AMBIANCE_2 = "esp32_lora";
const NODE_HISTORIAN = "ambiance_historian";

const COLORS = {
    TEMP: { BLUE: "#0096ff", ORANGE: "#ffa500", RED: "#ff1717" },
    HUM: { ORANGE: "#ffa500", GREEN: "#10b981", BLUE: "#0ea5e9" },
    PRESS: { CYAN: "#06b6d4", BLUE: "#3b82f6" }
};

// SVG Icons
const ICONS = {
    TEMP: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.5V4a2 2 0 0 0-4 0v10.5a4 4 0 1 0 4 0z"></path></svg>`,
    HUM: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`,
    PRESS: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="12" x2="16.24" y2="7.76"></line></svg>`
};

function getTempColor(val) {
    if (val === null) return "rgba(255,255,255,0.3)";
    if (val < 25) return COLORS.TEMP.BLUE;
    if (val > 45) return COLORS.TEMP.RED;
    return COLORS.TEMP.ORANGE;
}

function getHumColor(val) {
    if (val === null) return "rgba(255,255,255,0.3)";
    if (val < 20) return COLORS.HUM.ORANGE;
    if (val > 80) return COLORS.HUM.BLUE;
    return COLORS.HUM.GREEN;
}

function getPressColor(val) {
    if (val === null) return "rgba(255,255,255,0.3)";
    if (val < 1013) return COLORS.PRESS.CYAN;
    return COLORS.PRESS.BLUE;
}

function applyBadgeContent(badgeElement, colorHex, iconSvg) {
    if (!badgeElement) return;
    badgeElement.innerHTML = iconSvg;
    badgeElement.style.color = colorHex;
    badgeElement.style.backgroundColor = `${colorHex}12`;
    badgeElement.style.border = `1px solid ${colorHex}35`;
    badgeElement.style.boxShadow = `0 4px 10px ${colorHex}20`;
}

export const ambianceWidget = {
    name: "Ambiance Widget",
    create: createAmbianceWidget,
    init: initAmbianceWidget,
    render: renderAmbianceWidget,
    destroy: destroyAmbianceWidget
};

function getRosInstance() { const ros = getROS(); return (ros && ros.isConnected) ? ros : null; }

export function createAmbianceWidget() {
    return `
<section class="card widgets-card">
    <div class="widgets-header"><h3>🌱 &nbsp; Ambiance & Télémétrie 24h</h3></div>
    <div class="ambiance-body">
        <div class="ambiance-grid">
            ${createItem("Temp (BMP)", "ambiance-temp-bmp", "badge-temp-bmp")}
            <div class="widget-divider"></div>
            ${createItem("Pression", "ambiance-press-bmp", "badge-press-bmp")}
            ${createItem("Temp (DHT)", "ambiance-temp-dht", "badge-temp-dht")}
            <div class="widget-divider"></div>
            ${createItem("Humidité", "ambiance-hum-dht", "badge-hum-dht")}
        </div>
        <div class="charts-title-row">
            <span class="charts-title-text">HISTORIQUES</span>
            <button id="btn-toggle-ambiance-charts" class="btn-toggle-charts">
                <svg id="toggle-amb-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
        </div>
        <div id="ambiance-charts-section" style="display: none; flex-direction: column; gap: 10px;">
            <div class="chart-block"><canvas id="ambiance-temp-chart"></canvas></div>
            <div class="chart-block"><canvas id="ambiance-hum-chart"></canvas></div>
            <div class="chart-block"><canvas id="ambiance-press-chart"></canvas></div>
        </div>
    </div>
    <div class="widget-pending-container" id="amb-pending-box" style="display:none;">
        <div class="widget-pending-title"><span class="pending-pulse-dot"></span>En attente : <span id="amb-missing-nodes"></span></div>
    </div>
</section>`;
}

function createItem(label, valId, badgeId) {
    // Notez l'ajout de <span class="ambiance-unit" id="${valId}-unit"></span>
    return `
    <div class="ambiance-item">
        <div id="${badgeId}" class="premium-badge-icon"></div>
        <div class="ambiance-values">
            <span class="ambiance-label">${label}</span>
            <div class="ambiance-value-wrapper">
                <span class="ambiance-val" id="${valId}">--</span>
                <span class="ambiance-unit" id="${valId}-unit"></span>
            </div>
        </div>
    </div>`;
}

export function initAmbianceWidget(container) {
    root = container;
    tempBmpLabel = root.querySelector("#ambiance-temp-bmp");
    pressBmpLabel = root.querySelector("#ambiance-press-bmp");
    tempDhtLabel = root.querySelector("#ambiance-temp-dht");
    humDhtLabel = root.querySelector("#ambiance-hum-dht");
    tempBmpBadge = root.querySelector("#badge-temp-bmp");
    pressBmpBadge = root.querySelector("#badge-press-bmp");
    tempDhtBadge = root.querySelector("#badge-temp-dht");
    humDhtBadge = root.querySelector("#badge-hum-dht");

    if (typeof Chart === "undefined") {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.onload = () => initCharts();
        document.head.appendChild(script);
    } else { initCharts(); }
    
    const toggleIconSvg = root.querySelector("#toggle-amb-icon");
    
    root.querySelector("#btn-toggle-ambiance-charts").addEventListener("click", () => {
        const section = root.querySelector("#ambiance-charts-section");
        const isHidden = section.style.display === "none";
        section.style.display = isHidden ? "flex" : "none";
        if(isHidden) {
            fetchHistory();
            [tempChart, humChart, pressChart].forEach(c => c?.resize());
            if (toggleIconSvg) toggleIconSvg.style.transform = "rotate(180deg)";
        }
        else {
            if (toggleIconSvg) toggleIconSvg.style.transform = "rotate(0deg)";
        }
    });

    const ros = getRosInstance();
    if (ros) {
        const cfg = AppState.config?.topics || {};
        tempBmpTopic = new ROSLIB.Topic({ ros, name: cfg.temperature_bmp180 || "/state/internal_bmp180_temp", messageType: "std_msgs/Float32" });
        tempBmpTopic.subscribe((m) => { localState.tempBmp = m.data; renderAmbianceWidget(); });
        pressBmpTopic = new ROSLIB.Topic({ ros, name: cfg.pression_bmp180 || "/state/internal_bmp180_pressure", messageType: "std_msgs/Float32" });
        pressBmpTopic.subscribe((m) => { localState.pressBmp = m.data; renderAmbianceWidget(); });
        tempDhtTopic = new ROSLIB.Topic({ ros, name: cfg.temperature_DHT12 || "/state/internal_temperature", messageType: "std_msgs/Float32" });
        tempDhtTopic.subscribe((m) => { localState.tempDht = m.data; renderAmbianceWidget(); });
        humDhtTopic = new ROSLIB.Topic({ ros, name: cfg.humidite_DHT12 || "/state/internal_humidity", messageType: "std_msgs/Float32" });
        humDhtTopic.subscribe((m) => { localState.humDht = m.data; renderAmbianceWidget(); });
    }
    
    fetchHistory();
    historianInterval = setInterval(fetchHistory, 60000);
    
    watchdogInterval = setInterval(checkNodes, 3000);
    checkNodes();
}

function initCharts() {
    const common = { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { display: true, labels: { color: "#fff" } } },
        scales: { x: { display: false }, y: { ticks: { color: "#fff" } } },
        elements: { point: { radius: 0, hitRadius: 10, hoverRadius: 4 }, line: {fill: false, borderWidth: 3, tension: 0.3}}
    };

    const createGradient = (ctx, chartArea, color) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, `${color}00`);
        gradient.addColorStop(1, `${color}60`);
        return gradient;
    };

    // Helper pour générer la config avec gradient
    const getChartCfg = (label, color) => ({
        type: 'line',
        data: { 
            labels: [], 
            datasets: [{ 
                label: label,
                data: [], 
                borderColor: color, 
                borderWidth: 1.5,
                tension: 0.3,
                fill: true,
                backgroundColor: (ctx) => {
                    const chart = ctx.chart;
                    const { ctx: canvasCtx, chartArea } = chart;
                    if (!chartArea) return null;
                    return createGradient(canvasCtx, chartArea, color);
                }
            }] 
        },
        options: common
    });

    tempChart = new Chart(root.querySelector("#ambiance-temp-chart"), getChartCfg("Température (°C)", COLORS.TEMP.ORANGE));
    humChart = new Chart(root.querySelector("#ambiance-hum-chart"), getChartCfg("Humidité (%)", COLORS.HUM.GREEN));
    pressChart = new Chart(root.querySelector("#ambiance-press-chart"), getChartCfg("Pression (hPa)", COLORS.PRESS.BLUE));
}

function updateCharts(data) {
    tempChart.data.labels = data.timestamps; tempChart.data.datasets[0].data = data.temperatures; tempChart.update();
    humChart.data.labels = data.timestamps; humChart.data.datasets[0].data = data.humidities; humChart.update();
    pressChart.data.labels = data.timestamps; pressChart.data.datasets[0].data = data.pressures; pressChart.update();
}

function checkNodes() {
    const ros = getRosInstance();
    if (!ros) return;
    ros.getNodes((nodes) => {
        isAmbianceNodeActive = nodes.some(n => n.includes(NODE_AMBIANCE));
        isAmbianceNodeActive2 = nodes.some(n => n.includes(NODE_AMBIANCE_2));
        isHistorianNodeActive = nodes.some(n => n.includes(NODE_HISTORIAN));
        renderAmbianceWidget();
    });
}

function fetchHistory() {
    let historyClient = new ROSLIB.Service({
        ros: getROS(),
        name: '/ambiance_historian/get_history',
        serviceType: 'std_srvs/srv/Trigger'
    });
    historyClient.callService(new ROSLIB.ServiceRequest(), (result) => {
        if (result.success) {
            updateCharts(JSON.parse(result.message));
        }
        else {
            log("❌ Ambiance historian : Impossible de joindre le service.");
        }
    });
}

export function renderAmbianceWidget() {
    if (localState.tempBmp !== null) { 
        tempBmpLabel.textContent = Number(localState.tempBmp).toFixed(1); 
        root.querySelector("#ambiance-temp-bmp-unit").textContent = "°C";
        const col = getTempColor(localState.tempBmp);
        tempBmpLabel.style.color = col; 
        applyBadgeContent(tempBmpBadge, col, ICONS.TEMP); 
    }
    if (localState.pressBmp !== null) { 
        pressBmpLabel.textContent = Math.round(localState.pressBmp); 
        root.querySelector("#ambiance-press-bmp-unit").textContent = "hPa";
        const col = getPressColor(localState.pressBmp);
        pressBmpLabel.style.color = col;
        applyBadgeContent(pressBmpBadge, col, ICONS.PRESS); 
    }
    if (localState.tempDht !== null) { 
        tempDhtLabel.textContent = Number(localState.tempDht).toFixed(1); 
        root.querySelector("#ambiance-temp-dht-unit").textContent = "°C";
        const col = getTempColor(localState.tempDht);
        tempDhtLabel.style.color = col;
        applyBadgeContent(tempDhtBadge, col, ICONS.TEMP); 
    }
    if (localState.humDht !== null) { 
        humDhtLabel.textContent = Math.round(localState.humDht); 
        root.querySelector("#ambiance-hum-dht-unit").textContent = "%";
        const col = getHumColor(localState.humDht);
        humDhtLabel.style.color = col;
        applyBadgeContent(humDhtBadge, col, ICONS.HUM); 
    }

    const box = root.querySelector("#amb-pending-box");
    const missing = [];
    if (!isAmbianceNodeActive) missing.push(NODE_AMBIANCE);
    if (!isAmbianceNodeActive2) missing.push(NODE_AMBIANCE_2);
    if (!isHistorianNodeActive) missing.push(NODE_HISTORIAN);
    
    if (missing.length > 0) {
        root.querySelector("#amb-missing-nodes").textContent = missing.join(", ");
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}

export function destroyAmbianceWidget() {
    clearInterval(watchdogInterval);
    [tempBmpTopic, pressBmpTopic, tempDhtTopic, humDhtTopic, historyTopic].forEach(t => t?.unsubscribe());
    [tempChart, humChart, pressChart].forEach(c => c?.destroy());
}