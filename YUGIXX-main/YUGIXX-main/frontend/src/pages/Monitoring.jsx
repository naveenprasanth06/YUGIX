import React from 'react';
import { FiActivity } from 'react-icons/fi';
import '../styles/Dashboard.css';

const Monitoring = () => {
  return (
    <div className="monitoring-page">
      <div className="page-header">
        <FiActivity className="page-icon" />
        <h2>Monitoring</h2>
      </div>
      <div className="monitoring-content">
        <p>Monitoring metrics and live data will be displayed here.</p>
      </div>
    </div>
  );
};

export default Monitoring; 