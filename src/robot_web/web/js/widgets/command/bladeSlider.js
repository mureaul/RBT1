/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/command/bladeSlider.js
 *
 * Blade Speed Widget
 ******************************************************************************/

import { log } from "../../core/utils.js";
import {
    getConfig,
    onConfig,
    offConfig
} from "../../core/config.js";
import {
    getTargetState,
    setTargetState,
    onTarget,
    offTarget
} from "../../core/state.js";

/******************************************************************************
 * PRIVATE STATE
 ******************************************************************************/
let root = null;
let slider = null;
let valueLabel = null;

/******************************************************************************
 * CREATE (Structure Unifiée Premium)
 ******************************************************************************/
function createBladeSlider() {
    return `
<section class="card bladeSlider-card">
    <div class="bladeSlider-header">
        <h3>🔪 &nbsp; Blade Speed</h3>
    </div>

    <div class="bladeSlider-body">
        
        <div class="bladeslider-slider-container">
            <input id="blade-slider" class="bladeslider-slider" type="range" min="0" step="100">
        </div>

        <div class="bladeslider-details-grid">
            <div class="bladeslider-sub-grid">
                <div class="bladeslider-values-block format-left">
                    <span class="bladeslider-label">Velocity</span>
                    <div class="bladeslider-value-wrapper">
                        <span id="blade-value" class="bladeslider-value">0</span>
                        <span class="bladeslider-unit">RPM</span>
                    </div>
                </div>
                <div class="premium-badge-icon">
                    <svg viewBox="0 0 24 24" class="badge-svg-blue">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8l1.46 1.46c-.1.41-.16.85-.16 1.34 0 2.21 1.79 4 4 4s4-1.79 4-4c0-.49-.06-.93-.16-1.34l1.46-1.46c.45.83.7 1.79.7 2.8 0 3.31-2.69 6-6 6zm3.54-9.54L14.4 11.6c.38-.4.6-.94.6-1.6 0-1.1-.9-2-2-2s-2 .9-2 2c0 .66.22 1.2.6 1.6l-1.14 1.14c-.6-.62-.96-1.48-.96-2.43 0-2.21 1.79-4 4-4s4 1.79 4 4c0 .95-.36 1.81-.96 2.43z"/>
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
function initBladeSlider(container) {
    log("🔪 Blade slider premium init");

    root = container;
    slider = root.querySelector("#blade-slider");
    valueLabel = root.querySelector("#blade-value");

    if (!slider || !valueLabel) {
        console.error("BladeSlider : DOM not found");
        return;
    }

    slider.addEventListener("input", onSliderInput);
    onConfig("limits.maxBladeSpeed", renderBladeSlider);
    onTarget("blade", renderBladeSlider);

    renderBladeSlider();
}

/******************************************************************************
 * RENDER
 ******************************************************************************/
function renderBladeSlider() {
    if (!slider) return;

    const cfg = getConfig();
    const state = getTargetState();

    slider.max = cfg.limits.maxBladeSpeed;
    slider.value = state.blade;
    valueLabel.textContent = Math.round(state.blade);
}

/******************************************************************************
 * EVENTS
 ******************************************************************************/
function onSliderInput(event) {
    const cfg = getConfig();
    const max = cfg.limits.maxBladeSpeed;
    let blade = Number(event.target.value);

    blade = Math.max(0, Math.min(max, blade));

    setTargetState({
        blade
    });
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/
function destroyBladeSlider() {
    log("🧹 Blade slider premium destroy");

    offConfig("limits.maxBladeSpeed", renderBladeSlider);
    offTarget("blade", renderBladeSlider);

    slider?.removeEventListener("input", onSliderInput);

    slider = null;
    valueLabel = null;
    root = null;
}

/******************************************************************************
 * API/EXPORT
 ******************************************************************************/
export const bladeSliderWidget = {
    name: "Blade Slider",
    create: createBladeSlider,
    init: initBladeSlider,
    render: renderBladeSlider,
    destroy: destroyBladeSlider
};