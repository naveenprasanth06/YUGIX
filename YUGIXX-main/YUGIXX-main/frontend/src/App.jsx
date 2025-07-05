import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RequestBuilder from './pages/RequestBuilder';
import Collections from './pages/Collections';
import TestSuites from './pages/TestSuites';
import History from './pages/History';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Monitoring from './pages/Monitoring';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <Dashboard /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/builder" 
            element={
              isAuthenticated ? 
                <RequestBuilder /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/collections" 
            element={
              isAuthenticated ? 
                <Collections /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/test-suites" 
            element={
              isAuthenticated ? 
                <TestSuites /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/history" 
            element={
              isAuthenticated ? 
                <History /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/settings" 
            element={
              isAuthenticated ? 
                <Settings /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/analytics" 
            element={
              isAuthenticated ? 
                <Analytics /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/monitoring" 
            element={
              isAuthenticated ? 
                <Monitoring /> : 
                <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 