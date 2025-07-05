import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';
import { 
  FiPlus, 
  FiFolder, 
  FiClock, 
  FiSettings, 
  FiTrendingUp, 
  FiCheckCircle, 
  FiXCircle,
  FiActivity,
  FiBarChart2,
  FiRefreshCw,
  FiExternalLink,
  FiChevronRight,
  FiZap,
  FiAlertCircle,
  FiPieChart,
  FiUsers,
  FiGlobe,
  FiLogOut
} from 'react-icons/fi';

const ApiTestForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    url: '',
    method: 'GET',
    headers: {},
    params: {},
    body: ''
  });

  const [newHeader, setNewHeader] = useState({ key: '', value: '' });
  const [newParam, setNewParam] = useState({ key: '', value: '' });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleMethodChange = (e) => {
    setFormData({ ...formData, method: e.target.value });
  };

  const handleUrlChange = (e) => {
    setFormData({ ...formData, url: e.target.value });
  };

  const addHeader = () => {
    if (newHeader.key && newHeader.value) {
      setFormData({
        ...formData,
        headers: {
          ...formData.headers,
          [newHeader.key]: newHeader.value
        }
      });
      setNewHeader({ key: '', value: '' });
    }
  };

  const addParam = () => {
    if (newParam.key && newParam.value) {
      setFormData({
        ...formData,
        params: {
          ...formData.params,
          [newParam.key]: newParam.value
        }
      });
      setNewParam({ key: '', value: '' });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Build URL with parameters
      const url = new URL(formData.url);
      Object.entries(formData.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      // Prepare request options
      const options = {
        method: formData.method,
        headers: {
          ...formData.headers,
          'Content-Type': 'application/json'
        }
      };

      // Add body for POST, PUT, PATCH methods
      if (['POST', 'PUT', 'PATCH'].includes(formData.method) && formData.body) {
        options.body = formData.body;
      }

      // Make the API call
      const response = await fetch(url.toString(), options);
      const data = await response.json();

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-test-form-container">
      <div className="api-test-form-content">
        <div className="form-group">
          <label>Method</label>
          <select value={formData.method} onChange={handleMethodChange}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        <div className="form-group">
          <label>URL</label>
          <input 
            type="text" 
            value={formData.url} 
            onChange={handleUrlChange}
            placeholder="Enter API endpoint URL"
          />
        </div>

        <div className="form-section">
          <h4>Headers</h4>
          <div className="key-value-inputs">
            <input
              type="text"
              placeholder="Header name"
              value={newHeader.key}
              onChange={(e) => setNewHeader({ ...newHeader, key: e.target.value })}
            />
            <input
              type="text"
              placeholder="Header value"
              value={newHeader.value}
              onChange={(e) => setNewHeader({ ...newHeader, value: e.target.value })}
            />
            <button onClick={addHeader} className="add-button">Add</button>
          </div>
          <div className="key-value-list">
            {Object.entries(formData.headers).map(([key, value]) => (
              <div key={key} className="key-value-item">
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h4>Parameters</h4>
          <div className="key-value-inputs">
            <input
              type="text"
              placeholder="Parameter name"
              value={newParam.key}
              onChange={(e) => setNewParam({ ...newParam, key: e.target.value })}
            />
            <input
              type="text"
              placeholder="Parameter value"
              value={newParam.value}
              onChange={(e) => setNewParam({ ...newParam, value: e.target.value })}
            />
            <button onClick={addParam} className="add-button">Add</button>
          </div>
          <div className="key-value-list">
            {Object.entries(formData.params).map(([key, value]) => (
              <div key={key} className="key-value-item">
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        </div>

        {(formData.method === 'POST' || formData.method === 'PUT' || formData.method === 'PATCH') && (
          <div className="form-section">
            <h4>Request Body</h4>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Enter request body (JSON)"
              rows={5}
            />
          </div>
        )}

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        {response && (
          <div className="response-section">
            <h4>Response</h4>
            <div className="response-info">
              <div className="response-status">
                Status: {response.status} {response.statusText}
              </div>
              <div className="response-headers">
                <h5>Headers:</h5>
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="header-item">
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
              <div className="response-data">
                <h5>Data:</h5>
                <pre>{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="api-test-form-footer">
        <button 
          className="submit-button" 
          onClick={handleSubmit}
          disabled={!formData.url.trim() || loading}
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();

  // Sample data for demonstration
  const stats = {
    totalTests: 12,
    successRate: 85,
    avgResponseTime: 250,
    totalCollections: 3,
    activeUsers: 24,
    apiCalls: 1560,
    errorRate: 2.5,
    uptime: 99.9
  };

  const recentTests = [
    {
      id: 1,
      name: 'API Health Check',
      status: 'success',
      method: 'GET',
      url: '/api/health',
      timestamp: new Date(),
      responseTime: 150
    },
    {
      id: 2,
      name: 'User Authentication',
      status: 'success',
      method: 'POST',
      url: '/api/auth/login',
      timestamp: new Date(),
      responseTime: 200
    },
    {
      id: 3,
      name: 'Data Processing',
      status: 'error',
      method: 'POST',
      url: '/api/process',
      timestamp: new Date(),
      responseTime: 300
    }
  ];

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="greeting">
            <h1>Welcome back! 👋</h1>
            <div className="time-date">
              <span className="current-time">{currentTime}</span>
              <span className="current-date">{currentDate}</span>
            </div>
          </div>
          <p className="subtitle">Monitor your API performance and tests</p>
        </div>
        <div className="header-actions">
          <button 
            className="action-button primary"
            onClick={() => navigate('/builder')}
          >
            <FiPlus /> Create New Test
          </button>
          <button 
            className="action-button secondary"
            onClick={() => navigate('/collections/new')}
          >
            <FiFolder /> Create Collection
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <div className="dashboard-tabs">
          <button 
            className={`tab-button${location.pathname === '/dashboard' ? ' active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <FiBarChart2 /> Overview
          </button>
          <button 
            className={`tab-button${location.pathname === '/analytics' ? ' active' : ''}`}
            onClick={() => navigate('/analytics')}
          >
            <FiPieChart /> Analytics
          </button>
          <button 
            className={`tab-button${location.pathname === '/monitoring' ? ' active' : ''}`}
            onClick={() => navigate('/monitoring')}
          >
            <FiActivity /> Monitoring
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-tests">
            <FiActivity />
          </div>
          <div className="stat-content">
            <h3>Total Tests</h3>
            <p>{stats.totalTests}</p>
            <div className="stat-trend positive">
              <FiTrendingUp /> +12%
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success-rate">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Success Rate</h3>
            <p>{stats.successRate}%</p>
            <div className="stat-trend positive">
              <FiTrendingUp /> +5%
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon response-time">
            <FiZap />
          </div>
          <div className="stat-content">
            <h3>Avg Response Time</h3>
            <p>{stats.avgResponseTime}ms</p>
            <div className="stat-trend negative">
              <FiTrendingUp /> -8%
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon collections">
            <FiFolder />
          </div>
          <div className="stat-content">
            <h3>Collections</h3>
            <p>{stats.totalCollections}</p>
            <div className="stat-trend positive">
              <FiTrendingUp /> +3%
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon users">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <p>{stats.activeUsers}</p>
            <div className="stat-trend positive">
              <FiTrendingUp /> +15%
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon api-calls">
            <FiGlobe />
          </div>
          <div className="stat-content">
            <h3>API Calls</h3>
            <p>{stats.apiCalls}</p>
            <div className="stat-trend positive">
              <FiTrendingUp /> +20%
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <h2>Recent Activity</h2>
            <div className="card-actions">
              <button 
                className="refresh-btn"
                onClick={handleRefresh}
                disabled={loading}
              >
                <FiRefreshCw className={loading ? 'spinning' : ''} />
              </button>
              <button className="view-all-btn">
                View All <FiChevronRight />
              </button>
            </div>
          </div>
          <ul className="recent-tests">
            {recentTests.map((test) => (
              <li key={test.id} className="test-item">
                <div className={`status-indicator ${test.status}`}>
                  {test.status === 'success' ? <FiCheckCircle /> : <FiXCircle />}
                </div>
                <div className="test-info">
                  <div className="test-header">
                    <h3>{test.name}</h3>
                    <button className="view-test-btn">
                      <FiExternalLink />
                    </button>
                  </div>
                  <p className="test-url">{test.method} {test.url}</p>
                  <div className="test-meta">
                    <span className="timestamp">
                      {new Date(test.timestamp).toLocaleString()}
                    </span>
                    <span className="response-time">
                      {test.responseTime}ms
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="dashboard-card quick-access">
          <div className="card-header">
            <h2>Quick Access</h2>
          </div>
          <div className="quick-access-grid">
            <button 
              className="quick-access-btn"
              onClick={() => navigate('/collections/new')}
            >
              <FiFolder />
              <span>Create Collection</span>
              <FiChevronRight className="arrow-icon" />
            </button>
            <button 
              className="quick-access-btn"
              onClick={() => navigate('/history')}
            >
              <FiClock />
              <span>View History</span>
              <FiChevronRight className="arrow-icon" />
            </button>
            <button 
              className="quick-access-btn"
              onClick={() => navigate('/settings')}
            >
              <FiSettings />
              <span>Settings</span>
              <FiChevronRight className="arrow-icon" />
            </button>
          </div>
        </div>

        <div className="dashboard-card system-status">
          <div className="card-header">
            <h2>System Status</h2>
          </div>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-icon uptime">
                <FiCheckCircle />
              </div>
              <div className="status-info">
                <h3>Uptime</h3>
                <p>{stats.uptime}%</p>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon error-rate">
                <FiAlertCircle />
              </div>
              <div className="status-info">
                <h3>Error Rate</h3>
                <p>{stats.errorRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 