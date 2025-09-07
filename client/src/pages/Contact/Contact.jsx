import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar />
      <div style={{paddingTop: '100px', textAlign: 'center', minHeight: '60vh', padding: '100px 2rem 4rem'}}>
        <FiSend style={{fontSize: '4rem', color: '#10b981', marginBottom: '2rem'}} />
        <h1 style={{fontSize: '3rem', marginBottom: '1rem', color: '#1e293b'}}>Contact Us</h1>
        <p style={{fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 3rem'}}>
          Get in touch with our team for support, partnerships, or feedback.
        </p>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <div className="card" style={{padding: '2rem', textAlign: 'center'}}>
            <FiMail style={{fontSize: '2rem', color: '#10b981', marginBottom: '1rem'}} />
            <h3>Email</h3>
            <p>support@greensphere.edu</p>
          </div>
          <div className="card" style={{padding: '2rem', textAlign: 'center'}}>
            <FiPhone style={{fontSize: '2rem', color: '#10b981', marginBottom: '1rem'}} />
            <h3>Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>
          <div className="card" style={{padding: '2rem', textAlign: 'center'}}>
            <FiMapPin style={{fontSize: '2rem', color: '#10b981', marginBottom: '1rem'}} />
            <h3>Address</h3>
            <p>123 Green Street, Eco City</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;