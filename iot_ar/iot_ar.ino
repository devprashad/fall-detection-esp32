#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <HardwareSerial.h>

#define SIM808_TX_PIN 1 // Connect SIM808 RX to ESP32 TXD
#define SIM808_RX_PIN 3 // Connect SIM808 TX to ESP32 RXD

Adafruit_MPU6050 mpu;
HardwareSerial sim808Serial(0); // Use UART 0

// Wi-Fi credentials
const char *ssid = "Geon!";
const char *password = "12345678";

// FastAPI endpoint
const char *serverName = "https://render-56ig.onrender.com/sensor";  // Your server endpoint

// Define threshold values
const float ACCELERATION_THRESHOLD = 20.0;  // Example threshold value for acceleration
const float GYROSCOPE_THRESHOLD = 2.0;  // Example threshold value for gyroscope

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Wi-Fi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Initializing MPU6050...");
  if (!mpu.begin()) {
    Serial.println("Could not find a valid MPU6050 sensor, check wiring!");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 initialized successfully");

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);

  // Initialize SIM808 serial port
  sim808Serial.begin(115200, SERIAL_8N1, SIM808_RX_PIN, SIM808_TX_PIN);
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Calculate magnitude of acceleration
  float magnitudeAccel = sqrt(a.acceleration.x * a.acceleration.x + a.acceleration.y * a.acceleration.y + a.acceleration.z * a.acceleration.z);

  // Calculate magnitude of gyroscope readings
  float magnitudeGyro = sqrt(g.gyro.x * g.gyro.x + g.gyro.y * g.gyro.y + g.gyro.z * g.gyro.z);

  // Check if the sensor data exceeds the threshold values
  if (magnitudeAccel > ACCELERATION_THRESHOLD && magnitudeGyro > GYROSCOPE_THRESHOLD) {
    // Try to send data via Wi-Fi
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverName);
      http.addHeader("Content-Type", "application/json");

      String postData = "{\"acceleration\":" + String(magnitudeAccel, 2) + ",\"gyroscope\":" + String(magnitudeGyro, 2) + "}";

      Serial.print("Sending POST data: ");
      Serial.println(postData);

      int httpResponseCode = http.POST(postData);
      
      if (checkSIMStatus()) {
        sendSMS("+919566320016", "Fall detected with acceleration: " + String(magnitudeAccel, 2) + " and gyroscope: " + String(magnitudeGyro, 2));
      } else {
        Serial.println("SIM not initialized properly.");
      }

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
      } else {
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    } else {
      Serial.println("WiFi Disconnected. Trying to send SMS...");

      // Send SMS via SIM808
      if (checkSIMStatus()) {
        sendSMS("+918438462058", "Fall detected with acceleration: " + String(magnitudeAccel, 2) + " and gyroscope: " + String(magnitudeGyro, 2));
      } else {
        Serial.println("SIM not initialized properly.");
      }
    }
  }

  delay(1000); // Adjust this delay as needed
}

bool checkSIMStatus() {
  sim808Serial.println("AT");
  delay(500);
  while (sim808Serial.available()) {
    if (sim808Serial.find("OK")) {
      Serial.println("SIM module ready");
      return true; // SIM module responded with OK
    }
  }
  return false; // No response from SIM module
}

void sendSMS(const char *phoneNumber, const String &message) {
  sim808Serial.println("AT+CMGF=1"); // Set SMS mode to text mode
  delay(1000);

  sim808Serial.print("AT+CMGS=\"");
  sim808Serial.print(phoneNumber);
  sim808Serial.println("\"");

  delay(1000);
  sim808Serial.print(message);
  delay(100);
  sim808Serial.println((char)26); // End AT command with Ctrl+Z

  delay(1000);
  Serial.println("SMS sent!");
}