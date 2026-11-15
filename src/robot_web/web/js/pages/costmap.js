import { log } from "../core/utils.js";
import { registerWidget, mountPage, destroyPage } from "../core/widgetManager.js";
import { localCostmapWidget } from "../widgets/localCostmap.js";


export function initCostmapPage() {
    render();
    registerWidgets();
    mountPage("costmap");
}

function render() {
    // CORRECTION 1 : Correction de l'ID pour correspondre au format "page-system" du router
    const page = document.getElementById("page-costmap");
    page.innerHTML = `
        <div class="dashboard-grid">
            
            <div id="widget-localcostmap"></div>

            
        </div>
    `;
}

function registerWidgets() {

    registerWidget("costmap", document.getElementById("widget-localcostmap"), localCostmapWidget);

}

// CORRECTION 2 : Nommage de la fonction en cohérence avec le reste du projet
export function destroyCostmapPage() {
    // CORRECTION 3 : Utilisation du bon identifiant de scope "system"
    destroyPage("costmap");
}