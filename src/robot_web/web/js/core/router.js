/******************************************************************************
 * RBT1 Robot Control Interface
 * core/router.js
 *
 * Router central (UI navigation avec gestion du cycle de vie)
 ******************************************************************************/

import { log } from "./utils.js";
import { setCurrentPage } from "./state.js";

let AppState = null;

/******************************************************************************
 * INIT
 ******************************************************************************/
export function initRouter(state) {
    AppState = state;
    bindNavigation();
    log("🧭 Router initialized with life-cycle management");
}

/******************************************************************************
 * NAVIGATE (Avec nettoyage automatique des anciens widgets)
 ******************************************************************************/
export function navigate(page) {
    if (!AppState) return;

    // Récupération de la page que l'on s'apprête à quitter
    const previousPage = AppState.currentPage;

    // Si on demande la page déjà active, on ne fait rien
    if (previousPage === page) return;

    log(`🔄 Transitioning page: ${previousPage || "NONE"} ➡️ ${page}`);

    // --- 1. HOOK DE DESTRUCTION (NETTOYAGE) ---
    // Si une page était active et qu'elle possède une fonction de destruction, on l'exécute
    if (previousPage && AppState.destroyPages?.[previousPage]) {
        log(`🧹 Destroying previous page components: ${previousPage}`);
        AppState.destroyPages[previousPage](AppState);
    }

    // --- 2. MISE À JOUR DE L'ÉTAT CENTRAL ---
    AppState.currentPage = page;
    setCurrentPage(page);

    // --- 3. COMMUTATION VISUELLE (CSS) ---
    document.querySelectorAll(".page").forEach(p => {
        p.style.display = "none";
        p.classList.remove("active"); // Cohérence avec le CSS Premium
    });

    const target = document.getElementById(`page-${page}`);
    if (target) {
        target.style.display = "block";
        target.classList.add("active"); // Cohérence avec le CSS Premium
    }

    // Mettre à jour visuellement la Sidebar pour l'élément actif
    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.toggle("active", item.dataset.page === page);
    });

    log("📄 Navigate →", page);

    // --- 4. HOOK D'INITIALISATION (CREATION) ---
    const initFn = AppState.pages?.[page];
    if (initFn) {
        initFn(AppState);
    }
}

/******************************************************************************
 * EVENTS
 ******************************************************************************/
function bindNavigation() {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            navigate(item.dataset.page);
        });
    });
}