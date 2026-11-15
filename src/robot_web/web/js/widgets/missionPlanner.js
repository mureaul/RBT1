/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/maps/missionPlanner.js
 ******************************************************************************/

import { log } from "../core/utils.js";
import { getROS } from "../core/ros.js";

let root = null;
let schedulesListElement = null;
let zoneSelectElement = null;
let editingScheduleId = null; // Stocke l'ID en cours d'édition (null si ajout)
let isFormCollapsed = true;    // Rétracté par défaut

function getRosInstance() {
    const ros = getROS();
    if (ros && ros.isConnected) return ros;
    return null;
}

/**
 * Service unique unifié /mission_planner/action
 */
function callMissionPlannerAction(payload, callback) {
    const ros = getRosInstance();
    if (!ros) {
        log("⚠️ Non connecté à ROS Bridge");
        if (schedulesListElement && payload.action === 'get') {
            schedulesListElement.innerHTML = `<div class="error" style="padding: 10px; color: #ef4444; text-align: center;">Déconnecté du robot</div>`;
        }
        return;
    }

    const actionService = new ROSLIB.Service({
        ros: ros,
        name: '/mission_planner/action',
        serviceType: 'rbt1_interfaces/srv/MissionSchedulerAction'
    });

    const request = new ROSLIB.ServiceRequest({
        data: JSON.stringify(payload)
    });

    actionService.callService(request, function(result) {
        if (callback) callback(result);
    }, function(err) {
        log("❌ Erreur appel service /mission_planner/action", err);
    });
}

/******************************************************************************
 * API ACTIONS (Services ROS 2)
 ******************************************************************************/

// 1. Récupérer toutes les zones disponibles
function loadZonesIntoSelect() {
    const ros = getRosInstance();
    if (!ros || !zoneSelectElement) return;

    const listService = new ROSLIB.Service({
        ros: ros,
        name: '/get_workcells',
        serviceType: 'rbt1_interfaces/srv/GetWorkcells'
    });

    listService.callService(new ROSLIB.ServiceRequest({}), function(result) {
        if (result && result.success && result.names) {
            zoneSelectElement.innerHTML = `<option value="">-- Sélectionner une zone --</option>`;
            result.names.forEach(name => {
                const opt = document.createElement("option");
                opt.value = name;
                opt.textContent = name;
                zoneSelectElement.appendChild(opt);
            });
        }
    }, err => log("❌ MissionPlanner : Impossible de lister les zones", err));
}

// 2. Charger les planifications existantes
function loadSchedules() {
    callMissionPlannerAction({ action: 'get' }, function(result) {
        if (result && result.success) {
            try {
                const list = JSON.parse(result.message);
                renderSchedulesList(list);
            } catch(e) {
                log("Erreur parsing JSON planifications", e);
            }
        } else {
            log("❌ Erreur lors de la récupération des planifications :", result?.message);
        }
    });
}

// 3. Ajouter ou Mettre à jour une planification (Action 'add' / 'update')
function saveSchedule(event) {
    if (event) event.preventDefault();

    if (!root) root = document.querySelector("#sched-form")?.closest(".widgets-card") || document.body;

    const zoneElement = root.querySelector("#sched-zone");
    const freqElement = root.querySelector("#sched-freq");
    const startElement = root.querySelector("#sched-start");
    const endElement = root.querySelector("#sched-end");

    const zone = zoneElement ? zoneElement.value : "";
    const freq = freqElement ? freqElement.value : "DAILY";
    const startDate = startElement ? startElement.value : "";
    const endDate = endElement ? endElement.value : null;

    if (!zone || !startDate) {
        alert("Veuillez remplir au moins la zone et la date de début.");
        return;
    }

    const actionType = editingScheduleId ? "update" : "add";
    const scheduleId = editingScheduleId || ("id_" + Date.now());

    const payload = {
        action: actionType,
        id: scheduleId,
        zone: zone,
        freq: freq,
        start_date: startDate,
        end_date: endDate || null
    };

    log(`📤 Envoi de la planification (${actionType}) :`, payload);

    callMissionPlannerAction(payload, function(result) {
        if (result && result.success) {
            log(`✅ 📅 Planification ${actionType === 'update' ? 'mise à jour' : 'enregistrée'} avec succès.`);
            try {
                const updatedList = JSON.parse(result.message);
                renderSchedulesList(updatedList);
            } catch (e) {
                loadSchedules();
            }
            resetForm();
            // Rétracte automatiquement le formulaire après enregistrement
            if (!isFormCollapsed) {
                toggleFormVisibility();
            }
        } else {
            alert("Erreur enregistrement : " + (result ? result.message : "Pas de réponse du service ROS"));
        }
    });
}

// 4. Activer l'édition d'une planification
function editSchedule(schedule) {
    if (!root) return;

    // Si le formulaire est rétracté, on le rouvre
    if (isFormCollapsed) {
        toggleFormVisibility();
    }

    editingScheduleId = schedule.id;

    const zoneSelect = root.querySelector("#sched-zone");
    const freqSelect = root.querySelector("#sched-freq");
    const startInput = root.querySelector("#sched-start");
    const endInput = root.querySelector("#sched-end");
    const submitBtn = root.querySelector("#sched-submit-btn");
    const cancelBtn = root.querySelector("#sched-cancel-btn");

    if (zoneSelect) zoneSelect.value = schedule.zone || "";
    if (freqSelect) freqSelect.value = schedule.freq || "DAILY";
    if (startInput) startInput.value = schedule.start_date || "";
    if (endInput) endInput.value = schedule.end_date || "";

    if (submitBtn) submitBtn.textContent = "💾 Mettre à jour la planification";
    if (cancelBtn) cancelBtn.style.display = "inline-block";

    root.querySelector("#sched-form")?.scrollIntoView({ behavior: 'smooth' });
}

// Réinitialiser le formulaire
function resetForm() {
    if (!root) return;
    editingScheduleId = null;

    const form = root.querySelector("#sched-form");
    if (form) form.reset();

    const submitBtn = root.querySelector("#sched-submit-btn");
    const cancelBtn = root.querySelector("#sched-cancel-btn");

    if (submitBtn) submitBtn.textContent = "Enregistrer la planification";
    if (cancelBtn) cancelBtn.style.display = "none";
}

// 5. Basculer l'affichage du formulaire de saisie
function toggleFormVisibility() {
    if (!root) return;
    const form = root.querySelector("#sched-form");
    const toggleBtn = root.querySelector("#sched-toggle-form-btn");
    if (!form || !toggleBtn) return;

    isFormCollapsed = !isFormCollapsed;

    if (isFormCollapsed) {
        form.classList.add("hidden");
        form.style.setProperty("display", "none", "important");
        toggleBtn.title = "Afficher le formulaire de saisie";
        toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
    } else {
        form.classList.remove("hidden");
        form.style.removeProperty("display");
        toggleBtn.title = "Rétracter le formulaire de saisie";
        toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
    }
}

// 6. Supprimer une planification
function deleteSchedule(id) {
    const payload = {
        action: "delete",
        id: id
    };

    callMissionPlannerAction(payload, function(result) {
        if (result && result.success) {
            log("🗑️ Planification supprimée.");
            if (editingScheduleId === id) resetForm();
            try {
                const updatedList = JSON.parse(result.message);
                renderSchedulesList(updatedList);
            } catch (e) {
                loadSchedules();
            }
        } else {
            alert("Erreur suppression : " + (result ? result.message : "Pas de réponse"));
        }
    });
}

// 7. Tout effacer
function clearAllSchedules() {
    if (!confirm("Voulez-vous supprimer l'intégralité du planning de tonte ?")) return;

    callMissionPlannerAction({ action: "clear" }, function(result) {
        if (result && result.success) {
            log("🧹 Toutes les planifications ont été effacées.");
            resetForm();
            loadSchedules();
        } else {
            alert("Erreur lors du nettoyage : " + (result ? result.message : "Pas de réponse"));
        }
    });
}

/******************************************************************************
 * RENDERING UI & STATUS TEXT LOGIC
 ******************************************************************************/

// Calcule l'état et retourne le texte discret associé
function getScheduleStatusInfo(sc) {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const startDate = new Date(sc.start_date);
    const endDate = sc.end_date ? new Date(sc.end_date) : null;
    const freq = sc.freq ? sc.freq.toUpperCase() : "ONCE";

    // 1. Vérification "TERMINÉE" (Gris)
    if (freq === "ONCE") {
        if (!isNaN(startDate) && startDate < now) {
            return { status: "FINISHED", text: "terminée" };
        }
    } else {
        if (endDate && !isNaN(endDate) && endDate < now) {
            return { status: "FINISHED", text: "terminée" };
        }
    }

    // 2. Vérification "ACTIF" (Vert: dans les prochaines 24h)
    if (freq === "ONCE") {
        if (!isNaN(startDate) && startDate >= now && startDate <= in24h) {
            return { status: "ACTIVE", text: "actif" };
        }
    } else if (freq === "DAILY") {
        if ((!endDate || endDate >= now) && (!isNaN(startDate) && startDate <= in24h)) {
            return { status: "ACTIVE", text: "actif" };
        }
    } else if (freq === "WEEKLY") {
        if ((!endDate || endDate >= now) && !isNaN(startDate)) {
            const currentDay = now.getDay();
            const targetDay = startDate.getDay();
            
            let daysUntil = targetDay - currentDay;
            if (daysUntil < 0) daysUntil += 7;

            const nextOccurrence = new Date(now);
            nextOccurrence.setDate(now.getDate() + daysUntil);
            nextOccurrence.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);

            if (daysUntil === 0 && nextOccurrence < now) {
                nextOccurrence.setDate(nextOccurrence.getDate() + 7);
            }

            if (nextOccurrence >= now && nextOccurrence <= in24h) {
                return { status: "ACTIVE", text: "actif" };
            }
        }
    }

    // 3. Sinon "À VENIR" (Bleu)
    return { status: "PENDING", text: "à venir" };
}

function renderSchedulesList(schedules) {
    if (!schedulesListElement) return;
    schedulesListElement.innerHTML = "";

    if (!schedules || schedules.length === 0) {
        schedulesListElement.innerHTML = `<div class="empty-list" style="padding: 12px; color: #64748b; text-align: center;">Aucun événement planifié</div>`;
        return;
    }

    // Sauvegarder la liste en mémoire globale
    window._currentSchedulesMap = new Map(schedules.map(s => [String(s.id), s]));

    // Regroupement par fréquence
    const groups = {
        DAILY: { title: "🔄 Quotidien", items: [] },
        WEEKLY: { title: "📅 Hebdomadaire", items: [] },
        ONCE: { title: "🎯 Une fois", items: [] }
    };

    schedules.forEach(sc => {
        const freqKey = sc.freq ? sc.freq.toUpperCase() : "ONCE";
        if (groups[freqKey]) {
            groups[freqKey].items.push(sc);
        } else {
            groups.ONCE.items.push(sc);
        }
    });

    // --- LOGIQUE DE TRI ---
    groups.DAILY.items.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        const timeA = isNaN(dateA) ? 0 : dateA.getHours() * 60 + dateA.getMinutes();
        const timeB = isNaN(dateB) ? 0 : dateB.getHours() * 60 + dateB.getMinutes();
        return timeA - timeB;
    });

    groups.WEEKLY.items.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        const getISOWeekday = (d) => isNaN(d) ? 0 : (d.getDay() === 0 ? 7 : d.getDay());
        const dayA = getISOWeekday(dateA);
        const dayB = getISOWeekday(dateB);

        if (dayA !== dayB) return dayA - dayB;

        const timeA = isNaN(dateA) ? 0 : dateA.getHours() * 60 + dateA.getMinutes();
        const timeB = isNaN(dateB) ? 0 : dateB.getHours() * 60 + dateB.getMinutes();
        return timeA - timeB;
    });

    groups.ONCE.items.sort((a, b) => {
        const timeA = new Date(a.start_date).getTime();
        const timeB = new Date(b.start_date).getTime();
        return (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
    });

    // --- RENDU DOM ---
    Object.keys(groups).forEach(freqKey => {
        const group = groups[freqKey];
        if (group.items.length === 0) return;

        const groupWrapper = document.createElement("div");
        groupWrapper.className = "sched-group";
        groupWrapper.style.cssText = "margin-bottom: 12px;";

        const groupHeader = document.createElement("div");
        groupHeader.className = "sched-group-header";
        groupHeader.style.cssText = "font-size: 0.75rem; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; padding-bottom: 2px; border-bottom: 1px solid #334155;";
        groupHeader.textContent = `${group.title} (${group.items.length})`;
        groupWrapper.appendChild(groupHeader);

        const badgesContainer = document.createElement("div");
        badgesContainer.style.cssText = "display: flex; flex-direction: column; gap: 6px;";

        group.items.forEach(sc => {
            const startDateObj = new Date(sc.start_date);
            const isValidStartDate = !isNaN(startDateObj);
            const startFormatted = isValidStartDate 
                ? startDateObj.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) 
                : sc.start_date;

            // Gestion de la date de fin
            let endDateHtml = "";
            if (sc.end_date) {
                const endDateObj = new Date(sc.end_date);
                const isValidEndDate = !isNaN(endDateObj);
                const endFormatted = isValidEndDate 
                    ? endDateObj.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) 
                    : sc.end_date;
                endDateHtml = `<div style="font-size: 0.75rem; opacity: 0.8;">🏁 Fin: <b>${endFormatted}</b></div>`;
            }

            // Tag du jour pour HEBDOMADAIRE
            let dayTagHtml = "";
            if (freqKey === "WEEKLY" && isValidStartDate) {
                const dayName = startDateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
                const dayCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
                dayTagHtml = `<span style="background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2); font-size: 0.7rem; padding: 1px 6px; border-radius: 4px; font-weight: 600; text-transform: capitalize;">📆 ${dayCapitalized}</span>`;
            }

            // Récupération de l'état et du style associé
            const { status, text: statusText } = getScheduleStatusInfo(sc);
            let badgeStyle = "";

            if (status === "ACTIVE") {
                badgeStyle = "background: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.4); color: #86efac;";
            } else if (status === "FINISHED") {
                badgeStyle = "background: rgba(148, 163, 184, 0.08); border: 1px solid rgba(148, 163, 184, 0.2); color: #94a3b8; opacity: 0.65;";
            } else {
                badgeStyle = "background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8;";
            }

            const badge = document.createElement("div");
            badge.className = "sched-item-badge";
            badge.style.cssText = `display: flex; align-items: stretch; justify-content: space-between; border-radius: 6px; padding: 8px 10px; transition: all 0.2s; ${badgeStyle}`;
            
            badge.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                        <span style="font-weight: bold; font-size: 0.85rem;">📍 ${sc.zone}</span>
                        ${dayTagHtml}
                    </div>
                    <div style="font-size: 0.75rem; opacity: 0.9;">
                        🕒 Début: <b>${startFormatted}</b>
                    </div>
                    ${endDateHtml}
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; margin-left: 8px; gap: 4px;">
                    <span style="font-size: 0.65rem; opacity: 0.75; font-weight: 600; text-transform: lowercase;">${statusText}</span>
                    <div style="display: flex; align-items: center; gap: 2px;">
                        <button type="button" class="edit-sched-btn" data-id="${sc.id}" title="Éditer" style="background: transparent; border: none; color: inherit; cursor: pointer; padding: 2px 4px; border-radius: 4px; font-size: 0.85rem; opacity: 0.8;">
                            ✏️
                        </button>
                        <button type="button" class="delete-sched-btn" data-id="${sc.id}" title="Supprimer" style="background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 2px 4px; border-radius: 4px; font-size: 0.85rem;">
                            🗑️
                        </button>
                    </div>
                </div>
            `;

            badgesContainer.appendChild(badge);
        });

        groupWrapper.appendChild(badgesContainer);
        schedulesListElement.appendChild(groupWrapper);
    });
}

/******************************************************************************
 * EXPORTS WIDGET
 ******************************************************************************/

export function createMissionPlannerWidget() {
    return `
<section class="card widgets-card">
    <div class="widgets-header">
        <h3>📅 &nbsp; Planificateur de Missions</h3>
        <div style="display: flex; gap: 6px; align-items: center;">
            <button id="sched-toggle-form-btn" class="btn-toggle-charts" type="button" title="Afficher le formulaire de saisie">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <button id="sched-clear-btn" class="btn-toggle-charts" type="button" title="Tout effacer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        </div>
    </div>
    
    <div class="widgets-body">
        <form id="sched-form" class="mission-form hidden" style="display: none !important; transition: all 0.2s ease-in-out;">
            <div class="mission-input-group">
                <select id="sched-zone" class="mission-select" style="flex: 1;" required>
                    <option value="">Chargement des zones...</option>
                </select>
                <select id="sched-freq" class="mission-select" style="width: 110px;">
                    <option value="DAILY">Quotidien</option>
                    <option value="WEEKLY">Hebdomadaire</option>
                    <option value="ONCE">Une fois</option>
                </select>
            </div>
            
            <div class="mission-input-group">
                <input type="datetime-local" id="sched-start" class="mission-input" style="flex: 1;" required />
                <input type="datetime-local" id="sched-end" class="mission-input" style="flex: 1;" placeholder="Date de fin (optionnelle)" />
            </div>

            <div style="display: flex; gap: 8px;">
                <button type="submit" id="sched-submit-btn" class="btn-submit-mission" style="flex: 1;">Enregistrer la planification</button>
                <button type="button" id="sched-cancel-btn" class="btn-submit-mission" style="display: none; background: #475569; width: auto; padding: 0 12px;" title="Annuler l'édition">✖</button>
            </div>
        </form>

        <div class="sched-list-container" style="margin-top: 10px;">
            <div id="sched-ul-list">
                <div class="empty-list" style="padding: 12px; color: #64748b; text-align: center;">Vérification des tâches...</div>
            </div>
        </div>
    </div>
</section>
`;
}

export function initMissionPlannerWidget() {
    const attachEvents = () => {
        root = document.querySelector("#sched-form")?.closest(".widgets-card") || document.body;
        
        const form = root.querySelector("#sched-form");
        const submitBtn = root.querySelector("#sched-submit-btn");
        const cancelBtn = root.querySelector("#sched-cancel-btn");

        if (!form) {
            console.warn("⚠️ [MissionPlanner] Formulaire introuvable au moment d'init. Nouvelle tentative...");
            setTimeout(attachEvents, 100);
            return;
        }

        schedulesListElement = root.querySelector("#sched-ul-list");
        zoneSelectElement = root.querySelector("#sched-zone");

        form.onsubmit = saveSchedule;
        if (submitBtn) {
            submitBtn.onclick = (e) => {
                if (form.checkValidity()) {
                    saveSchedule(e);
                }
            };
        }

        if (cancelBtn) {
            cancelBtn.onclick = resetForm;
        }

        const clearBtn = root.querySelector("#sched-clear-btn");
        if (clearBtn) clearBtn.onclick = clearAllSchedules;

        const toggleBtn = root.querySelector("#sched-toggle-form-btn");
        if (toggleBtn) toggleBtn.onclick = toggleFormVisibility;

        // Gestion des actions d'édition et suppression dans la liste
        if (schedulesListElement) {
            schedulesListElement.onclick = (e) => {
                const deleteBtn = e.target.closest(".delete-sched-btn");
                if (deleteBtn) {
                    const id = deleteBtn.getAttribute("data-id");
                    if (id && confirm("Voulez-vous supprimer cette planification ?")) {
                        deleteSchedule(id);
                    }
                    return;
                }

                const editBtn = e.target.closest(".edit-sched-btn");
                if (editBtn) {
                    const id = editBtn.getAttribute("data-id");
                    const item = window._currentSchedulesMap?.get(String(id));
                    if (item) {
                        editSchedule(item);
                    }
                }
            };
        }

        loadZonesIntoSelect();
        loadSchedules();
        
        log("✅ [MissionPlanner] Initialisé avec succès.");
    };

    attachEvents();
}

export function destroyMissionPlannerWidget() {
    root = null;
    schedulesListElement = null;
    zoneSelectElement = null;
    editingScheduleId = null;
    isFormCollapsed = true;
}

export function renderMissionPlannerWidget() {
    loadSchedules();
}

export const missionPlannerWidget = {
    name: "Mission Planner",
    create: createMissionPlannerWidget,
    init: initMissionPlannerWidget,
    render: renderMissionPlannerWidget,
    destroy: destroyMissionPlannerWidget
};