#pragma once

#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>
#include <sensor_msgs/msg/point_cloud2.hpp>
#include <sensor_msgs/msg/point_field.hpp>
#include <diagnostic_msgs/msg/diagnostic_array.hpp>
#include <diagnostic_msgs/msg/diagnostic_status.hpp>
#include <diagnostic_msgs/msg/key_value.hpp>

#include <vector>
#include <string>
#include <cstdint>
#include <limits>

class PacecatE120 : public rclcpp::Node
{
public:
    PacecatE120();
    ~PacecatE120();

private:
    // ==== SERIAL ====
    std::string port_;
    int baudrate_;
    int serial_fd_;

    bool openSerial();
    void closeSerial();

    // ==== ROS ====
    rclcpp::Publisher<sensor_msgs::msg::LaserScan>::SharedPtr scan_pub_;
    rclcpp::Publisher<sensor_msgs::msg::PointCloud2>::SharedPtr pc_pub_;
    rclcpp::Publisher<diagnostic_msgs::msg::DiagnosticArray>::SharedPtr diag_pub_;

    rclcpp::TimerBase::SharedPtr timer_;

    // ==== BUFFER ====
    std::vector<uint8_t> rx_buffer_;

    // ==== PARSING ====
    static constexpr uint8_t HEADER_MASTER[8] = {0xCF,0xFA,0x1E,0x00,0x00,0x00,0xB4,0x00};
    static constexpr uint8_t HEADER_SUB[4]    = {0xCF,0xFA,0x1E,0x00};
    static constexpr size_t PACKET_MASTER_SIZE = 2016;
    static constexpr size_t SUB_PACKET_SIZE    = 100;
    static constexpr size_t POINTS_PER_SUBPACKET = 8;
    static constexpr float RESOLUTION_DEG = 2.25f;

    void spinOnce();
    void parseBuffer();
    void parseMasterPacket(const std::vector<uint8_t>& master);
    void parsePacket(
       std::vector<uint8_t>::const_iterator begin,
       std::vector<uint8_t>::const_iterator end,
       std::vector<float>& ranges,
       std::vector<float>& angles);

    // ==== PUBLISH ====
    void publishScan(const std::vector<float>& ranges);
    void publishPointCloud(const std::vector<float>& ranges, const std::vector<float>& angles);
};

