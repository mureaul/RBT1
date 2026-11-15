import { initCommandPage } from "../pages/command.js";
import { initCapteursPage } from "../pages/capteurs.js";
import { initNavigationPage } from "../pages/navigation.js";
import { initSettingsPage } from "../pages/settings.js";
import { initSystemPage } from "../pages/system.js";
import { initGpsWidget } from "../widgets/gpsWidget.js";
import { initCameraPage } from "../pages/camera.js";
import { initCostmapPage } from "../pages/costmap.js";


export const Pages = {

    command: initCommandPage,

    settings: initSettingsPage,

    system: initSystemPage,

    navigation: initNavigationPage,

    capteurs: initCapteursPage,

    camera: initCameraPage,

    costmap: initCostmapPage

};