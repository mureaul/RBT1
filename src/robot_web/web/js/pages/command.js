/******************************************************************************
 * Command Page
 ******************************************************************************/

import { log } from "../core/utils.js";
import {registerWidget, mountPage, destroyPage} from "../core/widgetManager.js";

import {joystickWidget} from "../widgets/command/joystick.js";
import {stopButtonWidget} from "../widgets/command/stopButton.js";
import { gpsRecorderWidget } from "../widgets/gpsRecorderWidget.js";
import { bladeButtonWidget } from "../widgets/command/bladeButton.js";
import { bladeSliderWidget } from "../widgets/command/bladeSlider.js";
import { modeToggleWidget } from "../widgets/modeToggleWidget.js";

/******************************************************************************
 * INIT
 ******************************************************************************/

export function initCommandPage() {

    log("🎮 Command page init");

    render();

    registerWidgets();

    mountPage("command");

}

/******************************************************************************
 * RENDER
 ******************************************************************************/

function render() {

    const page =

        document.getElementById("page-command");

    page.innerHTML = `

<div class="dashboard-grid">

    <div id="widget-joystick"></div>

    <div id="widget-blade"></div>

    <div id="widget-recorder"></div>

    <div id="widget-mode"></div>

</div>

`;

}

/******************************************************************************
 * REGISTER
 ******************************************************************************/

function registerWidgets() {

    registerWidget("command",document.getElementById("widget-joystick"),joystickWidget);
    registerWidget("command",document.getElementById("widget-blade"),bladeButtonWidget);
    registerWidget("command",document.getElementById("widget-recorder"),gpsRecorderWidget);
    registerWidget("command",document.getElementById("widget-mode"),modeToggleWidget);
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/

export function destroyCommandPage() {

    destroyPage("command");

}