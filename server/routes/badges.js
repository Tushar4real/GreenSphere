const express = require('express');
const badgeController = require('../controllers/badgeController');
const authMiddleware = require('../middlewares/auth');
const auth = authMiddleware.auth;

const router = express.Router();

router.get('/', auth, badgeController.getAllBadges);
router.get('/user/:userId', auth, badgeController.getUserBadges);
router.post('/', auth, badgeController.createBadge);
router.put('/:id/toggle', auth, badgeController.toggleBadgeStatus);

module.exports = router;