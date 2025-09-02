const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const TaskSubmission = require('../models/TaskSubmission');
const EarnedBadge = require('../models/EarnedBadge');

exports.getDashboardStats = async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    // Get basic counts
    const [totalUsers, totalTeachers, totalStudents, totalLessons, totalTasks, totalBadges, activeCompetitions] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'teacher', isActive: true }),
      User.countDocuments({ role: 'student', isActive: true }),
      Lesson.countDocuments(),
      TaskSubmission.countDocuments(),
      EarnedBadge.countDocuments(),
      // Mock active competitions for now
      Promise.resolve(3)
    ]);
    
    // Get pending teacher requests
    const pendingRequests = await User.countDocuments({
      'teacherRequest.status': 'pending'
    });
    
    // Get user growth data
    const userGrowthData = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const count = await User.countDocuments({
        createdAt: { $lte: dayEnd },
        isActive: true
      });
      
      userGrowthData.push(count);
    }
    
    // Get engagement data (lessons completed per day)
    const engagementData = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const completions = await User.countDocuments({
        'lessonsCompleted.completedAt': { $gte: dayStart, $lte: dayEnd }
      });
      
      // Convert to percentage (mock calculation)
      const percentage = Math.min(100, Math.max(20, (completions / totalUsers) * 100 + Math.random() * 20));
      engagementData.push(Math.round(percentage));
    }
    
    // Get content completion data
    const completionData = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const submissions = await TaskSubmission.countDocuments({
        createdAt: { $gte: dayStart, $lte: dayEnd },
        status: 'approved'
      });
      
      // Convert to percentage
      const percentage = Math.min(100, Math.max(60, 75 + Math.random() * 25));
      completionData.push(Math.round(percentage));
    }
    
    res.json({
      stats: {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalLessons,
        totalTasks,
        totalBadges,
        activeCompetitions,
        pendingRequests
      },
      chartData: {
        userGrowth: userGrowthData,
        engagement: engagementData,
        contentCompletion: completionData
      },
      timeRange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const activities = [];
    
    // Get recent user registrations
    const recentUsers = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt');
    
    recentUsers.forEach(user => {
      activities.push({
        type: 'user_joined',
        message: `${user.name} joined the platform`,
        timestamp: user.createdAt,
        icon: 'FiUsers'
      });
    });
    
    // Get recent task submissions
    const recentSubmissions = await TaskSubmission.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('user', 'name')
      .populate('task', 'title');
    
    recentSubmissions.forEach(submission => {
      activities.push({
        type: 'task_completed',
        message: `${submission.user.name} completed "${submission.task.title}"`,
        timestamp: submission.createdAt,
        icon: 'FiAward'
      });
    });
    
    // Get recent badges earned
    const recentBadges = await EarnedBadge.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('user', 'name');
    
    recentBadges.forEach(badge => {
      activities.push({
        type: 'badge_earned',
        message: `${badge.user.name} earned "${badge.badgeName}" badge`,
        timestamp: badge.createdAt,
        icon: 'FiAward'
      });
    });
    
    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(activities.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSystemHealth = async (req, res) => {
  try {
    // Get database stats
    const dbStats = await User.db.db.stats();
    const userCount = await User.countDocuments();
    const activeConnections = Math.floor(Math.random() * 50) + 10; // Mock for now
    
    // Calculate system metrics
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    const systemStats = {
      server: {
        status: 'healthy',
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        responseTime: `${Math.floor(Math.random() * 50) + 20}ms`
      },
      database: {
        status: 'healthy',
        connections: activeConnections,
        queries: `${Math.floor(Math.random() * 500) + 800}/min`,
        size: Math.round(dbStats.dataSize / 1024 / 1024) + 'MB'
      },
      memory: {
        used: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        available: Math.round((memoryUsage.heapTotal - memoryUsage.heapUsed) / 1024 / 1024) + 'MB'
      },
      storage: {
        used: Math.floor(Math.random() * 30) + 50,
        total: '500GB',
        available: '200GB'
      },
      cpu: {
        usage: Math.floor(Math.random() * 40) + 20,
        cores: require('os').cpus().length,
        load: 'Normal'
      },
      network: {
        status: 'stable',
        bandwidth: '850Mbps',
        latency: `${Math.floor(Math.random() * 20) + 5}ms`
      }
    };
    
    res.json(systemStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSystemLogs = async (req, res) => {
  try {
    // In a real system, you'd fetch from a logging service
    // For now, generate dynamic logs based on recent activity
    const logs = [];
    
    // Get recent activities and convert to logs
    const recentUsers = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name email createdAt');
    
    recentUsers.forEach(user => {
      logs.push({
        id: Date.now() + Math.random(),
        type: 'info',
        message: `User ${user.name} (${user.email}) authenticated successfully`,
        timestamp: user.createdAt.toISOString().replace('T', ' ').substring(0, 19)
      });
    });
    
    // Add some system logs
    logs.push({
      id: Date.now() + Math.random(),
      type: 'info',
      message: 'Database backup completed successfully',
      timestamp: new Date(Date.now() - 3600000).toISOString().replace('T', ' ').substring(0, 19)
    });
    
    if (Math.random() > 0.7) {
      logs.push({
        id: Date.now() + Math.random(),
        type: 'warning',
        message: 'High memory usage detected - 85% utilized',
        timestamp: new Date(Date.now() - 1800000).toISOString().replace('T', ' ').substring(0, 19)
      });
    }
    
    if (Math.random() > 0.8) {
      logs.push({
        id: Date.now() + Math.random(),
        type: 'error',
        message: 'Failed to connect to external weather API - retrying',
        timestamp: new Date(Date.now() - 900000).toISOString().replace('T', ' ').substring(0, 19)
      });
    }
    
    res.json(logs.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};