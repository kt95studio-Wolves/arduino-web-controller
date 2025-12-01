#include <Arduino.h>

// Define the digital pins for the three LEDs
const int redLedPin = 7; // Digital pin 7 for red LED
const int yellowLedPin = 4; // Digital pin 4 for yellow LED
const int greenLedPin = 2; // Digital pin 2 for green LED

// Define the character commands that will be sent via serial monitor
const char redCommand = 'r';
const char yellowCommand = 'y';
const char greenCommand = 'g';

// Store the current state of the LEDs (HIGH = ON, LOW = OFF)
int redLedState = LOW;
int yellowLedState = LOW;
int greenLedState = LOW;

void setup() {
  // Initialize the LED pins as outputs
  pinMode(redLedPin, OUTPUT);
  pinMode(yellowLedPin, OUTPUT);
  pinMode(greenLedPin, OUTPUT);

  // Start serial communication at 9600 bits per second
  Serial.begin(9600);
  Serial.println("Serial LED Control Ready.");
  Serial.println("Press 'r' (red), 'y' (yellow), or 'g' (green) to toggle the corresponding LED.");
}

void loop() {
  // Check if data is available to be read from the serial port
  if (Serial.available() > 0) {
    // Read the incoming byte (character)
    char receivedChar = Serial.read();

    // Check which command was received and toggle the corresponding LED state
    if (receivedChar == redCommand) {
      // Toggle the state: If it was LOW, make it HIGH, and vice-versa
      redLedState = !redLedState;
      // Write the new state to the LED pin
      digitalWrite(redLedPin, redLedState);
      Serial.print("Red LED Toggled. State: ");
      Serial.println(redLedState == HIGH ? "ON" : "OFF");

    } else if (receivedChar == yellowCommand) {
      yellowLedState = !yellowLedState;
      digitalWrite(yellowLedPin, yellowLedState);
      Serial.print("Yellow LED Toggled. State: ");
      Serial.println(yellowLedState == HIGH ? "ON" : "OFF");

    } else if (receivedChar == greenCommand) {
      greenLedState = !greenLedState;
      digitalWrite(greenLedPin, greenLedState);
      Serial.print("Green LED Toggled. State: ");
      Serial.println(greenLedState == HIGH ? "ON" : "OFF");

    } else {
      // Optionally handle unexpected input
      Serial.print("Received unknown command: ");
      Serial.println(receivedChar);
    }
  }
}