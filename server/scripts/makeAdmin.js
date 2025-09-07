const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greensphere');
    console.log('Connected to MongoDB');

    // Find user by email and make admin
    const user = await User.findOne({ email: 'tchandravadiya01@gmail.com' });
    
    if (user) {
      user.role = 'admin';
      user.permissions = ['manage_users', 'manage_badges', 'manage_competitions', 'system_settings'];
      await user.save();
      console.log('✅ User tchandravadiya01@gmail.com is now an admin');
    } else {
      // Create new admin user
      const newAdmin = new User({
        cognitoId: 'tchandravadiya-admin-' + Date.now(),
        email: 'tchandravadiya01@gmail.com',
        name: 'Tushar Chandravadiya',
        role: 'admin',
        permissions: ['manage_users', 'manage_badges', 'manage_competitions', 'system_settings'],
        points: 0,
        level: 'Admin',
        isActive: true
      });
      
      await newAdmin.save();
      console.log('✅ Created new admin user: tchandravadiya01@gmail.com');
    }

  } catch (error) {
    console.error('Error making admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

makeAdmin();