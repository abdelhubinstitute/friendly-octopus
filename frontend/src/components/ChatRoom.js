import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const socket = io('http://localhost:5000');

const ChatRoom = () => {
  const { room } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', room);
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Fetch conversation history from backend
    axios.get(`http://localhost:5000/api/chat/${room}`)
      .then((res) => {
        if (res.data && res.data.messages) {
          const loaded = res.data.messages.map(msg => `${msg.sender}: ${msg.text}`);
          setMessages(loaded);
        }
      })
      .catch((err) => console.error(err));

    return () => {
      socket.off('chatMessage');
    };
  }, [room]);

  const sendMessage = () => {
    const msgData = { sender: 'User', text: message };
    // Emit message via WebSocket
    socket.emit('chatMessage', { room, message: `${msgData.sender}: ${msgData.text}` });
    // Save message to backend
    axios.post(`http://localhost:5000/api/chat/${room}`, msgData)
      .catch(err => console.error(err));
    setMessage('');
  };

  const handleReport = () => {
    navigate(`/report/${room}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Chat Room: {room}</h2>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Enter message" 
      />
      <button onClick={sendMessage}>Send</button>
      <br /><br />
      <button onClick={handleReport}>Get Friend Report</button>
    </div>
  );
};

export default ChatRoom;
