const Quiz = require('../models/Quiz');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .populate('teacher', 'name')
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 });
    
    // Get user progress
    const userId = req.user.userId;
    const userProgress = await UserProgress.findOne({ user: userId }) || { quizProgress: [] };
    
    const quizzesWithStatus = quizzes.map(quiz => {
      const progress = userProgress.quizProgress.find(p => p.quiz.toString() === quiz._id.toString());
      return {
        ...quiz.toObject(),
        completed: !!progress && progress.attempts.length > 0,
        bestScore: progress?.bestScore || 0,
        attempts: progress?.totalAttempts || 0,
        lastAttempt: progress?.attempts[progress.attempts.length - 1]?.completedAt,
        teacher: quiz.teacher || null,
        badge: quiz.badge || null
      };
    });
    
    res.json(quizzesWithStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('teacher', 'name')
      .select('-questions.correctAnswer -questions.explanation');
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const { answers, timeSpent } = req.body;
    const userId = req.user.userId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const user = await User.findById(userId);
    
    // Get or create user progress
    let userProgress = await UserProgress.findOne({ user: userId });
    if (!userProgress) {
      userProgress = new UserProgress({ user: userId });
    }
    
    let totalPoints = 0;
    let correctAnswers = 0;
    const results = [];
    const attemptAnswers = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      const pointsEarned = isCorrect ? question.points : 0;
      
      if (isCorrect) correctAnswers++;
      totalPoints += pointsEarned;
      
      results.push({
        questionIndex: index,
        correct: isCorrect,
        userAnswer,
        correctAnswer: question.correctAnswer,
        pointsEarned,
        explanation: question.explanation
      });
      
      attemptAnswers.push({
        questionIndex: index,
        selectedAnswer: userAnswer,
        isCorrect,
        pointsEarned
      });
    });
    
    const percentage = Math.round((totalPoints / quiz.totalPoints) * 100);
    
    // Find or create quiz progress
    let quizProgress = userProgress.quizProgress.find(p => p.quiz.toString() === quizId);
    if (!quizProgress) {
      quizProgress = { quiz: quizId, attempts: [], bestScore: 0, totalAttempts: 0 };
      userProgress.quizProgress.push(quizProgress);
    }
    
    // Add attempt
    quizProgress.attempts.push({
      completedAt: new Date(),
      score: percentage,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent: timeSpent || 0,
      answers: attemptAnswers
    });
    
    quizProgress.totalAttempts += 1;
    if (percentage > quizProgress.bestScore) {
      quizProgress.bestScore = percentage;
    }
    
    // Update daily activity
    const today = new Date().toDateString();
    let dailyActivity = userProgress.dailyActivity.find(d => d.date.toDateString() === today);
    if (!dailyActivity) {
      dailyActivity = { date: new Date(), pointsEarned: 0, quizzesCompleted: 0, timeSpent: 0 };
      userProgress.dailyActivity.push(dailyActivity);
    }
    dailyActivity.pointsEarned += totalPoints;
    dailyActivity.quizzesCompleted += 1;
    dailyActivity.timeSpent += timeSpent || 0;
    
    // Update streak
    userProgress.updateStreak();
    
    // Update user stats
    user.points += totalPoints;
    user.totalQuizzesCompleted += 1;
    user.totalTimeSpent += timeSpent || 0;
    user.streakDays = userProgress.currentStreak;
    
    // Calculate new average quiz score
    const allQuizScores = userProgress.quizProgress.flatMap(qp => qp.attempts.map(a => a.score));
    user.averageQuizScore = allQuizScores.reduce((sum, score) => sum + score, 0) / allQuizScores.length;
    
    if (!user.completedQuizzes.includes(quizId)) {
      user.completedQuizzes.push(quizId);
    }
    
    user.updateLevel();
    user.lastActivity = new Date();
    
    await Promise.all([userProgress.save(), user.save()]);

    res.json({
      totalPoints,
      maxPoints: quiz.totalPoints,
      percentage,
      results,
      newLevel: user.level,
      totalUserPoints: user.points,
      currentStreak: userProgress.currentStreak,
      bestScore: quizProgress.bestScore,
      attempt: quizProgress.totalAttempts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};