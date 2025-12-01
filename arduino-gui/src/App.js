import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './App.css'; 

const WS_SERVER_URL = 'ws://localhost:3001'; 

function App() {
  const wsRef = useRef(null);
  const scrollRef = useRef(null); // Ref to auto-scroll the terminal
  const [statusMessages, setStatusMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    const socket = new WebSocket(WS_SERVER_URL);
    wsRef.current = socket;

    socket.onopen = () => setConnectionStatus('Connected');

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const messageToDisplay = data.type === 'error' ? `[ERR] ${data.message}` : `> ${data.message}`;
        setStatusMessages(prev => [...prev, messageToDisplay]);
      } catch (e) {
        setStatusMessages(prev => [...prev, `> ${event.data}`]);
      }
    };

    socket.onclose = () => setConnectionStatus('Disconnected');
    socket.onerror = () => setConnectionStatus('Connection Error');
    
    return () => socket.close();
  }, []);

  // Auto-scroll to bottom of terminal
  useLayoutEffect(() => {
    if(scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [statusMessages]);

  const sendCommand = (command) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(command);
    } else {
      alert(`SYSTEM OFFLINE: ${connectionStatus}`);
    }
  };

  return (
    <div className="cyber-wrapper">
      <div className="scanlines"></div>
      <div className="App-container">
        
        {/* Header Section */}
        <header className="cyber-header">
          <h1 className="glitch-text" data-text="ARDUINO_NET_LINK">ARDUINO_NET_LINK</h1>
          <div className="status-panel">
            <span className="status-label">SYS.STATUS:</span>
            <strong className={`status-indicator status-${connectionStatus.toLowerCase().replace(' ', '-')}`}>
              {connectionStatus.toUpperCase()}
            </strong>
          </div>
        </header>

        {/* Control Deck */}
        <div className="control-deck">
            <div className="cyber-frame">
                <h3>// MANUAL_OVERRIDE</h3>
                <div className="button-group">
                    <button className="cyber-btn red-btn" onClick={() => sendCommand('r')}>
                    <span className="btn-content">RELAY_RED</span>
                    </button>
                    <button className="cyber-btn yellow-btn" onClick={() => sendCommand('y')}>
                    <span className="btn-content">RELAY_YEL</span>
                    </button>
                    <button className="cyber-btn green-btn" onClick={() => sendCommand('g')}>
                    <span className="btn-content">RELAY_GRN</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Terminal Output */}
        <div className="terminal-section">
            <h3>// SERIAL_DATA_STREAM</h3>
            <div className="serial-monitor" ref={scrollRef}>
                {statusMessages.length === 0 && <p className="placeholder-text">Waiting for data stream...</p>}
                {statusMessages.map((msg, index) => (
                    <p key={index} className="terminal-line">{msg}</p>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}

export default App;