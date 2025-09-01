const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, default: '#28A745' },
  category: { type: String, enum: ['task', 'quiz', 'streak', 'special'], required: true },
  criteria: {
    type: { type: String, enum: ['tasks_completed', 'quizzes_completed', 'points_earned', 'streak_days', 'special_achievement'] },
    value: { type: Number },
    description: { type: String }
  },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);