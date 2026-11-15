/******************************************************************************
 * RBT1 Robot Control Interface
 * core/ui.js
 ******************************************************************************/

import { log } from "./utils.js";
import { modeToggleIconWidget } from "../widgets/icons/modeToggleIconWidget.js";
import { wifiIconWidget } from "../widgets/icons/wifiIconWidget.js";

export function initUI(AppState) {
    log("🎨 Initializing Premium UI Shell...");
    buildLayout();
    initSidebarToggle();
    setRosStatus(false);
}

/******************************************************************************
 * LAYOUT (Identité Cyber-Industrielle Harmonisée)
 ******************************************************************************/
function buildLayout() {
    const app = document.getElementById("app");

    app.innerHTML = `
<div class="app-shell">

    <header class="topbar">
        <div class="topbar-left">
            <button id="sidebar-toggle" aria-label="Toggle Sidebar">☰</button>
            <div class="logo">
                <span class="logo-icon">🚜</span> RBT1 <span class="logo-sub">OS</span>
            </div>
        </div>

        <div class="topbar-right">
            
            ${modeToggleIconWidget.create()}    
        
            <div id="topbar-ros-badge" class="topbar-ros-status">
                <svg viewBox="0 0 24 24" class="ros-status-svg">
                    <circle cx="12" cy="12" r="7" fill="currentColor" />
                </svg>
                <svg viewBox="0 0 24 24" class="status-ring">
                    <circle cx="12" cy="12" r="7" />
                </svg>
            </div>

            ${wifiIconWidget.create()}
            
            <div id="topbar-battery-icon-container"></div>

        </div>
    </header>

    <div class="body">

        <aside class="sidebar" id="app-sidebar">
            <nav class="sidebar-nav">
                <div class="nav-item active" data-page="command">
                    <span class="nav-icon">🎮</span>
                    <span class="nav-label">Commande</span>
                </div>

                <div class="nav-item" data-page="navigation">
                    <span class="nav-icon">🧭</span>
                    <span class="nav-label">Navigation</span>
                </div>

                <div class="nav-item" data-page="costmap">
                    <span class="nav-icon">🗺️</span>
                    <span class="nav-label">Costmap</span>            
                </div>

                <div class="nav-item" data-page="capteurs">
                    <span class="nav-icon">📡</span>
                    <span class="nav-label">Capteurs</span>
                </div>

                <div class="nav-item" data-page="camera">
                    <span class="nav-icon">📷</span>
                    <span class="nav-label">Camera</span>
                </div>

                <div class="nav-item" data-page="system">
                    <span class="nav-icon">🔧</span>
                    <span class="nav-label">Système</span>
                </div>

                <div class="nav-item" data-page="settings">
                    <span class="nav-icon">⚙️</span>
                    <span class="nav-label">Paramètres</span>
                </div>
            </nav>
        </aside>

        <main class="content">
            <section id="page-command" class="page active"></section>
            <section id="page-navigation" class="page"></section>
            <section id="page-costmap" class="page"></section>
            <section id="page-capteurs" class="page"></section>
            <section id="page-camera" class="page"></section>
            <section id="page-system" class="page"></section>
            <section id="page-settings" class="page"></section>
        </main>

    </div>

</div>
`;
}

/******************************************************************************
 * SIDEBAR INTERACTION
 ******************************************************************************/
function initSidebarToggle() {
    const toggleBtn = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("app-sidebar");
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }
}

/******************************************************************************
 * ROS STATUS (Copie exacte de la logique de couleur réactive de nos widgets)
 ******************************************************************************/
export function setRosStatus(connected) {
    const badge = document.getElementById("topbar-ros-badge");
    if (!badge) return;

    if (connected) {
        badge.classList.remove("is-disconnected");
        badge.classList.add("is-connected");
        badge.setAttribute("title", "ROS Connected");
    } else {
        badge.classList.remove("is-connected");
        badge.classList.add("is-disconnected");
        badge.setAttribute("title", "ROS Offline");
    }
}

export function showMessage(message) { log(message); }
export function getPage(name) { return document.getElementById(`page-${name}`); }