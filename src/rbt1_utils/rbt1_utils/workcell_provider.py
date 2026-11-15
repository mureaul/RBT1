#!/usr/bin/env python3
import os
import yaml
import rclpy
from rclpy.node import Node

# À adapter selon le nom de votre package et de vos services personnalisés
from rbt1_interfaces.srv import GetWorkcells, GetWorkcellGeometry, DeleteWorkcell 

class WorkcellProvider(Node):
    def __init__(self):
        super().__init__('workcell_provider')
        
        # Configuration des chemins d'accès
        self.home = os.getenv('HOME', os.path.expanduser('~'))
        self.maps_dir = os.path.join(self.home, 'RBT1', 'src', 'rbt1_navigation', 'maps')
        
        # Création des services ROS 2
        self.srv_list = self.create_service(GetWorkcells, 'get_workcells', self.handle_get_workcells)
        self.srv_geom = self.create_service(GetWorkcellGeometry, 'get_workcell_geometry', self.handle_get_geometry)
        self.srv_delete = self.create_service(DeleteWorkcell, 'delete_workcell', self.handle_delete_workcell)

        self.get_logger().info("Nœud workcell_provider démarré, services disponibles.")

    def get_clean_name(self, filename):
        name = filename.replace('.yaml', '')
        if name.startswith('workcell_'): name = name[9:]
        elif name.startswith('wokcell_'): name = name[8:]
        return name.replace('_', ' ').capitalize()

    def handle_get_workcells(self, request, response):
        self.get_logger().info("Requête reçue : Liste des workcells")
        ids, names, counts = [], [], []
        
        if os.path.exists(self.maps_dir):
            for file in os.listdir(self.maps_dir):
                if file.endswith('.yaml') and (file.startswith('workcell') or file.startswith('wokcell')):
                    file_path = os.path.join(self.maps_dir, file)
                    try:
                        with open(file_path, 'r') as f:
                            data = yaml.safe_load(f)
                        
                        waypoints = data.get('waypoints', data) if isinstance(data, dict) else data
                        count = len(waypoints) if isinstance(waypoints, list) else 0
                        
                        ids.append(file.replace('.yaml', ''))
                        names.append(self.get_clean_name(file))
                        counts.append(count)
                    except Exception as e:
                        self.get_logger().error(f"Erreur lecture fichier {file}: {e}")
                        
        response.ids = ids
        response.names = names
        response.waypoints_counts = counts
        response.success = True
        return response

    def handle_get_geometry(self, request, response):
        self.get_logger().info(f"Requête reçue : Géométrie pour {request.id}")
        safe_id = os.path.basename(request.id)
        yaml_path = os.path.join(self.maps_dir, f"{safe_id}.yaml")
        map_yaml_path = os.path.join(self.maps_dir, 'RBT1_map.yaml')
        minx, miny = 0.0, 0.0

        # 1. Récupération de l'origine absolue de la carte Nav2
        if os.path.exists(map_yaml_path):
            try:
                with open(map_yaml_path, 'r') as f:
                    map_data = yaml.safe_load(f)
                    origin_list = map_data.get('origin', [0.0, 0.0, 0.0])
                    minx = origin_list[0]
                    miny = origin_list[1]
            except Exception as e:
                self.get_logger().error(f"Erreur lecture RBT1_map.yaml : {e}")

        # 2. Lecture et extraction du contour extérieur
        if os.path.exists(yaml_path):
            try:
                with open(yaml_path, 'r') as f:
                    content = yaml.safe_load(f)
                
                # Récupération des poses (le zigzag de couverture)
                poses = content.get('poses', []) if isinstance(content, dict) else content
                
                if isinstance(poses, list) and len(poses) > 2:
                    # --- ASTUCE POUR L'AIRE PROPRE ---
                    # Au lieu d'envoyer tout le zigzag, on peut extraire le contour.
                    # Si vos fichiers générés possèdent une structure spécifique ou si on veut
                    # juste nettoyer l'affichage, on envoie les poses ET l'origine.
                    pass

                # On emballe proprement pour le JS
                output = {
                    'poses': poses,
                    'global_origin': {'minx': minx, 'miny': miny}
                }
                
                response.yaml_content = yaml.dump(output)
                response.success = True
            except Exception as e:
                self.get_logger().error(f"Erreur lecture géométrie {safe_id}: {e}")
                response.success = False
        else:
            self.get_logger().warn(f"Fichier introuvable : {yaml_path}")
            response.success = False
            
        return response
    
    def handle_delete_workcell(self, request, response):
        self.get_logger().info(f"Requête reçue : Suppression de la workcell via interface dédiée pour : {request.id}")
        
        # Sécurisation du nom de fichier pour éviter les injections de chemin (ex: ../..)
        safe_id = os.path.basename(request.id)
        yaml_path = os.path.join(self.maps_dir, f"{safe_id}.yaml")
        
        if os.path.exists(yaml_path):
            try:
                os.remove(yaml_path)
                self.get_logger().info(f"Fichier effacé avec succès : {yaml_path}")
                response.success = True
                response.message = f"La workcell '{safe_id}' a été supprimée avec succès."
            except Exception as e:
                error_msg = f"Impossible de supprimer le fichier physique : {e}"
                self.get_logger().error(error_msg)
                response.success = False
                response.message = error_msg
        else:
            warn_msg = f"Fichier introuvable sur le disque : {yaml_path}"
            self.get_logger().warn(warn_msg)
            response.success = False
            response.message = warn_msg
            
        return response


def main(args=None):
    rclpy.init(args=args)
    node = WorkcellProvider()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.try_shutdown()

if __name__ == '__main__':
    main()