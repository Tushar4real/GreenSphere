const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greensphere');
    console.log('Connected to MongoDB');

    // Update existing admin account
    const updatedAdmin = await User.findOneAndUpdate(
      { email: 'tchandravadiya01@gmail.com' },
      {
        name: 'Tushar Chandravadiya',
        role: 'admin',
        permissions: ['manage_users', 'manage_badges', 'manage_competitions', 'system_settings'],
        isActive: true
      },
      { new: true, upsert: true }
    );

    console.log('✅ Admin account updated successfully');
    console.log('Email: tchandravadiya01@gmail.com');
    console.log('Password: Admin@122333@');
    console.log('Role: admin');
    console.log('Status: Active');

  } catch (error) {
    console.error('Error updating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

updateAdmin();