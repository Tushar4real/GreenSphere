const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['climate', 'biodiversity', 'pollution', 'sustainability', 'energy'], required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  estimatedTime: { type: Number, required: true }, // in minutes
  slides: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    quiz: {
      question: { type: String },
      options: [{ type: String }],
      correctAnswer: { type: Number },
      points: { type: Number, default: 5 }
    }
  }],
  totalPoints: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);