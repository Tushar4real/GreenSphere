const User = require('../models/User');

exports.bulkImportUsers = async (req, res) => {
  try {
    const { users } = req.body;
    
    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ error: 'Invalid users data' });
    }
    
    const results = {
      total: users.length,
      successful: 0,
      failed: 0,
      errors: []
    };
    
    for (const userData of users) {
      try {
        // Validate required fields
        if (!userData.name || !userData.email || !userData.role) {
          results.failed++;
          results.errors.push({
            email: userData.email || 'Unknown',
            error: 'Missing required fields (name, email, role)'
          });
          continue;
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          results.failed++;
          results.errors.push({
            email: userData.email,
            error: 'User already exists'
          });
          continue;
        }
        
        // Create new user
        const newUser = new User({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          school: userData.school || 'Not specified',
          cognitoId: `bulk-import-${Date.now()}-${Math.random()}`,
          isActive: true,
          points: 0,
          level: 'Seedling'
        });
        
        await newUser.save();
        results.successful++;
        
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: userData.email || 'Unknown',
          error: error.message
        });
      }
    }
    
    res.json({
      message: 'Bulk import completed',
      results
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportUsers = async (req, res) => {
  try {
    const { role, dateRange, includeFields } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case '30d':
          startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
          break;
        case '90d':
          startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
          break;
        case '1y':
          startDate = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
          break;
      }
      
      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }
    
    // Select fields based on includeFields
    let selectFields = 'name email role createdAt';
    const fields = includeFields ? includeFields.split(',') : [];
    
    if (fields.includes('points')) selectFields += ' points level';
    if (fields.includes('activity')) selectFields += ' lastLoginAt totalLessonsCompleted';
    if (fields.includes('badges')) selectFields += ' badges';
    
    const users = await User.find(query)
      .select(selectFields)
      .sort({ createdAt: -1 });
    
    // Convert to CSV format
    const csvData = users.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role,
      joinDate: user.createdAt.toISOString().split('T')[0],
      ...(fields.includes('points') && { 
        points: user.points || 0, 
        level: user.level || 'Seedling' 
      }),
      ...(fields.includes('activity') && { 
        lastLogin: user.lastLoginAt ? user.lastLoginAt.toISOString().split('T')[0] : 'Never',
        lessonsCompleted: user.totalLessonsCompleted || 0
      }),
      ...(fields.includes('badges') && { 
        badgeCount: user.badges ? user.badges.length : 0
      })
    }));
    
    res.json({
      message: 'Export completed',
      data: csvData,
      count: csvData.length
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bulkUpdateUsers = async (req, res) => {
  try {
    const { userIds, updates } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || !updates) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
    
    const result = await User.updateMany(
      { _id: { $in: userIds }, isActive: true },
      { ...updates, updatedAt: new Date() }
    );
    
    res.json({
      message: 'Bulk update completed',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ error: 'Invalid user IDs' });
    }
    
    // Soft delete by setting isActive to false
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { isActive: false, updatedAt: new Date() }
    );
    
    res.json({
      message: 'Bulk delete completed',
      deletedCount: result.modifiedCount
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};