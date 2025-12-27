#ifndef RBT1_HW_INTERFACE_HPP
#define RBT1_HW_INTERFACE_HPP

#include <hardware_interface/system_interface.hpp>
#include <hardware_interface/types/hardware_interface_return_values.hpp>
#include <rclcpp/rclcpp.hpp>
#include <vector>
#include <string>
#include <memory>
#include <chrono>
#include <mutex>

#include <gpiod.h>

namespace rbt1_control {

class RBT1HWInterface : public hardware_interface::SystemInterface
{
public:
  RCLCPP_SHARED_PTR_DEFINITIONS(RBT1HWInterface)

  RBT1HWInterface();
  ~RBT1HWInterface() override;

  hardware_interface::CallbackReturn on_init(const hardware_interface::HardwareInfo & info) override;
  std::vector<hardware_interface::StateInterface> export_state_interfaces() override;
  std::vector<hardware_interface::CommandInterface> export_command_interfaces() override;

  hardware_interface::CallbackReturn on_activate(const rclcpp_lifecycle::State & previous_state) override;
  hardware_interface::CallbackReturn on_deactivate(const rclcpp_lifecycle::State & previous_state) override;

  hardware_interface::return_type read(const rclcpp::Time & time, const rclcpp::Duration & period) override;
  hardware_interface::return_type write(const rclcpp::Time & time, const rclcpp::Duration & period) override;

private:
  // Wheel states
  double left_wheel_pos_  = 0.0;
  double right_wheel_pos_ = 0.0;
  double left_wheel_vel_  = 0.0;
  double right_wheel_vel_ = 0.0;

  // Commands
  double left_cmd_vel_ = 0.0;
  double right_cmd_vel_ = 0.0;

  // Ramping
  double left_ramped_vel_ = 0.0;
  double right_ramped_vel_ = 0.0;
  double max_accel_m_s2_ = 0.6; // m/s^2
  double max_accel_steps_s2_;    // steps/s^2
  double left_smoothed_freq_;    // steps/s
  double right_smoothed_freq_;   // steps/s

  // GPIO config
  int left_step_pin_ = 23;
  int left_dir_pin_  = 24;
  int right_step_pin_ = 17;
  int right_dir_pin_  = 27;

  // Robot parameters
  int steps_per_rev_ = 200;
  double microstep_ = 8.0;
  double wheel_radius_ = 0.1;
  double wheel_base_ = 0.30;
  double steps_per_meter_ = 0.0;

  // libgpiod handles
  gpiod_chip *chip_ = nullptr;
  gpiod_line *left_step_line_ = nullptr;
  gpiod_line *left_dir_line_ = nullptr;
  gpiod_line *right_step_line_ = nullptr;
  gpiod_line *right_dir_line_ = nullptr;

  std::mutex gpio_mutex_;

  double last_period_sec_ = 0.01;

  // Hardware parameters
  int pulse_us_ = 50;
  double max_step_freq_ = 20000.0;
  double freq_tolerance_ = 1e-6;

  // Internal helpers
  void apply_ramping(double dt);
  void generate_steps(double left_vel, double right_vel, double dt);
};

} // namespace rbt1_control

#endif

