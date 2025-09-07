import React from 'react';
import { FiHelpCircle, FiBook, FiMessageCircle } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Help = () => {
  return (
    <div className="help-page">
      <Navbar />
      <div style={{paddingTop: '100px', textAlign: 'center', minHeight: '60vh', padding: '100px 2rem 4rem'}}>
        <FiHelpCircle style={{fontSize: '4rem', color: '#10b981', marginBottom: '2rem'}} />
        <h1 style={{fontSize: '3rem', marginBottom: '1rem', color: '#1e293b'}}>Help Center</h1>
        <p style={{fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 3rem'}}>
          Find answers to common questions and get support for your GreenSphere journey.
        </p>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <div className="card" style={{padding: '2rem', textAlign: 'center'}}>
            <FiBook style={{fontSize: '2rem', color: '#10b981', marginBottom: '1rem'}} />
            <h3>Getting Started</h3>
            <p>Learn how to use GreenSphere effectively</p>
          </div>
          <div className="card" style={{padding: '2rem', textAlign: 'center'}}>
            <FiMessageCircle style={{fontSize: '2rem', color: '#10b981', marginBottom: '1rem'}} />
            <h3>Contact Support</h3>
            <p>Get help from our support team</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Help;