/******************************************************************************
 * RBT1 Robot Control Interface
 * core/ros.js
 *
 * ROS Manager
 *
 * Rôle :
 *  - connexion rosbridge
 *  - reconnexion automatique
 *  - publishers
 *  - subscribers
 *  - synchronisation avec StateManager
 *
 ******************************************************************************/

import { log } from "./utils.js";
import { getConfig } from "./config.js";
import { emit } from "./events.js";
import { getTargetState, setFeedbackState, setUIState, setTargetState, getLastInputTime, setConnected, setLidarTelemetry} from "./state.js";
import { setRosStatus } from "./ui.js";

/******************************************************************************
 * PRIVATE
 ******************************************************************************/

let AppState = null;

let ros = null;

let publishTimer = null;
let reconnectTimer = null;

let cmdVelPub = null;
let bladePub = null;

let subscribers = {};

/******************************************************************************
 * INIT
 ******************************************************************************/

export function initROS(state) {

    AppState = state;

    log("🔌 Initializing ROS...");

    connect();

}

/******************************************************************************
 * CONNECTION
 ******************************************************************************/

function connect() {

    const cfg = getConfig();

    const host =
        cfg.rosbridge?.host ??
        cfg.rosbridge_host;

    const port =
        cfg.rosbridge?.port ??
        cfg.rosbridge_port;

    if (!host || !port) {

        console.error("Invalid rosbridge config", cfg);

        throw new Error("Missing rosbridge configuration");

    }
    
    const url = `ws://${host}:${port}`;

    log(`📡 Connecting to rosbridge: ${url}`);

    try {

        ros = new ROSLIB.Ros({

            url

        });

        ros.on("connection", onConnected);

        ros.on("close", onDisconnected);

        ros.on("error", onError);

    }

    catch (err) {

        console.error(err);

        scheduleReconnect();

    }

}

/******************************************************************************
 * CALLBACKS
 ******************************************************************************/

function onConnected() {

    log("🟢 ROS connected");

    AppState.ros = ros;

    setRosStatus(true);

    setUIState({

        connected: true

    });

    setupPublishers();

    setupSubscribers();

    startPublishLoop();
    
    setConnected(true);
    
    emit("ros:connected");

}

function onDisconnected() {

    log("🔴 ROS disconnected");

    AppState.ros = null;

    setRosStatus(false);

    setUIState({

        connected: false

    });

    stopPublishLoop();

    unsubscribeAll();

    setConnected(false);

    emit("ros:disconnected");

    scheduleReconnect();

}

function onError(error) {

    console.error(error);

    emit("ros:error", error);

}

/******************************************************************************
 * RECONNECTION
 ******************************************************************************/

function scheduleReconnect() {

    if (reconnectTimer) {

        return;

    }

    reconnectTimer = setTimeout(() => {

        reconnectTimer = null;

        log("🔄 Reconnecting to ROS...");

        connect();

    }, 2000);

}

/******************************************************************************
 * PUBLISHERS
 ******************************************************************************/

function setupPublishers() {

    const cfg = getConfig();

    cmdVelPub = new ROSLIB.Topic({

        ros,

        name: cfg.topics.cmd_vel,

        messageType: "geometry_msgs/msg/Twist"

    });

    bladePub = new ROSLIB.Topic({

        ros,

        name: cfg.topics.blade_speed_web,

        messageType: "std_msgs/msg/Float32"

    });

    log("✔ Publishers created");

}

/******************************************************************************
 * SUBSCRIBERS
 ******************************************************************************/

function setupSubscribers() {

    unsubscribeAll();

    const cfg = getConfig();

/*
    --------------------------------------------------------------------------
    BATTERY
    --------------------------------------------------------------------------
    */
    if (cfg.topics.battery) {
        subscribers.battery = new ROSLIB.Topic({
            ros,
            name: cfg.topics.battery,
            messageType: "sensor_msgs/msg/BatteryState"
        });

        subscribers.battery.subscribe(msg => {
            // Correct : On passe tout l'objet du message au State Manager
            setFeedbackState({
                battery: msg
            });

            emit("topic:battery", msg);
        });
    }
    
    /*--------------------------------------------------------------------------
    *BLADE
    ---------------------------------------------------------------------------*/

    if (cfg.topics.blade_telemetry) {

        subscribers.blade_telemetry = new ROSLIB.Topic({

            ros,

            name: cfg.topics.blade_telemetry,

            messageType: "std_msgs/msg/String"

        });

        subscribers.blade_telemetry.subscribe(msg => {
            
            setFeedbackState({

                blade_telemetry: msg.data

            });

            emit("topic:blade_telemetry", msg.data);

        });

    }
    
    /*--------------------------------------------------------------------------
    *COSTMAP
    ---------------------------------------------------------------------------*/

    if (cfg.topics.costmap) {
        subscribers.costmap = new ROSLIB.Topic({
            ros: ros,
            name: cfg.topics.costmap,
            messageType: "nav_msgs/OccupancyGrid"
        });

        subscribers.costmap.subscribe(msg => {
            setFeedbackState({
                costmap: {
                    width: msg.info.width,
                    height: msg.info.height,
                    data: msg.data // Contient le tableau Int8 d'occupation
                }
            });
        });
    }




    /*
    --------------------------------------------------------------------------
    IMU
    --------------------------------------------------------------------------
    */

    if (cfg.topics.imu) {

        subscribers.imu = new ROSLIB.Topic({
            ros,
            name: cfg.topics.imu,
            messageType: "sensor_msgs/msg/Imu"
        });

        subscribers.imu.subscribe(msg => {
            const q = msg.orientation;
            const acc = msg.linear_acceleration; // Récupération de l'accéléromètre
            
            let roll = 0, pitch = 0, yaw = 0;

            if (q) {
                const sinr_cosp = 2 * (q.w * q.x + q.y * q.z);
                const cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y);
                roll = Math.atan2(sinr_cosp, cosr_cosp) * (180 / Math.PI);

                const sinp = 2 * (q.w * q.y - q.z * q.x);
                if (Math.abs(sinp) >= 1) {
                    pitch = (Math.PI / 2) * Math.sign(sinp) * (180 / Math.PI);
                } else {
                    pitch = Math.asin(sinp) * (180 / Math.PI);
                }

                const siny_cosp = 2 * (q.w * q.z + q.x * q.y);
                const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
                yaw = Math.atan2(siny_cosp, cosy_cosp) * (180 / Math.PI);
                if (yaw < 0) yaw += 360;
            }

            // Envoi groupé au State Manager
            setFeedbackState({
                imu: {
                    roll: roll,
                    pitch: pitch,
                    yaw: yaw,
                    accX: acc ? acc.x : 0.0,
                    accY: acc ? acc.y : 0.0,
                    accZ: acc ? acc.z : 0.0
                }
            });

            emit("topic:imu", { roll, pitch, yaw, accX: acc?.x, accY: acc?.y, accZ: acc?.z });
        });
    }

    /*
    --------------------------------------------------------------------------
    GPS
    --------------------------------------------------------------------------
    */

    if (cfg.topics.gps) {

        subscribers.gps = new ROSLIB.Topic({

            ros,

            name: cfg.topics.gps,

            messageType: "sensor_msgs/msg/NavSatFix"

        });

        subscribers.gps.subscribe(msg => {

            setFeedbackState({

                gps: msg

            });

            emit("topic:gps", msg);

        });

    }

/*--------------------------------------------------------------------------
    WIFI
    --------------------------------------------------------------------------
    */

    if (cfg.topics.wifi) {

        subscribers.wifi = new ROSLIB.Topic({
            ros,
            name: cfg.topics.wifi,
            messageType: "std_msgs/msg/String"
        });

        subscribers.wifi.subscribe(msg => {
            try {
                // On parse le JSON contenu dans msg.data (ex: {"ssid": "...", "ip_address": "...", "rssi": -40})
                const wifiData = JSON.parse(msg.data);

                setFeedbackState({
                    wifi: {
                        ssid: wifiData.ssid ?? "deconnecte",
                        ip_address: wifiData.ip_address ?? "0.0.0.0",
                        rssi: wifiData.rssi ?? -100
                    }
                });

                emit("topic:wifi", wifiData);
            } catch (err) {
                console.error("Error parsing WiFi JSON string:", err);
            }
        });

    }


    /*
    ----------------------------------------------------------------------
    ROBOT MODE / FSM
    ----------------------------------------------------------------------
    */

    if (cfg.topics.robot_mode) {

        subscribers.mode = new ROSLIB.Topic({
            ros,
            name: cfg.topics.robot_mode,
            messageType: "std_msgs/msg/String"
        });

        subscribers.mode.subscribe(msg => {

            setFeedbackState({ mode: msg.data });

            emit("topic:mode", msg.data);

        });

    }

    /*
    ----------------------------------------------------------------------
    OPTIONAL FSM
    ----------------------------------------------------------------------
    */

    if (cfg.topics.fsm) {

        subscribers.fsm = new ROSLIB.Topic({
            ros,
            name: cfg.topics.fsm,
            messageType: "std_msgs/msg/String"
        });

        subscribers.fsm.subscribe(msg => {

            setFeedbackState({ fsm: msg.data });

            emit("topic:fsm", msg.data);

        });

    }

    // OPTION B (Plus propre) : Si votre script Python publie un JSON String sur un seul topic
    if (cfg.topics.system_status) {
        subscribers.system = new ROSLIB.Topic({
            ros,
            name: cfg.topics.system_status,
            messageType: "std_msgs/msg/String"
        });

        subscribers.system.subscribe(msg => {
            try {
                // On parse le JSON reçu (ex: {"cpu": 24, "ram": 45, "temp": 52})
                const sysData = JSON.parse(msg.data);
                
                // Utilisation directe de la fonction pour mettre à jour le State
                setFeedbackState({
                    system: {
                        cpu: sysData.cpu ?? 0,
                        ram: sysData.ram ?? 0,
                        temp: sysData.temp ?? 0
                    }
                });
                
                emit("topic:system", sysData);
            } catch (err) {
                console.error("Error parsing system metrics JSON string:", err);
            }
        });
    }

    /*
    --------------------------------------------------------------------------
    LiDAR LaserScan (Synchrone & Sécurisé)
    --------------------------------------------------------------------------*/
    if (cfg.topics.lidar) {
        subscribers.lidar = new ROSLIB.Topic({
            ros,
            name: cfg.topics.lidar,
            messageType: "sensor_msgs/msg/LaserScan"
        });

    
        subscribers.lidar.subscribe(msg => {
            try {
                // 1. Extraction robuste des ranges
                const rawRanges = (msg.ranges && msg.ranges.data) ? msg.ranges.data : msg.ranges;
                if (!rawRanges) return;

                // 2. EXTRACTION ET DÉCLARATION SÉCURISÉE DES INTENSITÉS
                // Si msg.intensities n'existe pas du tout, on retombe sur un tableau vide
                const rawIntensities = (msg.intensities && msg.intensities.data) ? msg.intensities.data : msg.intensities;

                // 3. Conversion des ranges
                const cleanRanges = Array.from(rawRanges).map(val => {
                    if (val === '.inf' || val === 'inf' || val === Infinity) return 16.0;
                    if (val === '-.inf' || val === '-inf' || val === -Infinity) return 0.15;
                    return Number(val);
                });

                // 4. CONVERSION DES INTENSITÉS (Utilise maintenant la variable bien définie)
                const cleanIntensities = rawIntensities ? Array.from(rawIntensities).map(v => Number(v)) : [];

                // 5. Transmission
                setLidarTelemetry(
                    Number(msg.angle_min),
                    Number(msg.angle_increment),
                    cleanRanges,
                    cleanIntensities
                );

            } catch (err) {
                console.error("[LIDAR-TEST] Erreur dans le traitement :", err);
            }
        });
    }

}

/******************************************************************************
 * PUBLISH LOOP
 ******************************************************************************/

function startPublishLoop() {

    stopPublishLoop();

    const cfg = getConfig();

    const period = 1000 / cfg.publishRate;

    publishTimer = setInterval(() => {

        publish();

    }, period);

    log(`⏱️ ROS loop started (${cfg.publishRate} Hz)`);

}

/******************************************************************************
 * STOP LOOP
 ******************************************************************************/

function stopPublishLoop() {

    if (publishTimer) {

        clearInterval(publishTimer);

        publishTimer = null;

    }

}

/******************************************************************************
 * PUBLISH
 ******************************************************************************/

function publish() {

    if (!ros || !cmdVelPub || !bladePub) return;

    const state = getTargetState();

    const twist = new ROSLIB.Message({

        linear: {

            x: state.linear,
            y: 0,
            z: 0

        },

        angular: {

            x: 0,
            y: 0,
            z: state.angular

        }

    });

    const bladeMsg = new ROSLIB.Message({

        data: state.blade

    });
    
    cmdVelPub.publish(twist);

    bladePub.publish(bladeMsg);

    emit("ros:publish", state);

}

/******************************************************************************
 * SAFETY WATCHDOG
 ******************************************************************************/


function safetyWatchdog() {

}

/******************************************************************************
 * STATE UPDATE (COMPAT LAYER)
 *
 * IMPORTANT :
 * Cette fonction existe uniquement pour compatibilité avec les anciens widgets.
 * Elle sera supprimée en Sprint 3.4.
 ******************************************************************************/

/*export function updateRobotState(state = {}) {

    updateActivityTimestamp();

    setTargetState(state);

}*/

/******************************************************************************
 * STOP ROBOT
 ******************************************************************************/

export function stopRobot() {

    updateRobotState({

        linear: 0,

        angular: 0,

        blade: 0

    });

    publish();

    emit("ros:stop");

}

/******************************************************************************
 * EMERGENCY STOP
 ******************************************************************************/

export function emergencyStop() {

    emit("ros:emergency_stop");

    log("🛑 Emergency STOP triggered");

}

/******************************************************************************
 * CLEANUP SUBSCRIBERS
 ******************************************************************************/

function unsubscribeAll() {

    Object.values(subscribers).forEach(sub => {

        try {

            sub.unsubscribe();

        } catch (e) {

            console.warn(e);

        }

    });

    subscribers = {};

}

/******************************************************************************
 * GETTERS
 ******************************************************************************/

export function getROS() {

    return ros;

}

export function isConnected() {

    return ros !== null && AppState?.ros !== null;

}

/******************************************************************************
 * DEBUG INFO
 ******************************************************************************/

export function getROSInfo() {

    return {

        connected: isConnected(),

        publishRate: getConfig().publishRate,

        rosbridge: getConfig().rosbridge,

        topics: getConfig().topics,

        subscribers: Object.keys(subscribers),

        publishers: {

            cmdVel: !!cmdVelPub,

            blade: !!bladePub

        },

        lastUpdate: lastUpdateTime

    };

}

/******************************************************************************
 * CLEAN EXIT (OPTIONNEL FUTUR)
 ******************************************************************************/

export function shutdownROS() {

    try {

        stopPublishLoop();
        unsubscribeAll();

        if (ros) {

            ros.close();

        }

        ros = null;

        AppState.ros = null;

        setRosStatus(false);

        setUIState({ connected: false });

        emit("ros:shutdown");

        log("🔌 ROS shutdown complete");

    } catch (e) {

        console.error(e);

    }
}