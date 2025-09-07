const RealWorldTask = require('../models/RealWorldTask');
const TaskSubmission = require('../models/TaskSubmission');
const User = require('../models/User');
const { awardPoints } = require('./gamificationController');
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
    const { taskId, description, impact, location } = req.body;
    const userId = req.user.userId;
    
    const task = await RealWorldTask.findById(taskId);
    if (!task || !task.isAvailable()) {
      return res.status(404).json({ error: 'Task not found or not available' });
    }
    
    // Check if already submitted
    const existing = await TaskSubmission.findOne({
      user: userId,
      task: taskId,
      status: { $in: ['pending', 'approved'] }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Task already submitted' });
    }
    
    const proofPhotos = req.files ? req.files.map(file => `/uploads/task-proofs/${file.filename}`) : [];
    
    if (task.photoRequired && proofPhotos.length === 0) {
      return res.status(400).json({ error: 'Photo proof required' });
    }
    
    const submission = new TaskSubmission({
      user: userId,
      task: taskId,
      description,
      proofPhotos,
      location: location ? JSON.parse(location) : null,
      reportedImpact: impact ? JSON.parse(impact) : {},
      status: task.verificationRequired ? 'pending' : 'approved'
    });
    
    await submission.save();
    
    // Auto-approve if no verification needed
    if (!task.verificationRequired) {
      const pointsResult = await awardPoints(
        userId,
        task.points,
        task.ecoPoints,
        'task_completed',
        taskId
      );
      
      submission.pointsAwarded = pointsResult.pointsAwarded;
      submission.ecoPointsAwarded = pointsResult.ecoPointsAwarded;
      await submission.save();
      
      const user = await User.findById(userId);
      user.totalTasksCompleted += 1;
      user.totalRealWorldTasksCompleted += 1;
      await user.save();
      
      return res.json({
        message: 'Task completed!',
        pointsAwarded: pointsResult.pointsAwarded,
        newBadges: pointsResult.newBadges
      });
    }
    
    res.json({ message: 'Task submitted for verification' });
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
    
    if (!submission || submission.status !== 'pending') {
      return res.status(404).json({ error: 'Submission not found or already reviewed' });
    }
    
    submission.status = status;
    submission.verificationNotes = feedback;
    submission.verifiedBy = reviewerId;
    submission.verifiedAt = new Date();
    
    if (status === 'approved') {
      const pointsResult = await awardPoints(
        submission.user._id,
        submission.task.points,
        submission.task.ecoPoints,
        'task_completed',
        submission.task._id
      );
      
      submission.pointsAwarded = pointsResult.pointsAwarded;
      submission.ecoPointsAwarded = pointsResult.ecoPointsAwarded;
      
      const user = submission.user;
      user.totalTasksCompleted += 1;
      user.totalRealWorldTasksCompleted += 1;
      
      // Update impact metrics
      if (submission.reportedImpact) {
        user.treesPlanted += submission.reportedImpact.treesPlanted || 0;
        user.wasteCollected += submission.reportedImpact.wasteCollected || 0;
        user.energySaved += submission.reportedImpact.energySaved || 0;
        user.carbonFootprintReduced += submission.reportedImpact.carbonReduced || 0;
      }
      
      await user.save();
      
      return res.json({
        message: 'Task approved!',
        pointsAwarded: pointsResult.pointsAwarded,
        newBadges: pointsResult.newBadges
      });
    }
    
    await submission.save();
    res.json({ message: `Submission ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const submissions = await TaskSubmission.find({ user: userId })
      .populate('task')
      .sort({ createdAt: -1 });
    
    const availableTasks = await RealWorldTask.find({ isActive: true });
    const completedTaskIds = submissions.filter(s => s.status === 'approved').map(s => s.task._id.toString());
    
    const tasksWithProgress = availableTasks.map(task => {
      const submission = submissions.find(s => s.task._id.toString() === task._id.toString());
      return {
        ...task.toObject(),
        isCompleted: completedTaskIds.includes(task._id.toString()),
        submission: submission || null,
        canSubmit: task.isAvailable() && !submission
      };
    });
    
    res.json({
      tasks: tasksWithProgress,
      submissions,
      stats: {
        total: availableTasks.length,
        completed: completedTaskIds.length,
        pending: submissions.filter(s => s.status === 'pending').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};