/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/navigation/localCostmap.js
 *
 * Local Costmap Canvas Visualizer Widget
 ******************************************************************************/

import { log } from "../core/utils.js";
import { getFeedbackState, onFeedback, offFeedback } from "../core/state.js";

let root = null;
let canvas = null;
let ctx = null;

export const localCostmapWidget = {
    name: "Local Costmap",
    create: createCostmap,
    init: initCostmap,
    render: renderCostmap,
    destroy: destroyCostmap
};

function createCostmap() {
    return `
<section class="widgets-card">
    <div class="widgets-header">
        <h3>🗺️ &nbsp; Local Costmap</h3>
    </div>
    <div class="widgets-body">
        <div class="costmap-canvas-wrapper">
            <canvas id="costmap-canvas" width="200" height="200"></canvas>
        </div>
        <div class="costmap-footer-legend">
            <span class="legend-item unknown">Inconnu</span>
            <span class="legend-item free">Libre</span>
            <span class="legend-item obstacle">Obstacle</span>
        </div>
    </div>
</section>
`;
}

function initCostmap(container) {
    log("🗺️ Local Costmap widget init");
    root = container;

    setTimeout(() => {
        canvas = root.querySelector("#costmap-canvas");
        if (!canvas) return;
        ctx = canvas.getContext("2d");

        // On écoute le store central quand la costmap est mise à jour par ros.js
        onFeedback("costmap", renderCostmap);
        renderCostmap();
    }, 0);
}

function renderCostmap() {
    if (!canvas || !ctx) return;

    const feedback = getFeedbackState();
    const mapData = feedback.costmap; // Doit contenir { width, height, data }

    if (!mapData || !mapData.data) {
        // Mode Standby / Pas de données
        ctx.fillStyle = "#1a1e26";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#525a6c";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("En attente des données ROS...", canvas.width / 2, canvas.height / 2);
        return;
    }

    const w = mapData.width;
    const h = mapData.height;

    // Ajuste dynamiquement la taille du canvas si la costmap ROS change de résolution
    if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
    }

    // Création d'une image en mémoire pour un rendu ultra-rapide pixel par pixel
    const imgData = ctx.createImageData(w, h);
    const data = mapData.data;

    for (let i = 0; i < data.length; i++) {
        const value = data[i]; // Valeur ROS classique entre -1 et 100
        const idx = i * 4;

        if (value === -1) {
            // ZONE INCONNUE : Gris foncé texturé
            imgData.data[idx]      = 34;  // R
            imgData.data[idx + 1] = 39;  // G
            imgData.data[idx + 2] = 51;  // B
            imgData.data[idx + 3] = 255; // A
        } else if (value === 0) {
            // ZONE LIBRE : Transparent / Noir d'arrière-plan
            imgData.data[idx]      = 20;
            imgData.data[idx + 1] = 23;
            imgData.data[idx + 2] = 30;
            imgData.data[idx + 3] = 255;
        } else {
            // ZONE D'OBSTACLE / COÛT : Dégradé du jaune au rouge vif selon l'importance (0-100)
            const factor = value / 100;
            imgData.data[idx]      = 239;                     // Rouge fort
            imgData.data[idx + 1] = Math.round(83 * (1 - factor)); // Vert décroissant
            imgData.data[idx + 2] = Math.round(80 * (1 - factor)); // Bleu décroissant
            imgData.data[idx + 3] = 255;
        }
    }

    // Dessin de la matrice sur le Canvas
    ctx.putImageData(imgData, 0, 0);
}

function destroyCostmap() {
    log("🧹 Costmap widget destroy");
    offFeedback("costmap", renderCostmap);
    canvas = null;
    ctx = null;
    root = null;
}