/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/settings/limits.js
 *
 * Robot Limits Widget
 ******************************************************************************/

import {
    getConfig,
    setValue,
    onConfig,
    offConfig
} from "../../core/config.js";

import { log } from "../../core/utils.js";

/******************************************************************************
 * PRIVATE
 ******************************************************************************/

let root = null;

export const limitsWidget = {
    name: "Robot Limits",
    create: createLimitsWidget,
    init: initLimitsWidget,
    render: renderLimitsWidget,
    destroy: destroyLimitsWidget
};

/******************************************************************************
 * HTML (Structure Premium Harmonies Formulaires & Télémétrie)
 ******************************************************************************/
export function createLimitsWidget() {
    return `
<section class="card limits-card">
    <div class="limits-header">
        <h3>⚙️ &nbsp; Robot Limits</h3>
    </div>

    <div class="limits-body">
        <div class="limits-form-container">
            <div class="limits-row-group">
                <label for="maxLinear">Max linear speed</label>
                <div class="limits-input-wrapper">
                    <input id="maxLinear" type="number" min="0" max="2" step="0.01" placeholder="0.00">
                    <span class="limits-unit">m/s</span>
                </div>
            </div>
            <div class="limits-row-group">
                <label for="maxAngular">Max angular speed</label>
                <div class="limits-input-wrapper">
                    <input id="maxAngular" type="number" min="0" max="5" step="0.01" placeholder="0.00">
                    <span class="limits-unit">rad/s</span>
                </div>
            </div>
            <div class="limits-row-group">
                <label for="maxBlade">Max blade speed</label>
                <div class="limits-input-wrapper">
                    <input id="maxBlade" type="number" min="0" max="20000" step="100" placeholder="0">
                    <span class="limits-unit">rpm</span>
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
export function initLimitsWidget(container) {
    log("⚙️ Limits widget premium init");

    root = container;

    root.querySelector("#maxLinear").addEventListener("change", onLinearChanged);
    root.querySelector("#maxAngular").addEventListener("change", onAngularChanged);
    root.querySelector("#maxBlade").addEventListener("change", onBladeChanged);

    renderLimitsWidget();

    onConfig("limits.maxLinearSpeed", renderLimitsWidget);
    onConfig("limits.maxAngularSpeed", renderLimitsWidget);
    onConfig("limits.maxBladeSpeed", renderLimitsWidget);
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
export function renderLimitsWidget() {
    if (!root) return;

    const cfg = getConfig();

    if (cfg?.limits) {
        root.querySelector("#maxLinear").value = cfg.limits.maxLinearSpeed ?? 0;
        root.querySelector("#maxAngular").value = cfg.limits.maxAngularSpeed ?? 0;
        root.querySelector("#maxBlade").value = cfg.limits.maxBladeSpeed ?? 0;
    }
}

/******************************************************************************
 * EVENTS
 ******************************************************************************/
function onLinearChanged(event) {
    const value = clamp(Number(event.target.value), 0, 2);
    setValue("limits.maxLinearSpeed", value);
}

function onAngularChanged(event) {
    const value = clamp(Number(event.target.value), 0, 5);
    setValue("limits.maxAngularSpeed", value);
}

function onBladeChanged(event) {
    const value = clamp(Number(event.target.value), 0, 20000);
    setValue("limits.maxBladeSpeed", value);
}

/******************************************************************************
 * HELPERS
 ******************************************************************************/
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/
export function destroyLimitsWidget() {
    offConfig("limits.maxLinearSpeed", renderLimitsWidget);
    offConfig("limits.maxAngularSpeed", renderLimitsWidget);
    offConfig("limits.maxBladeSpeed", renderLimitsWidget);
    root = null;
}