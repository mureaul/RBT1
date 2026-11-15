import { getFeedbackState, onFeedback, offFeedback } from "../../core/state.js";
import { log } from "../../core/utils.js";

export const batteryIconWidget = {
    name: "Battery Icon Widget",
    init: initBatteryIconWidget,
    create: createBatteryIconWidget,
    render: renderBatteryIcon,
    destroy: destroyBatteryIconWidget
};


function createBatteryIconWidget() {
    return `      
    <div class="topbar-battery-icon">
            <svg class="battery-icon-svg" viewBox="0 0 24 24">
                <rect x="3" y="7" width="14" height="10" rx="2" fill="none" stroke="${color}" stroke-width="2"/>
                <rect x="18" y="10" width="2" height="4" rx="1" fill="${color}"/>
                <rect x="5" y="9" width="${(level/100)*10}" height="6" fill="${color}"/>
            </svg>
            <span class="topbar-battery-value">${level}%</span>
        </div>
    `;
}

function initBatteryIconWidget() {
    log("⚙️ Init BatteryIconWidget");
    onFeedback("battery", renderBatteryIcon);
    renderBatteryIcon();
}

function renderBatteryIcon() {
    const container = document.getElementById("topbar-battery-icon-container");
    if (!container) return;

    const battery = getFeedbackState().battery ?? {};
    const level = Math.round(battery.percentage ?? 0);
    const status = battery.power_supply_status ?? 0;
    const isCharging = (status === 1 || (status === 0 && (battery.current ?? 0) > 0.05));

    // 1. Définition correcte de la classe d'état
    let stateClass = "bat-high";
    if (level < 15) stateClass = "bat-low";
    else if (level <= 50) stateClass = "bat-mid";

    // 2. Application des classes sur le conteneur existant
    container.className = `battery-widget-wrapper ${stateClass} ${isCharging ? 'is-charging' : ''}`;

    // 3. Calcul de la largeur (max 11px)
    const fillWidth = (level / 100) * 11;

    container.innerHTML = `
        <svg class="battery-icon-svg" viewBox="0 0 24 24">
            <rect class="bat-outline" x="4" y="8" width="12" height="8" rx="1.5" fill="none" stroke-width="2" />
            <rect class="bat-tip" x="17" y="10" width="2" height="4" rx="0.5" />
            <rect class="bat-fill" x="4.5" y="8.5" width="${fillWidth}" height="7" rx="1" />
            <path class="battery-bolt-icon" d="M12,4 L7,12 L10,12 L8,20 L13,12 L10,12 Z" fill="#ffffff" stroke="#000" stroke-width="0.5"/>
        </svg>
        <span class="topbar-battery-value">${level}%</span>
    `;
}

function destroyBatteryIconWidget() {
    offFeedback("battery", renderBatteryIcon);
}