import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (room) {
      navigate(`/chat/${room}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Enter Room Name</h2>
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Room name"
      />
      <button onClick={handleJoin}>Join Chat</button>
    </div>
  );
};

export default Login;
