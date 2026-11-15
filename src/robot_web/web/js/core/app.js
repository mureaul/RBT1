/******************************************************************************
 * RBT1 Robot Control Interface
 * core/app.js
 ******************************************************************************/
import { initConfig, getConfig } from "./config.js";
import { initUI } from "./ui.js";
import { initRouter, navigate } from "./router.js";
import { initROS } from "./ros.js";
import { Pages } from "./pages.js";
import { initLayout } from "./layoutManager.js";
import { log } from "./utils.js";

// Importation explicite du cycle de vie de la page commande
import { initCommandPage, destroyCommandPage } from "../pages/command.js";
import { destroySystemPage } from "../pages/system.js";
import { destroySettingsPage } from "../pages/settings.js";
import { destroyNavigationPage } from "../pages/navigation.js";

import { batteryIconWidget } from "../widgets/icons/batteryIconWidget.js";
import { modeToggleIconWidget } from "../widgets/icons/modeToggleIconWidget.js";
import { wifiIconWidget } from "../widgets/icons/wifiIconWidget.js";

/******************************************************************************
 * STATE GLOBAL (Ajusté pour le cycle de vie du routeur)
 ******************************************************************************/
export const AppState = {
    config: null,
    ros: null,
    currentPage: null, // IMPÉRATIF : À 'null' pour que le routeur accepte le premier navigate("command")
    pages: {},
    destroyPages: {}   // AJOUT : Stockage des fonctions de destruction pour le routeur
};

/******************************************************************************
 * BOOTSTRAP
 ******************************************************************************/
async function bootstrap() {
    log("🚀 RBT1 UI starting...");
    
    const cfg = await fetch("/config/config.json").then(r => r.json());
    initConfig(cfg);
    AppState.config = getConfig();
    log("✔ Configuration loaded");

    // 1. Génération de l'interface globale
    initUI(AppState);
    
    // 2. Assignation des hooks d'initialisation et de destruction des pages
    AppState.pages = Pages; 
    AppState.destroyPages = {
        command: destroyCommandPage,
        navigation: destroyNavigationPage, 
        costmap: () => {},
        lidar: () => {},
        gps: () => {},
        system: destroySystemPage,
        settings: destroySettingsPage
    };

    // 3. Initialisations annexes
    initLayout();
    initRouter(AppState);
    initROS(AppState);
    batteryIconWidget.init();
    wifiIconWidget.init();
    modeToggleIconWidget.init();
    
    // 4. Déclenchement de la page par défaut
    navigate("command");

    log("✅ Application ready");
}

bootstrap();