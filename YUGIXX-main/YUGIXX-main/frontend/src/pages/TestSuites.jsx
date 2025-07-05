import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TestSuites.css';

const TestSuites = () => {
  const [testSuites, setTestSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSuiteName, setNewSuiteName] = useState('');

  useEffect(() => {
    fetchTestSuites();
  }, []);

  const fetchTestSuites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/test-suites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestSuites(response.data);
    } catch (err) {
      setError('Failed to fetch test suites');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuite = async (e) => {
    e.preventDefault();
    if (!newSuiteName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/test-suites',
        { name: newSuiteName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTestSuites([...testSuites, response.data]);
      setNewSuiteName('');
    } catch (err) {
      setError('Failed to create test suite');
    }
  };

  const handleDeleteSuite = async (suiteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/test-suites/${suiteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestSuites(testSuites.filter(s => s._id !== suiteId));
    } catch (err) {
      setError('Failed to delete test suite');
    }
  };

  const handleRunSuite = async (suiteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/test-suites/${suiteId}/run`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh the test suites to get updated results
      fetchTestSuites();
    } catch (err) {
      setError('Failed to run test suite');
    }
  };

  if (loading) return <div className="loading">Loading test suites...</div>;

  return (
    <div className="test-suites">
      <div className="test-suites-header">
        <h1>Test Suites</h1>
        <form onSubmit={handleCreateSuite} className="create-suite-form">
          <input
            type="text"
            value={newSuiteName}
            onChange={(e) => setNewSuiteName(e.target.value)}
            placeholder="New test suite name"
            required
          />
          <button type="submit">Create Suite</button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="test-suites-grid">
        {testSuites.map(suite => (
          <div key={suite._id} className="test-suite-card">
            <div className="suite-header">
              <h2>{suite.name}</h2>
              <button
                onClick={() => handleDeleteSuite(suite._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
            <div className="suite-stats">
              <span>{suite.tests?.length || 0} tests</span>
              <span>Last run: {suite.lastRun || 'Never'}</span>
            </div>
            <div className="suite-actions">
              <button 
                onClick={() => handleRunSuite(suite._id)}
                className="run-btn"
              >
                Run Tests
              </button>
              <button className="edit-btn">Edit</button>
            </div>
            {suite.results && (
              <div className="suite-results">
                <div className="result-item">
                  <span className="result-label">Passed:</span>
                  <span className="result-value passed">{suite.results.passed}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Failed:</span>
                  <span className="result-value failed">{suite.results.failed}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Skipped:</span>
                  <span className="result-value skipped">{suite.results.skipped}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestSuites; 