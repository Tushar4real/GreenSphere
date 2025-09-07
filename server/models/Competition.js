const mongoose = require('mongoose');

// Competition Activity Log Schema
const competitionActivitySchema = new mongoose.Schema({
  competition: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  school: { type: String, required: true },
  
  activityType: { type: String, enum: ['lesson_completed', 'task_completed', 'quiz_completed'], required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId }, // ID of lesson/task/quiz
  activityTitle: { type: String },
  
  pointsEarned: { type: Number, default: 0 },
  ecoPointsEarned: { type: Number, default: 0 },
  
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const CompetitionActivity = mongoose.models.CompetitionActivity || mongoose.model('CompetitionActivity', competitionActivitySchema);

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // Competition Type
  type: { type: String, enum: ['school', 'individual', 'team'], default: 'school' },
  category: { type: String, enum: ['general', 'planting', 'cleaning', 'energy', 'awareness'], default: 'general' },
  
  // School Participation
  schools: [{
    name: { type: String, required: true },
    totalPoints: { type: Number, default: 0 },
    participantCount: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    // School-specific metrics
    tasksCompleted: { type: Number, default: 0 },
    lessonsCompleted: { type: Number, default: 0 },
    ecoImpact: {
      treesPlanted: { type: Number, default: 0 },
      wasteCollected: { type: Number, default: 0 },
      energySaved: { type: Number, default: 0 },
      carbonReduced: { type: Number, default: 0 }
    }
  }],
  
  // Individual Participants
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    school: { type: String },
    points: { type: Number, default: 0 },
    ecoPoints: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    tasksCompleted: { type: Number, default: 0 },
    lessonsCompleted: { type: Number, default: 0 },
    rank: { type: Number }
  }],
  
  // Competition Rules
  rules: [{ type: String }],
  pointsMultiplier: { type: Number, default: 1.0 },
  allowedActivities: [{ type: String }], // ['lessons', 'tasks', 'quizzes']
  
  // Prizes and Rewards
  prizes: [{
    category: { type: String, enum: ['school', 'individual'] },
    position: { type: Number },
    title: { type: String },
    description: { type: String },
    badge: {
      name: { type: String },
      icon: { type: String },
      rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'] }
    }
  }],
  
  // Competition Statistics
  totalParticipants: { type: Number, default: 0 },
  totalSchools: { type: Number, default: 0 },
  totalPointsAwarded: { type: Number, default: 0 },
  totalTasksCompleted: { type: Number, default: 0 },
  
  // Status and Visibility
  status: { type: String, enum: ['upcoming', 'active', 'completed', 'cancelled'], default: 'upcoming' },
  isPublic: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  
  // Competition Image
  bannerImage: { type: String },
  
  // Created by (admin/teacher)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Update competition status based on dates
competitionSchema.methods.updateStatus = function() {
  const now = new Date();
  
  if (now < this.startDate) {
    this.status = 'upcoming';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = 'active';
  } else {
    this.status = 'completed';
  }
};

// Get school leaderboard
competitionSchema.methods.getSchoolLeaderboard = function() {
  return this.schools
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((school, index) => ({
      ...school.toObject(),
      rank: index + 1
    }));
};

// Get individual leaderboard
competitionSchema.methods.getIndividualLeaderboard = function() {
  return this.participants
    .sort((a, b) => (b.points + b.ecoPoints) - (a.points + a.ecoPoints))
    .map((participant, index) => ({
      ...participant.toObject(),
      rank: index + 1,
      totalPoints: participant.points + participant.ecoPoints
    }));
};

// Add participant to competition
competitionSchema.methods.addParticipant = function(user) {
  // Check if user already participating
  const existingParticipant = this.participants.find(p => p.user.toString() === user._id.toString());
  if (existingParticipant) {
    throw new Error('User already participating in this competition');
  }
  
  // Add to participants
  this.participants.push({
    user: user._id,
    school: user.school,
    points: 0,
    ecoPoints: 0
  });
  
  // Update or add school
  let school = this.schools.find(s => s.name === user.school);
  if (school) {
    school.participantCount += 1;
  } else {
    this.schools.push({
      name: user.school,
      participantCount: 1
    });
  }
  
  this.totalParticipants += 1;
  this.totalSchools = this.schools.length;
};

module.exports = mongoose.models.Competition || mongoose.model('Competition', competitionSchema);