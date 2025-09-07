const mongoose = require('mongoose');

const testBadgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  color: { type: String, default: '#FFD700' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  criteria: {
    minScore: { type: Number, default: 80 }, // Minimum percentage to earn badge
    maxAttempts: { type: Number, default: 3 } // Maximum attempts allowed
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.models.TestBadge || mongoose.model('TestBadge', testBadgeSchema);