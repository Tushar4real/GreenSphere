import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiBookOpen, FiAward, FiUsers, FiTrendingUp, FiTarget, FiSettings, FiBell, FiStar, FiZap, FiHeart, FiGlobe, FiDroplet, FiSun } from 'react-icons/fi';
import { HiOutlineSparkles, HiOutlineAcademicCap, HiOutlineFire, HiOutlineClipboardCheck } from 'react-icons/hi';
import Navbar from '../../components/Navbar/Navbar';
import SidePanel from '../../components/SidePanel/SidePanel';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import Footer from '../../components/Footer/Footer';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const motivationalQuotes = [
    "Every small action creates ripples of change",
    "Be the change you wish to see in the world",
    "The Earth does not belong to us, we belong to Earth",
    "Small steps lead to big environmental victories",
    "Your planet needs you - start today!",
    "Green choices today, brighter tomorrow",
    "Together we can heal our beautiful planet",
    "Nature is not a place to visit, it is home"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const mainFeatures = [
    {
      icon: FiBookOpen,
      title: 'Learn',
      description: 'Interactive lessons',
      path: '/lessons',
      color: '#6f42c1'
    },
    {
      icon: FiAward,
      title: 'Badges',
      description: 'Earn rewards',
      path: '/badges',
      color: '#ffc107'
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'Connect with others',
      path: '/community',
      color: '#fd7e14'
    },
    {
      icon: FiTarget,
      title: 'Tasks',
      description: 'Real-world activities',
      path: '/real-world-tasks',
      color: '#17a2b8'
    },
    {
      icon: FiUsers,
      title: 'Compete',
      description: 'Join competitions',
      path: '/competitions',
      color: '#28a745'
    },
    {
      icon: FiSettings,
      title: 'Exams',
      description: 'Test knowledge',
      path: '/tests',
      color: '#20c997'
    }
  ];


  
  const handleFeatureHover = (index) => {
    const messages = [
      '📚 Ready to become an eco-expert?',
      '🎯 Time to make a real impact!',
      '🏆 Collect awesome badges!',
      '🌍 Connect with eco-warriors!',
      '🔔 Stay updated with your progress!',
      '🏅 Show your green spirit!',
      '👥 Manage your eco-warriors!',
      '📈 Track your green impact!'
    ];
    console.log(messages[index] || '🌱 Let\'s go green!');
  };

  return (
    <div className="homepage">
      <Navbar />



      <div className="main-features-grid">
        {mainFeatures.map((feature, index) => (
          <div 
            key={index}
            className="main-feature-card"
            onClick={() => {
              const card = document.querySelectorAll('.main-feature-card')[index];
              card.style.transform = 'scale(0.95)';
              setTimeout(() => {
                card.style.transform = '';
                navigate(feature.path);
              }, 150);
            }}
            style={{ 
              '--feature-color': feature.color,
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="main-feature-icon">
              <feature.icon />
            </div>
            <h3>{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>

          </div>
        ))}
      </div>


      
      <SidePanel />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default HomePage;