#!/usr/bin/env python3
import json
import rclpy
from rclpy.node import Node
from rbt1_interfaces.msg import MissionCommand, MissionState, MissionOrchestratorState
from rbt1_interfaces.srv import SetMode, MissionSchedulerAction
from std_msgs.msg import String, Bool
from enum import Enum, auto
from datetime import datetime, timedelta
from collections import deque
from rclpy.callback_groups import ReentrantCallbackGroup
from rclpy.executors import MultiThreadedExecutor


class OrchestratorStatus(Enum):
    IDLE = auto()
    WAITING_LAUNCH = auto()
    MISSION_SENT = auto()
    COMPLETED = auto()
    ERROR = auto()

class ScheduledMission:
    def __init__(self, mission_id, zone, min_battery=90.0, scheduled_time=None, manual=False, freq="ONCE", end_date=None):
        self.mission_id = mission_id
        self.zone = zone
        self.min_battery_percent = min_battery
        self.scheduled_time = scheduled_time
        self.manual = manual
        self.freq = freq
        self.end_date = end_date
        self.attempts = 0

class MissionOrchestrator(Node):
    def __init__(self):
        super().__init__('mission_orchestrator')

        self.status = OrchestratorStatus.IDLE
        self.current_mission_id = None
        self.last_mission_state = None
        self.mission_queue = deque()
        self.active_schedules = []
        self.executed_slots = set()  # Pour garder la trace des créneaux déjà traités aujourd'hui
        
        self.manual_request = False
        self.manual_zone = None
        self.manual_zone_req = False
        self.current_mode = "AUTO"
        self.info = ""
        self.cb_group = ReentrantCallbackGroup()

        # Nouveau client vers le service unifié du mission_planner
        self.planner_action_client = self.create_client(
            MissionSchedulerAction, 
            '/mission_planner/action', 
            callback_group=self.cb_group
        )

        # Publishers / Subscribers
        self.mission_pub = self.create_publisher(MissionCommand, '/mission/command', 10)
        self.orchestrator_pub = self.create_publisher(MissionOrchestratorState, '/state/mission_orchestrator', 10)
        self.create_subscription(MissionState, '/mission/state', self.state_cb, 10, callback_group=self.cb_group)
        self.create_subscription(Bool, '/cmd/mission/start', self.manual_start_cb, 10, callback_group=self.cb_group)
        self.create_subscription(String, '/cmd/mission/zone', self.manual_zone_cb, 10, callback_group=self.cb_group)
        self.create_subscription(String, '/state', self.mode_cb, 10, callback_group=self.cb_group)

        # Timers
        self.create_timer(10.0, self.fetch_schedules_from_planner, callback_group=self.cb_group)
        self.create_timer(5.0, self.orchestrator_loop, callback_group=self.cb_group)

        self.set_mode_client = self.create_client(SetMode, '/mode_manager/set_mode')
        # Demande de passage en mode "AUTO"
        self.set_robot_mode('AUTO')

        self.get_logger().info("✅ Mission Orchestrator READY")

    def set_robot_mode(self, target_mode: str):
        if not self.set_mode_client.wait_for_service(timeout_sec=2.0):
            self.get_logger().error("Le service /mode_manager/set_mode n'est pas disponible !")
            return

        req = SetMode.Request()
        req.mode = target_mode

        future = self.set_mode_client.call_async(req)
        future.add_done_callback(self._set_mode_response_callback)

    def _set_mode_response_callback(self, future):
        try:
            response = future.result()
            if response.success:
                self.get_logger().info(f" Succès : {response.message}")
            else:
                self.get_logger().warn(f" Échec : {response.message}")
        except Exception as e:
            self.get_logger().error(f"Erreur lors de l'appel au service set_mode : {e}")

    def parse_iso_datetime(self, date_str: str):
        """Parse proprement les dates ISO issues du JSON."""
        if not date_str:
            return None
        try:
            return datetime.fromisoformat(date_str)
        except ValueError:
            for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M"):
                try:
                    return datetime.strptime(date_str, fmt)
                except ValueError:
                    pass
        return None

    def fetch_schedules_from_planner(self):
        if not self.planner_action_client.service_is_ready():
            self.get_logger().warn("Échec de l'appel du service /mission_planner/action (non prêt)")
            return

        # Construction de la requête unifiée avec action JSON
        req = MissionSchedulerAction.Request()
        req.data = json.dumps({"action": "get"})

        future = self.planner_action_client.call_async(req)
        future.add_done_callback(self._fetch_schedules_cb)

    def _fetch_schedules_cb(self, future):
        try:
            res = future.result()
            if res.success:
                self.active_schedules = json.loads(res.message)
            else:
                self.get_logger().warn(f"Échec récupération plannings : {res.message}")
        except Exception as e:
            self.get_logger().error(f"Erreur de synchro avec mission_planner : {e}")

    def state_cb(self, msg: MissionState):
        self.last_mission_state = msg

    def manual_start_cb(self, msg: Bool):
        self.manual_request = msg.data

    def manual_zone_cb(self, msg: String):
        self.manual_zone = msg.data
        self.manual_zone_req = True

    def mode_cb(self, msg: String):
        self.current_mode = msg.data

    def check_manual_mission_ready(self) -> bool:
        if self.manual_request and self.manual_zone_req:
            self.manual_request = False
            self.manual_zone_req = False
            return True
        return False

    def mission_manager_ready(self) -> bool:
        if self.last_mission_state is None:
            return True
        return self.last_mission_state.state in ("WAIT_MISSION", "IDLE")

    def orchestrator_loop(self):
        now = datetime.now()

        if self.current_mode == "MANUAL":
            if self.status != OrchestratorStatus.IDLE:
                self.status = OrchestratorStatus.IDLE
            self.pub_orchestrator_state()
            return

        self.generate_scheduled_missions(now)

        if self.check_manual_mission_ready():
            mission_id = f"manual_{now.strftime('%Y%m%d_%H%M%S')}"
            self.mission_queue.append(ScheduledMission(mission_id, self.manual_zone, scheduled_time=now, manual=True))
            self.info = f"Mission manuelle {mission_id} ajoutée à la file"
            self.get_logger().info(self.info)

        if self.status == OrchestratorStatus.IDLE:
            if self.mission_queue:
                self.status = OrchestratorStatus.WAITING_LAUNCH
       
        if self.status == OrchestratorStatus.WAITING_LAUNCH:
            if self.mission_manager_ready() and self.mission_queue:
                next_mission = self.mission_queue[0]

                # Mission trop ancienne (> 1 jour)
                if next_mission.scheduled_time and now > next_mission.scheduled_time + timedelta(days=1):
                    self.info = f"Mission {next_mission.mission_id} expirée."
                    self.get_logger().error(self.info)
                    self.mission_queue.popleft()
                    self.status = OrchestratorStatus.IDLE
                    self.pub_orchestrator_state()
                    return

                # Prête à être envoyée
                if next_mission.scheduled_time is None or now >= next_mission.scheduled_time:
                    self.start_mission(next_mission)
                    self.status = OrchestratorStatus.MISSION_SENT
                    self.mission_queue.popleft()
        
        if self.status == OrchestratorStatus.MISSION_SENT:          
            if hasattr(self, 'current_mission_start_time') and self.current_mission_start_time + timedelta(days=1) < now:
                self.info = f"Timeout sur la mission {self.current_mission_id}"
                self.get_logger().error(self.info)
                self.status = OrchestratorStatus.ERROR

            if self.last_mission_state and self.last_mission_state.state == "COMPLETE":
                self.status = OrchestratorStatus.COMPLETED

        if self.status in (OrchestratorStatus.COMPLETED, OrchestratorStatus.ERROR):  
            self.status = OrchestratorStatus.IDLE

        self.pub_orchestrator_state()

    def generate_scheduled_missions(self, now: datetime):
        for sched in self.active_schedules:
            start_dt = self.parse_iso_datetime(sched.get('start_date'))
            end_dt = self.parse_iso_datetime(sched.get('end_date'))

            if not start_dt:
                continue

            # Vérification de la fenêtre de validité globale
            if now < start_dt or (end_dt and now > end_dt):
                continue

            # Création de l'heure cible pour la journée en cours
            target_time = now.replace(
                hour=start_dt.hour, 
                minute=start_dt.minute, 
                second=0, 
                microsecond=0
            )

            # Si l'heure cible du jour est déjà passée de plus de 2 heures, on évite le déclenchement rétroactif tardif
            if now > target_time + timedelta(hours=2):
                continue

            should_run = False
            freq = sched.get('freq', 'ONCE')

            if freq == 'DAILY':
                should_run = True
            elif freq == 'WEEKLY':
                should_run = (now.weekday() == start_dt.weekday())
            elif freq == 'ONCE':
                should_run = (now.date() == start_dt.date())

            if should_run:
                slot_id = f"sched_{sched['id']}_{now.strftime('%Y%m%d')}"

                # Anti-doublons : vérifie si le slot n'a pas déjà été exécuté ou mis en file
                if (slot_id not in self.executed_slots and 
                    not any(m.mission_id == slot_id for m in self.mission_queue) and 
                    self.current_mission_id != slot_id):

                    self.mission_queue.append(
                        ScheduledMission(
                            slot_id, 
                            sched['zone'], 
                            scheduled_time=target_time, 
                            freq=freq
                        )
                    )
                    self.executed_slots.add(slot_id)
                    self.info = f"📅 Mission planifiée {slot_id} en file (Zone {sched['zone']})"
                    self.get_logger().info(f"📅 Mission planifiée {slot_id} en file pour la zone {sched['zone']} (Heure prévue : {target_time.strftime('%H:%M')})")

    def start_mission(self, mission: ScheduledMission):
        msg = MissionCommand()
        msg.mission_id = mission.mission_id
        msg.min_battery_percent = mission.min_battery_percent
        msg.mission_type = "SURVEY"
        msg.zone = mission.zone
        self.mission_pub.publish(msg)
        self.current_mission_id = mission.mission_id
        self.current_mission_start_time = datetime.now()
        self.info = f"🚀 Mission {mission.mission_id} envoyée (Zone: {mission.zone})"
        self.get_logger().info(self.info)

    def pub_orchestrator_state(self):
        msg = MissionOrchestratorState()
        msg.state = self.status.name
        msg.info = self.info
        
        queue_list = []
        for m in self.mission_queue:
            queue_list.append({
                "id": m.mission_id,
                "z": m.zone,
                "b": m.min_battery_percent,
                "t": m.scheduled_time.isoformat() if m.scheduled_time else None,
                "m": m.manual,
                "f": m.freq
            })
        msg.queue = json.dumps(queue_list)

        self.orchestrator_pub.publish(msg)

def main():
    rclpy.init()
    orchestrator = MissionOrchestrator()
    executor = MultiThreadedExecutor()
    executor.add_node(orchestrator)
    try:
        executor.spin()
    except KeyboardInterrupt:
        pass
    finally:
        orchestrator.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()