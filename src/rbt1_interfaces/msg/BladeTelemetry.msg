# rbt1_interfaces/msg/BladeTelemetry.msg

# État de la FSM de la lame (STOPPED, ACCEL, RUNNING, DECEL, ERROR)
string state

# Consigne et vitesse réelle de rotation (RPM)
float32 target_speed
float32 current_speed

# Mesures physiques issues du VESC via VescUart
float32 motor_current      # Courant moteur (A)
float32 input_voltage      # Tension d'entrée batterie (V)
float32 esc_temp           # Température de l'ESC (°C)
float32 motor_temp         # Température du moteur (°C)
float32 consumed_ah        # Capacité consommée (Ah)