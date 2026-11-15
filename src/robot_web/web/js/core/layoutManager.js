/******************************************************************************
 * Layout Manager
 ******************************************************************************/

import { log } from "./utils.js";
import {initSidebar,renderSidebar,destroySidebar} from "../layout/sidebar.js";
import {onUI} from "./state.js";

/******************************************************************************
 * INIT
 ******************************************************************************/

export function initLayout() {

    log("🖥 Layout init");

    initSidebar();

    onUI(

        "sidebarCollapsed",

        renderSidebar

    );

    renderSidebar();

}

/******************************************************************************
 * DESTROY
 ******************************************************************************/

export function destroyLayout() {

    destroySidebar();

}