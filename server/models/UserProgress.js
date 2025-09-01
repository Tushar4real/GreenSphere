const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Lesson Progress
  lessonProgress: [{
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    completedAt: { type: Date, default: Date.now },
    pointsEarned: { type: Number, default: 0 },
    slideProgress: [{
      slideIndex: Number,
      completed: Boolean,
      quizScore: Number,
      timeSpent: Number // in seconds
    }]
  }],
  
  // Quiz Progress
  quizProgress: [{
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    attempts: [{
      completedAt: { type: Date, default: Date.now },
      score: Number,
      totalQuestions: Number,
      correctAnswers: Number,
      timeSpent: Number,
      answers: [{
        questionIndex: Number,
        selectedAnswer: Number,
        isCorrect: Boolean,
        pointsEarned: Number
      }]
    }],
    bestScore: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 }
  }],
  
  // Daily Activity Tracking
  dailyActivity: [{
    date: { type: Date, default: Date.now },
    pointsEarned: { type: Number, default: 0 },
    lessonsCompleted: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 } // in minutes
  }],
  
  // Streak Tracking
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityDate: { type: Date, default: Date.now },
  
  // Overall Stats
  totalPointsEarned: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 }, // in minutes
  averageScore: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Update streak when activity is recorded
userProgressSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActivity = new Date(this.lastActivityDate);
  
  // Check if last activity was yesterday
  const diffTime = Math.abs(today - lastActivity);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    this.currentStreak += 1;
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }
  } else if (diffDays > 1) {
    this.currentStreak = 1; // Reset streak but count today
  }
  
  this.lastActivityDate = today;
};

module.exports = mongoose.model('UserProgress', userProgressSchema);