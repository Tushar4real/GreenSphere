const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const {
  getUserProgress,
  getAvailableBadges,
  markBadgesViewed
} = require('../controllers/gamificationController');

// Get user progress dashboard
router.get('/progress', auth, getUserProgress);

// Get available badges with progress
router.get('/badges', auth, getAvailableBadges);

// Mark badges as viewed
router.post('/badges/viewed', auth, markBadgesViewed);

module.exports = router;