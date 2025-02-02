import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import Report from './components/Report';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat/:room" element={<ChatRoom />} />
        <Route path="/report/:room" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
