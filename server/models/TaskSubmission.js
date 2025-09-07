const mongoose = require('mongoose');

const taskSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'RealWorldTask', required: true },
  description: { type: String, required: true },
  proofFiles: [{
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true }
  }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  feedback: { type: String },
  pointsAwarded: { type: Number, default: 0 },
  badgeAwarded: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.models.TaskSubmission || mongoose.model('TaskSubmission', taskSubmissionSchema);