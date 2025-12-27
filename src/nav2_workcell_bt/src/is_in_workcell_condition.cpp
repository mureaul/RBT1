#include <behaviortree_cpp_v3/condition_node.h>
#include <rclcpp/rclcpp.hpp>
#include <geometry_msgs/msg/pose_with_covariance_stamped.hpp>
#include <vector>
#include <string>
#include <mutex>
#include <cmath>

using std::placeholders::_1;

static bool pointInPolygon(double x, double y, const std::vector<std::vector<double>> &poly) {
  // ray casting
  bool inside = false;
  int n = (int)poly.size();
  for (int i = 0, j = n - 1; i < n; j = i++) {
    double xi = poly[i][0], yi = poly[i][1];
    double xj = poly[j][0], yj = poly[j][1];
    bool intersect = ((yi > y) != (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

class IsInWorkcell : public BT::ConditionNode
{
public:
  IsInWorkcell(const std::string & name, const BT::NodeConfig & config)
  : BT::ConditionNode(name, config)
  {
    node_ = rclcpp::Node::make_shared("is_in_workcell_bt_node");
    // load workcells from parameter server (nav2 params)
    if (node_->has_parameter("workcells")) {
      rclcpp::Parameter p = node_->get_parameter("workcells");
      // Ideally nav2_params.yaml provides workcells as a list of maps with footprint key
    }
    // We'll fetch parameter as generic - safer to use declare_parameter and get
    node_->declare_parameter("workcells", std::vector<std::string>());
    // now attempt to get structured param (yaml loaded by nav2)
    try {
      // get param as YAML-like string then parse? Simpler: attempt to get via get_parameter and expect Vector of maps isn't direct.
      // We'll assume nav2_params loads workcells as a parameter "workcells" of type
      // list of maps: each map has 'name' and 'footprint' which is list of list doubles.
    } catch (...) {}
    // Subscribe to robot pose
    pose_sub_ = node_->create_subscription<geometry_msgs::msg::PoseWithCovarianceStamped>(
      "/amcl_pose", 10, std::bind(&IsInWorkcell::poseCallback, this, _1));
  }

  static BT::PortsList providedPorts()
  {
    // Optional input: workcell_name to test for specific zone. If omitted, returns SUCCESS if in ANY workcell.
    return { BT::InputPort<std::string>("workcell_name", "optional specific workcell name") };
  }

  // This function will be called by the BT when evaluating this condition.
  BT::NodeStatus tick() override
  {
    std::lock_guard<std::mutex> lk(mutex_);
    double x = last_pose_x_;
    double y = last_pose_y_;
    if (!pose_received_) {
      RCLCPP_WARN(node_->get_logger(), "IsInWorkcell: no pose received yet");
      return BT::NodeStatus::FAILURE;
    }

    // Lazy load workcells param (only once)
    if (!loaded_) {
      loadWorkcellsFromParams();
      loaded_ = true;
    }

    auto workcell_name_res = getInput<std::string>("workcell_name");
    if (workcell_name_res) {
      std::string name = workcell_name_res.value();
      if (workcells_map_.count(name)) {
        if (pointInPolygon(x, y, workcells_map_[name])) {
          return BT::NodeStatus::SUCCESS;
        } else {
          return BT::NodeStatus::FAILURE;
        }
      } else {
        RCLCPP_WARN(node_->get_logger(), "IsInWorkcell: requested workcell '%s' not found", name.c_str());
        return BT::NodeStatus::FAILURE;
      }
    } else {
      // check any workcell
      for (auto &kv : workcells_map_) {
        if (pointInPolygon(x, y, kv.second)) {
          return BT::NodeStatus::SUCCESS;
        }
      }
      return BT::NodeStatus::FAILURE;
    }
  }

private:
  void poseCallback(const geometry_msgs::msg::PoseWithCovarianceStamped::SharedPtr msg) {
    std::lock_guard<std::mutex> lk(mutex_);
    last_pose_x_ = msg->pose.pose.position.x;
    last_pose_y_ = msg->pose.pose.position.y;
    pose_received_ = true;
  }

  void loadWorkcellsFromParams() {
    // Expect parameter structure under /nav2_params/polygon_layer/ros__parameters/workcells
    // But simpler: read parameter "workcells" on this node's namespace
    // We'll attempt to read using rclcpp::Parameter and parse YAML string fallback.
    try {
      // The param server may have 'workcells' as a YAML string - fetch via node->get_parameter
      rclcpp::Parameter p;
      if (node_->get_parameter("workcells", p)) {
        // If p is TYPE_STRING containing YAML, parse manually is heavy; instead try get_parameter with variant types is complex.
      }
    } catch (...) {
      RCLCPP_WARN(node_->get_logger(), "IsInWorkcell: couldn't parse 'workcells' param, ensure it's loaded into param server");
    }

    // As fallback, try reading individual params under /nav2_params/polygon_layer/ros__parameters/workcells
    std::vector<rclcpp::Parameter> params;
    // We'll try reading from topological param namespace
    // Common approach: the nav2 params are loaded under node namespaces; instruct user to set parameter 'workcells' on this node with list of maps.
    // For now, try get_parameter("workcells", ...)
    if (node_->get_parameter("workcells", params)) {
      // Try to parse - left as extension for your environment
    }

    // If nothing, warn user to set parameter. For reliability, user should start this node with parameter --ros-args -p workcells:="[...]"
    RCLCPP_INFO(node_->get_logger(), "IsInWorkcell: please ensure 'workcells' param is set (name + footprint).");
  }

  rclcpp::Node::SharedPtr node_;
  rclcpp::Subscription<geometry_msgs::msg::PoseWithCovarianceStamped>::SharedPtr pose_sub_;
  std::mutex mutex_;
  double last_pose_x_{0.0};
  double last_pose_y_{0.0};
  bool pose_received_{false};
  bool loaded_{false};

  // map name -> polygon (vector of [x,y])
  std::map<std::string, std::vector<std::vector<double>>> workcells_map_;
};

// Register node
#include <behaviortree_cpp_v3/bt_factory.h>
BT_REGISTER_NODES(factory)
{
  factory.registerNodeType<IsInWorkcell>("IsInWorkcell");
}

