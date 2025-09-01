const User = require('../models/User');
const Quiz = require('../models/Quiz');
const UserBadge = require('../models/UserBadge');

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