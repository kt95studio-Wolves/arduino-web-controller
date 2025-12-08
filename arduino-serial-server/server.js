const { SerialPort } = require('serialport');
const WebSocket = require('ws');
const http = require('http');
const express = require('express');

// 💡 CONFIGURATION: **CHANGE THIS**
// Find your port: e.g., 'COM3' on Windows, or '/dev/ttyACM0' / '/dev/ttyUSB0' on Linux/Mac
const ARDUINO_PORT = 'COM5';
const BAUD_RATE = 9600;
const WEB_SERVER_PORT = 3001; // Port for the React app to connect to

// --- Setup Server and WebSockets ---
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// --- Setup Serial Port ---
let port;
try {
  port = new SerialPort({ path: ARDUINO_PORT, baudRate: BAUD_RATE }, (err) => {
    if (err) {
      console.error(`Error opening serial port ${ARDUINO_PORT}:`, err.message);
    } else {
      console.log(`Successfully connected to Arduino on ${ARDUINO_PORT}`);
    }
  });
} catch (e) {
  console.error(`Failed to instantiate SerialPort: ${e.message}`);
}

const { ReadlineParser } = require('@serialport/parser-readline');

if (port) {
  // Pipe the raw port data through a parser that looks for newlines
  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  parser.on('data', (line) => {
    // 'line' is already a full string, no buffer logic needed
    console.log('Received:', line);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'status', message: line }));
      }
    });
  });
}

// WebSocket Server Handling
wss.on('connection', (ws) => {
  console.log('React Client Connected');

  // Handle incoming commands from the React application
  ws.on('message', (message) => {
    const command = message.toString();
    console.log(`Received command from React: ${command}`);

    // Write the command ('r', 'y', or 'g') to the Arduino
    if (port && port.isOpen) {
      port.write(command, (err) => {
        if (err) {
          console.error('Error writing to serial port:', err.message);
        }
      });
    } else {
      // Send an error back to the client if the port isn't open
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Server not connected to Arduino.',
        })
      );
    }
  });

  ws.on('close', () => {
    console.log('React Client Disconnected');
  });
});

// Start the HTTP/WebSocket server
server.listen(WEB_SERVER_PORT, () => {
  console.log(`Server listening on port ${WEB_SERVER_PORT}`);
  if (port) {
    console.log(`Attempting connection to Arduino on ${ARDUINO_PORT}...`);
  } else {
    console.log(
      'SerialPort initialization failed. Check your port configuration.'
    );
  }
});
