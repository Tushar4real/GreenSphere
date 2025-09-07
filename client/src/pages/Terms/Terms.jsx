import React from 'react';
import { FiFileText } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Terms = () => {
  return (
    <div className="terms-page">
      <Navbar />
      <div style={{paddingTop: '100px', textAlign: 'center', minHeight: '60vh', padding: '100px 2rem 4rem'}}>
        <FiFileText style={{fontSize: '4rem', color: '#10b981', marginBottom: '2rem'}} />
        <h1 style={{fontSize: '3rem', marginBottom: '1rem', color: '#1e293b'}}>Terms of Service</h1>
        <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'left'}}>
          <div className="card" style={{padding: '2rem', marginBottom: '2rem'}}>
            <h2>Acceptable Use</h2>
            <p>GreenSphere is designed for educational purposes to promote environmental awareness and action.</p>
          </div>
          <div className="card" style={{padding: '2rem', marginBottom: '2rem'}}>
            <h2>User Responsibilities</h2>
            <p>Users are expected to engage respectfully with the community and complete tasks honestly.</p>
          </div>
          <div className="card" style={{padding: '2rem'}}>
            <h2>Service Availability</h2>
            <p>We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;