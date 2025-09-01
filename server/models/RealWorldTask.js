const mongoose = require('mongoose');

const realWorldTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['planting', 'cleaning', 'conservation', 'energy', 'awareness'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  points: { type: Number, required: true },
  badge: {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true }
  },
  requirements: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('RealWorldTask', realWorldTaskSchema);