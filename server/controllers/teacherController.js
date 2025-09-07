const User = require('../models/User');
const Quiz = require('../models/Quiz');
const UserBadge = require('../models/UserBadge');
const TaskSubmission = require('../models/TaskSubmission');

const TEACHER_CODES = {
  'TEACH2024': 'General Teaching',
  'ENVIRO123': 'Environmental Science',
  'BIO2024': 'Biology',
  'CHEM2024': 'Chemistry',
  'GEO2024': 'Geography',
  'EARTH2024': 'Earth Science',
  'SUSTAIN2024': 'Sustainability Studies'
};

exports.getStudentCount = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student', isActive: true });
    res.json({ count: studentCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isActive: true })
      .select('name email points level totalLessonsCompleted totalQuizzesCompleted totalTasksCompleted averageQuizScore')
      .sort({ points: -1 });
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherRequests = async (req, res) => {
  try {
    const requests = await User.find({ 
      'teacherRequest.status': 'pending' 
    }).select('name email teacherRequest createdAt');
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions, badge } = req.body;
    const teacherId = req.user.userId;
    
    const quiz = new Quiz({
      title,
      description,
      category: 'sustainability', // Default category
      teacher: teacherId,
      questions,
      badge: badge || null
    });
    
    await quiz.save();
    
    res.status(201).json({
      message: 'Quiz created successfully',
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        totalPoints: quiz.totalPoints,
        badge: quiz.badge
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherQuizzes = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const quizzes = await Quiz.find({ teacher: teacherId })
      .select('title description totalPoints badge createdAt isActive')
      .sort({ createdAt: -1 });
    
    // Get attempt counts for each quiz
    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const attemptCount = await UserBadge.countDocuments({ quiz: quiz._id });
        const badgeCount = await UserBadge.countDocuments({ 
          quiz: quiz._id,
          score: { $gte: quiz.badge?.minScore || 80 }
        });
        
        return {
          ...quiz.toObject(),
          attempts: attemptCount,
          badgesEarned: badgeCount
        };
      })
    );
    
    res.json(quizzesWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestTeacherRole = async (req, res) => {
  try {
    const { teacherCode, email, name, fieldOfStudy } = req.body;
    const userId = req.user.userId;

    if (!teacherCode || !email || !name || !fieldOfStudy) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!TEACHER_CODES[teacherCode]) {
      return res.status(400).json({ error: 'Invalid teacher code' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'teacher' || user.role === 'admin') {
      return res.status(400).json({ error: 'You already have elevated privileges' });
    }

    if (user.teacherRequest && user.teacherRequest.status === 'pending') {
      return res.status(400).json({ error: 'You already have a pending teacher request' });
    }

    user.teacherRequest = {
      status: 'pending',
      requestedAt: new Date(),
      teacherCode,
      fieldOfStudy,
      verifiedCode: TEACHER_CODES[teacherCode]
    };

    await user.save();

    res.json({ 
      message: 'Teacher request submitted successfully. Please wait for admin approval.',
      requestId: user._id
    });
  } catch (error) {
    console.error('Teacher request error:', error);
    res.status(500).json({ error: 'Failed to submit teacher request' });
  }
};

exports.getPendingSubmissions = async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({ status: 'pending' })
      .populate('student', 'name email')
      .populate('task', 'title points')
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    
    const submission = await TaskSubmission.findById(id)
      .populate('student')
      .populate('task');
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    submission.status = 'approved';
    submission.reviewedAt = new Date();
    submission.reviewedBy = req.user.userId;
    await submission.save();
    
    // Award points to student
    const student = await User.findById(submission.student._id);
    if (student) {
      student.points += submission.task.points;
      student.totalTasksCompleted += 1;
      await student.save();
    }
    
    res.json({ message: 'Submission approved successfully', submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    
    const submission = await TaskSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    submission.status = 'rejected';
    submission.feedback = feedback;
    submission.reviewedAt = new Date();
    submission.reviewedBy = req.user.userId;
    await submission.save();
    
    res.json({ message: 'Submission rejected with feedback', submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};