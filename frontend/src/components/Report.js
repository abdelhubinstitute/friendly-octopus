import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Report = () => {
  const { room } = useParams();
  const [role, setRole] = useState('friendship report');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReport = () => {
    setLoading(true);
    axios.post(`http://localhost:5000/api/analysis/${room}`, { role })
      .then((res) => {
        setReport(res.data.report);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReport();
  }, [room, role]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Friend Report for Room: {room}</h2>
      <div>
        <label>Select Role: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="friendship report">Friendship Report</option>
          <option value="couple consulting">Couple Consulting</option>
          <option value="professional mediator">Professional Mediator</option>
        </select>
        <button onClick={fetchReport}>Refresh Report</button>
      </div>
      {loading ? <p>Loading...</p> : <pre>{report}</pre>}
    </div>
  );
};

export default Report;
