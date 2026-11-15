import { log } from "../core/utils.js";
import { registerWidget, mountPage, destroyPage } from "../core/widgetManager.js";
import { gpsRecorderWidget } from "../widgets/gpsRecorderWidget.js";
import { gpsWidget } from "../widgets/gpsWidget.js";
import { missionPlannerWidget } from "../widgets/missionPlanner.js";
import { workcellManagerWidget} from "../widgets/workcellManager.js";

export function initNavigationPage() {
    render();
    registerWidgets();
    mountPage("navigation");
}

function render() {
    // CORRECTION 1 : Correction de l'ID pour correspondre au format "page-system" du router
    const page = document.getElementById("page-navigation");
    page.innerHTML = `
        <div class="dashboard-grid">
            
            <div id="widget-gpsrecord"></div>
            <div id="widget-gps"></div>
            <div id="widget-planner"></div>
            
        </div>
    `;
}

function registerWidgets() {
    registerWidget("navigation", document.getElementById("widget-gps"), gpsWidget);
    registerWidget("navigation", document.getElementById("widget-gpsrecord"), workcellManagerWidget);
    registerWidget("navigation", document.getElementById("widget-planner"), missionPlannerWidget);
}

// CORRECTION 2 : Nommage de la fonction en cohérence avec le reste du projet
export function destroyNavigationPage() {
    // CORRECTION 3 : Utilisation du bon identifiant de scope "system"
    destroyPage("navigation");
}