import React from 'react';
import { FiShield } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Privacy = () => {
  return (
    <div className="privacy-page">
      <Navbar />
      <div style={{paddingTop: '100px', textAlign: 'center', minHeight: '60vh', padding: '100px 2rem 4rem'}}>
        <FiShield style={{fontSize: '4rem', color: '#10b981', marginBottom: '2rem'}} />
        <h1 style={{fontSize: '3rem', marginBottom: '1rem', color: '#1e293b'}}>Privacy Policy</h1>
        <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'left'}}>
          <div className="card" style={{padding: '2rem', marginBottom: '2rem'}}>
            <h2>Data Collection</h2>
            <p>We collect minimal data necessary to provide our educational services and track your environmental impact progress.</p>
          </div>
          <div className="card" style={{padding: '2rem', marginBottom: '2rem'}}>
            <h2>Data Usage</h2>
            <p>Your data is used solely to enhance your learning experience and is never shared with third parties without consent.</p>
          </div>
          <div className="card" style={{padding: '2rem'}}>
            <h2>Your Rights</h2>
            <p>You have full control over your data and can request deletion or modification at any time.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;