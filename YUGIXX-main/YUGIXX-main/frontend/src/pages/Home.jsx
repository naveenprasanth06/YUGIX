import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiShield, 
  FiLayers, 
  FiCode, 
  FiTrendingUp,
  FiZap,
  FiGlobe,
  FiCheckCircle
} from 'react-icons/fi';
import '../styles/Home.css';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    {
      icon: <FiShield />,
      title: 'Secure Authentication',
      description: 'State-of-the-art security with JWT tokens and password hashing',
      benefits: ['End-to-end encryption', 'Multi-factor authentication', 'Regular security audits']
    },
    {
      icon: <FiLayers />,
      title: 'User Dashboard',
      description: 'Personalized dashboard for managing your account',
      benefits: ['Real-time analytics', 'Customizable widgets', 'Performance monitoring']
    },
    {
      icon: <FiCode />,
      title: 'Easy Integration',
      description: 'Simple API endpoints for seamless integration',
      benefits: ['RESTful APIs', 'WebSocket support', 'Comprehensive documentation']
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="gradient-text">YUGIXX</span>
              <br />
              Your Ultimate API Platform
            </h1>
            <p className="hero-subtitle">
              Streamline your API development, testing, and monitoring with our powerful platform
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="cta-button primary">
                Get Started <FiArrowRight />
              </Link>
              <Link to="/login" className="cta-button secondary">
                Login
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <FiTrendingUp />
              <span>99.9%</span>
              <p>Uptime</p>
            </div>
            <div className="stat-item">
              <FiZap />
              <span>50ms</span>
              <p>Avg Response</p>
            </div>
            <div className="stat-item">
              <FiGlobe />
              <span>10+</span>
              <p>Global Regions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to build and manage your APIs</p>
        </div>
        <div className="features-container">
          <div className="features-nav">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`feature-nav-item ${activeFeature === index ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
              >
                {feature.icon}
                {feature.title}
              </button>
            ))}
          </div>
          <div className="feature-content">
            <div className="feature-card">
              <div className="feature-icon">{features[activeFeature].icon}</div>
              <h3>{features[activeFeature].title}</h3>
              <p>{features[activeFeature].description}</p>
              <ul className="feature-benefits">
                {features[activeFeature].benefits.map((benefit, index) => (
                  <li key={index}>
                    <FiCheckCircle />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of developers who trust YUGIXX for their API needs</p>
          <Link to="/signup" className="cta-button primary large">
            Start Free Trial <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 