import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaSchool, FaCity } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import apiService from '../../services/apiService';
import './Leaderboard.css';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('school');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      let response;
      
      if (activeTab === 'school') {
        response = await apiService.leaderboard.getSchoolLeaderboard();
      } else {
        response = await apiService.leaderboard.getCityLeaderboard();
      }
      
      setLeaderboardData(response.data || await generateMockData());
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboardData(await generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = async () => {
    try {
      // Try to fetch real users from API
      const response = await apiService.user.getUsers();
      const users = response.data || [];
      
      if (users.length > 0) {
        const studentsOnly = users.filter(user => user.role === 'student');
        const sortedStudents = studentsOnly
          .sort((a, b) => (b.points || 0) - (a.points || 0))
          .slice(0, 10);
          
        return sortedStudents.map(user => ({
          id: user._id,
          name: user.name,
          school: user.school || 'GreenSphere Academy',
          city: user.city || 'Mumbai',
          points: user.points || 0,
          level: user.level || 'Seedling',
          badges: user.badges?.length || 0
        }));
      }
    } catch (error) {
      console.log('Failed to fetch real users, using mock data');
    }
    
    // Fallback mock data
    const schoolData = [
      { id: 1, name: 'Alex Johnson', school: 'Green Valley High', points: 2450 + Math.floor(Math.random() * 100), level: 'Eco Champion', badges: 12 },
      { id: 2, name: 'Sarah Chen', school: 'Green Valley High', points: 2380 + Math.floor(Math.random() * 100), level: 'Planet Protector', badges: 11 },
      { id: 3, name: 'Mike Rodriguez', school: 'Green Valley High', points: 2200 + Math.floor(Math.random() * 100), level: 'Green Guardian', badges: 10 },
      { id: 4, name: 'Emma Davis', school: 'Green Valley High', points: 2100 + Math.floor(Math.random() * 100), level: 'Eco Warrior', badges: 9 },
      { id: 5, name: 'James Wilson', school: 'Green Valley High', points: 1950 + Math.floor(Math.random() * 100), level: 'Nature Lover', badges: 8 }
    ];

    const cityData = [
      { id: 1, name: 'Emma Wilson', school: 'Eco Academy', city: 'Mumbai', points: 3200 + Math.floor(Math.random() * 200), level: 'Eco Legend', badges: 15 },
      { id: 2, name: 'Raj Patel', school: 'Nature School', city: 'Mumbai', points: 3100 + Math.floor(Math.random() * 200), level: 'Green Master', badges: 14 },
      { id: 3, name: 'Lisa Kumar', school: 'Green Future School', city: 'Mumbai', points: 2900 + Math.floor(Math.random() * 200), level: 'Eco Champion', badges: 13 },
      { id: 4, name: 'Arjun Singh', school: 'Sustainable Academy', city: 'Mumbai', points: 2800 + Math.floor(Math.random() * 200), level: 'Planet Protector', badges: 12 },
      { id: 5, name: 'Priya Sharma', school: 'Earth School', city: 'Mumbai', points: 2700 + Math.floor(Math.random() * 200), level: 'Green Guardian', badges: 11 }
    ];

    return activeTab === 'school' ? schoolData : cityData;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="gold" />;
    if (rank === 2) return <FaMedal className="silver" />;
    if (rank === 3) return <FaMedal className="bronze" />;
    return <span className="rank-number">{rank}</span>;
  };

  return (
    <div className="leaderboard-page">
      <Navbar />
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1>🏆 Leaderboard</h1>
          <p>See how you rank among eco-warriors!</p>
        </div>

        <div className="leaderboard-tabs">
          <button 
            className={`tab ${activeTab === 'school' ? 'active' : ''}`}
            onClick={() => setActiveTab('school')}
          >
            <FaSchool /> School Level
          </button>
          <button 
            className={`tab ${activeTab === 'city' ? 'active' : ''}`}
            onClick={() => setActiveTab('city')}
          >
            <FaCity /> City Level
          </button>
        </div>

        <div className="leaderboard-content">
          {loading ? (
            <div className="loading">Loading leaderboard...</div>
          ) : (
            <div className="leaderboard-list">
              {leaderboardData.map((user, index) => (
                <div key={user.id} className={`leaderboard-item rank-${index + 1}`}>
                  <div className="rank">
                    {getRankIcon(index + 1)}
                  </div>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{activeTab === 'school' ? user.school : `${user.school}, ${user.city}`}</p>
                  </div>
                  <div className="user-stats">
                    <div className="stat">
                      <span className="value">{user.points}</span>
                      <span className="label">Points</span>
                    </div>
                    <div className="stat">
                      <span className="value">{user.level}</span>
                      <span className="label">Level</span>
                    </div>
                    <div className="stat">
                      <span className="value">{user.badges}</span>
                      <span className="label">Badges</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Leaderboard;