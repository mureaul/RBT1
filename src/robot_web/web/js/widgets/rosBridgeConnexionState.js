/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/rosBridgeConnexionStateWidget.js
 *
 * Widget : System Status
 ******************************************************************************/

import { log } from "../core/utils.js";
import { getUIState, onUIChanged, offUIChanged } from "../core/state.js";

let root = null;
let rosElement = null;
let pageElement = null;

export const rosBridgeConnexionStateWidget = {
    name: "rosBridgeConnexionState",
    create: createrosBridgeConnexionStateWidget,
    init: initrosBridgeConnexionStateWidget,
    render: renderrosBridgeConnexionStateWidget,
    destroy: destroyrosBridgeConnexionStateWidget
};

/******************************************************************************
 * HTML (Même identité visuelle et structurelle que la batterie)
 ******************************************************************************/
export function createrosBridgeConnexionStateWidget() {
    return `
<section class="card status-card">
    <div class="status-header">
        <h3>🖥️ &nbsp; System Status</h3>
    </div>

    <div class="status-body">
        
        <div class="status-main-row">
            <div class="status-info-block">
                <div id="status-ros" class="status-connection-badge">Disconnected</div>
            </div>
        </div>       
    </div>
</section>
`;
}

/******************************************************************************
 * INIT
 ******************************************************************************/
export function initrosBridgeConnexionStateWidget(container) {
    log("🖥️ Status widget premium v3");
    root = container;

    rosElement = root.querySelector("#status-ros");
    pageElement = root.querySelector("#status-page");

    // Abonnements aux changements d'état de l'UI
    onUIChanged(renderrosBridgeConnexionStateWidget);
    renderrosBridgeConnexionStateWidget();
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
export function renderrosBridgeConnexionStateWidget() {
    if (!root) return;

    const uiState = getUIState();

    // 1. Gestion dynamique du badge de connexion central
    if (rosElement) {
        if (uiState.connected) {
            rosElement.textContent = "CONNECTED";
            root.classList.remove("is-disconnected");
            root.classList.add("is-connected");
        } else {
            rosElement.textContent = "DISCONNECTED";
            root.classList.remove("is-connected");
            root.classList.add("is-disconnected");
        }
    }

    // 2. Mise à jour de la page active en bas
    if (pageElement) {
        pageElement.textContent = uiState.page ? uiState.page.toUpperCase() : "NONE";
    }
}

/******************************************************************************
 * DESTROY (Sprint 4 : Nettoyage de l'écouteur globale)
 ******************************************************************************/
export function destroyrosBridgeConnexionStateWidget() {
    if (typeof offUIChanged === "function") {
        offUIChanged(renderrosBridgeConnexionStateWidget);
    }
    root = null;
}