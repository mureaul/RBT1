// Simple test pour toggler STEP/DIR via libgpiod (sans ROS)
#include <gpiod.h>
#include <iostream>
#include <thread>
#include <chrono>


int main(int argc, char ** argv)
{
const char *chipname = "gpiochip0";
int step = 18;
int dir = 23;


gpiod_chip *chip = gpiod_chip_open_by_name(chipname);
if (!chip) { std::cerr << "Impossible d'ouvrir " << chipname << std::endl; return 1; }


gpiod_line *step_line = gpiod_chip_get_line(chip, step);
gpiod_line *dir_line = gpiod_chip_get_line(chip, dir);
if (!step_line || !dir_line) { std::cerr << "Impossible d'obtenir les lignes" << std::endl; return 1; }


if (gpiod_line_request_output(step_line, "gpio_test", 0) < 0) { std::cerr << "request step fail" << std::endl; return 1; }
if (gpiod_line_request_output(dir_line, "gpio_test", 0) < 0) { std::cerr << "request dir fail" << std::endl; return 1; }


// set direction
gpiod_line_set_value(dir_line, 1);


for (int i=0;i<1000;i++) {
gpiod_line_set_value(step_line, 1);
std::this_thread::sleep_for(std::chrono::microseconds(500));
gpiod_line_set_value(step_line, 0);
std::this_thread::sleep_for(std::chrono::microseconds(500));
}


gpiod_line_release(step_line);
gpiod_line_release(dir_line);
gpiod_chip_close(chip);
return 0;
}
