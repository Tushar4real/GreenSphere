const express = require('express');
const leaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middlewares/auth');
const auth = authMiddleware.auth;

const router = express.Router();

router.get('/school/:school', auth, leaderboardController.getSchoolLeaderboard);
router.get('/global', auth, leaderboardController.getGlobalLeaderboard);
router.get('/rank/:userId', auth, leaderboardController.getUserRank);

module.exports = router;