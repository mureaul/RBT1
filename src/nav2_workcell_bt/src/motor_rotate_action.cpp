#include <behaviortree_cpp_v3/action_node.h>
#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/bool.hpp>

using std::placeholders::_1;

class MotorRotate : public BT::SyncActionNode
{
public:
  MotorRotate(const std::string & name, const BT::NodeConfig & config)
  : BT::SyncActionNode(name, config)
  {
    node_ = rclcpp::Node::make_shared("motor_rotate_bt_node");
    // Publisher to control motor (adapt topic/type if needed)
    pub_ = node_->create_publisher<std_msgs::msg::Bool>("/motor_rotate", 10);
  }

  static BT::PortsList providedPorts()
  {
    return { BT::InputPort<std::string>("command", "on or off") };
  }

  BT::NodeStatus tick() override
  {
    auto cmd_res = getInput<std::string>("command");
    if (!cmd_res) {
      RCLCPP_ERROR(node_->get_logger(), "MotorRotate: missing 'command' input");
      return BT::NodeStatus::FAILURE;
    }
    std::string cmd = cmd_res.value();
    std_msgs::msg::Bool msg;
    if (cmd == "on" || cmd == "true" || cmd == "1") {
      msg.data = true;
    } else {
      msg.data = false;
    }

    pub_->publish(msg);
    // small spin to actually flush the publisher (not blocking)
    rclcpp::spin_some(node_);
    return BT::NodeStatus::SUCCESS;
  }

private:
  rclcpp::Node::SharedPtr node_;
  rclcpp::Publisher<std_msgs::msg::Bool>::SharedPtr pub_;
};

// Register node as a plugin for dynamic loading
#include <behaviortree_cpp_v3/bt_factory.h>
BT_REGISTER_NODES(factory)
{
  factory.registerNodeType<MotorRotate>("MotorRotate");
}

