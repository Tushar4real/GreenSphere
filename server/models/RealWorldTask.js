const mongoose = require('mongoose');

// Task Submission Schema for tracking user submissions
const taskSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'RealWorldTask', required: true },
  
  // Submission Details
  proofPhotos: [{ type: String }], // URLs to uploaded photos
  description: { type: String, required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String }
  },
  
  // Verification
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verificationNotes: { type: String },
  verifiedAt: { type: Date },
  
  // Points Awarded
  pointsAwarded: { type: Number, default: 0 },
  ecoPointsAwarded: { type: Number, default: 0 },
  
  // Impact Tracking
  reportedImpact: {
    treesPlanted: { type: Number, default: 0 },
    wasteCollected: { type: Number, default: 0 },
    energySaved: { type: Number, default: 0 },
    carbonReduced: { type: Number, default: 0 }
  },
  
  // User Rating
  userRating: { type: Number, min: 1, max: 5 },
  userFeedback: { type: String }
}, {
  timestamps: true
});

const TaskSubmission = mongoose.models.TaskSubmission || mongoose.model('TaskSubmission', taskSubmissionSchema);

const realWorldTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['planting', 'cleaning', 'conservation', 'energy', 'awareness', 'recycling', 'water'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  
  // Enhanced Points System
  points: { type: Number, required: true },
  ecoPoints: { type: Number, required: true }, // Environmental impact points
  
  // Impact Metrics
  impactMetrics: {
    treesPlanted: { type: Number, default: 0 },
    wasteCollected: { type: Number, default: 0 }, // in kg
    energySaved: { type: Number, default: 0 }, // in kWh
    carbonReduced: { type: Number, default: 0 } // in kg CO2
  },
  
  // Verification Requirements
  verificationRequired: { type: Boolean, default: true },
  verificationInstructions: { type: String },
  photoRequired: { type: Boolean, default: true },
  locationRequired: { type: Boolean, default: false },
  
  // Badge System
  badge: {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' }
  },
  
  // Task Details
  requirements: [{ type: String }],
  estimatedTime: { type: Number }, // in minutes
  maxParticipants: { type: Number }, // for group tasks
  
  // Gamification
  completionCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  
  // Seasonal/Event Tasks
  isSeasonalTask: { type: Boolean, default: false },
  availableFrom: { type: Date },
  availableUntil: { type: Date },
  
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Calculate difficulty multiplier
realWorldTaskSchema.methods.getDifficultyMultiplier = function() {
  switch(this.difficulty) {
    case 'hard': return 1.5;
    case 'medium': return 1.2;
    case 'easy': return 1.0;
    default: return 1.0;
  }
};

// Check if task is currently available
realWorldTaskSchema.methods.isAvailable = function() {
  if (!this.isActive) return false;
  
  const now = new Date();
  if (this.availableFrom && now < this.availableFrom) return false;
  if (this.availableUntil && now > this.availableUntil) return false;
  
  return true;
};

module.exports = mongoose.models.RealWorldTask || mongoose.model('RealWorldTask', realWorldTaskSchema);