const User = require('../models/User');

exports.requestTeacherRole = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subject, teacherCode, teacherEmail } = req.body;
    
    // Validate teacher code
    const validTeacherCode = 'TEACH2024';
    if (teacherCode !== validTeacherCode) {
      return res.status(400).json({ error: 'Invalid teacher verification code' });
    }
    
    // Validate email format (basic check for professional domains)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(teacherEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role !== 'student') {
      return res.status(400).json({ error: 'Only students can request teacher role' });
    }
    
    if (user.teacherRequest?.status === 'pending') {
      return res.status(400).json({ error: 'Teacher request already pending' });
    }
    
    user.teacherRequest = {
      status: 'pending',
      requestedAt: new Date(),
      subject,
      teacherEmail
    };
    
    await user.save();
    
    res.json({ message: 'Teacher request submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherRequests = async (req, res) => {
  try {
    const requests = await User.find({
      'teacherRequest.status': 'pending'
    }).select('name email teacherRequest createdAt');
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveTeacherRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { approved } = req.body;
    const adminId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (approved) {
      user.role = 'teacher';
      user.teacherRequest.status = 'approved';
    } else {
      user.teacherRequest.status = 'rejected';
    }
    
    user.teacherRequest.reviewedAt = new Date();
    user.teacherRequest.reviewedBy = adminId;
    
    await user.save();
    
    res.json({ 
      message: `Teacher request ${approved ? 'approved' : 'rejected'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addTeacher = async (req, res) => {
  try {
    const { email, name, password, fieldOfStudy, school } = req.body;
    
    if (!email || !name || !password || !fieldOfStudy) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    let user = await User.findOne({ email });
    if (user) {
      if (user.role === 'teacher' || user.role === 'admin') {
        return res.status(400).json({ error: 'User already has elevated privileges' });
      }
      user.role = 'teacher';
      user.teacherRequest = {
        status: 'approved',
        requestedAt: new Date(),
        reviewedAt: new Date(),
        reviewedBy: req.user.userId,
        fieldOfStudy
      };
      if (school) user.school = school;
    } else {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 12);
      
      user = new User({
        email,
        name,
        password: hashedPassword,
        cognitoId: `teacher-${Date.now()}`,
        role: 'teacher',
        school: school || 'GreenSphere Academy',
        points: 0,
        level: 'Educator',
        isActive: true,
        teacherRequest: {
          status: 'approved',
          requestedAt: new Date(),
          reviewedAt: new Date(),
          reviewedBy: req.user.userId,
          fieldOfStudy
        }
      });
    }
    
    await user.save();
    
    res.status(201).json({
      message: 'Teacher added successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        fieldOfStudy
      }
    });
  } catch (error) {
    console.error('Add teacher error:', error);
    res.status(500).json({ error: error.message || 'Failed to add teacher' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('name email role points level createdAt teacherRequest')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.role = role;
    if (role === 'teacher' && user.teacherRequest?.status !== 'approved') {
      user.teacherRequest = {
        status: 'approved',
        requestedAt: new Date(),
        reviewedAt: new Date(),
        reviewedBy: req.user.userId
      };
    }
    
    await user.save();
    
    res.json({
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};