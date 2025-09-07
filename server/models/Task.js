const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['energy', 'water', 'waste', 'transport', 'nature'], required: true },
  points: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  requiresProof: { type: Boolean, default: true },
  proofType: { type: String, enum: ['photo', 'video', 'text'], default: 'photo' },
  isSpecial: { type: Boolean, default: false },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);