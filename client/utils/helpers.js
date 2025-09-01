// Format points with commas
export const formatPoints = (points) => {
  return points.toLocaleString();
};

// Get level color based on level name
export const getLevelColor = (level) => {
  const colors = {
    'Seedling': '#8BC34A',
    'Sapling': '#4CAF50',
    'Tree': '#2E7D32',
    'Planet Saver': '#FFC107'
  };
  return colors[level] || '#28A745';
};

// Calculate progress percentage for next level
export const getProgressToNextLevel = (points) => {
  if (points < 101) return { current: points, next: 101, percentage: (points / 101) * 100 };
  if (points < 301) return { current: points - 100, next: 201, percentage: ((points - 100) / 201) * 100 };
  if (points < 601) return { current: points - 300, next: 301, percentage: ((points - 300) / 301) * 100 };
  return { current: points - 600, next: 0, percentage: 100 };
};

// Format time duration
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get badge rarity color
export const getBadgeRarityColor = (rarity) => {
  const colors = {
    'common': '#6c757d',
    'rare': '#007bff',
    'epic': '#6f42c1',
    'legendary': '#ffc107'
  };
  return colors[rarity] || '#6c757d';
};