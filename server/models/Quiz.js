const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['climate', 'biodiversity', 'pollution', 'sustainability', 'energy'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  timeLimit: { type: Number, default: 300 }, // in seconds
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Teacher who created the quiz
  questions: [{
    question: { type: String, required: true },
    type: { type: String, enum: ['multiple-choice', 'true-false', 'scenario'], default: 'multiple-choice' },
    options: [{ type: String }],
    correctAnswer: { type: Number, required: true },
    points: { type: Number, default: 10 },
    explanation: { type: String }
  }],
  totalPoints: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Calculate total points before saving
quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  next();
});

module.exports = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);