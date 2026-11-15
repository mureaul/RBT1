/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/maps/workcellManager.js
 ******************************************************************************/

import { log } from "../core/utils.js";
import { getROS } from "../core/ros.js";
// IMPORTATION CRITIQUE : On importe le widget d'enregistrement pour pouvoir l'imbriquer
import { gpsRecorderWidget } from "./gpsRecorderWidget.js"; 

/******************************************************************************
 * PRIVATE STATE & CONFIGURATION
 ******************************************************************************/
let root = null;
let mapInstance = null;
let workcellListElement = null;
let allLayersMap = {}; 
let selectedWorkcellId = null;
let isRecorderInitialized = false; // Flag pour ne pas initialiser le sous-widget en boucle

const WORKCELL_COLORS = [
    "#0ea5e9", "#10b981", "#f97316", "#a855f7", "#ec4899", "#eab308", "#6366f1"
];

/******************************************************************************
 * API
 ******************************************************************************/
export const workcellManagerWidget = {
    name: "WorkcellManager Widget",
    create: createWorkcellManagerWidget,
    init: initWorkcellManagerWidget,
    render: renderWorkcellManagerWidget,
    destroy: destroyWorkcellManagerWidget
};


function getRosInstance() {
    const ros = getROS();
    if (ros && ros.isConnected) return ros;
    return null;
}

function getColorForIndex(index) {
    return WORKCELL_COLORS[index % WORKCELL_COLORS.length];
}

/******************************************************************************
 * PRIVATE HANDLERS (Fonctions load, build, display, delete inchangées...)
 ******************************************************************************/
function loadAllWorkcellsFromROS() {
    const ros = getRosInstance();
    if (!ros) {
        if (workcellListElement) workcellListElement.innerHTML = `<li class="workcell-error">Déconnecté du robot</li>`;
        return;
    }
    const listService = new ROSLIB.Service({
        ros: ros, name: '/get_workcells', serviceType: 'rbt1_interfaces/srv/GetWorkcells'
    });
    listService.callService(new ROSLIB.ServiceRequest({}), function(result) {
        if (result && result.success) {
            const workcells = result.ids.map((id, index) => ({
                id: id, name: result.names[index], waypoints_count: result.waypoints_counts[index], color: getColorForIndex(index)
            }));
            buildWorkcellListUI(workcells);
            loadAndDisplayAllZones(result.ids);
        } else {
            if (workcellListElement) workcellListElement.innerHTML = `<li class="workcell-error">Erreur liste</li>`;
        }
    }, function(error) { log("❌ WorkcellManager : Impossible de joindre le service.", error); });
}

function buildWorkcellListUI(workcells) {
    if (!workcellListElement) return;
    workcellListElement.innerHTML = "";
    if (workcells.length === 0) {
        workcellListElement.innerHTML = `<li class="workcell-empty">Aucune carte YAML</li>`;
        return;
    }
    workcells.forEach(cell => {
        const li = document.createElement("li");
        li.className = "workcell-item"; li.dataset.id = cell.id; li.dataset.color = cell.color; 
        li.innerHTML = `
            <div class="workcell-item-info">
                <span class="workcell-color-indicator" style="background-color: ${cell.color};"></span>
                <span class="workcell-item-name">📁 ${cell.name}</span>
                <span class="workcell-item-meta">${cell.waypoints_count} pts</span>
            </div>
            <div class="workcell-item-actions">
                <button class="btn-action view-btn" title="Focus sur la zone" style="border-color: ${cell.color}44;">👁️</button>
                <button class="btn-action delete-btn" title="Supprimer la zone">🗑️</button>
            </div>
        `;
        const highlightAction = () => highlightZone(cell.id);
        li.querySelector(".view-btn").addEventListener("click", (e) => { e.stopPropagation(); highlightAction(); });
        li.addEventListener("click", highlightAction);
        li.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement la zone "${cell.name}" ?`)) deleteWorkcellFromROS(cell.id);
        });
        workcellListElement.appendChild(li);
    });
}

function loadAndDisplayAllZones(ids) {
    Object.values(allLayersMap).forEach(layer => { if (mapInstance) mapInstance.removeLayer(layer); });
    allLayersMap = {};
    const ros = getRosInstance(); if (!ros) return;
    ids.forEach((id, index) => {
        const zoneColor = getColorForIndex(index);
        const geomService = new ROSLIB.Service({ ros: ros, name: '/get_workcell_geometry', serviceType: 'rbt1_interfaces/srv/GetWorkcellGeometry' });
        geomService.callService(new ROSLIB.ServiceRequest({ id: id }), function(result) {
            if (result && result.success) {
                const geojsonData = parseRosYamlToGeoJSON(result.yaml_content);
                if (mapInstance && geojsonData && geojsonData.features.length > 0) {
                    const layer = L.geoJSON(geojsonData, {
                        style: () => ({ color: zoneColor, weight: 0.8, opacity: 0.4, fillColor: zoneColor, fillOpacity: 0.12 }),
                        pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 1, fillColor: zoneColor, color: zoneColor, weight: 0.5, fillOpacity: 0.2 })
                    }).addTo(mapInstance);
                    layer.options.zoneColor = zoneColor; allLayersMap[id] = layer; autoFitAllLayers();
                }
            }
        });
    });
}

function highlightZone(selectedId) {
    selectedWorkcellId = selectedId;
    if (workcellListElement) {
        workcellListElement.querySelectorAll(".workcell-item").forEach(li => {
            if (li.dataset.id === selectedId) {
                li.classList.add("is-selected"); li.style.borderLeftColor = li.dataset.color; li.style.background = `${li.dataset.color}15`;
            } else {
                li.classList.remove("is-selected"); li.style.borderLeftColor = "transparent"; li.style.background = "transparent";
            }
        });
    }
    Object.keys(allLayersMap).forEach(id => {
        const layer = allLayersMap[id]; const baseColor = layer.options.zoneColor;
        if (id === selectedId) {
            layer.setStyle({ color: baseColor, weight: 1.5, opacity: 1.0, fillColor: baseColor, fillOpacity: 0.45 });
            layer.bringToFront(); const bounds = layer.getBounds();
            if (bounds.isValid() && mapInstance) mapInstance.flyToBounds(bounds, { padding: [30, 30], duration: 0.6 });
        } else {
            layer.setStyle({ color: baseColor, weight: 0.5, opacity: 0.15, fillColor: baseColor, fillOpacity: 0.04 });
        }
    });
}

function autoFitAllLayers() {
    if (!mapInstance) return; const layers = Object.values(allLayersMap); if (layers.length === 0) return;
    const featureGroup = L.featureGroup(layers); const bounds = featureGroup.getBounds();
    if (bounds.isValid()) mapInstance.fitBounds(bounds, { padding: [40, 40] });
}

function parseRosYamlToGeoJSON(yamlString) {
    const features = []; const coordinates = []; const lines = yamlString.split('\n'); let currentPose = {};
    let minx = 435521.6224823745; let miny = 4827220.302264106;
    lines.forEach(line => {
        if (line.includes("minx:")) minx = parseFloat(line.split(":")[1]);
        if (line.includes("miny:")) miny = parseFloat(line.split(":")[1]);
    });
    function utm31NToWgs84(Easting, Northing) {
        const a = 6378137; const f = 1 / 298.257223563; const b = a * (1 - f); const e2 = (a*a - b*b) / (a*a); const ePrime2 = (a*a - b*b) / (b*b);
        const x = Easting - 500000; const y = Northing; const lambda0 = 3 * Math.PI / 180; const k0 = 0.9996; const M = y / k0;
        const mu = M / (a * (1 - e2/4 - 3*e2*e2/64 - 5*Math.pow(e2, 3)/256)); const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
        const j1 = (3*e1/2 - 27*Math.pow(e1,3)/32); const j2 = (21*e1*e1/16 - 55*Math.pow(e1,4)/32); const j3 = (151*Math.pow(e1,3)/96);
        const fp = mu + j1*Math.sin(2*mu) + j2*Math.sin(4*mu) + j3*Math.sin(6*mu); const C1 = ePrime2 * Math.pow(Math.cos(fp), 2); const T1 = Math.pow(Math.tan(fp), 2);
        const R1 = a * (1 - e2) / Math.pow(1 - e2 * Math.pow(Math.sin(fp), 2), 1.5); const N1 = a / Math.sqrt(1 - e2 * Math.pow(Math.sin(fp), 2)); const D = x / (N1 * k0);
        let latRad = fp - (N1 * Math.tan(fp) / R1) * (D*D/2 - (5 + 3*T1 + 10*C1 - 4*C1*C1 - 9*ePrime2)*Math.pow(D,4)/24); let lonRad = (D - (1 + 2*T1 + C1)*Math.pow(D,3)/6) / Math.cos(fp);
        return { lat: latRad * 180 / Math.PI, lon: (lonRad * 180 / Math.PI) + (lambda0 * 180 / Math.PI) };
    }
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('-') || trimmed === '') {
            if (currentPose.x !== undefined && currentPose.y !== undefined) {
                const absX = currentPose.x + minx; const absY = currentPose.y + miny;
                const gps = utm31NToWgs84(absX, absY); if (!isNaN(gps.lat) && !isNaN(gps.lon)) coordinates.push([gps.lon, gps.lat]);
            }
            currentPose = {};
        }
        const parts = trimmed.replace(/^- /, '').split(':');
        if (parts.length === 2) {
            const key = parts[0].trim(); const val = parseFloat(parts[1].trim()); if (!isNaN(val)) currentPose[key] = val;
        }
    });
    if (coordinates.length > 1) features.push({ type: "Feature", geometry: { type: "LineString", coordinates: coordinates }, properties: { type: "workcell_polygon_exact" } });
    return { type: "FeatureCollection", features: features };
}

function deleteWorkcellFromROS(workcellId) {
    const ros = getRosInstance(); if (!ros) return;
    const deleteService = new ROSLIB.Service({ ros: ros, name: '/delete_workcell', serviceType: 'rbt1_interfaces/srv/DeleteWorkcell' });
    deleteService.callService(new ROSLIB.ServiceRequest({ id: workcellId }), function(result) {
        if (result && result.success) {
            log(`🗑️ Workcell ${workcellId} supprimée.`);
            if (allLayersMap[workcellId]) { if (mapInstance) mapInstance.removeLayer(allLayersMap[workcellId]); delete allLayersMap[workcellId]; }
            loadAllWorkcellsFromROS();
        } else { alert(`Erreur : ${result ? result.message : "Pas de réponse"}`); }
    }, (err) => log("❌ Erreur /delete_workcell", err));
}

/******************************************************************************
 * WIDGET FRAMEWORK EXPORTS
 ******************************************************************************/
export function createWorkcellManagerWidget() {
    const recorderHtml = gpsRecorderWidget.create();

    return `
<section class="card workcell-card">
    <div class="workcell-header">
        <h3>🗺️ &nbsp; Gestion des Zones</h3>
        <div style="display: flex; gap: 8px;">
            <button id="workcell-refresh-btn" class="workcell-btn-header" title="Rafraîchir">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
            </button>
            <button id="workcell-add-btn" class="workcell-btn-header" title="Enregistrer">
                <svg id="workcell-add-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
        </div>
    </div>
    
    <div id="workcell-recorder-container" style="display: none; width: 100%; border-bottom: 1px solid #ffffff15; padding-bottom: 12px; margin-bottom: 4px;">
        ${recorderHtml}
    </div>

    <div class="workcell-body">
        <div class="workcell-list-container">
            <div class="workcell-list-header">Cartes détectées</div>
            <ul id="workcell-ul-list" class="workcell-list"></ul>
        </div>
        <div class="workcell-map-container">
            <div id="workcell-leaflet-map" class="workcell-embedded-map"></div>
        </div>
    </div>
</section>
`;
}

export function initWorkcellManagerWidget(container) {
    root = container;
    workcellListElement = root.querySelector("#workcell-ul-list");
    const mapContainer = root.querySelector("#workcell-leaflet-map");
    
    if (mapContainer && typeof L !== "undefined") {
        mapInstance = L.map(mapContainer).setView([43.604, 2.244], 15);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 20 }).addTo(mapInstance);
    }

    const addBtn = root.querySelector("#workcell-add-btn");
    const refreshBtn = root.querySelector("#workcell-refresh-btn");
    const recorderContainer = root.querySelector("#workcell-recorder-container");

    // Gestion du bouton Refresh 🔄
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => loadAllWorkcellsFromROS());
    }

    // Gestion du bouton "+" et du déploiement
    if (addBtn && recorderContainer) {
        const addIcon = addBtn.querySelector("#workcell-add-icon");

        addBtn.addEventListener("click", () => {
            if (recorderContainer.style.display === "none") {
                recorderContainer.style.display = "block";
                addBtn.title = "Fermer l'enregistreur";
                
                if (addIcon) {
                    addIcon.innerHTML = `<line x1="5" y1="12" x2="19" y2="12"></line>`;
                }
                
                if (!isRecorderInitialized) {
                    log("🏗️ Initialisation du sous-widget gpsRecorderWidget imbriqué...");
                    gpsRecorderWidget.init(recorderContainer);
                    isRecorderInitialized = true;
                }
            } else {
                recorderContainer.style.display = "none";
                addBtn.title = "Enregistrer une nouvelle zone";
                
                if (addIcon) {
                    addIcon.innerHTML = `
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    `;
                }
            }
        });
    }

    loadAllWorkcellsFromROS();
}

export function renderWorkcellManagerWidget() {
    // Si le sous-widget possède du code de render, on le propage
    if (isRecorderInitialized && typeof gpsRecorderWidget.render === "function") {
        gpsRecorderWidget.render();
    }
}

export function destroyWorkcellManagerWidget() {
    // Destruction propre du sous-widget s'il a été démarré
    if (isRecorderInitialized && typeof gpsRecorderWidget.destroy === "function") {
        gpsRecorderWidget.destroy();
        isRecorderInitialized = false;
    }
    if (mapInstance) { mapInstance.remove(); mapInstance = null; }
    allLayersMap = {}; root = null; workcellListElement = null;
}
