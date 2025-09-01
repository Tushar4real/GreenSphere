const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  schools: [{ type: String }], // School names participating
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    school: { type: String },
    points: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now }
  }],
  prizes: [{
    position: { type: Number },
    title: { type: String },
    description: { type: String }
  }],
  status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'upcoming' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Competition', competitionSchema);