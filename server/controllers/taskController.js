const Task = require('../models/Task');
const TaskSubmission = require('../models/TaskSubmission');
const User = require('../models/User');
const Badge = require('../models/Badge');

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true })
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitTask = async (req, res) => {
  try {
    const { taskId, description } = req.body;
    const userId = req.user.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const existingSubmission = await TaskSubmission.findOne({
      task: taskId,
      student: userId
    });

    if (existingSubmission) {
      return res.status(400).json({ error: 'Task already submitted' });
    }

    const submission = new TaskSubmission({
      task: taskId,
      student: userId,
      proofFile: req.file ? req.file.filename : null,
      description
    });

    await submission.save();
    res.status(201).json({ message: 'Task submitted successfully', submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingSubmissions = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const submissions = await TaskSubmission.find({ status: 'pending' })
      .populate('task', 'title points category')
      .populate('student', 'name email school')
      .sort({ submissionDate: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reviewSubmission = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { submissionId } = req.params;
    const { status, comment } = req.body;

    const submission = await TaskSubmission.findById(submissionId)
      .populate('task')
      .populate('student');

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submission.status = status;
    submission.reviewComment = comment;
    submission.reviewedBy = req.user.userId;
    submission.reviewDate = new Date();

    if (status === 'approved') {
      submission.pointsAwarded = submission.task.points;
      
      const student = await User.findById(submission.student._id);
      student.points += submission.task.points;
      student.updateLevel();
      
      await checkAndAwardBadges(student);
      await student.save();
    }

    await submission.save();
    res.json({ message: 'Submission reviewed successfully', submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSpecialTask = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { title, description, category, points, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      category,
      points,
      isSpecial: true,
      assignedBy: req.user.userId,
      assignedTo: assignedTo || []
    });

    await task.save();
    res.status(201).json({ message: 'Special task created successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignTask = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { taskId, studentIds } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.assignedTo = [...new Set([...task.assignedTo, ...studentIds])];
    await task.save();

    res.json({ message: 'Task assigned successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function checkAndAwardBadges(user) {
  const badges = await Badge.find({ isActive: true });
  
  for (const badge of badges) {
    if (user.badges.includes(badge._id)) continue;
    
    let shouldAward = false;
    
    switch (badge.criteria.type) {
      case 'tasks_completed':
        const completedTasks = await TaskSubmission.countDocuments({
          student: user._id,
          status: 'approved'
        });
        shouldAward = completedTasks >= badge.criteria.value;
        break;
      case 'points_earned':
        shouldAward = user.points >= badge.criteria.value;
        break;
    }
    
    if (shouldAward) {
      user.badges.push(badge._id);
    }
  }
}