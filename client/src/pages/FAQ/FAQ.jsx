import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const FAQ = () => {
  const faqs = [
    {
      question: "How do I earn points?",
      answer: "Complete lessons, tasks, and participate in community activities to earn eco-points."
    },
    {
      question: "What are badges for?",
      answer: "Badges recognize your achievements and progress in environmental learning and action."
    },
    {
      question: "How do I level up?",
      answer: "Accumulate points through various activities to advance to higher levels."
    },
    {
      question: "Can I compete with friends?",
      answer: "Yes! Join competitions and check the leaderboard to see how you rank."
    }
  ];

  return (
    <div className="faq-page">
      <Navbar />
      <div style={{paddingTop: '100px', textAlign: 'center', minHeight: '60vh', padding: '100px 2rem 4rem'}}>
        <FiHelpCircle style={{fontSize: '4rem', color: '#10b981', marginBottom: '2rem'}} />
        <h1 style={{fontSize: '3rem', marginBottom: '1rem', color: '#1e293b'}}>Frequently Asked Questions</h1>
        <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'left'}}>
          {faqs.map((faq, index) => (
            <div key={index} className="card" style={{padding: '2rem', marginBottom: '1.5rem'}}>
              <h3 style={{color: '#10b981', marginBottom: '1rem'}}>{faq.question}</h3>
              <p style={{color: '#64748b'}}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;