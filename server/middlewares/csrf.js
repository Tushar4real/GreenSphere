const crypto = require('crypto');

// Simple CSRF protection middleware
const csrfProtection = {
  // Generate CSRF token
  generateToken: () => {
    return crypto.randomBytes(32).toString('hex');
  },

  // Middleware to add CSRF token to session/response
  addToken: (req, res, next) => {
    if (!req.session) {
      req.session = {};
    }
    
    if (!req.session.csrfToken) {
      req.session.csrfToken = csrfProtection.generateToken();
    }
    
    res.locals.csrfToken = req.session.csrfToken;
    next();
  },

  // Middleware to verify CSRF token
  verifyToken: (req, res, next) => {
    // Skip CSRF for GET requests and API endpoints with JWT auth
    if (req.method === 'GET' || req.headers.authorization) {
      return next();
    }

    const token = req.body._csrf || req.headers['x-csrf-token'];
    const sessionToken = req.session?.csrfToken;

    if (!token || !sessionToken || token !== sessionToken) {
      return res.status(403).json({ 
        error: 'Invalid CSRF token. Please refresh the page and try again.' 
      });
    }

    next();
  }
};

module.exports = csrfProtection;