const mongoose = require('mongoose');

const userBadgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badge: { type: mongoose.Schema.Types.ObjectId, ref: 'TestBadge', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  earnedAt: { type: Date, default: Date.now },
  score: { type: Number, required: true }, // Score achieved when earning the badge
  attempt: { type: Number, required: true } // Which attempt earned the badge
}, {
  timestamps: true
});

// Ensure user can only earn each badge once
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

module.exports = mongoose.model('UserBadge', userBadgeSchema);