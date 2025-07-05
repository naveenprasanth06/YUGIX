import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Settings.css';
import {
  FiSave, FiPlus, FiTrash2, FiSun, FiMoon,
  FiSettings, FiBell, FiClock
} from 'react-icons/fi';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoSave: true,
    timeout: 30000
  });
  const [settingsId, setSettingsId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setSettings({
          theme: data.theme || 'light',
          notifications: data.notifications ?? true,
          autoSave: data.autoSave ?? true,
          timeout: data.timeout || 30000
        });
        setSettingsId(data._id);
      } else {
        setError('Invalid settings response');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token');

      const payload = {
        theme: settings.theme,
        notifications: settings.notifications,
        autoSave: settings.autoSave,
        timeout: settings.timeout
      };

      await axios.put(`http://localhost:5000/api/settings/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (e) => {
    const value = e.target.value;
    setSettings({ ...settings, theme: value });
    document.documentElement.setAttribute('data-theme', value);
  };

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleTimeoutChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1000) {
      setSettings({ ...settings, timeout: value });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <FiSettings className="settings-icon" />
        <h1>Settings</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="settings-grid">
        {/* Appearance Section */}
        <div className="settings-section">
          <div className="section-header">
            <FiSun className="section-icon" />
            <h2>Appearance</h2>
          </div>
          <div className="setting-item">
            <label>Theme</label>
            <div className="theme-selector">
              <select value={settings.theme} onChange={handleThemeChange}>
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="system">System Default</option>
              </select>
              <div className="theme-preview">
                {settings.theme === 'light' ? <FiSun /> : <FiMoon />}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="settings-section">
          <div className="section-header">
            <FiSettings className="section-icon" />
            <h2>Preferences</h2>
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <FiBell className="setting-icon" />
              <label>Enable Notifications</label>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
                id="notifications"
              />
              <label htmlFor="notifications"></label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <FiSave className="setting-icon" />
              <label>Auto-save Changes</label>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={() => handleToggle('autoSave')}
                id="autoSave"
              />
              <label htmlFor="autoSave"></label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <FiClock className="setting-icon" />
              <label>Request Timeout (ms)</label>
            </div>
            <div className="timeout-input">
              <input
                type="number"
                min="1000"
                step="1000"
                value={settings.timeout}
                onChange={handleTimeoutChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="settings-actions">
        <button
          onClick={handleSave}
          className="save-btn"
          disabled={saving}
        >
          {saving ? 'Saving...' : (
            <>
              <FiSave /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;
