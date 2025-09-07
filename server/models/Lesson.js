const mongoose = require('mongoose');

// Lesson Progress Schema for tracking user progress through lessons
const lessonProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  
  // Progress Tracking
  currentSlide: { type: Number, default: 0 },
  completedSlides: [{ type: Number }],
  totalSlides: { type: Number },
  
  // Performance
  score: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in seconds
  
  // Quiz Results
  quizResults: [{
    slideIndex: { type: Number },
    question: { type: String },
    userAnswer: { type: Number },
    correctAnswer: { type: Number },
    isCorrect: { type: Boolean },
    pointsEarned: { type: Number },
    timeSpent: { type: Number }
  }],
  
  // Status
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  completedAt: { type: Date },
  
  // Attempts
  attemptCount: { type: Number, default: 1 },
  bestScore: { type: Number, default: 0 }
}, {
  timestamps: true
});

const LessonProgress = mongoose.models.LessonProgress || mongoose.model('LessonProgress', lessonProgressSchema);

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['climate', 'biodiversity', 'pollution', 'sustainability', 'energy', 'water', 'recycling'], required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  estimatedTime: { type: Number, required: true }, // in minutes
  
  // Enhanced Content Structure
  slides: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    videoUrl: { type: String },
    
    // Interactive Elements
    interactiveType: { type: String, enum: ['text', 'quiz', 'scenario', 'drag-drop', 'matching'], default: 'text' },
    
    // Quiz/Interactive Content
    quiz: {
      question: { type: String },
      type: { type: String, enum: ['multiple-choice', 'true-false', 'scenario', 'drag-drop'], default: 'multiple-choice' },
      options: [{ type: String }],
      correctAnswer: { type: Number },
      explanation: { type: String },
      points: { type: Number, default: 5 },
      hint: { type: String }
    },
    
    // Scenario-based learning
    scenario: {
      situation: { type: String },
      choices: [{
        text: { type: String },
        outcome: { type: String },
        points: { type: Number },
        isCorrect: { type: Boolean }
      }]
    },
    
    // Fun Facts and Tips
    funFact: { type: String },
    actionTip: { type: String }
  }],
  
  // Points and Rewards
  totalPoints: { type: Number, default: 0 },
  ecoPoints: { type: Number, default: 0 },
  
  // Prerequisites and Progression
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  unlocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  
  // Gamification
  badge: {
    name: { type: String },
    icon: { type: String },
    description: { type: String }
  },
  
  // Learning Objectives
  learningObjectives: [{ type: String }],
  keyTakeaways: [{ type: String }],
  
  // Statistics
  completionCount: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  averageTimeSpent: { type: Number, default: 0 },
  
  // Content Metadata
  tags: [{ type: String }],
  ageGroup: { type: String, enum: ['6-10', '11-14', '15-18', 'all'], default: 'all' },
  
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  
  // Created by (teacher/admin)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Calculate total points before saving
lessonSchema.pre('save', function(next) {
  this.totalPoints = this.slides.reduce((sum, slide) => {
    return sum + (slide.quiz?.points || 0);
  }, 0);
  next();
});

// Get difficulty multiplier
lessonSchema.methods.getDifficultyMultiplier = function() {
  switch(this.difficulty) {
    case 'advanced': return 1.5;
    case 'intermediate': return 1.2;
    case 'beginner': return 1.0;
    default: return 1.0;
  }
};

// Check if lesson is unlocked for user
lessonSchema.methods.isUnlockedForUser = async function(userId) {
  if (this.prerequisites.length === 0) return true;
  
  const User = require('./User');
  const user = await User.findById(userId).populate('completedLessons');
  
  const completedLessonIds = user.completedLessons.map(lesson => lesson._id.toString());
  const prerequisiteIds = this.prerequisites.map(prereq => prereq.toString());
  
  return prerequisiteIds.every(prereqId => completedLessonIds.includes(prereqId));
};

module.exports = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);