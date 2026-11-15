import { log } from "../core/utils.js";
import { registerWidget, mountPage, destroyPage } from "../core/widgetManager.js";
import { ambianceWidget } from "../widgets/ambianceWidget.js";
import { batteryWidget } from "../widgets/battery.js";
import { bladeTelemetryWidget } from "../widgets/bladeTelemetryWidget.js";
import { imuWidget } from "../widgets/imuWidget.js";
import { lidarWidget } from "../widgets/lidarWidget.js";



export function initCapteursPage() {
    render();
    registerWidgets();
    mountPage("capteurs");
}

function render() {
    // CORRECTION 1 : Correction de l'ID pour correspondre au format "page-system" du router
    const page = document.getElementById("page-capteurs");
    page.innerHTML = `
        <div class="dashboard-grid">
            
            <div id="widget-battery"></div>
            <div id="widget-scan"></div>
            <div id="widget-imu"></div>
            <div id="widget-ambiance"></div>
            <div id="widget-blade-telemetry"></div>

        </div>
    `;
}

function registerWidgets() {
    registerWidget("capteurs", document.getElementById("widget-scan"), lidarWidget);
    registerWidget("capteurs", document.getElementById("widget-imu"), imuWidget);
    registerWidget("capteurs", document.getElementById("widget-ambiance"), ambianceWidget);
    registerWidget("capteurs", document.getElementById("widget-battery"), batteryWidget);
    registerWidget("capteurs", document.getElementById("widget-blade-telemetry"), bladeTelemetryWidget);

}

// CORRECTION 2 : Nommage de la fonction en cohérence avec le reste du projet
export function destroyCapteursPage() {
    // CORRECTION 3 : Utilisation du bon identifiant de scope "system"
    destroyPage("capteurs");
}