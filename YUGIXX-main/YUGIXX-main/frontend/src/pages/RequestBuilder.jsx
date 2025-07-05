import { useState } from 'react';
import axios from 'axios';
import '../styles/RequestBuilder.css';

const RequestBuilder = () => {
  const [request, setRequest] = useState({
    url: '',
    method: 'GET',
    headers: [{ key: '', value: '' }],
    params: [{ key: '', value: '' }],
    body: '',
    authType: 'none',
    authToken: '',
    apiKey: '',
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyValueChange = (type, index, field, value) => {
    setRequest(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addKeyValuePair = (type) => {
    setRequest(prev => ({
      ...prev,
      [type]: [...prev[type], { key: '', value: '' }]
    }));
  };

  const removeKeyValuePair = (type, index) => {
    setRequest(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      // Prepare headers
      const headers = {};
      request.headers.forEach(({ key, value }) => {
        if (key && value) headers[key] = value;
      });

      // Add auth header if needed
      if (request.authType === 'bearer' && request.authToken) {
        headers['Authorization'] = `Bearer ${request.authToken}`;
      } else if (request.authType === 'apiKey' && request.apiKey) {
        headers['X-API-Key'] = request.apiKey;
      }

      // Prepare query params
      const params = {};
      request.params.forEach(({ key, value }) => {
        if (key && value) params[key] = value;
      });

      // Prepare body
      let body;
      if (request.method !== 'GET' && request.body) {
        try {
          body = JSON.parse(request.body);
        } catch (e) {
          body = request.body;
        }
      }

      const startTime = Date.now();
      const response = await axios({
        method: request.method,
        url: request.url,
        headers,
        params,
        data: body
      });
      const endTime = Date.now();

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        time: endTime - startTime
      });
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      if (error.response) {
        setResponse({
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data,
          time: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-builder">
      <form onSubmit={handleSubmit}>
        <div className="request-section">
          <div className="url-section">
            <select 
              name="method" 
              value={request.method}
              onChange={handleInputChange}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
            <input
              type="text"
              name="url"
              value={request.url}
              onChange={handleInputChange}
              placeholder="Enter URL"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>

          <div className="tabs">
            <div className="tab-section">
              <h3>Headers</h3>
              {request.headers.map((header, index) => (
                <div key={index} className="key-value-pair">
                  <input
                    type="text"
                    placeholder="Key"
                    value={header.key}
                    onChange={(e) => handleKeyValueChange('headers', index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) => handleKeyValueChange('headers', index, 'value', e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => removeKeyValuePair('headers', index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => addKeyValuePair('headers')}
              >
                Add Header
              </button>
            </div>

            <div className="tab-section">
              <h3>Params</h3>
              {request.params.map((param, index) => (
                <div key={index} className="key-value-pair">
                  <input
                    type="text"
                    placeholder="Key"
                    value={param.key}
                    onChange={(e) => handleKeyValueChange('params', index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={param.value}
                    onChange={(e) => handleKeyValueChange('params', index, 'value', e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => removeKeyValuePair('params', index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => addKeyValuePair('params')}
              >
                Add Param
              </button>
            </div>

            <div className="tab-section">
              <h3>Body</h3>
              <textarea
                name="body"
                value={request.body}
                onChange={handleInputChange}
                placeholder="Enter request body (JSON)"
                rows="10"
              />
            </div>

            <div className="tab-section">
              <h3>Auth</h3>
              <select 
                name="authType" 
                value={request.authType}
                onChange={handleInputChange}
              >
                <option value="none">None</option>
                <option value="bearer">Bearer Token</option>
                <option value="apiKey">API Key</option>
              </select>
              
              {request.authType === 'bearer' && (
                <input
                  type="text"
                  name="authToken"
                  value={request.authToken}
                  onChange={handleInputChange}
                  placeholder="Enter Bearer Token"
                />
              )}
              
              {request.authType === 'apiKey' && (
                <input
                  type="text"
                  name="apiKey"
                  value={request.apiKey}
                  onChange={handleInputChange}
                  placeholder="Enter API Key"
                />
              )}
            </div>
          </div>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {response && (
        <div className="response-section">
          <div className="response-header">
            <span className={`status-code ${response.status >= 200 && response.status < 300 ? 'success' : 'error'}`}>
              {response.status} {response.statusText}
            </span>
            <span className="response-time">Time: {response.time}ms</span>
          </div>
          
          <div className="response-tabs">
            <div className="tab-section">
              <h3>Response Body</h3>
              <pre>{JSON.stringify(response.data, null, 2)}</pre>
            </div>
            
            <div className="tab-section">
              <h3>Response Headers</h3>
              <pre>{JSON.stringify(response.headers, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestBuilder; 