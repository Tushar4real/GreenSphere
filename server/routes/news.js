const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/newsController');

// Get environmental news
router.get('/', NewsController.getEnvironmentalNews);

module.exports = router;