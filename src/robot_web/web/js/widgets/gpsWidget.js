/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/telemetry/gpsWidget.js
 *
 * GPS Map Widget (Mission Selector Positioned Below the Map)
 ******************************************************************************/

import { log } from "../core/utils.js";
import { onFeedback, offFeedback, getFeedbackState } from "../core/state.js";
import { getROS, isConnected } from "../core/ros.js";

let root = null;
let mapInstance = null;
let markerInstance = null;
let polylineInstance = null;
let resizeObserver = null;
let isMapReady = false;

// Topic ROS pour le flux direct /ublox_gps_node/fix
let ubloxGpsTopic = null;

// Variables mémoires pour éviter les rafraîchissements intempestifs de Leaflet
let lastLat = null;
let lastLon = null;

let gpsHistory = []; 
const FORCED_MAX_ZOOM = 18;

export const gpsWidget = {
    name: "GPS Map Widget",
    create: createGpsWidget,
    init: initGpsWidget,
    render: renderGpsWidget,
    destroy: destroyGpsWidget
};


export function createGpsWidget() {
    return `
<section class="card gps-card">
    <div class="gps-header">
        <h3>🛰️ &nbsp; GPS Mission Tracking</h3>
    </div>
    <div class="gps-body">
        <div id="gps-coords-badge" class="gps-coords-badge">Lat: -- | Lon: --</div>
        <div class="gps-map-wrapper">
            <div id="rbt1-map" style="width:100%; height:100%;"></div>
        </div>
        <div class="gps-footer">
            <span class="gps-footer-label">Historique :</span>
            <select id="select-gps-mission" class="gps-select">
                <option value="">-- Sélectionner une mission --</option>
            </select>
        </div>
    </div>
</section>
`;
}

export function initGpsWidget(container) {
    log("🛰️ GPS map widget init");
    root = container;

    // Réinitialisation des filtres de position au montage
    lastLat = null;
    lastLon = null;

    if (!document.getElementById("leaflet-core-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-core-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
    }

    setTimeout(() => {
        if (typeof L !== 'undefined' && root) {
            try {
                // Aligné avec l'ID du DOM
                const mapEl = root.querySelector('#rbt1-map');
                if (!mapEl) return;

                mapInstance = L.map(mapEl, {
                    zoomControl: true,
                    attributionControl: false,
                    maxZoom: FORCED_MAX_ZOOM,
                    minZoom: 1
                }).setView([46.2276, 2.2137], FORCED_MAX_ZOOM);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);

                polylineInstance = L.polyline([], {
                    color: '#00e5ff',
                    weight: 3,
                    opacity: 0.7,
                    dashArray: '6, 6',
                    lineJoin: 'round'
                }).addTo(mapInstance);

                markerInstance = L.marker([46.2276, 2.2137]).addTo(mapInstance);
                
                mapInstance.invalidateSize();
                isMapReady = true;

                const selectMission = root.querySelector("#select-gps-mission");
                if (selectMission) {
                    selectMission.addEventListener("change", handleMissionChange);
                }

                loadMissionsListFromROS();
                setupUbloxGpsTopic(); // Souscription au topic /ublox_gps_node/fix

            } catch (err) {
                console.error("[GPS] Échec de l'instanciation de Leaflet :", err);
            }
        }
    }, 50);

    resizeObserver = new ResizeObserver(() => {
        if (mapInstance && isMapReady) {
            mapInstance.invalidateSize();
        }
    });
    
    // Aligné avec la classe du wrapper
    const wrapper = root.querySelector(".gps-map-wrapper");
    if (wrapper) resizeObserver.observe(wrapper);

    onFeedback("gps", renderGpsWidget);
}

/**
 * Configure la souscription au topic /ublox_gps_node/fix via l'instance ROS de ros.js
 */
function setupUbloxGpsTopic() {
    const ros = getROS();

    if (ros && isConnected()) {
        log("[GPS] Abonnement au topic /ublox_gps_node/fix...");

        ubloxGpsTopic = new ROSLIB.Topic({
            ros: ros,
            name: '/ublox_gps_node/fix',
            messageType: 'sensor_msgs/msg/NavSatFix'
        });

        ubloxGpsTopic.subscribe((msg) => {
            if (msg && msg.latitude !== undefined && msg.longitude !== undefined) {
                updateGpsDisplay(msg.latitude, msg.longitude);
            }
        });
    } else {
        console.warn("[GPS] ROS non connecté lors de l'abonnement à /ublox_gps_node/fix");
    }
}

/**
 * Met à jour le badge gps-coords-badge ainsi que la position du marqueur Leaflet
 */
function updateGpsDisplay(lat, lon) {
    if (!root) return;

    // 1. Mise à jour directe du badge d'affichage des coordonnées
    const coordsBadge = root.querySelector("#gps-coords-badge");
    if (coordsBadge) {
        coordsBadge.textContent = `Lat: ${lat.toFixed(5)} | Lon: ${lon.toFixed(5)}`;
    }

    // 2. Centrage et mise à jour de la carte
    if (mapInstance && markerInstance && isMapReady) {
        const newPos = [lat, lon];
        
        markerInstance.setLatLng(newPos);
        
        const select = root.querySelector("#select-gps-mission");
        
        if (select && !select.value) {
            if (lat !== lastLat || lon !== lastLon) {
                lastLat = lat;
                lastLon = lon;
                
                mapInstance.setView(newPos, FORCED_MAX_ZOOM);
            }
        }
    }
}

function loadMissionsListFromROS() {
    const ros = getROS();

    if (ros && isConnected()) {
        log("[GPS] Requête de la liste des missions au robot...");

        const listService = new ROSLIB.Service({
            ros: ros,
            name: '/get_missions_list',
            serviceType: 'rbt1_interfaces/srv/GetMissionsList'
        });

        listService.callService(new ROSLIB.ServiceRequest({}), (result) => {
            try {
                const missions = JSON.parse(result.missions_json);
                const select = root.querySelector("#select-gps-mission");
                
                if (select && Array.isArray(missions)) {
                    select.innerHTML = '<option value="">-- Sélectionner une mission --</option>';
                    missions.forEach(mission => {
                        const opt = document.createElement("option");
                        opt.value = mission.id || mission;
                        opt.textContent = mission.name || mission;
                        select.appendChild(opt);
                    });
                }
            } catch (error) {
                console.error("[GPS] Erreur parsing liste des missions :", error);
            }
        }, (err) => console.warn("[GPS] Impossible de charger les missions :", err));
    }
}

function handleMissionChange(e) {
    const missionId = e.target.value;
    
    if (!missionId) {
        gpsHistory = [];
        if (polylineInstance) polylineInstance.setLatLngs([]);
        return;
    }

    const ros = getROS();

    if (ros && isConnected()) {
        log(`[GPS] Chargement du tracé pour la mission : ${missionId}`);

        const historyService = new ROSLIB.Service({
            ros: ros,
            name: '/get_gps_history',
            serviceType: 'rbt1_interfaces/srv/GetGpsHistory'
        });

        const request = new ROSLIB.ServiceRequest({
            mission_id: missionId
        });

        historyService.callService(request, (result) => {
            try {
                const data = JSON.parse(result.points_json);
                if (data && Array.isArray(data)) {
                    gpsHistory = data.map(pt => [pt.lat, pt.lon]);
                    
                    if (polylineInstance) {
                        polylineInstance.setLatLngs(gpsHistory);
                        if (gpsHistory.length > 0 && mapInstance) {
                            mapInstance.fitBounds(polylineInstance.getBounds(), { padding: [20, 20] });
                        }
                    }
                }
            } catch (error) {
                console.error("[GPS] Erreur parsing trace mission :", error);
            }
        }, (err) => console.error("[GPS] Échec récupération tracé mission :", err));
    }
}

/******************************************************************************
 * RENDER (Mise à jour via le State global en fallback)
 ******************************************************************************/
export function renderGpsWidget() {
    const state = getFeedbackState();
    const gps = state.gps;
    if (!gps || gps.latitude === undefined || gps.longitude === undefined) return;

    updateGpsDisplay(gps.latitude, gps.longitude);
}

export function destroyGpsWidget() {
    log("🧹 GPS widget destroy");
    offFeedback("gps", renderGpsWidget);

    if (ubloxGpsTopic) {
        ubloxGpsTopic.unsubscribe();
        ubloxGpsTopic = null;
    }

    isMapReady = false;
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
    if (polylineInstance) {
        polylineInstance.remove();
        polylineInstance = null;
    }
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
    root = null;
    markerInstance = null;
    gpsHistory = [];
    lastLat = null;
    lastLon = null;
}