import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Assuming you have some basic CSS

// **CHANGE THIS** if your server is on a different IP/Port
const WS_SERVER_URL = 'ws://localhost:3001'; 

function App() {
  const wsRef = useRef(null);
  const [statusMessages, setStatusMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  // Effect to manage WebSocket connection
  useEffect(() => {
    // We use a constant to avoid issues with cleanup
    const socket = new WebSocket(WS_SERVER_URL);
    wsRef.current = socket;

    socket.onopen = () => {
      setConnectionStatus('Connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Display both status messages from Arduino and server errors
        const messageToDisplay = data.type === 'error' ? `ERROR: ${data.message}` : data.message;
        
        setStatusMessages(prev => [...prev, messageToDisplay]);
      } catch (e) {
        // Fallback for non-JSON messages (though Arduino output should be clean text)
        setStatusMessages(prev => [...prev, event.data]);
      }
    };

    socket.onclose = () => {
      setConnectionStatus('Disconnected');
    };

    socket.onerror = (error) => {
      setConnectionStatus('Connection Error');
    };
    
    // Cleanup function to close the connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  // Function to send the command ('r', 'y', or 'g') to the server
  const sendCommand = (command) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      // The server expects a raw command character
      ws.send(command);
    } else {
      alert(`Cannot send command. Status: ${connectionStatus}`);
    }
  };

  return (
    <div className="App-container">
      <h1>🚦 Arduino LED Web Controller</h1>
      <p>Server Status: <strong className={`status-${connectionStatus.toLowerCase().replace(' ', '-')}`}>{connectionStatus}</strong></p>
      
      <div className="button-group">
        <button className="red-btn" onClick={() => sendCommand('r')}>
          Toggle Red (R)
        </button>
        <button className="yellow-btn" onClick={() => sendCommand('y')}>
          Toggle Yellow (Y)
        </button>
        <button className="green-btn" onClick={() => sendCommand('g')}>
          Toggle Green (G)
        </button>
      </div>

      <h2>Serial Output</h2>
      <div className="serial-monitor">
        {statusMessages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default App;