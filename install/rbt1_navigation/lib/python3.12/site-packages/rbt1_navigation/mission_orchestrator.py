import os
import rclpy
from rclpy.node import Node
from rbt1_interfaces.msg import MissionCommand, MissionState
from std_msgs.msg import String, Bool
from std_srvs.srv import Trigger
from enum import Enum, auto
from datetime import datetime, timedelta
from collections import deque
from rbt1_interfaces.srv import LoadZone
from rclpy.callback_groups import ReentrantCallbackGroup

# ================= ENUM =================
class OrchestratorStatus(Enum):
    IDLE = auto()
    WAITING_LAUNCH = auto()
    MISSION_SENT = auto()
    PAUSED = auto()
    COMPLETED = auto()
    ERROR = auto()

# ================= MISSION STRUCT =================
class ScheduledMission:
    def __init__(self, mission_id, zone, min_battery=30.0, scheduled_time=None, manual=False):
        self.mission_id = mission_id
        self.zone = zone
        self.min_battery_percent = min_battery
        self.scheduled_time = scheduled_time
        self.manual = manual
        self.attempts = 0  # compteur de reports

# ================= NODE =================
class MissionOrchestrator(Node):
    def __init__(self):
        super().__init__('mission_orchestrator')

        # ---- ÉTAT ----
        self.status = OrchestratorStatus.IDLE
        self.current_mission_id = None
        self.last_mission_state = None
        self.mission_queue = deque()
        self.weather_ok = False
        self.battery_ok = False
        self.manual_request = False
        self.manual_zone = None
        self.manual_mission_cmd = False
        self.manual_zone_req = False

        # ---- PUBLISHERS ----
        self.mission_pub = self.create_publisher(MissionCommand, '/mission/command', 10)

        # ---- SUBSCRIBERS ----
        self.create_subscription(MissionState, '/mission/state', self.state_cb, 10)
        self.create_subscription(Bool, '/cmd/mission/start', self.manual_start_cb, 10)
        self.create_subscription(String, '/cmd/mission/zone', self.manual_zone_cb, 10)
        self.create_subscription(Bool, '/state/weather_ok', self.weather_ok_cb, 10)
        self.create_subscription(Bool, '/state/battery_ok', self.battery_ok_cb, 10)

        # ---- TIMERS ----
        self.create_timer(5.0, self.orchestrator_loop)

        # ---- TEMP ----
        self.manual_request = False
        self.manual_zone = None
        self.prep_request = False

        # ---- NAVIGATION ORCHESTRATOR SERVICE ---------------
        #self.cb_group = ReentrantCallbackGroup()
        #self.load_zone_client = self.create_client(LoadZone, '/nav2/load_zone',callback_group=self.cb_group)
        #while not self.load_zone_client.wait_for_service(timeout_sec=2.0):
        #    self.get_logger().info("Waiting for /navigation/load_zone service...")
        
        self.get_logger().info("✅ Mission Orchestrator READY")

    # ================= CALLBACKS =================
    def state_cb(self, msg: MissionState):
        self.last_mission_state = msg
        if msg.state == "PAUSED":
            self.status = OrchestratorStatus.PAUSED
            self.get_logger().info(f"Mission PAUSED at step {msg.current_step}")
        elif msg.state == "DONE":
            self.status = OrchestratorStatus.COMPLETED
            self.get_logger().info(f"Mission COMPLETED: {msg.mission_id}")
        elif msg.state == "ERROR":
            self.status = OrchestratorStatus.ERROR
            self.get_logger().error(f"Mission ERROR: {msg.info}")

    def manual_start_cb(self, msg: Bool):
        self.manual_request = msg.data
        if msg.data:
            self.get_logger().info("Manual mission requested")

    def weather_ok_cb(self, msg: Bool):
        self.weather_ok = msg.data

    def battery_ok_cb(self, msg: Bool):
        self.battery_ok = msg.data

    def manual_zone_cb(self, msg: String):
        self.manual_zone = msg.data
        self.manual_zone_req = True
        self.get_logger().info(f"Manual mission zone set to: {self.manual_zone}")

    def check_manual_mission_ready(self) -> bool:
        if self.manual_request and self.manual_zone_req:
            # reset flags pour la prochaine mission
            self.manual_request = False
            self.manual_zone_req = False
            return True
        else:
            return False

    # ===============CHECK MISSION MANAGER READY ====================
    def mission_manager_ready(self) -> bool:
        if self.last_mission_state is None:
            return True
        return self.last_mission_state.state in ("DONE")


    # ================= LOOP =================
    def orchestrator_loop(self):
        now = datetime.now()
        
        if self.status == OrchestratorStatus.MISSION_SENT:
            return
        # ----- Planification automatique -----
        if not self.mission_queue:
            # Créer mission automatique si vide
            zone_of_the_day = self.select_zone_by_day(now.weekday())
            mission_id = f"auto_{now.strftime('%Y%m%d_%H%M%S')}"
            scheduled_time = now.replace(hour=1, minute=0, second=0, microsecond=0)
            #if scheduled_time < now:
            #    scheduled_time += timedelta(days=1)
            self.mission_queue.append(ScheduledMission(mission_id, zone_of_the_day, scheduled_time=scheduled_time))
            self.get_logger().info(f"Auto mission {mission_id} queued, planifiée le {scheduled_time}")

        # ----- Ajouter mission manuelle si demandée -----
        if self.check_manual_mission_ready():
            mission_id = f"manual_{now.strftime('%Y%m%d_%H%M%S')}"
            self.mission_queue.append(ScheduledMission(mission_id, self.manual_zone, manual=True))
            self.manual_zone_req = False
            self.manual_request = False
            self.manual_zone = None
            self.get_logger().info(f"Manual mission {mission_id} queued")

        # ----- Lancer mission si possible -----
        if self.mission_queue and self.status in (OrchestratorStatus.IDLE, OrchestratorStatus.COMPLETED) and self.mission_manager_ready():
            next_mission = self.mission_queue[0]
    
            # Vérifier si la mission est trop vieille (>1 jour)
            if next_mission.scheduled_time is not None and now > next_mission.scheduled_time + timedelta(days=1):
                self.get_logger().error(f"Mission {next_mission.mission_id} annulée : planifiée le {next_mission.scheduled_time} et dépassée d'un jour ou plus")
                self.mission_queue.popleft()
                return
            
            # vérifier si c'est le moment de lancer (report si pas conditions OK)
            if self.check_conditions():
                self.get_logger().info(f"Conditions météo et batterie OK pour mission {next_mission.mission_id}")
                if next_mission.scheduled_time is None or now >= next_mission.scheduled_time:
                    self.get_logger().info(f"Timing OK pour mission {next_mission.mission_id} planifiée le {next_mission.scheduled_time}")
                    self.start_mission(next_mission)
                    # attendre que la mission soit complete
                    self.mission_queue.popleft()

        # ----- Suivi mission en cours -----
        if self.last_mission_state:
            self.get_logger().info(f"Mission {self.last_mission_state.mission_id} step={self.last_mission_state.current_step} state={self.last_mission_state.state}")

    # ================= LOGIC =================
    def select_zone_by_day(self, weekday: int):
        zones = ["workcell1 - jardin nord", "workcell1 - jardin nord", "workcell1 - jardin nord", "workcell1 - jardin nord", "workcell1 - jardin nord", "workcell1 - jardin nord", "workcell1 - jardin nord"]
        return zones[weekday]

    def check_conditions(self):
        if (self.weather_ok and self.battery_ok):
            return True
        else:
            return False

    def start_mission(self, mission: ScheduledMission):
        msg = MissionCommand()
        msg.mission_id = mission.mission_id
        msg.min_battery_percent = mission.min_battery_percent
        msg.mission_type = "SURVEY"
        msg.zone = mission.zone
        self.mission_pub.publish(msg)
        self.current_mission_id = mission.mission_id
        self.status = OrchestratorStatus.MISSION_SENT
        self.get_logger().info(f"{'Manual' if mission.manual else 'Scheduled'} mission {mission.mission_id} launched to {mission.zone}")

# ================= MAIN =================
def main():
    rclpy.init()
    orchestrator = MissionOrchestrator()
    rclpy.spin(orchestrator)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
