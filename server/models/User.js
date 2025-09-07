const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  cognitoId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String }, // For local authentication fallback
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  school: { type: String },
  grade: { type: String },
  class: { type: String },
  // Teacher request system
  teacherRequest: {
    status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    requestedAt: Date,
    reviewedAt: Date,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String
  },
  // Teacher-specific fields
  assignedClasses: [String],
  // Admin-specific fields
  permissions: [String],
  // Enhanced Points System
  points: { type: Number, default: 0 },
  ecoPoints: { type: Number, default: 0 }, // Separate eco-impact points
  impactPoints: { type: Number, default: 0 },
  level: { type: String, default: 'Seedling' },
  levelNumber: { type: Number, default: 1 },
  
  // Gamification Features
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EarnedBadge' }],
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  completedQuizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  submittedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  
  // Activity Tracking
  isActive: { type: Boolean, default: true },
  streakDays: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  profilePicture: String,
  
  // Multipliers and Bonuses
  streakMultiplier: { type: Number, default: 1.0 },
  weeklyGoal: { type: Number, default: 100 }, // Weekly points goal
  weeklyProgress: { type: Number, default: 0 },
  weekStartDate: { type: Date, default: Date.now },
  
  // Competition Participation
  activeCompetitions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competition' }],
  competitionPoints: { type: Number, default: 0 },
  
  // Real-world Impact Tracking
  treesPlanted: { type: Number, default: 0 },
  wasteCollected: { type: Number, default: 0 }, // in kg
  energySaved: { type: Number, default: 0 }, // in kWh
  carbonFootprintReduced: { type: Number, default: 0 }, // in kg CO2
  
  // Enhanced Progress Tracking
  totalLessonsCompleted: { type: Number, default: 0 },
  totalQuizzesCompleted: { type: Number, default: 0 },
  totalTasksCompleted: { type: Number, default: 0 },
  totalRealWorldTasksCompleted: { type: Number, default: 0 },
  averageQuizScore: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 }, // in minutes
  longestStreak: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Update streak on activity
userSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastActivity = new Date(this.lastActivity);
  const daysDiff = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day
    this.streakDays += 1;
    if (this.streakDays > this.longestStreak) {
      this.longestStreak = this.streakDays;
    }
  } else if (daysDiff > 1) {
    // Streak broken
    this.streakDays = 1;
  }
  // If daysDiff === 0, same day activity, no change
  
  this.lastActivity = now;
  this.updateStreakMultiplier();
};

// Enhanced level calculation with more granular progression
userSchema.methods.updateLevel = function() {
  const totalPoints = this.points + this.ecoPoints;
  
  if (totalPoints >= 2000) {
    this.level = 'Planet Guardian';
    this.levelNumber = 8;
  } else if (totalPoints >= 1500) {
    this.level = 'Eco Champion';
    this.levelNumber = 7;
  } else if (totalPoints >= 1000) {
    this.level = 'Planet Saver';
    this.levelNumber = 6;
  } else if (totalPoints >= 700) {
    this.level = 'Green Warrior';
    this.levelNumber = 5;
  } else if (totalPoints >= 400) {
    this.level = 'Tree';
    this.levelNumber = 4;
  } else if (totalPoints >= 200) {
    this.level = 'Sapling';
    this.levelNumber = 3;
  } else if (totalPoints >= 50) {
    this.level = 'Sprout';
    this.levelNumber = 2;
  } else {
    this.level = 'Seedling';
    this.levelNumber = 1;
  }
};

// Calculate streak multiplier
userSchema.methods.updateStreakMultiplier = function() {
  if (this.streakDays >= 30) this.streakMultiplier = 2.0;
  else if (this.streakDays >= 14) this.streakMultiplier = 1.5;
  else if (this.streakDays >= 7) this.streakMultiplier = 1.3;
  else if (this.streakDays >= 3) this.streakMultiplier = 1.1;
  else this.streakMultiplier = 1.0;
};

// Add points with multiplier
userSchema.methods.addPoints = function(basePoints, isEcoAction = false) {
  const multipliedPoints = Math.floor(basePoints * this.streakMultiplier);
  
  if (isEcoAction) {
    this.ecoPoints += multipliedPoints;
  } else {
    this.points += multipliedPoints;
  }
  
  this.weeklyProgress += multipliedPoints;
  this.updateLevel();
  
  return multipliedPoints;
};

// Reset weekly progress
userSchema.methods.resetWeeklyProgress = function() {
  const now = new Date();
  const weekStart = new Date(this.weekStartDate);
  const daysDiff = Math.floor((now - weekStart) / (1000 * 60 * 60 * 24));
  
  if (daysDiff >= 7) {
    this.weeklyProgress = 0;
    this.weekStartDate = now;
  }
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);