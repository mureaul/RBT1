import rclpy
from rclpy.node import Node
from enum import Enum, auto

from std_msgs.msg import Float32, Bool, String
from rbt1_interfaces import MissionState

class DockState(Enum):
    IDLE = auto()
    WAIT_DOCK_ZONE = auto()
    SEARCH_DOCK = auto()
    ALIGN_DOCK = auto()
    FINAL_APPROACH = auto()
    CONTACT_VERIFY = auto()
    CHARGING = auto()
    UNDOCK = auto()


class DockManager(Node):

    def __init__(self):
        super().__init__('dock_manager')

        self.state = DockState.IDLE

        self.mission_step = MissionState.IDLE
        self.battery = 100.0
        self.dock_visible = False
        self.dock_contact = False

        # Subscriptions
        self.create_subscription(MissionState, '/mission/state', self.mission_state_cb, 10)
        self.create_subscription(Float32, '/battery/soc', self.battery_cb, 10)
        self.create_subscription(Bool, '/dock/visible', self.dock_visible_cb, 10)
        self.create_subscription(Bool, '/dock/contact', self.dock_contact_cb, 10)

        # Publications
        self.state_pub = self.create_publisher(String, '/dock/state', 10)
        self.mission_step_pub = self.create_publisher(MissionState, '/mission/state', 10)

        self.timer = self.create_timer(0.2, self.update)

        self.get_logger().info("🧠 Dock Manager (zone-based) started")

    # ---------- Callbacks ----------
    def mission_state_cb(self, msg):
        self.mission_step = msg.current_step

    def battery_cb(self, msg):
        self.battery = msg.data

    def dock_visible_cb(self, msg):
        self.dock_visible = msg.data

    def dock_contact_cb(self, msg):
        self.dock_contact = msg.data

    # ---------- FSM ----------
    def update(self):
        self.publish_state()

        # 1️⃣ Attente passive
        if self.state == DockState.IDLE:
            if self.mission_step == "RETURNING":
                self.state = DockState.WAIT_DOCK_ZONE

        # 2️⃣ Robot déjà amené par GPS dans la zone
        elif self.state == DockState.WAIT_DOCK_ZONE:
            if self.dock_visible:
                self.state = DockState.ALIGN_DOCK

        # 3️⃣ Recherche visuelle
        elif self.state == DockState.SEARCH_DOCK:
            if self.dock_visible:
                self.state = DockState.ALIGN_DOCK

        # 4️⃣ Alignement
        elif self.state == DockState.ALIGN_DOCK:
            if not self.dock_visible:
                self.state = DockState.SEARCH_DOCK
            else:
                self.state = DockState.FINAL_APPROACH

        # 5️⃣ Approche finale
        elif self.state == DockState.FINAL_APPROACH:
            if self.dock_contact:
                self.state = DockState.CONTACT_VERIFY

        # 6️⃣ Vérification contact
        elif self.state == DockState.CONTACT_VERIFY:
            if self.dock_contact:
                self.state = DockState.CHARGING

        # 7️⃣ Recharge
        elif self.state == DockState.CHARGING:
            if self.battery > 95.0:
                self.state = DockState.UNDOCK

        # 8️⃣ Sortie dock
        elif self.state == DockState.UNDOCK:
            self.publish_mission_step("DOCKED")
            self.state = DockState.IDLE

    # ---------- Utils ----------
    def publish_state(self):
        msg = String()
        msg.data = self.state.name
        self.state_pub.publish(msg)

    def publish_mission_step(self, step):
        msg = MissionState()
        msg.current_step = step
        self.mission_step_pub.publish(msg)


def main():
    rclpy.init()
    node = DockManager()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
