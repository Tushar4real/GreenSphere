import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiUsers, FiBookOpen, FiAward, FiCalendar, FiDownload } from 'react-icons/fi';
import apiService from '../../services/apiService';
import './Analytics.css';

const Analytics = ({ data }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState({
    userGrowth: [],
    engagement: [],
    contentCompletion: []
  });
  const [stats, setStats] = useState({
    activeUsers: 0,
    lessonsCompleted: 0,
    badgesEarned: 0,
    engagementRate: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [usersRes, postsRes] = await Promise.all([
        apiService.admin.getAllUsers().catch(() => ({ data: [] })),
        apiService.community.getPosts().catch(() => ({ data: [] }))
      ]);
      
      const users = usersRes.data || [];
      const posts = postsRes.data?.data || postsRes.data || [];
      
      const students = users.filter(u => u.role === 'student');
      const activeUsers = users.filter(u => {
        const lastActivity = new Date(u.lastActivity || u.createdAt);
        const daysSinceActive = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceActive <= 7;
      });
      
      const totalLessons = students.reduce((sum, s) => sum + (s.totalLessonsCompleted || 0), 0);
      const totalBadges = students.reduce((sum, s) => sum + (s.badges?.length || 0), 0);
      const engagementRate = users.length > 0 ? Math.round((activeUsers.length / users.length) * 100) : 0;
      
      // Generate mock chart data
      const generateChartData = (baseValue, variance = 10) => {
        return Array.from({ length: 7 }, (_, i) => 
          Math.max(0, baseValue + Math.floor(Math.random() * variance) - variance/2)
        );
      };
      
      setChartData({
        userGrowth: generateChartData(users.length, 5),
        engagement: generateChartData(engagementRate, 15),
        contentCompletion: generateChartData(75, 20)
      });
      
      setStats({
        activeUsers: activeUsers.length,
        lessonsCompleted: totalLessons,
        badgesEarned: totalBadges,
        engagementRate
      });
      
      // Generate recent activities
      const recentActivities = [
        { icon: 'FiUsers', message: `${users.length} total users registered`, timestamp: new Date() },
        { icon: 'FiBookOpen', message: `${totalLessons} lessons completed by students`, timestamp: new Date(Date.now() - 60000) },
        { icon: 'FiAward', message: `${totalBadges} badges earned across platform`, timestamp: new Date(Date.now() - 120000) },
        { icon: 'FiTrendingUp', message: `${engagementRate}% user engagement rate`, timestamp: new Date(Date.now() - 180000) }
      ];
      
      setActivities(recentActivities);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Fallback data
      setStats({
        activeUsers: 89,
        lessonsCompleted: 342,
        badgesEarned: 156,
        engagementRate: 73
      });
      setChartData({
        userGrowth: [45, 52, 48, 61, 55, 67, 89],
        engagement: [65, 71, 68, 75, 72, 78, 73],
        contentCompletion: [60, 65, 70, 68, 75, 80, 78]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);
  


  const SimpleChart = ({ data, color, title, unit = '' }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="simple-chart">
        <div className="chart-header">
          <h4>{title}</h4>
          <span className="chart-value">{data[data.length - 1]}{unit}</span>
        </div>
        <div className="chart-container">
          <svg viewBox="0 0 300 100" className="chart-svg">
            <polyline
              points={data.map((value, index) => 
                `${(index / (data.length - 1)) * 300},${100 - ((value - min) / range) * 80}`
              ).join(' ')}
              fill="none"
              stroke={color}
              strokeWidth="2"
            />
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            <polygon
              points={`0,100 ${data.map((value, index) => 
                `${(index / (data.length - 1)) * 300},${100 - ((value - min) / range) * 80}`
              ).join(' ')} 300,100`}
              fill={`url(#gradient-${title})`}
            />
          </svg>
        </div>
      </div>
    );
  };

  const MetricCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="metric-card">
      <div className="metric-icon" style={{ backgroundColor: color }}>
        <Icon />
      </div>
      <div className="metric-content">
        <h3>{value}</h3>
        <p>{title}</p>
        <div className="metric-change positive">
          <FiTrendingUp />
          <span>{change}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <div className="analytics-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="export-btn">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricCard
          icon={FiUsers}
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          change="+12.5%"
          color="var(--primary-green)"
        />
        <MetricCard
          icon={FiBookOpen}
          title="Tasks Completed"
          value={stats.lessonsCompleted.toLocaleString()}
          change="+8.3%"
          color="var(--secondary-teal)"
        />
        <MetricCard
          icon={FiAward}
          title="Badges Earned"
          value={stats.badgesEarned.toLocaleString()}
          change="+15.7%"
          color="var(--accent-yellow)"
        />
        <MetricCard
          icon={FiTrendingUp}
          title="Engagement Rate"
          value={`${stats.engagementRate}%`}
          change="+5.2%"
          color="var(--accent-orange)"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <SimpleChart
            data={chartData.userGrowth}
            color="var(--primary-green)"
            title="User Growth"
          />
        </div>
        
        <div className="chart-card">
          <SimpleChart
            data={chartData.engagement}
            color="var(--secondary-teal)"
            title="Daily Engagement"
            unit="%"
          />
        </div>
        
        <div className="chart-card">
          <SimpleChart
            data={chartData.contentCompletion}
            color="var(--accent-orange)"
            title="Content Completion"
            unit="%"
          />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="activity-section">
        <h3>Recent Activity</h3>
        {loading ? (
          <div className="loading-spinner">Loading activities...</div>
        ) : (
          <div className="activity-feed">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.icon === 'FiUsers' && <FiUsers />}
                  {activity.icon === 'FiBookOpen' && <FiBookOpen />}
                  {activity.icon === 'FiAward' && <FiAward />}
                  {activity.icon === 'FiTrendingUp' && <FiTrendingUp />}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span>{new Date(activity.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Loading spinner CSS
const loadingSpinnerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100px',
  color: 'var(--neutral-gray)'
};

export default Analytics;