# 🚦 Arduino LED Web Controller

This project demonstrates how to control an Arduino Uno's digital pins (LEDs) from a simple **React** web interface using a **Node.js** server as a serial communication bridge.

The setup involves three distinct components communicating over two separate channels:

1.  **React GUI** ↔️ (WebSockets) ↔️ **Node.js Server**
2.  **Node.js Server** ↔️ (Serial Port) ↔️ **Arduino Uno**

## 📂 Project Structure

The repository is organized into three main sub-directories:

```

arduino-web-controller/
├── arduino-gui/              \# React Frontend (Web Controller)
├── arduino-serial-server/    \# Node.js Serial Bridge (Middleware)
└── arduino-code/             \# Arduino C++ Sketch (PlatformIO)

````

## 🛠️ Prerequisites

To run this project, you need the following installed:

* **Arduino IDE or PlatformIO (recommended):** For uploading the sketch.
* **Node.js (LTS version):** For running the server and the React application.
* **USB Cable:** To connect the Arduino Uno to your computer.

## 🚀 Getting Started

Follow these three steps to get the controller running:

### Step 1: Arduino Code Setup

1.  Open the `arduino-code/` folder in VS Code with the PlatformIO extension installed.
2.  Review the file `arduino-code/src/main.cpp`. It defines the LED pins (10, 9, 8) and listens for single characters: `'r'`, `'y'`, or `'g'` to toggle the corresponding LED.
3.  Upload the sketch to your Arduino Uno board.

### Step 2: Node.js Server Setup (The Serial Bridge)

The server acts as the middleman, linking the web (WebSockets) to the hardware (Serial Port).

1.  Navigate to the `arduino-serial-server/` directory:
    ```bash
    cd arduino-serial-server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Crucially**, open `server.js` and **change the `ARDUINO_PORT` variable** to match the port your Arduino is currently using (e.g., `'COM3'` on Windows, or `'/dev/ttyACM0'` on Linux/Mac).
4.  Start the server. Keep this terminal window open.
    ```bash
    node server.js
    ```
    The server will start on port `3001`.

### Step 3: React GUI Setup (The Web Controller)

The frontend provides the buttons and the serial output monitor.

1.  Navigate to the `arduino-gui/` directory:
    ```bash
    cd ../arduino-gui
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React development server:
    ```bash
    npm start
    ```
    This will open the web controller in your browser (usually at `http://localhost:3000`).

## ✨ Usage

1.  With all three components running (Arduino, Node.js Server, and React App), click the **Toggle Red (R)**, **Toggle Yellow (Y)**, or **Toggle Green (G)** buttons.
2.  The React app sends the corresponding character (`'r'`, `'y'`, or `'g'`) to the Node.js server via WebSocket.
3.  The Node.js server writes the character to the Arduino's USB Serial Port.
4.  The Arduino toggles the LED and sends a status message back via the Serial Port (e.g., "Red LED Toggled. State: ON").
5.  The Node.js server receives this status and broadcasts it back to the React app via WebSocket.
6.  The React app displays the message in the **Serial Output** box.

## 🛑 Troubleshooting

| Issue | Potential Solution |
| :--- | :--- |
| **"Error opening serial port"** | **Check `server.js`:** Ensure the `ARDUINO_PORT` matches the port listed in the Arduino IDE/PlatformIO. |
| **"Server Status: Disconnected"** | Make sure the `node server.js` terminal is running and did not crash. Check console errors for port conflicts (the server runs on `3001`). |
| **Arduino not receiving command** | Ensure the **Baud Rate** (`9600`) is consistent in both the Arduino code (`Serial.begin(9600);`) and the Node.js `server.js` file. |
| **`node-serialport` installation error** | On some systems (especially Linux/Mac), you may need to install necessary build tools. Try `npm install --build-from-source`. |