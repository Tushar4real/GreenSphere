const Post = require('../models/Post');
const User = require('../models/User');

// Get all community posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const postsWithAvatars = posts.map(post => ({
      _id: post._id,
      content: post.content,
      task: post.task,
      points: post.points || 10,
      likes: post.likes || 0,
      comments: post.comments?.length || 0,
      createdAt: post.createdAt,
      user: {
        name: post.author?.name || 'Anonymous User',
        avatar: getRandomAvatar()
      }
    }));

    res.json({ success: true, data: postsWithAvatars });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    const { content, task, points } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User authentication required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const post = new Post({
      author: userId,
      content,
      task,
      points: points || 10,
      likes: 0,
      comments: []
    });

    await post.save();

    const postResponse = {
      _id: post._id,
      content: post.content,
      task: post.task,
      points: post.points,
      likes: post.likes,
      comments: 0,
      createdAt: post.createdAt,
      user: {
        name: user.name,
        avatar: getRandomAvatar()
      }
    };

    res.status(201).json({ success: true, data: postResponse });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, likes: post.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function for random avatars
const getRandomAvatar = () => {
  const avatars = ['🌱', '🌍', '♻️', '🌳', '💧', '☀️', '🌿', '🦋', '🌺', '🍃'];
  return avatars[Math.floor(Math.random() * avatars.length)];
};

module.exports = {
  getPosts,
  createPost,
  likePost
};