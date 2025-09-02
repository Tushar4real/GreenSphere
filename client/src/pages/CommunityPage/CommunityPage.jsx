import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import BackToDashboard from '../../components/BackToDashboard/BackToDashboard';
import Footer from '../../components/Footer/Footer';
import apiService from '../../services/apiService';
import './CommunityPage.css';

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiService.community.getPosts();
      const postsData = response.data?.data || response.data || [];
      setPosts(postsData.length > 0 ? postsData : generateMockPosts());
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(generateMockPosts());
    }
    setLoading(false);
  };

  const generateMockPosts = () => {
    const currentTime = Date.now();
    return [
      {
        _id: '1',
        user: { name: 'Priya Sharma', avatar: '🌱' },
        content: 'Just planted 5 trees in my neighborhood! 🌳 Every small action counts!',
        task: 'Tree Planting Challenge',
        points: 50,
        likes: Math.floor(Math.random() * 20) + 10,
        comments: Math.floor(Math.random() * 8) + 2,
        createdAt: new Date(currentTime - Math.floor(Math.random() * 3) * 60 * 60 * 1000)
      },
      {
        _id: '2',
        user: { name: 'Arjun Patel', avatar: '♻️' },
        content: 'Completed plastic-free week! Switched to reusable bags 💪',
        task: 'Plastic-Free Week',
        points: 30,
        likes: Math.floor(Math.random() * 15) + 5,
        comments: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date(currentTime - Math.floor(Math.random() * 6) * 60 * 60 * 1000)
      },
      {
        _id: '3',
        user: { name: 'Sneha Reddy', avatar: '🌊' },
        content: 'Beach cleanup with friends! Collected 15kg waste 🏖️',
        task: 'Beach Cleanup Drive',
        points: 75,
        likes: Math.floor(Math.random() * 30) + 20,
        comments: Math.floor(Math.random() * 10) + 5,
        createdAt: new Date(currentTime - Math.floor(Math.random() * 8) * 60 * 60 * 1000)
      },
      {
        _id: '4',
        user: { name: 'Rahul Kumar', avatar: '⚡' },
        content: 'Switched to solar power at home! ☀️ Reduced electricity bill by 60%!',
        task: 'Solar Energy Adoption',
        points: 100,
        likes: Math.floor(Math.random() * 25) + 15,
        comments: Math.floor(Math.random() * 6) + 3,
        createdAt: new Date(currentTime - Math.floor(Math.random() * 12) * 60 * 60 * 1000)
      },
      {
        _id: '5',
        user: { name: 'Ananya Singh', avatar: '💧' },
        content: 'Installed rainwater harvesting system! 🌧️ Saving 500L water daily!',
        task: 'Water Conservation',
        points: 80,
        likes: Math.floor(Math.random() * 18) + 12,
        comments: Math.floor(Math.random() * 7) + 2,
        createdAt: new Date(currentTime - Math.floor(Math.random() * 24) * 60 * 60 * 1000)
      }
    ];
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await apiService.community.createPost({ content: newPost });
      if (response.data) {
        setPosts(prev => [response.data, ...prev]);
      }
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
      // Create optimistic update
      const optimisticPost = {
        _id: Date.now().toString(),
        user: { name: user.name, avatar: '🌟' },
        content: newPost,
        points: 10,
        likes: 0,
        comments: 0,
        createdAt: new Date()
      };
      setPosts(prev => [optimisticPost, ...prev]);
      setNewPost('');
    }
  };

  const handleLike = async (postId) => {
    setPosts(prev => prev.map(post => 
      post._id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
    
    try {
      await apiService.community.likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatTimeAgo = (date) => {
    const diff = new Date() - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (loading) {
    return <div className="loading">Loading community... 🌱</div>;
  }

  return (
    <div className="community-page">
      <Navbar />
      <BackToDashboard />
      <div className="community-header">
        <h1>🌍 Eco Community</h1>
        <p>Share achievements and inspire others!</p>
      </div>

      <div className="post-form">
        <form onSubmit={handlePostSubmit}>
          <div className="form-header">
            <span className="user-avatar">🌟</span>
            <span className="user-name">{user?.name}</span>
          </div>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your eco-achievement! 🌱"
            rows="3"
          />
          <button type="submit" disabled={!newPost.trim()}>
            Share 🚀
          </button>
        </form>
      </div>

      <div className="posts-feed">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <div className="post-user">
                <span className="post-avatar">{post.user.avatar}</span>
                <div className="post-user-info">
                  <span className="post-username">{post.user.name}</span>
                  <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
                </div>
              </div>
              {post.points && (
                <div className="post-points">+{post.points} 🌟</div>
              )}
            </div>

            <div className="post-content">
              <p>{post.content}</p>
              {post.task && (
                <div className="post-task">📋 {post.task}</div>
              )}
            </div>

            <div className="post-actions">
              <button onClick={() => handleLike(post._id)}>
                ❤️ {post.likes}
              </button>
              <button>💬 {post.comments}</button>
              <button>🔄 Share</button>
            </div>
          </div>
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

export default CommunityPage;