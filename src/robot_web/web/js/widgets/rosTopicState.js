/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/ros/rosTopicState.js
 *
 * ROS2 Topics & Echo Live Widget (Strict Font Color & UI Fix)
 ******************************************************************************/

import { log } from "../core/utils.js";
import { getROS } from "../core/ros.js";

let root = null;
let topicListContainer = null;
let consoleTitleElement = null;
let consoleLogsContainer = null;

let selectedTopicName = null;
let activeTopicListener = null; 
let refreshInterval = null;

//API
export const RosTopicStateWidget = {
    name: "RosTopicState Widget",
    create: createRosTopicStateWidget,
    init: initRosTopicStateWidget,
    render: renderRosTopicStateWidget,
    destroy: destroyRosTopicStateWidget
};

function getRosInstance() {
    const ros = getROS();
    if (ros && ros.isConnected) return ros;
    return null;
}

/******************************************************************************
 * CREATE
 ******************************************************************************/
export function createRosTopicStateWidget() {
    return `
<section class="widgets-card ros-node-card">
    <div class="widgets-header">
        <h3>ROS2 Active Topics</h3>
        <button id="btn-refresh-topics" class="ros-node-refresh-btn">...</button>
    </div>

    <div class="ros-widget-wrapper">
        <!-- Liste des objets en haut -->
        <div class="workcell-list-container" style="max-height: 200px; overflow-y: auto; margin-bottom: 16px;">
            <ul id="ros-topic-list" class="workcell-list"></ul>
        </div>

        <!-- Console en dessous -->
        <div class="ros-terminal-box">
            <div class="ros-terminal-bar">
                <span id="ros-topic-console-title" class="ros-terminal-title"></span>
                <span class="ros-terminal-tag">LIVE ECHO</span>
            </div>
            <div id="ros-topic-console-logs" class="ros-terminal-body" style="height: 150px;"></div>
        </div>
    </div>
</section>
`;
}

/******************************************************************************
 * INIT
 ******************************************************************************/
export function initRosTopicStateWidget(container) {
    log("🤖 ROS2 Topic State widget initialized");
    root = container;

    topicListContainer = root.querySelector("#ros-topic-list");
    consoleTitleElement = root.querySelector("#ros-topic-console-title");
    consoleLogsContainer = root.querySelector("#ros-topic-console-logs");

    const refreshBtn = root.querySelector("#btn-refresh-topics");
    if (refreshBtn) {
        refreshBtn.onclick = () => fetchRosTopicsDirectly();
    }

    fetchRosTopicsDirectly();
    refreshInterval = setInterval(fetchRosTopicsDirectly, 5000);
}

/******************************************************************************
 * FETCH TOPICS
 ******************************************************************************/
function fetchRosTopicsDirectly() {
    const ros = getRosInstance();
    if (!ros) {
        if (topicListContainer) {
            topicListContainer.innerHTML = `<li class="workcell-error">Rosbridge déconnecté</li>`;
        }
        return;
    }

    ros.getTopics((result) => {
        const topicsList = result.topics || [];
        const typesList = result.types || [];

        const formattedTopics = topicsList.map((name, index) => {
            return {
                name: name,
                type: typesList[index] || "unknown type"
            };
        });

        renderRosTopicStateWidget(formattedTopics);
    }, (err) => {
        console.error("[ROS-TOPICS] Erreur getTopics :", err);
    });
}

/******************************************************************************
 * LIVE TOPIC ECHO
 ******************************************************************************/
function startTopicEcho(topicName, topicType) {
    const ros = getRosInstance();
    
    if (activeTopicListener) {
        activeTopicListener.unsubscribe();
        activeTopicListener = null;
    }

    if (!ros || !topicName) return;

    if (consoleLogsContainer) {
        consoleLogsContainer.innerHTML = `<div style="color: #64748b; font-style: italic;">En attente de messages sur ${topicName}...</div>`;
    }

    activeTopicListener = new window.ROSLIB.Topic({
        ros: ros,
        name: topicName,
        messageType: topicType
    });

    activeTopicListener.subscribe((message) => {
        if (!root || selectedTopicName !== topicName) return;

        if (consoleLogsContainer) {
            const placeholder = consoleLogsContainer.querySelector(".ros-log-placeholder");
            if (placeholder) consoleLogsContainer.innerHTML = "";

            const timestamp = new Date().toLocaleTimeString();
            const messageString = JSON.stringify(message, null, 2);
            
            const logLine = document.createElement("div");
            logLine.className = "ros-log-line ros-log-info";
            logLine.innerHTML = `<span style="color: #64748b;">[${timestamp}]</span> ${escapeHtml(messageString)}`;
            
            consoleLogsContainer.appendChild(logLine);

            if (consoleLogsContainer.childNodes.length > 30) {
                consoleLogsContainer.removeChild(consoleLogsContainer.firstChild);
            }

            consoleLogsContainer.scrollTop = consoleLogsContainer.scrollHeight;
        }
    });
}

/******************************************************************************
 * RENDER (Correction de la classe texte en .workcell-item-name)
 ******************************************************************************/
export function renderRosTopicStateWidget(topicList = []) {
    if (!root) return;

    const count = topicList.length;

    if (!selectedTopicName && count > 0) {
        selectedTopicName = topicList[0].name;
        startTopicEcho(topicList[0].name, topicList[0].type);
    }

    if (count === 0) {
        if (topicListContainer) {
            topicListContainer.innerHTML = `<li class="workcell-empty">Aucun topic actif</li>`;
        }
    } else if (topicListContainer) {
        topicListContainer.innerHTML = "";
        
        topicList.forEach(topic => {
            const isActive = topic.name === selectedTopicName;
            const li = document.createElement("li");
            li.className = `workcell-item ${isActive ? 'is-selected' : ''}`;
            
            if (isActive) {
                li.style.borderLeftColor = "#29b6f6";
                li.style.background = "linear-gradient(90deg, rgba(41, 182, 246, 0.06) 0%, transparent 100%)";
            }

            // Utilisation stricte de la classe globale .workcell-item-name pour hériter du gris premium
            li.innerHTML = `
                <div class="workcell-item-info">
                    <span class="workcell-color-indicator" style="background-color: ${isActive ? '#29b6f6' : '#4a5161'};"></span>
                    <span class="workcell-item-name">${topic.name}</span>
                </div>
                <span class="ros-topic-type-tag">${topic.type.split('/').pop()}</span>
            `;

            li.addEventListener("click", () => {
                if (selectedTopicName !== topic.name) {
                    selectedTopicName = topic.name;
                    renderRosTopicStateWidget(topicList);
                    startTopicEcho(topic.name, topic.type);
                }
            });

            topicListContainer.appendChild(li);
        });
    }

    if (consoleTitleElement) {
        consoleTitleElement.textContent = selectedTopicName ? `Echo: ${selectedTopicName}` : "Echo: Aucun topic";
    }
}

/******************************************************************************
 * DESTROY
 ******************************************************************************/
export function destroyRosTopicStateWidget() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
    if (activeTopicListener) {
        activeTopicListener.unsubscribe();
        activeTopicListener = null;
    }
    root = null;
    selectedTopicName = null;
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
