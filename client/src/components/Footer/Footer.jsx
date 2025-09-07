import React, { useState } from 'react';
import { FiGlobe, FiMail, FiHeart, FiTwitter, FiFacebook, FiInstagram, FiLinkedin, FiYoutube, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      setEmail('');
    }
  };

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="brand-header">
            <FiGlobe className="footer-icon" />
            <h3>GreenSphere</h3>
          </div>
          <p className="brand-tagline">
            <FiHeart className="heart-icon" />
            Making Earth Greener Together
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <span>support@greensphere.edu</span>
            </div>
            <div className="contact-item">
              <FiPhone className="contact-icon" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <FiMapPin className="contact-icon" />
              <span>123 Green Street, Eco City</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <span onClick={() => navigate('/about')} className="footer-link">About Us</span>
            <span onClick={() => navigate('/lessons')} className="footer-link">Lessons</span>
            <span onClick={() => navigate('/real-world-tasks')} className="footer-link">Tasks</span>
            <span onClick={() => navigate('/community')} className="footer-link">Community</span>
            <span onClick={() => navigate('/badges')} className="footer-link">Badges</span>
            <span onClick={() => navigate('/leaderboard')} className="footer-link">Leaderboard</span>
          </div>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <div className="footer-links">
            <span onClick={() => navigate('/help')} className="footer-link">Help Center</span>
            <span onClick={() => navigate('/privacy')} className="footer-link">Privacy Policy</span>
            <span onClick={() => navigate('/terms')} className="footer-link">Terms of Service</span>
            <span onClick={() => navigate('/contact')} className="footer-link">Contact Us</span>
            <span onClick={() => navigate('/faq')} className="footer-link">FAQ</span>
          </div>
        </div>

        <div className="footer-section">
          <h4>Stay Connected</h4>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                <FiSend className="send-icon" />
              </button>
            </div>
          </form>
          <div className="social-links">
            <a href="https://twitter.com/greensphere" className="social-link">
              <FiTwitter />
            </a>
            <a href="https://facebook.com/greensphere" className="social-link">
              <FiFacebook />
            </a>
            <a href="https://instagram.com/greensphere" className="social-link">
              <FiInstagram />
            </a>
            <a href="https://linkedin.com/company/greensphere" className="social-link">
              <FiLinkedin />
            </a>
            <a href="https://youtube.com/greensphere" className="social-link">
              <FiYoutube />
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <span>&copy; 2025 GreenSphere. All rights reserved.</span><br /> Made with Heart and Brain
      </div>
    </footer>
  );
};

export default Footer;