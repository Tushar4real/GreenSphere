const User = require('../models/User');

exports.getSchoolLeaderboard = async (req, res) => {
  try {
    const { school } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = await User.find({ 
      school, 
      role: 'student', 
      isActive: true 
    })
    .select('name points level badges')
    .populate('badges', 'name icon color')
    .sort({ points: -1 })
    .limit(limit);

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const leaderboard = await User.find({ 
      role: 'student', 
      isActive: true 
    })
    .select('name school points level badges')
    .populate('badges', 'name icon color')
    .sort({ points: -1 })
    .limit(limit);

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const schoolRank = await User.countDocuments({
      school: user.school,
      role: 'student',
      isActive: true,
      points: { $gt: user.points }
    }) + 1;

    const globalRank = await User.countDocuments({
      role: 'student',
      isActive: true,
      points: { $gt: user.points }
    }) + 1;

    res.json({
      schoolRank,
      globalRank,
      points: user.points,
      level: user.level
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};