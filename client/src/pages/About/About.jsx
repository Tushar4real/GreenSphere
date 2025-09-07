import React from 'react';
import { FiGlobe, FiHeart, FiUsers, FiTarget } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-content">
        <div className="hero-section">
          <FiGlobe className="hero-icon" />
          <h1>About GreenSphere</h1>
          <p>Empowering the next generation to create a sustainable future</p>
        </div>
        
        <div className="mission-section">
          <div className="mission-card">
            <FiHeart className="mission-icon" />
            <h2>Our Mission</h2>
            <p>To educate and inspire individuals to take meaningful action for environmental conservation through interactive learning and real-world challenges.</p>
          </div>
          
          <div className="mission-card">
            <FiUsers className="mission-icon" />
            <h2>Our Community</h2>
            <p>Join thousands of eco-warriors worldwide who are making a difference, one green action at a time.</p>
          </div>
          
          <div className="mission-card">
            <FiTarget className="mission-icon" />
            <h2>Our Impact</h2>
            <p>Together, we've completed over 10,000 environmental tasks and educated millions about sustainability.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;