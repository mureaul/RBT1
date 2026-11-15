
/******************************************************************************
 * layout/sidebar.js
 ******************************************************************************/

import { getUIState, toggleSidebar } from "../core/state.js";

let sidebar = null;
let button = null;

export function initSidebar() {

    sidebar = document.querySelector(".sidebar");
    button = document.getElementById("sidebar-toggle");

    if (!sidebar) {

        console.warn("Sidebar not found");
        return;

    }

    if (button) {

        button.addEventListener("click", toggleSidebar);

    }

}

export function renderSidebar() {

    if (!sidebar) return;

    const ui = getUIState();

    sidebar.classList.toggle("collapsed",ui.sidebarCollapsed);
    
    // 🔥 highlight page active
    document.querySelectorAll(".nav-item").forEach(item => {

        const page = item.dataset.page;

        item.classList.toggle(
            "active",
            page === ui.page
        );

    });
}

export function destroySidebar() {

    if (button) {

        button.removeEventListener("click", toggleSidebar);

    }

    sidebar = null;
    button = null;

}