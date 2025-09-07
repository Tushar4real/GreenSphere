import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiTrendingUp, FiFileText, FiUser } from 'react-icons/fi';
import './SidePanel.css';

const SidePanel = () => {
  const navigate = useNavigate();

  const panelItems = [
    {
      icon: FiBell,
      title: 'Notifications',
      path: '/notifications',
      color: '#17a2b8'
    },
    {
      icon: FiTrendingUp,
      title: 'Leaderboard',
      path: '/leaderboard',
      color: '#ffc107'
    },
    {
      icon: FiFileText,
      title: 'News',
      path: '/news',
      color: '#28a745'
    },
    {
      icon: FiUser,
      title: 'Progress',
      path: '/progress',
      color: '#10b981'
    }
  ];

  return (
    <div className="side-panel">
      {panelItems.map((item, index) => (
        <div
          key={index}
          className="panel-item"
          onClick={() => navigate(item.path)}
          style={{ '--item-color': item.color }}
          title={item.title}
        >
          <item.icon className="panel-icon" />
          <span className="panel-label">{item.title}</span>
        </div>
      ))}
    </div>
  );
};

export default SidePanel;