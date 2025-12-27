#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/bool.hpp>
#include <std_msgs/msg/string.hpp>
#include <std_msgs/msg/float32.hpp> 
#include <gpiod.h>
#include <thread>
#include <chrono>
#include <cmath>
#include <atomic>
using namespace std::chrono_literals;

class CoupeMotorNode : public rclcpp::Node {
public:
    CoupeMotorNode() : Node("coupe_motor"), pwm_ratio_(0.0f) {
        declare_parameter<int>("motor.gpio_pin", 18);
        declare_parameter<int>("motor.emergency_pin", 17);
        declare_parameter<int>("motor.pwm_frequency", 20000);
        declare_parameter<double>("motor.ramp_up_duration", 2.0);
        declare_parameter<double>("motor.ramp_down_duration", 1.5);
        declare_parameter<double>("motor.watchdog_timeout", 1.0);

        get_parameter("motor.gpio_pin", gpio_pin_);
        get_parameter("motor.emergency_pin", emergency_pin_);
        get_parameter("motor.pwm_frequency", pwm_freq_);
        get_parameter("motor.ramp_up_duration", ramp_up_);
        get_parameter("motor.ramp_down_duration", ramp_down_);
        get_parameter("motor.watchdog_timeout", watchdog_timeout_);

        // Publisher du ratio PWM
        pwm_pub_ = create_publisher<std_msgs::msg::Float32>("motor_pwm_ratio", 10);
        last_cmd_time_ = now();
        // Publisher de l'état du moteur
        state_pub_ = create_publisher<std_msgs::msg::String>("coupe_motor_state", 10);

        sub_ = create_subscription<std_msgs::msg::Bool>(
            "/cmd_coupe", 10,
            [this](std_msgs::msg::Bool::SharedPtr msg){
                command_ = msg->data;
                last_cmd_time_ = now();
            });

        chip_ = gpiod_chip_open_by_name("gpiochip0");
        line_ = gpiod_chip_get_line(chip_, gpio_pin_);
        gpiod_line_request_output(line_, "coupe_motor", 0);
        emergency_line_ = gpiod_chip_get_line(chip_, emergency_pin_);
        gpiod_line_request_input(emergency_line_, "coupe_motor_emergency");

        motor_thread_ = std::thread([this](){ this->motorLoop(); });
    }

    ~CoupeMotorNode() {
        stop_ = true;
        if(motor_thread_.joinable()) motor_thread_.join();
        gpiod_line_release(line_);
        gpiod_line_release(emergency_line_);
        gpiod_chip_close(chip_);
    }

private:
    void motorLoop() {
        rclcpp::Rate rate(100);
        while(rclcpp::ok() && !stop_) {
                     
            int emergency_val = gpiod_line_get_value(emergency_line_);
            if(emergency_val == 1) { // pin activée -> arrêt immédiat
               gpiod_line_set_value(line_, 0);
               pwm_ratio_ = 0.0f;
               motor_state_ = 4;

               auto state_msg = std_msgs::msg::String();
               state_msg.data = "EMERGENCY_STOP";
               state_pub_->publish(state_msg);

               rate.sleep();
               continue;  // passe à l’itération suivante
            }
            
            double dt = 0.01;
            auto now_time = now();
            if ((now_time - last_cmd_time_).seconds() > watchdog_timeout_) {
                command_ = false;
            }

            if(command_ && pwm_ratio_ < 1.0f) {
                pwm_ratio_ += dt / ramp_up_;
                if(pwm_ratio_ > 1.0f) pwm_ratio_ = 1.0f;
                motor_state_ = 2;
            }
            else if(!command_ && pwm_ratio_ > 0.0f) {
                pwm_ratio_ -= dt / ramp_down_;
                if(pwm_ratio_ < 0.0f) pwm_ratio_ = 0.0f;
                motor_state_ = 3;
            }
            else {
                motor_state_ = command_ ? 1 : 0;
            }

            int val = pwm_ratio_ > 0.5 ? 1 : 0;
            gpiod_line_set_value(line_, val);

            // Publication du ratio PWM
            auto pwm_msg = std_msgs::msg::Float32();
            pwm_msg.data = pwm_ratio_;
            pwm_pub_->publish(pwm_msg);

            // Publication de l'état du moteur
            auto state_msg = std_msgs::msg::String();
            switch(motor_state_) {
              case 0: state_msg.data = "OFF"; break;
              case 1: state_msg.data = "RUN"; break;
              case 2: state_msg.data = "RAMPING"; break;
              case 3: state_msg.data = "UNRAMPING"; break;
              case 4: state_msg.data = "EMERGENCY_STOP"; break;
              default: state_msg.data = "UNKNOWN"; break;
            }
            state_pub_->publish(state_msg);

            rate.sleep();
        }
    }

    int gpio_pin_;
    int emergency_pin_;
    int pwm_freq_;
    int motor_state_;
        
    double ramp_up_;
    double ramp_down_;
    double watchdog_timeout_;

    struct gpiod_chip *chip_;
    struct gpiod_line *line_;
    struct gpiod_line *emergency_line_;

    std::thread motor_thread_;
    std::atomic<bool> stop_{false};
    std::atomic<bool> command_{false};
    
    rclcpp::Time last_cmd_time_;
    float pwm_ratio_;

    rclcpp::Publisher<std_msgs::msg::Float32>::SharedPtr pwm_pub_;
    rclcpp::Publisher<std_msgs::msg::String>::SharedPtr state_pub_;
    rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr sub_;
};

int main(int argc, char **argv) {
    rclcpp::init(argc, argv);
    auto node = std::make_shared<CoupeMotorNode>();
    rclcpp::spin(node);
    rclcpp::shutdown();
    return 0;
}

