import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>🌱 GreenSphere</h3>
          <p>Making Earth Greener Together</p>
        </div>
        <div className="footer-links">
          <span>📧 support@greensphere.edu</span>
          <span>&copy; 2024 GreenSphere</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;