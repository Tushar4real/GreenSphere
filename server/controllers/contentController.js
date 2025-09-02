const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

exports.createLesson = async (req, res) => {
  try {
    const { title, description, category, difficulty, points, slides } = req.body;
    const createdBy = req.user.userId;
    
    const lesson = new Lesson({
      title,
      description,
      category,
      difficulty,
      points,
      slides,
      createdBy,
      isActive: true
    });
    
    await lesson.save();
    
    res.status(201).json({
      message: 'Lesson created successfully',
      lesson: {
        _id: lesson._id,
        title: lesson.title,
        category: lesson.category,
        difficulty: lesson.difficulty,
        points: lesson.points
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, points, questions } = req.body;
    const createdBy = req.user.userId;
    
    const quiz = new Quiz({
      title,
      description,
      category,
      difficulty,
      points,
      questions,
      createdBy,
      isActive: true
    });
    
    await quiz.save();
    
    res.status(201).json({
      message: 'Quiz created successfully',
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        category: quiz.category,
        difficulty: quiz.difficulty,
        points: quiz.points
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json({
      message: 'Lesson updated successfully',
      lesson
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const quiz = await Quiz.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    res.json({
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};