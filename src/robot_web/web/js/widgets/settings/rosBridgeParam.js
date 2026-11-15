/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/settings/rosWidget.js
 *
 * Widget : ROS Bridge Configuration
 ******************************************************************************/

import { log } from "../../core/utils.js";
import { getConfig, setValue } from "../../core/config.js";

let root = null;
let hostElement = null;
let portElement = null;

export const RosBridgeParamWidget = {
    name: "RosBridgeParam Widget",
    create: createRosBridgeParamWidget,
    init: initRosBridgeParamWidget,
    render: renderRosBridgeParamWidget,
    destroy: destroyRosBridgeParamWidget
};

/******************************************************************************
 * HTML (Fusion de l'identité visuelle Premium et Formulaire)
 ******************************************************************************/
export function createRosBridgeParamWidget() {
    return `
<section class="card ros-card">
    <div class="ros-header">
        <h3>🌐 &nbsp; ROS Bridge</h3>
    </div>

    <div class="ros-body">
        <div class="ros-form-grid">
            <div class="ros-input-group">
                <label for="ros-host">Host</label>
                <input id="ros-host" type="text" placeholder="localhost" spellcheck="false">
            </div>
            <div class="ros-input-group">
                <label for="ros-port">Port</label>
                <input id="ros-port" type="number" placeholder="9090">
            </div>
        </div>

        <div class="ros-details-grid">
            <div class="protocol-sub-grid">
                <div class="ros-values-block format-left">
                    <span class="ros-label">Protocol</span>
                    <span class="ros-value">WEBSOCKET</span>
                </div>
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue">
                        <path d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M11,19.93 C7.05,19.44 4,16.08 4,12 C4,11.38 4.08,10.78 4.21,10.21 L9,15 L9,16 C9,17.1 9.9,18 11,18 L11,19.93 Z M17.9,15.39 C17.61,14.58 16.85,14 16,14 L15,14 L15,11 C15,10.45 14.55,10 14,10 L8,10 L8,8 L10,8 C10.55,8 11,7.55 11,7 L11,5 L13,5 C14.66,5 16,6.34 16,8 L16,9.5 C17.19,10.15 18,11.42 18,13 C18,13.91 17.62,14.73 17.9,15.39 Z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</section>
`;
}

/******************************************************************************
 * INIT
 ******************************************************************************/
export function initRosBridgeParamWidget(container) {
    log("🌐 ROS Bridge widget premium");
    root = container;

    const cfg = getConfig();

    hostElement = root.querySelector("#ros-host");
    portElement = root.querySelector("#ros-port");

    // Hydratation initiale
    if (cfg?.rosbridge) {
        hostElement.value = cfg.rosbridge.host ?? "";
        portElement.value = cfg.rosbridge.port ?? "";
    }

    // Écouteurs d'événements persistants
    hostElement.addEventListener("change", handleHostChange);
    portElement.addEventListener("change", handlePortChange);
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
export function renderRosBridgeParamWidget(container) {

}

/******************************************************************************
 * INTERNALS / EVENT HANDLERS
 ******************************************************************************/
function handleHostChange() {
    if (hostElement) {
        setValue("rosbridge.host", hostElement.value.trim());
    }
}

function handlePortChange() {
    if (portElement) {
        setValue("rosbridge.port", Number(portElement.value));
    }
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/
export function destroyRosBridgeParamWidget() {
    if (hostElement) hostElement.removeEventListener("change", handleHostChange);
    if (portElement) portElement.removeEventListener("change", handlePortChange);
    root = null;
}
