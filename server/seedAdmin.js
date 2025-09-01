const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greensphere');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@demo.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create primary admin user (Tushar)
    const adminUser = new User({
      cognitoId: 'tushar-admin-id',
      email: 'tchandravadiya01@gmail.com',
      name: 'Tushar Chandravadiya',
      role: 'admin',
      permissions: ['manage_users', 'manage_badges', 'manage_competitions', 'system_settings'],
      points: 0,
      level: 'Admin',
      badges: [],
      completedLessons: [],
      completedQuizzes: [],
      submittedTasks: [],
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Primary admin user created successfully');
    console.log('Email: tchandravadiya01@gmail.com');
    console.log('Password: Admin@122333@ (use this for login)');

    // Create demo admin for testing
    const demoAdmin = new User({
      cognitoId: 'admin-demo-id',
      email: 'admin@demo.com',
      name: 'Demo Administrator',
      role: 'admin',
      permissions: ['manage_users', 'manage_badges', 'manage_competitions', 'system_settings'],
      points: 0,
      level: 'Admin',
      badges: [],
      completedLessons: [],
      completedQuizzes: [],
      submittedTasks: [],
      isActive: true
    });

    await demoAdmin.save();
    console.log('✅ Demo admin user created successfully');
    console.log('Email: admin@demo.com');

    // Create a demo teacher for testing
    const teacherUser = new User({
      cognitoId: 'teacher-demo-id',
      email: 'teacher@demo.com',
      name: 'Demo Teacher',
      role: 'teacher',
      assignedClasses: ['Class A', 'Class B'],
      teacherRequest: {
        status: 'approved',
        reviewedAt: new Date(),
        reviewedBy: adminUser._id
      },
      points: 0,
      level: 'Teacher',
      badges: [],
      completedLessons: [],
      completedQuizzes: [],
      submittedTasks: [],
      isActive: true
    });

    await teacherUser.save();
    console.log('✅ Demo teacher created successfully');
    console.log('Email: teacher@demo.com');

    // Create a demo student
    const studentUser = new User({
      cognitoId: 'student-demo-id',
      email: 'student@demo.com',
      name: 'Demo Student',
      role: 'student',
      points: 150,
      level: 'Sapling',
      badges: [],
      completedLessons: [],
      completedQuizzes: [],
      submittedTasks: [],
      isActive: true
    });

    await studentUser.save();
    console.log('✅ Demo student created successfully');
    console.log('Email: student@demo.com');

    console.log('\n🎉 Demo users created successfully!');
    console.log('You can now use these accounts for testing the role management system.');

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedAdmin();