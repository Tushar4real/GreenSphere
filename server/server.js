const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Validate environment variables
const { validateEnvironment } = require('./config/validateEnv');
validateEnvironment();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Input sanitization middleware
const { sanitizeInput } = require('./middlewares/sanitize');
app.use(sanitizeInput);

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads/task-proofs')) {
  fs.mkdirSync('uploads/task-proofs', { recursive: true });
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/badges', require('./routes/badges'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/competitions', require('./routes/competitions'));
app.use('/api/real-world-tasks', require('./routes/realWorldTasks'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/content', require('./routes/content'));
app.use('/api/bulk-users', require('./routes/bulkUsers'));
app.use('/api/community', require('./routes/community'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/news', require('./routes/news'));
app.use('/api/gamification', require('./routes/gamification'));

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ MongoDB URI not configured');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});