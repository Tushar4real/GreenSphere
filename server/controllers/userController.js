const User = require('../models/User');
const TaskSubmission = require('../models/TaskSubmission');
const UserProgress = require('../models/UserProgress');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Task = require('../models/Task');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('badges', 'name icon color description')
      .select('-cognitoId');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, school, grade } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (school) user.school = school;
    if (grade) user.grade = grade;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).populate('badges');
    const userProgress = await UserProgress.findOne({ user: userId }) || { dailyActivity: [], lessonProgress: [], quizProgress: [] };
    
    const completedTasks = await TaskSubmission.countDocuments({
      student: userId,
      status: 'approved'
    });

    const pendingTasks = await TaskSubmission.countDocuments({
      student: userId,
      status: 'pending'
    });
    
    // Calculate progress percentages
    const totalLessons = await Lesson.countDocuments({ isActive: true });
    const totalQuizzes = await Quiz.countDocuments({ isActive: true });
    const totalTasks = await Task.countDocuments({ isActive: true });
    
    const lessonProgress = totalLessons > 0 ? Math.round((user.totalLessonsCompleted / totalLessons) * 100) : 0;
    const quizProgress = totalQuizzes > 0 ? Math.round((user.totalQuizzesCompleted / totalQuizzes) * 100) : 0;
    const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivity = userProgress.dailyActivity.filter(activity => 
      new Date(activity.date) >= sevenDaysAgo
    );
    
    const weeklyPoints = recentActivity.reduce((sum, day) => sum + day.pointsEarned, 0);
    const weeklyTimeSpent = recentActivity.reduce((sum, day) => sum + day.timeSpent, 0);

    res.json({
      points: user.points,
      level: user.level,
      badges: user.badges.length,
      completedLessons: user.totalLessonsCompleted,
      completedQuizzes: user.totalQuizzesCompleted,
      completedTasks,
      pendingTasks,
      streakDays: user.streakDays,
      longestStreak: user.longestStreak,
      averageQuizScore: Math.round(user.averageQuizScore || 0),
      totalTimeSpent: user.totalTimeSpent,
      progressPercentages: {
        lessons: lessonProgress,
        quizzes: quizProgress,
        tasks: taskProgress,
        overall: Math.round((lessonProgress + quizProgress + taskProgress) / 3)
      },
      weeklyStats: {
        points: weeklyPoints,
        timeSpent: weeklyTimeSpent,
        activeDays: recentActivity.length
      },
      recentActivity: recentActivity.slice(-5).reverse() // Last 5 days
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = await User.find()
      .select('-cognitoId')
      .populate('badges', 'name icon')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClassStudents = async (req, res) => {
  try {
    const { className } = req.params;
    
    const students = await User.find({
      role: 'student',
      class: className
    }).select('name email points level badges');

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.awardBonusPoints = async (req, res) => {
  try {
    const { points, reason } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.points += points;
    user.updateLevel();
    await user.save();

    res.json({ message: 'Bonus points awarded', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};