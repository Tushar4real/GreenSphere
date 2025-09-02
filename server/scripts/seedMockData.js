const mongoose = require('mongoose');
const Post = require('./models/Post');
const TaskSubmission = require('./models/TaskSubmission');
const User = require('./models/User');
require('dotenv').config();

const seedMockData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greensphere');
    console.log('Connected to MongoDB');

    // Create mock users if they don't exist
    const mockUsers = [
      {
        cognitoId: 'mock-user-1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        role: 'student',
        school: 'Green Valley High',
        points: 450,
        level: 'Eco Enthusiast',
        streakDays: 5
      },
      {
        cognitoId: 'mock-user-2',
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        role: 'student',
        school: 'Green Valley High',
        points: 380,
        level: 'Eco Enthusiast',
        streakDays: 3
      }
    ];

    for (const userData of mockUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created mock user: ${userData.name}`);
      }
    }

    // Clear existing posts
    await Post.deleteMany({});

    // Create mock community posts
    const users = await User.find({ role: 'student' }).limit(2);
    
    const mockPosts = [
      {
        author: users[0]._id,
        content: "Just completed my first tree planting task! 🌱 Planted an oak sapling in our school garden. Can't wait to see it grow! #EcoWarrior #TreePlanting",
        type: 'achievement',
        likes: 12,
        comments: [
          {
            author: users[1]._id,
            content: "Amazing work! I'm inspired to plant one too! 🌳",
            createdAt: new Date()
          }
        ],
        tags: ['tree-planting', 'school-project'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        author: users[1]._id,
        content: "Completed a plastic-free day challenge! Used my reusable water bottle, brought lunch in glass containers, and said no to plastic bags. Small steps make a big difference! ♻️",
        type: 'achievement',
        likes: 8,
        comments: [],
        tags: ['plastic-free', 'sustainability'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        author: users[0]._id,
        content: "Did you know that a single tree can absorb 48 pounds of CO2 per year? That's why our tree planting initiative is so important! 🌍 Let's all do our part!",
        type: 'educational',
        likes: 15,
        comments: [
          {
            author: users[1]._id,
            content: "Wow, I didn't know that! Thanks for sharing! 📚",
            createdAt: new Date()
          }
        ],
        tags: ['climate-facts', 'education'],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      }
    ];

    await Post.insertMany(mockPosts);
    console.log('Mock community posts created successfully');

    console.log('All mock data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding mock data:', error);
    process.exit(1);
  }
};

seedMockData();