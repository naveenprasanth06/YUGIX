import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (err) {
      setError('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory([]);
    } catch (err) {
      setError('Failed to clear history');
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'error';
    if (status >= 500) return 'server-error';
    return 'info';
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'success') return item.status >= 200 && item.status < 300;
    if (filter === 'error') return item.status >= 400;
    return true;
  });

  if (loading) return <div className="loading">Loading history...</div>;

  return (
    <div className="history">
      <div className="history-header">
        <h1>Request History</h1>
        <div className="history-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Requests</option>
            <option value="success">Successful</option>
            <option value="error">Errors</option>
          </select>
          <button 
            onClick={handleClearHistory}
            className="clear-btn"
          >
            Clear History
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="history-list">
        {filteredHistory.map((item) => (
          <div key={item._id} className="history-item">
            <div className="history-item-header">
              <span className={`method ${item.method.toLowerCase()}`}>
                {item.method}
              </span>
              <span className="url">{item.url}</span>
              <span className={`status ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
            <div className="history-item-details">
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span className="detail-value">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">{item.duration}ms</span>
              </div>
              {item.error && (
                <div className="error-details">
                  <span className="detail-label">Error:</span>
                  <span className="detail-value error">{item.error}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredHistory.length === 0 && (
          <div className="empty-state">
            No history items found
          </div>
        )}
      </div>
    </div>
  );
};

export default History; 