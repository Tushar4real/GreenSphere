const mongoose = require('mongoose');

const earnedBadgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'RealWorldTask', required: true },
  submission: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskSubmission', required: true },
  badgeName: { type: String, required: true },
  badgeIcon: { type: String, required: true },
  badgeDescription: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('EarnedBadge', earnedBadgeSchema);