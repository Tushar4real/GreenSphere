const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createTestUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greensphere');
    console.log('Connected to MongoDB');

    const testUsers = [
      {
        cognitoId: 'rahul-user-' + Date.now(),
        email: 'onlinerahulpatel@gmail.com',
        name: 'Rahul Patel',
        role: 'student',
        points: 250,
        level: 'Seedling',
        school: 'Tech Academy',
        isActive: true
      },
      {
        cognitoId: 'alice-user-' + Date.now(),
        email: 'alice@student.com',
        name: 'Alice Johnson',
        role: 'student',
        points: 450,
        level: 'Sapling',
        school: 'Green Valley High',
        isActive: true
      },
      {
        cognitoId: 'bob-user-' + Date.now(),
        email: 'bob@student.com',
        name: 'Bob Smith',
        role: 'student',
        points: 320,
        level: 'Seedling',
        school: 'Eco Academy',
        isActive: true
      },
      {
        cognitoId: 'teacher-user-' + Date.now(),
        email: 'teacher@school.com',
        name: 'Dr. Sarah Green',
        role: 'teacher',
        points: 0,
        level: 'Educator',
        school: 'Green Valley High',
        isActive: true
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log('✅ Created user:', userData.email, '- Role:', userData.role);
      } else {
        console.log('⚠️ User already exists:', userData.email);
      }
    }
    
    const totalUsers = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${totalUsers}`);
    
    const allUsers = await User.find().select('email role name');
    console.log('\n👥 All users:');
    allUsers.forEach(u => console.log(`  - ${u.email} (${u.role}) - ${u.name}`));

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestUsers();