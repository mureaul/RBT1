#include "pacecat_e120/e120_driver.hpp"

#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>
#include <sensor_msgs/msg/point_cloud2.hpp>
#include <sensor_msgs/msg/point_field.hpp>

#include <fcntl.h>
#include <termios.h>
#include <unistd.h>
#include <errno.h>

#include <vector>
#include <algorithm>
#include <cmath>
#include <cstring>

// ==================== CONSTANTES PROTOCOLE ====================
static constexpr uint8_t HEADER_MASTER[] = {0xCF,0xFA,0x1E,0x00,0x00,0x00,0xB4,0x00};
static constexpr uint8_t HEADER_PACKET[] = {0xCF,0xFA,0x1E,0x00};

static constexpr size_t MASTER_PACKET_SIZE = 2016;
static constexpr size_t BUFFER_READ_SIZE   = 4096;

static constexpr float ANGLE_RES_DEG = 2.25f;
static constexpr int   DATA_STRIDE   = 12;

// =============================================================

PacecatE120::PacecatE120()
: Node("pacecat_e120"),
  serial_fd_(-1)
{
    port_     = declare_parameter("port", "/dev/ttyUSB1");
    baudrate_ = declare_parameter("baudrate", 230400);

    scan_pub_ = create_publisher<sensor_msgs::msg::LaserScan>(
        "scan", rclcpp::SensorDataQoS());

    pc_pub_ = create_publisher<sensor_msgs::msg::PointCloud2>(
        "points", rclcpp::SensorDataQoS());

    openSerial();

    timer_ = create_wall_timer(
        std::chrono::milliseconds(50),
        std::bind(&PacecatE120::spinOnce, this));
}

PacecatE120::~PacecatE120()
{
    closeSerial();
}

// ==================== SERIAL ====================
bool PacecatE120::openSerial()
{
    serial_fd_ = open(port_.c_str(), O_RDWR | O_NOCTTY | O_NONBLOCK);
    if (serial_fd_ < 0) {
        RCLCPP_ERROR(get_logger(), "Impossible d'ouvrir %s", port_.c_str());
        return false;
    }

    termios tty{};
    tcgetattr(serial_fd_, &tty);
    cfmakeraw(&tty);

    cfsetispeed(&tty, B230400);
    cfsetospeed(&tty, B230400);

    tty.c_cflag |= (CLOCAL | CREAD);
    tty.c_cflag &= ~CRTSCTS;

    tty.c_cc[VMIN]  = 0;
    tty.c_cc[VTIME] = 1;

    tcsetattr(serial_fd_, TCSANOW, &tty);

    RCLCPP_INFO(get_logger(), "Port série %s ouvert", port_.c_str());
    return true;
}

void PacecatE120::closeSerial()
{
    if (serial_fd_ >= 0)
        close(serial_fd_);
    serial_fd_ = -1;
}

// ==================== BOUCLE ====================
void PacecatE120::spinOnce()
{
    uint8_t buf[BUFFER_READ_SIZE];
    int n = read(serial_fd_, buf, sizeof(buf));

    if (n <= 0)
        return;

    rx_buffer_.insert(rx_buffer_.end(), buf, buf + n);
    parseBuffer();
}

// ==================== PARSING ====================
void PacecatE120::parseBuffer()
{
    while (rx_buffer_.size() >= MASTER_PACKET_SIZE)
    {
        auto it = std::search(
            rx_buffer_.begin(), rx_buffer_.end(),
            std::begin(HEADER_MASTER), std::end(HEADER_MASTER));

        if (it == rx_buffer_.end()) {
            rx_buffer_.clear();
            return;
        }

        if (std::distance(it, rx_buffer_.end()) < (int)MASTER_PACKET_SIZE)
            return;

        std::vector<uint8_t> master(it, it + MASTER_PACKET_SIZE);
        rx_buffer_.erase(rx_buffer_.begin(), it + MASTER_PACKET_SIZE);

        parseMasterPacket(master);
    }
}

void PacecatE120::parseMasterPacket(const std::vector<uint8_t>& master)
{
    std::vector<float> ranges(360, std::numeric_limits<float>::infinity());
    std::vector<float> angles(360, 0.0f);

    size_t idx = 0;
    while (true)
    {
        auto it = std::search(master.begin() + idx, master.end(),
                              std::begin(HEADER_PACKET), std::end(HEADER_PACKET));
        if (it == master.end()) break;

        auto it_next = std::search(it + 1, master.end(),
                                   std::begin(HEADER_PACKET), std::end(HEADER_PACKET));
        if (it_next == master.end()) break;

        parsePacket(it, it_next, ranges, angles);
        idx = std::distance(master.begin(), it_next);
    }

    // Convert angles to radians for PointCloud2
    for (size_t i = 0; i < angles.size(); ++i)
        angles[i] = angles[i] * M_PI / 180.0f;

    publishScan(ranges);
    publishPointCloud(ranges, angles);
}

void PacecatE120::parsePacket(
    std::vector<uint8_t>::const_iterator begin,
    std::vector<uint8_t>::const_iterator end,
    std::vector<float>& ranges,
    std::vector<float>& angles)
{
    if (std::distance(begin, end) < 100)
        return;

    const uint8_t* pkt = &(*begin);
    uint16_t counter = pkt[4] | (pkt[5] << 8);
    float base_angle = ((counter / 180.0f) * 18.0f);

    const uint8_t* data = pkt + 8;
    size_t len = end - begin;

    for (size_t i = 0; i + DATA_STRIDE <= len - 8; i += DATA_STRIDE)
    {
        uint16_t dist = data[i + 4] | (data[i + 5] << 8);
        if (dist == 0) continue;

        float angle = base_angle + (i / DATA_STRIDE) * ANGLE_RES_DEG;
        angle = fmod(angle, 360.0f);
        int idx_angle = static_cast<int>(angle);

        if (idx_angle < 0 || idx_angle >= 360) continue;

        ranges[idx_angle] = dist / 1000.0f; // meters
        angles[idx_angle] = angle;          // degrees
    }
}

// ==================== PUBLISH ====================
void PacecatE120::publishScan(const std::vector<float>& ranges)
{
    sensor_msgs::msg::LaserScan scan;
    scan.header.stamp = now();
    scan.header.frame_id = "base_link";

    scan.angle_min = 0.0f;
    scan.angle_max = 2.0f * M_PI;
    scan.angle_increment = M_PI / 180.0f;

    scan.range_min = 0.05f;
    scan.range_max = 12.0f;

    scan.ranges = ranges;
    scan_pub_->publish(scan);
}

void PacecatE120::publishPointCloud(const std::vector<float>& ranges, const std::vector<float>& angles)
{
    if (ranges.size() != angles.size()) return;

    sensor_msgs::msg::PointCloud2 pc;
    pc.header.stamp = now();
    pc.header.frame_id = "base_link";

    pc.height = 1;
    pc.width = ranges.size();
    pc.is_dense = false;

    sensor_msgs::msg::PointField field_x, field_y, field_z;
    field_x.name = "x"; field_x.offset = 0; field_x.datatype = sensor_msgs::msg::PointField::FLOAT32; field_x.count = 1;
    field_y.name = "y"; field_y.offset = 4; field_y.datatype = sensor_msgs::msg::PointField::FLOAT32; field_y.count = 1;
    field_z.name = "z"; field_z.offset = 8; field_z.datatype = sensor_msgs::msg::PointField::FLOAT32; field_z.count = 1;
    pc.fields = {field_x, field_y, field_z};
    pc.point_step = 12;
    pc.row_step = pc.point_step * pc.width;
    pc.data.resize(pc.row_step * pc.height);

    for (size_t i = 0; i < ranges.size(); ++i) {
        float x = ranges[i] * std::cos(angles[i]);
        float y = ranges[i] * std::sin(angles[i]);
        float z = 0.0f;

        std::memcpy(&pc.data[i*pc.point_step + 0], &x, sizeof(float));
        std::memcpy(&pc.data[i*pc.point_step + 4], &y, sizeof(float));
        std::memcpy(&pc.data[i*pc.point_step + 8], &z, sizeof(float));
    }

    pc_pub_->publish(pc);
}

// ==================== MAIN ====================
int main(int argc, char** argv)
{
    rclcpp::init(argc, argv);
    rclcpp::spin(std::make_shared<PacecatE120>());
    rclcpp::shutdown();
    return 0;
}

