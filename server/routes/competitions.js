const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const { auth } = require('../middlewares/auth');

// Get active competitions
router.get('/', auth, competitionController.getActiveCompetitions);

// Join competition
router.post('/:competitionId/join', auth, competitionController.joinCompetition);

// Get competition leaderboard
router.get('/:competitionId/leaderboard', auth, competitionController.getCompetitionLeaderboard);

// Create competition (admin only)
router.post('/create', auth, competitionController.createCompetition);

module.exports = router;