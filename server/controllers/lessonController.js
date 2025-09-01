const Lesson = require('../models/Lesson');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ isActive: true }).sort({ order: 1 });
    
    // Get user progress
    const userId = req.user.userId;
    const userProgress = await UserProgress.findOne({ user: userId }) || { lessonProgress: [] };
    
    const lessonsWithStatus = lessons.map(lesson => {
      const progress = userProgress.lessonProgress.find(p => p.lesson.toString() === lesson._id.toString());
      return {
        ...lesson.toObject(),
        completed: !!progress,
        pointsEarned: progress?.pointsEarned || 0,
        completedAt: progress?.completedAt
      };
    });
    
    res.json(lessonsWithStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson || !lesson.isActive) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    // Get user progress for this lesson
    const userProgress = await UserProgress.findOne({ user: req.user.userId });
    const lessonProgress = userProgress?.lessonProgress.find(p => p.lesson.toString() === lesson._id.toString());
    
    res.json({
      ...lesson.toObject(),
      completed: !!lessonProgress,
      slideProgress: lessonProgress?.slideProgress || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const userId = req.user.userId;
    const { points, slideProgress, timeSpent } = req.body;
    
    const lesson = await Lesson.findById(lessonId);
    const user = await User.findById(userId);
    
    if (!lesson || !user) {
      return res.status(404).json({ error: 'Lesson or user not found' });
    }
    
    // Get or create user progress
    let userProgress = await UserProgress.findOne({ user: userId });
    if (!userProgress) {
      userProgress = new UserProgress({ user: userId });
    }
    
    // Check if already completed
    const existingProgress = userProgress.lessonProgress.find(p => p.lesson.toString() === lessonId);
    if (existingProgress) {
      return res.status(400).json({ error: 'Lesson already completed' });
    }
    
    const pointsEarned = points || lesson.totalPoints;
    
    // Add lesson progress
    userProgress.lessonProgress.push({
      lesson: lessonId,
      pointsEarned,
      slideProgress: slideProgress || [],
      completedAt: new Date()
    });
    
    // Update daily activity
    const today = new Date().toDateString();
    let dailyActivity = userProgress.dailyActivity.find(d => d.date.toDateString() === today);
    if (!dailyActivity) {
      dailyActivity = { date: new Date(), pointsEarned: 0, lessonsCompleted: 0, timeSpent: 0 };
      userProgress.dailyActivity.push(dailyActivity);
    }
    dailyActivity.pointsEarned += pointsEarned;
    dailyActivity.lessonsCompleted += 1;
    dailyActivity.timeSpent += timeSpent || 0;
    
    // Update streak
    userProgress.updateStreak();
    
    // Update user stats
    user.points += pointsEarned;
    user.totalLessonsCompleted += 1;
    user.totalTimeSpent += timeSpent || 0;
    user.streakDays = userProgress.currentStreak;
    user.longestStreak = userProgress.longestStreak;
    user.completedLessons.push(lessonId);
    user.updateLevel();
    user.lastActivity = new Date();
    
    await Promise.all([userProgress.save(), user.save()]);
    
    res.json({ 
      message: 'Lesson completed successfully',
      pointsEarned,
      newLevel: user.level,
      totalPoints: user.points,
      currentStreak: userProgress.currentStreak
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitQuizAnswer = async (req, res) => {
  try {
    const { lessonId, slideIndex } = req.params;
    const { answer, timeSpent } = req.body;
    const userId = req.user.userId;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson || !lesson.slides[slideIndex] || !lesson.slides[slideIndex].quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = lesson.slides[slideIndex].quiz;
    const isCorrect = answer === quiz.correctAnswer;
    const pointsEarned = isCorrect ? quiz.points : 0;

    // Update user progress
    let userProgress = await UserProgress.findOne({ user: userId });
    if (!userProgress) {
      userProgress = new UserProgress({ user: userId });
    }
    
    // Find or create lesson progress
    let lessonProgress = userProgress.lessonProgress.find(p => p.lesson.toString() === lessonId);
    if (!lessonProgress) {
      lessonProgress = { lesson: lessonId, slideProgress: [] };
      userProgress.lessonProgress.push(lessonProgress);
    }
    
    // Update slide progress
    let slideProgress = lessonProgress.slideProgress.find(s => s.slideIndex === parseInt(slideIndex));
    if (!slideProgress) {
      slideProgress = { slideIndex: parseInt(slideIndex), completed: false };
      lessonProgress.slideProgress.push(slideProgress);
    }
    
    slideProgress.completed = true;
    slideProgress.quizScore = isCorrect ? 100 : 0;
    slideProgress.timeSpent = timeSpent || 0;
    
    if (isCorrect) {
      const user = await User.findById(userId);
      user.points += pointsEarned;
      user.updateLevel();
      user.lastActivity = new Date();
      await user.save();
    }
    
    await userProgress.save();

    res.json({
      correct: isCorrect,
      pointsEarned,
      explanation: quiz.explanation || (isCorrect ? 'Correct!' : 'Try again!')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};