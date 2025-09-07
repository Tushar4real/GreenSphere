const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    let decoded;
    let user;
    
    try {
      // Try JWT first (for local tokens)
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      user = await User.findById(decoded.userId);
    } catch (jwtError) {
      // Try Cognito token (base64 decode)
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          user = await User.findOne({ email: payload.email });
          
          if (!user) {
            // Create user if doesn't exist (for Cognito users)
            let role = 'student';
            if (payload.email === 'tchandravadiya01@gmail.com') role = 'admin';
            
            user = new User({
              cognitoId: payload.sub,
              email: payload.email,
              name: payload.name || payload.email.split('@')[0],
              role: role
            });
            await user.save();
          } else {
            // Update admin role if needed
            if (payload.email === 'tchandravadiya01@gmail.com' && user.role !== 'admin') {
              user.role = 'admin';
              await user.save();
            }
          }
        } else {
          throw new Error('Invalid token format');
        }
      } catch (cognitoError) {
        return res.status(401).json({ error: 'Invalid token format.' });
      }
    }
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token or user deactivated.' });
    }

    req.user = {
      id: user._id,
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = { auth, requireRole };