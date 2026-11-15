import { log } from "../core/utils.js";
import { registerWidget, mountPage, destroyPage } from "../core/widgetManager.js";
import { limitsWidget } from "../widgets/settings/limits.js";
import { RosBridgeParamWidget } from "../widgets/settings/rosBridgeParam.js";

export function initSettingsPage() {
    render();
    registerWidgets();
    mountPage("settings");
}

function render() {
    // CORRECTION 1 : Correction de l'ID pour correspondre au format "page-system" du router
    const page = document.getElementById("page-settings");
    page.innerHTML = `
        <div class="dashboard-grid">

            <div id="widget-rosbridgeparam"></div>
            <div id="widget-limits"></div>
        
        </div>
    `;
}

function registerWidgets() {

    registerWidget("settings", document.getElementById("widget-rosbridgeparam"), RosBridgeParamWidget);
    registerWidget("settings", document.getElementById("widget-limits"), limitsWidget);

}

// CORRECTION 2 : Nommage de la fonction en cohérence avec le reste du projet
export function destroySettingsPage() {
    // CORRECTION 3 : Utilisation du bon identifiant de scope "system"
    destroyPage("settings");
}
