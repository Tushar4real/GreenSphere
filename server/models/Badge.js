const mongoose = require('mongoose');

// User Badge Achievement Schema
const userBadgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: true },
  
  // Achievement Details
  earnedAt: { type: Date, default: Date.now },
  pointsAwarded: { type: Number, default: 0 },
  
  // Achievement Context
  achievementContext: {
    activityType: { type: String }, // What activity triggered this badge
    activityId: { type: mongoose.Schema.Types.ObjectId },
    milestone: { type: String } // e.g., "Completed 10 tasks"
  },
  
  // Display Status
  isNew: { type: Boolean, default: true }, // For showing "NEW" indicator
  viewedAt: { type: Date },
  
  // Social Features
  isShared: { type: Boolean, default: false },
  sharedAt: { type: Date }
}, {
  timestamps: true
});

// Compound index to prevent duplicate badges
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

const UserBadge = mongoose.models.UserBadge || mongoose.model('UserBadge', userBadgeSchema);

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, default: '#28A745' },
  
  // Enhanced Categories
  category: { 
    type: String, 
    enum: ['task', 'lesson', 'quiz', 'streak', 'competition', 'impact', 'social', 'special', 'seasonal'], 
    required: true 
  },
  
  // Multiple Criteria Support
  criteria: [{
    type: { 
      type: String, 
      enum: [
        'tasks_completed', 'lessons_completed', 'quizzes_completed', 
        'points_earned', 'eco_points_earned', 'streak_days', 
        'competitions_won', 'trees_planted', 'waste_collected',
        'energy_saved', 'carbon_reduced', 'friends_invited',
        'special_achievement', 'seasonal_event'
      ]
    },
    value: { type: Number },
    operator: { type: String, enum: ['>=', '>', '=', '<', '<='], default: '>=' },
    description: { type: String }
  }],
  
  // Badge Properties
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
  points: { type: Number, default: 0 }, // Points awarded when badge is earned
  
  // Unlock Conditions
  isHidden: { type: Boolean, default: false }, // Hidden until unlocked
  prerequisiteBadges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  
  // Time-based Availability
  availableFrom: { type: Date },
  availableUntil: { type: Date },
  isSeasonalBadge: { type: Boolean, default: false },
  
  // Statistics
  earnedCount: { type: Number, default: 0 },
  
  // Display Properties
  animationEffect: { type: String, enum: ['none', 'glow', 'sparkle', 'bounce'], default: 'none' },
  celebrationMessage: { type: String },
  
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Check if user meets badge criteria
badgeSchema.methods.checkCriteria = function(userStats) {
  return this.criteria.every(criterion => {
    const userValue = userStats[criterion.type] || 0;
    const requiredValue = criterion.value;
    
    switch(criterion.operator) {
      case '>=':
        return userValue >= requiredValue;
      case '>':
        return userValue > requiredValue;
      case '=':
        return userValue === requiredValue;
      case '<':
        return userValue < requiredValue;
      case '<=':
        return userValue <= requiredValue;
      default:
        return userValue >= requiredValue;
    }
  });
};

// Check if badge is currently available
badgeSchema.methods.isAvailable = function() {
  if (!this.isActive) return false;
  
  const now = new Date();
  if (this.availableFrom && now < this.availableFrom) return false;
  if (this.availableUntil && now > this.availableUntil) return false;
  
  return true;
};

module.exports = mongoose.models.Badge || mongoose.model('Badge', badgeSchema);