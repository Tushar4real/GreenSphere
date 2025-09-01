const Badge = require('../models/Badge');
const User = require('../models/User');

exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find({ isActive: true }).sort({ order: 1 });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBadges = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('badges');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.badges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBadge = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const badge = new Badge(req.body);
    await badge.save();
    
    res.status(201).json({ message: 'Badge created successfully', badge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleBadgeStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({ error: 'Badge not found' });
    }

    badge.isActive = !badge.isActive;
    await badge.save();

    res.json({ message: 'Badge status updated', badge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};