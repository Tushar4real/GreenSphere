const express = require('express');
const router = express.Router();
const { getPosts, createPost, likePost } = require('../controllers/communityController');

// Get all community posts
router.get('/posts', getPosts);

// Create new post
router.post('/posts', createPost);

// Like a post
router.post('/posts/:postId/like', likePost);

module.exports = router;