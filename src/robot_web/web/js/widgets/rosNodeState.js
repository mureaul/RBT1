/******************************************************************************
 * RBT1 Robot Control Interface
 * widgets/ros/rosNodeState.js
 *
 * ROS2 Nodes & Logs Widget (Strict Card & Header Remastering)
 ******************************************************************************/

import { log } from "../core/utils.js";
import { getROS } from "../core/ros.js";

let root = null;
let nodeListContainer = null;
let consoleTitleElement = null;
let consoleLogsContainer = null;

let selectedNodeName = null;
let refreshInterval = null;

//API
export const RosNodeStateWidget = {
    name: "RosNodeState Widget",
    create: createRosNodeStateWidget,
    init: initRosNodeStateWidget,
    render: renderRosNodeStateWidget,
    destroy: destroyRosNodeStateWidget
};

function getRosInstance() {
    const ros = getROS();
    if (ros && ros.isConnected) return ros;
    return null;
}

/******************************************************************************
 * CREATE (Template HTML - Architecture stricte de l'en-tête)
 ******************************************************************************/
export function createRosNodeStateWidget() {
    return `
<section class="widgets-card">
    <div class="widgets-header">
        <h3>ROS2 Active Nodes</h3>
        <button id="btn-refresh-nodes" class="ros-node-refresh-btn">...</button>
    </div>

    <div class="ros-widget-wrapper">
        <!-- Liste des objets en haut -->
        <div class="ros-list-container" style="max-height: 200px; overflow-y: auto; margin-bottom: 16px;">
            <ul id="ros-node-list" class="workcell-list"></ul>
        </div>

        <!-- Console en dessous -->
        <div class="ros-terminal-box">
            <div class="ros-terminal-bar">
                <span id="ros-node-console-title" class="ros-terminal-title"></span>
                <span class="ros-terminal-tag">LOGS</span>
            </div>
            <div id="ros-node-console-logs" class="ros-terminal-body" style="height: 150px;"></div>
        </div>
    </div>
</section>
`;
}

/******************************************************************************
 * INIT
 ******************************************************************************/
export function initRosNodeStateWidget(container) {
    log("🤖 ROS2 Node State widget init");
    root = container;

    nodeListContainer = root.querySelector("#ros-node-list");
    consoleTitleElement = root.querySelector("#ros-node-console-title");
    consoleLogsContainer = root.querySelector("#ros-node-console-logs");

    const refreshBtn = root.querySelector("#btn-refresh-nodes");
    if (refreshBtn) {
        refreshBtn.onclick = () => fetchRosNodesDirectly();
    }

    fetchRosNodesDirectly();
    refreshInterval = setInterval(fetchRosNodesDirectly, 4000);
}

/******************************************************************************
 * FETCH DATA
 ******************************************************************************/
function fetchRosNodesDirectly() {
    const ros = getRosInstance();
    if (!ros) {
        if (nodeListContainer) {
            nodeListContainer.innerHTML = `<li class="workcell-error">Rosbridge déconnecté</li>`;
        }
        return;
    }

    ros.getNodes((nodes) => {
        const formattedNodes = nodes.map(name => {
            return {
                name: name,
                logs: [
                    `[INFO] [${new Date().toLocaleTimeString()}] Node [${name}] operational.`,
                    `[INFO] [${new Date().toLocaleTimeString()}] Connected to master graph.`
                ]
            };
        });
        renderRosNodeStateWidget(formattedNodes);
    }, (err) => {
        console.error("[ROS-NODES] Erreur getNodes :", err);
    });
}

/******************************************************************************
 * RENDER (Utilisation des structures exactes li.workcell-item)
 ******************************************************************************/
export function renderRosNodeStateWidget(nodeList = []) {
    if (!root) return;

    const count = nodeList.length;

    if (!selectedNodeName && count > 0) {
        selectedNodeName = nodeList[0].name;
    }

    if (count === 0) {
        if (nodeListContainer) {
            nodeListContainer.innerHTML = `<li class="workcell-empty">Aucun nœud actif</li>`;
        }
    } else if (nodeListContainer) {
        nodeListContainer.innerHTML = "";
        
        nodeList.forEach(node => {
            const isActive = node.name === selectedNodeName;
            const li = document.createElement("li");
            li.className = `workcell-item ${isActive ? 'is-selected' : ''}`;
            if (isActive) {
                li.style.borderLeftColor = "#29b6f6";
                li.style.background = "linear-gradient(90deg, rgba(41, 182, 246, 0.06) 0%, transparent 100%)";
            }

            li.innerHTML = `
                <div class="workcell-item-info">
                    <span class="workcell-color-indicator" style="background-color: ${isActive ? '#29b6f6' : '#4a5161'};"></span>
                    <span class="workcell-item-name">${node.name}</span>
                </div>
            `;

            li.addEventListener("click", () => {
                selectedNodeName = node.name;
                renderRosNodeStateWidget(nodeList);
            });

            nodeListContainer.appendChild(li);
        });
    }

    const currentNode = nodeList.find(n => n.name === selectedNodeName);

    if (consoleTitleElement && consoleLogsContainer) {
        if (!currentNode) {
            consoleTitleElement.textContent = "Console: Aucun nœud";
            consoleLogsContainer.innerHTML = `<div class="ros-log-placeholder">Aucun nœud actif sélectionné.</div>`;
        } else {
            consoleTitleElement.textContent = `Console: ${currentNode.name}`;
            
            const logsArray = currentNode.logs ?? [];
            consoleLogsContainer.innerHTML = logsArray.map(logText => {
                let logClass = "ros-log-info";
                if (logText.includes("[WARN]")) logClass = "ros-log-warn";
                if (logText.includes("[ERROR]")) logClass = "ros-log-error";
                
                return `<div class="ros-log-line ${logClass}">${escapeHtml(logText)}</div>`;
            }).join('');
            
            consoleLogsContainer.scrollTop = consoleLogsContainer.scrollHeight;
        }
    }
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function destroyRosNodeStateWidget() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
    root = null;
    selectedNodeName = null;
}
