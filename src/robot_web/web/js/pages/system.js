import { log } from "../core/utils.js";
import { registerWidget, mountPage, destroyPage } from "../core/widgetManager.js";
import { bringupOrchestratorWidget } from "../widgets/bringupOrchestratorWidget.js";
import { rosBridgeConnexionStateWidget } from "../widgets/rosBridgeConnexionState.js";
import { RosNodeStateWidget } from "../widgets/rosNodeState.js";
import { RosTopicStateWidget } from "../widgets/rosTopicState.js";
import { RosBridgeParamWidget } from "../widgets/settings/rosBridgeParam.js";
import { systemWidget } from "../widgets/systemWidget.js";

export function initSystemPage() {
    render();
    registerWidgets();
    mountPage("system");
}

function render() {
    // CORRECTION 1 : Correction de l'ID pour correspondre au format "page-system" du router
    const page = document.getElementById("page-system");
    page.innerHTML = `
        <div class="dashboard-grid">

            <div id="widget-system"></div>
            <div id="widget-rosbridgestate"></div>
            <div id="widget-bringup"></div>
            <div id="widget-rosnodestate"></div>
            <div id="widget-rostopicstate"></div>
                    
        </div>
    `;
}

function registerWidgets() {
    registerWidget("system", document.getElementById("widget-system"), systemWidget);
    registerWidget("system", document.getElementById("widget-rosbridgestate"), rosBridgeConnexionStateWidget);
    registerWidget("system", document.getElementById("widget-rosnodestate"), RosNodeStateWidget);
    registerWidget("system", document.getElementById("widget-rostopicstate"), RosTopicStateWidget);
    registerWidget("system", document.getElementById("widget-bringup"), bringupOrchestratorWidget);


}

// CORRECTION 2 : Nommage de la fonction en cohérence avec le reste du projet
export function destroySystemPage() {
    // CORRECTION 3 : Utilisation du bon identifiant de scope "system"
    destroyPage("system");
}