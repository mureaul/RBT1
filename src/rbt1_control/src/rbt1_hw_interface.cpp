#include "rbt1_control/rbt1_hw_interface.hpp"
#include <algorithm>
#include <cmath>
#include <stdexcept>
#include <thread>

namespace rbt1_control
{

RBT1HWInterface::RBT1HWInterface()
{
  chip_ = nullptr;
  left_step_line_ = left_dir_line_ = right_step_line_ = right_dir_line_ = nullptr;

  left_wheel_pos_ = right_wheel_pos_ = 0.0;
  left_wheel_vel_ = right_wheel_vel_ = 0.0;
  left_cmd_vel_ = right_cmd_vel_ = 0.0;
  left_smoothed_freq_ = right_smoothed_freq_ = 0.0;
  max_accel_steps_s2_ = 0.0;
}

RBT1HWInterface::~RBT1HWInterface()
{
  std::lock_guard<std::mutex> lock(gpio_mutex_);
  if (left_step_line_)  gpiod_line_release(left_step_line_);
  if (left_dir_line_)   gpiod_line_release(left_dir_line_);
  if (right_step_line_) gpiod_line_release(right_step_line_);
  if (right_dir_line_)  gpiod_line_release(right_dir_line_);
  if (chip_) gpiod_chip_close(chip_);
}

hardware_interface::CallbackReturn RBT1HWInterface::on_init(const hardware_interface::HardwareInfo & info)
{
  if (hardware_interface::SystemInterface::on_init(info) != hardware_interface::CallbackReturn::SUCCESS)
    return hardware_interface::CallbackReturn::ERROR;

  try {
    left_step_pin_  = std::stoi(info.hardware_parameters.at("left_step"));
    left_dir_pin_   = std::stoi(info.hardware_parameters.at("left_dir"));
    right_step_pin_ = std::stoi(info.hardware_parameters.at("right_step"));
    right_dir_pin_  = std::stoi(info.hardware_parameters.at("right_dir"));

    steps_per_rev_ = info.hardware_parameters.count("steps_per_rev") ? std::stoi(info.hardware_parameters.at("steps_per_rev")) : 200;
    wheel_radius_  = info.hardware_parameters.count("wheel_radius") ? std::stod(info.hardware_parameters.at("wheel_radius")) : 0.09;
    pulse_us_      = info.hardware_parameters.count("pulse_us") ? std::stoi(info.hardware_parameters.at("pulse_us")) : 50;
    max_accel_m_s2_ = info.hardware_parameters.count("max_accel_m_s2") ? std::stod(info.hardware_parameters.at("max_accel_m_s2")) : 0.6;
    max_accel_steps_s2_ = max_accel_m_s2_ * (steps_per_rev_ / (2.0 * M_PI * wheel_radius_));
    max_step_freq_ = info.hardware_parameters.count("max_step_frequency") ? std::stod(info.hardware_parameters.at("max_step_frequency")) : 20000.0;
  } catch (const std::exception &e) {
    RCLCPP_ERROR(rclcpp::get_logger("RBT1HWInterface"), "Invalid hardware_parameters: %s", e.what());
    return hardware_interface::CallbackReturn::ERROR;
  }

  steps_per_meter_ = (steps_per_rev_ /* * microsteps if used */) / (2.0 * M_PI * wheel_radius_);

  RCLCPP_INFO(rclcpp::get_logger("RBT1HWInterface"),
              "on_init done: left_step=%d left_dir=%d right_step=%d right_dir=%d pulse_us=%d max_accel=%.3f",
              left_step_pin_, left_dir_pin_, right_step_pin_, right_dir_pin_, pulse_us_, max_accel_m_s2_);

  return hardware_interface::CallbackReturn::SUCCESS;
}

hardware_interface::CallbackReturn RBT1HWInterface::on_activate(const rclcpp_lifecycle::State &)
{
  std::lock_guard<std::mutex> lock(gpio_mutex_);

  chip_ = gpiod_chip_open_by_name("gpiochip0");
  if (!chip_) {
    RCLCPP_ERROR(rclcpp::get_logger("RBT1HWInterface"), "Failed to open gpiochip0");
    return hardware_interface::CallbackReturn::ERROR;
  }

  left_step_line_  = gpiod_chip_get_line(chip_, left_step_pin_);
  left_dir_line_   = gpiod_chip_get_line(chip_, left_dir_pin_);
  right_step_line_ = gpiod_chip_get_line(chip_, right_step_pin_);
  right_dir_line_  = gpiod_chip_get_line(chip_, right_dir_pin_);

  if (!left_step_line_ || !left_dir_line_ || !right_step_line_ || !right_dir_line_) {
    RCLCPP_ERROR(rclcpp::get_logger("RBT1HWInterface"), "Failed to get GPIO lines");
    return hardware_interface::CallbackReturn::ERROR;
  }

  if (gpiod_line_request_output(left_step_line_, "rbt1_control", 0) < 0) {
    RCLCPP_ERROR(rclcpp::get_logger("RBT1HWInterface"), "Failed to request left_step_line as output");
    return hardware_interface::CallbackReturn::ERROR;
  }
  if (gpiod_line_request_output(left_dir_line_, "rbt1_control", 0) < 0) {
    RCLCPP_ERROR(rclcpp::get_logger("RBT1HWInterface"), "Failed to request left_dir_line as output");
    return hardware_interface::CallbackReturn::ERROR;
  } 
  if (gpiod_line_request_output(right_step_line_, "rbt1_control", 0) < 0) {
    RCLCPP_ERROR(rclcpp::get_logger("RBT1HWInterface"), "Failed to request right_step_line as output");
    return hardware_interface::CallbackReturn::ERROR;
  }
  if (gpiod_line_request_output(right_dir_line_, "rbt1_control", 0) < 0) {
    RCLCPP_ERROR(rclcpp::get_logger("RBT1HWInterface"), "Failed to request right_dir_line as output");
   return hardware_interface::CallbackReturn::ERROR;
  }

  return hardware_interface::CallbackReturn::SUCCESS;
}

hardware_interface::CallbackReturn RBT1HWInterface::on_deactivate(const rclcpp_lifecycle::State &)
{
  std::lock_guard<std::mutex> lock(gpio_mutex_);
  if (left_step_line_)  gpiod_line_release(left_step_line_);
  if (left_dir_line_)   gpiod_line_release(left_dir_line_);
  if (right_step_line_) gpiod_line_release(right_step_line_);
  if (right_dir_line_)  gpiod_line_release(right_dir_line_);
  if (chip_) gpiod_chip_close(chip_);
  chip_ = nullptr;

  return hardware_interface::CallbackReturn::SUCCESS;
}

std::vector<hardware_interface::StateInterface> RBT1HWInterface::export_state_interfaces()
{
  std::vector<hardware_interface::StateInterface> state_interfaces;
  state_interfaces.emplace_back("left_wheel_joint", "position", &left_wheel_pos_);
  state_interfaces.emplace_back("left_wheel_joint", "velocity", &left_wheel_vel_);
  state_interfaces.emplace_back("right_wheel_joint", "position", &right_wheel_pos_);
  state_interfaces.emplace_back("right_wheel_joint", "velocity", &right_wheel_vel_);
  return state_interfaces;
}

std::vector<hardware_interface::CommandInterface> RBT1HWInterface::export_command_interfaces()
{
  std::vector<hardware_interface::CommandInterface> command_interfaces;
  command_interfaces.emplace_back("left_wheel_joint", "velocity", &left_cmd_vel_);
  command_interfaces.emplace_back("right_wheel_joint", "velocity", &right_cmd_vel_);
  return command_interfaces;
}


hardware_interface::return_type RBT1HWInterface::read(const rclcpp::Time &, const rclcpp::Duration & period)
{
  double dt = period.seconds();
  left_wheel_pos_  += left_smoothed_freq_ / steps_per_meter_ * dt;
  right_wheel_pos_ += right_smoothed_freq_ / steps_per_meter_ * dt;
  left_wheel_vel_  = left_smoothed_freq_ / steps_per_meter_;
  right_wheel_vel_ = right_smoothed_freq_ / steps_per_meter_;
  return hardware_interface::return_type::OK;
}

hardware_interface::return_type RBT1HWInterface::write(const rclcpp::Time &, const rclcpp::Duration & period)
{
  std::lock_guard<std::mutex> lock(gpio_mutex_);

  double dt = period.seconds();
  if (dt <= 0.0) dt = 0.01;

  // ramping
  auto ramp_freq = [&](double current, double target) {
    double delta = max_accel_steps_s2_ * dt;
    if (std::fabs(target - current) < delta)
      return target;
    return current + ((target > current) ? delta : -delta);
  };

  double left_target_freq  = left_cmd_vel_  * steps_per_meter_;
  double right_target_freq = right_cmd_vel_ * steps_per_meter_;

  if (std::fabs(left_target_freq) > max_step_freq_)  left_target_freq  = std::copysign(max_step_freq_, left_target_freq);
  if (std::fabs(right_target_freq) > max_step_freq_) right_target_freq = std::copysign(max_step_freq_, right_target_freq);

  left_smoothed_freq_  = ramp_freq(left_smoothed_freq_,  left_target_freq);
  right_smoothed_freq_ = ramp_freq(right_smoothed_freq_, right_target_freq);

  // set direction pins
  gpiod_line_set_value(left_dir_line_,  left_smoothed_freq_ >= 0.0 ? 1 : 0);
  gpiod_line_set_value(right_dir_line_, right_smoothed_freq_ >= 0.0 ? 1 : 0);

  // generate step pulses (software)
  int n_left_steps  = std::abs(static_cast<int>(left_smoothed_freq_ * dt));
  int n_right_steps = std::abs(static_cast<int>(right_smoothed_freq_ * dt));

  for (int i = 0; i < std::max(n_left_steps, n_right_steps); ++i) {
    if (i < n_left_steps)  gpiod_line_set_value(left_step_line_,  1);
    if (i < n_right_steps) gpiod_line_set_value(right_step_line_, 1);
    std::this_thread::sleep_for(std::chrono::microseconds(pulse_us_));
    if (i < n_left_steps)  gpiod_line_set_value(left_step_line_,  0);
    if (i < n_right_steps) gpiod_line_set_value(right_step_line_, 0);
  }

  return hardware_interface::return_type::OK;
}

} // namespace rbt1_control

#include "pluginlib/class_list_macros.hpp"
PLUGINLIB_EXPORT_CLASS(
  rbt1_control::RBT1HWInterface,
  hardware_interface::SystemInterface
)

