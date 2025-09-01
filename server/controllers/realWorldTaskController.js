const RealWorldTask = require('../models/RealWorldTask');
const TaskSubmission = require('../models/TaskSubmission');
const EarnedBadge = require('../models/EarnedBadge');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/task-proofs/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

exports.uploadMiddleware = upload.array('proofFiles', 5);

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await RealWorldTask.find({ isActive: true }).sort({ difficulty: 1, points: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitTask = async (req, res) => {
  try {
    const { taskId, description } = req.body;
    const userId = req.user.userId;
    
    const task = await RealWorldTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const proofFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    }));
    
    const submission = new TaskSubmission({
      user: userId,
      task: taskId,
      description,
      proofFiles
    });
    
    await submission.save();
    
    res.status(201).json({
      message: 'Task submitted successfully',
      submission: submission._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const submissions = await TaskSubmission.find(filter)
      .populate('user', 'name email school')
      .populate('task', 'title category difficulty points badge')
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reviewSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, feedback } = req.body;
    const reviewerId = req.user.userId;
    
    const submission = await TaskSubmission.findById(submissionId)
      .populate('user')
      .populate('task');
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    submission.status = status;
    submission.feedback = feedback;
    submission.reviewedBy = reviewerId;
    submission.reviewedAt = new Date();
    
    if (status === 'approved') {
      // Award impact points (separate from regular points)
      submission.pointsAwarded = submission.task.points;
      submission.user.impactPoints += submission.task.points;
      submission.user.totalRealWorldTasksCompleted += 1;
      
      // Award task-specific badge
      const earnedBadge = new EarnedBadge({
        user: submission.user._id,
        task: submission.task._id,
        submission: submission._id,
        badgeName: submission.task.badge.name,
        badgeIcon: submission.task.badge.icon,
        badgeDescription: submission.task.badge.description
      });
      
      await earnedBadge.save();
      submission.badgeAwarded = true;
      submission.user.badges.push(earnedBadge._id);
      
      // Check for impact point milestone badges
      const impactBadgeThresholds = [
        { points: 500, name: 'Earth Defender', icon: '🛡️', description: 'Committed environmental protector' },
        { points: 1000, name: 'Planet Guardian', icon: '🌍', description: 'Dedicated guardian of our planet' },
        { points: 2000, name: 'Climate Hero', icon: '🦸', description: 'Hero in the fight against climate change' },
        { points: 3500, name: 'Eco Legend', icon: '👑', description: 'Legendary environmental champion' },
        { points: 5000, name: 'Earth Savior', icon: '✨', description: 'Ultimate savior of our planet' }
      ];
      
      const previousImpactPoints = submission.user.impactPoints - submission.task.points;
      for (const threshold of impactBadgeThresholds) {
        if (submission.user.impactPoints >= threshold.points && previousImpactPoints < threshold.points) {
          const milestoneEarnedBadge = new EarnedBadge({
            user: submission.user._id,
            task: null,
            submission: submission._id,
            badgeName: threshold.name,
            badgeIcon: threshold.icon,
            badgeDescription: threshold.description
          });
          await milestoneEarnedBadge.save();
          submission.user.badges.push(milestoneEarnedBadge._id);
        }
      }
      
      await submission.user.save();
    }
    
    await submission.save();
    
    res.json({
      message: `Submission ${status} successfully`,
      pointsAwarded: submission.pointsAwarded,
      badgeAwarded: submission.badgeAwarded
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const submissions = await TaskSubmission.find({ user: userId })
      .populate('task', 'title category difficulty points badge')
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};