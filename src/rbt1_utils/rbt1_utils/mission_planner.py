#!/usr/bin/env python3
import os
import json
import rclpy
from rclpy.node import Node
# Importation du service custom
from rbt1_interfaces.srv import MissionSchedulerAction

class MissionPlannerNode(Node):
    def __init__(self):
        super().__init__('mission_planner')

        self.db_path = os.path.join(os.getenv('HOME'), 'RBT1', 'schedules', 'scheduled_missions.json')
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)

        if not os.path.exists(self.db_path):
            self.save_to_disk([])

        # --- SERVICE UNIFIÉ VIA INTERFACE CUSTOM ---
        self.create_service(
            MissionSchedulerAction, 
            '/mission_planner/action', 
            self.handle_action_cb
        )

        self.get_logger().info("✅ Mission Planner Node prêt (Interface : MissionSchedulerAction)")

    # ================= FICHIER DISQUE =================
    def read_from_disk(self):
        if not os.path.exists(self.db_path):
            return []
        try:
            with open(self.db_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            self.get_logger().error(f"❌ Erreur lecture JSON : {e}")
            return []

    def save_to_disk(self, data):
        try:
            with open(self.db_path, 'w') as f:
                json.dump(data, f, indent=4)
            self.get_logger().info("💾 JSON mis à jour sur le disque.")
            return True
        except Exception as e:
            self.get_logger().error(f"❌ Erreur écriture JSON : {e}")
            return False

    # ================= CALLBACK UNIQUE =================
    def handle_action_cb(self, request, response):
        try:
            if not request.data:
                response.success = False
                response.message = "Payload JSON vide."
                return response

            payload = json.loads(request.data)
            action = payload.get('action')

            if not action:
                response.success = False
                response.message = "Champ 'action' manquant dans le JSON."
                return response

            schedules = self.read_from_disk()

            # --- ACTION: READ / GET ---
            if action == 'get':
                response.success = True
                response.message = json.dumps(schedules)
                return response

            # --- ACTION: CLEAR ---
            elif action == 'clear':
                self.save_to_disk([])
                response.success = True
                response.message = "[]"
                return response

            # --- ACTION: ADD / UPDATE ---
            elif action in ['add', 'update']:
                item_id = payload.get('id')
                if not item_id:
                    response.success = False
                    response.message = "Champ 'id' requis pour add/update."
                    return response

                # Extraction propre de l'objet planification sans le champ 'action'
                schedule_item = {
                    "id": item_id,
                    "zone": payload.get('zone'),
                    "freq": payload.get('freq'),
                    "start_date": payload.get('start_date'),
                    "end_date": payload.get('end_date')
                }

                # Suppression de l'ancienne version si existante
                schedules = [s for s in schedules if str(s.get('id')) != str(item_id)]
                schedules.append(schedule_item)

                if self.save_to_disk(schedules):
                    response.success = True
                    response.message = json.dumps(schedules)
                else:
                    response.success = False
                    response.message = "Erreur lors de la sauvegarde sur disque."

            # --- ACTION: DELETE ---
            elif action == 'delete':
                target_id = payload.get('id')
                if not target_id:
                    response.success = False
                    response.message = "ID requis pour la suppression."
                    return response

                initial_len = len(schedules)
                schedules = [s for s in schedules if str(s.get('id')) != str(target_id)]

                if len(schedules) < initial_len:
                    self.save_to_disk(schedules)
                    response.success = True
                    response.message = json.dumps(schedules)
                else:
                    response.success = False
                    response.message = f"ID '{target_id}' introuvable."

            else:
                response.success = False
                response.message = f"Action non reconnue : {action}"

        except Exception as e:
            self.get_logger().error(f"❌ Erreur traitement action : {e}")
            response.success = False
            response.message = f"Erreur serveur : {str(e)}"

        return response

def main(args=None):
    rclpy.init(args=args)
    node = MissionPlannerNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
    