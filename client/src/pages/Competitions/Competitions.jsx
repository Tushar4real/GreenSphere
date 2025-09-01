import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { FiAward, FiUsers, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import apiService from '../../utils/apiService';
import './Competitions.css';

const Competitions = () => {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    try {
      const response = await apiService.get('/competitions');
      setCompetitions(response.data || mockCompetitions);
    } catch (error) {
      console.error('Error loading competitions:', error);
      setCompetitions(mockCompetitions);
    } finally {
      setLoading(false);
    }
  };

  const mockCompetitions = [
    {
      _id: '1',
      title: 'Green Schools Challenge 2024',
      description: 'Inter-school environmental competition focusing on sustainability practices',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'active',
      participants: [{ school: 'Green Valley High' }, { school: 'Eco Academy' }]
    }
  ];

  const mockLeaderboard = {
    schoolLeaderboard: [
      { school: 'Green Valley High', totalPoints: 2450, studentCount: 15 },
      { school: 'Eco Academy', totalPoints: 2180, studentCount: 12 },
      { school: 'Nature School', totalPoints: 1890, studentCount: 10 }
    ],
    individualLeaderboard: [
      { name: 'Alice Green', school: 'Green Valley High', points: 850, level: 'Tree' },
      { name: 'Bob Earth', school: 'Eco Academy', points: 720, level: 'Sapling' }
    ]
  };

  const handleJoinCompetition = async (competitionId) => {
    try {
      await apiService.post(`/competitions/${competitionId}/join`);
      alert('Successfully joined competition!');
      loadCompetitions();
    } catch (error) {
      alert(error.response?.data?.error || 'Error joining competition');
    }
  };

  const handleViewLeaderboard = async (competition) => {
    try {
      const response = await apiService.get(`/competitions/${competition._id}/leaderboard`);
      setLeaderboard(response.data || mockLeaderboard);
      setSelectedCompetition(competition);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboard(mockLeaderboard);
      setSelectedCompetition(competition);
    }
  };

  if (loading) {
    return (
      <div className="competitions-page">
        <Navbar />
        <div className="competitions-container">
          <div className="loading-spinner">Loading competitions...</div>
        </div>
      </div>
    );
  }

  if (selectedCompetition && leaderboard) {
    return (
      <div className="competitions-page">
        <Navbar />
        <div className="competitions-container">
          <button className="back-btn" onClick={() => setSelectedCompetition(null)}>
            <FiArrowLeft /> Back to Competitions
          </button>
          
          <div className="leaderboard-header">
            <h1>🏆 {selectedCompetition.title}</h1>
            <p>Competition Leaderboard</p>
          </div>

          <div className="leaderboard-sections">
            <div className="school-leaderboard">
              <h2>🏫 School Rankings</h2>
              <div className="leaderboard-list">
                {leaderboard.schoolLeaderboard.map((school, index) => (
                  <div key={school.school} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
                    <div className="rank">#{index + 1}</div>
                    <div className="school-info">
                      <h3>{school.school}</h3>
                      <p>{school.studentCount} students</p>
                    </div>
                    <div className="points">{school.totalPoints} pts</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="individual-leaderboard">
              <h2>👤 Top Students</h2>
              <div className="leaderboard-list">
                {leaderboard.individualLeaderboard.map((student, index) => (
                  <div key={student.name} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
                    <div className="rank">#{index + 1}</div>
                    <div className="student-info">
                      <h3>{student.name}</h3>
                      <p>{student.school} • {student.level}</p>
                    </div>
                    <div className="points">{student.points} pts</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="competitions-page">
      <Navbar />
      
      <div className="competitions-container">
        <div className="competitions-header">
          <h1>🏆 School Competitions</h1>
          <p>Compete with other schools in environmental challenges</p>
        </div>

        <div className="competitions-grid">
          {competitions.map(competition => (
            <div key={competition._id} className={`competition-card ${competition.status}`}>
              <div className="competition-header">
                <div className="competition-status">
                  {competition.status === 'active' ? '🟢 Active' : 
                   competition.status === 'upcoming' ? '🟡 Upcoming' : '🔴 Completed'}
                </div>
                <FiAward className="competition-icon" />
              </div>
              
              <div className="competition-content">
                <h3>{competition.title}</h3>
                <p>{competition.description}</p>
                
                <div className="competition-meta">
                  <div className="meta-item">
                    <FiCalendar />
                    <span>{new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <FiUsers />
                    <span>{competition.participants?.length || 0} participants</span>
                  </div>
                </div>
              </div>
              
              <div className="competition-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleViewLeaderboard(competition)}
                >
                  <FiAward /> View Leaderboard
                </button>
                {competition.status === 'active' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleJoinCompetition(competition._id)}
                  >
                    Join Competition
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {competitions.length === 0 && (
          <div className="empty-state">
            <FiAward size={48} />
            <h3>No Active Competitions</h3>
            <p>Check back later for new school competitions!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Competitions;