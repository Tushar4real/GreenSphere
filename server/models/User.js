const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  cognitoId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
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
  points: { type: Number, default: 0 },
  impactPoints: { type: Number, default: 0 },
  level: { type: String, default: 'Seedling' },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EarnedBadge' }],
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  completedQuizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  submittedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  isActive: { type: Boolean, default: true },
  streakDays: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  profilePicture: String,
  
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

// Calculate level based on points
userSchema.methods.updateLevel = function() {
  if (this.points >= 601) this.level = 'Planet Saver';
  else if (this.points >= 301) this.level = 'Tree';
  else if (this.points >= 101) this.level = 'Sapling';
  else this.level = 'Seedling';
};

module.exports = mongoose.model('User', userSchema);