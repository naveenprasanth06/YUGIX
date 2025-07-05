import React from 'react';
import { FiPieChart } from 'react-icons/fi';
import '../styles/Dashboard.css';

const Analytics = () => {
  return (
    <div className="analytics-page">
      <div className="page-header">
        <FiPieChart className="page-icon" />
        <h2>Analytics</h2>
      </div>
      <div className="analytics-content">
        <p>Analytics data and charts will be displayed here.</p>
      </div>
    </div>
  );
};

export default Analytics; 