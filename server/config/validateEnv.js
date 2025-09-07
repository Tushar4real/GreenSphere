const crypto = require('crypto');

/**
 * Environment Variable Validation
 * Ensures all required environment variables are set and secure
 */

const requiredEnvVars = [
  'JWT_SECRET',
  'MONGO_URI',
  'NODE_ENV'
];

const optionalEnvVars = [
  'PORT',
  'COGNITO_CLIENT_ID',
  'COGNITO_USER_POOL_ID',
  'AWS_REGION',
  'NEWS_API_KEY',
  'GUARDIAN_API_KEY',
  'EMAIL_USER',
  'EMAIL_PASS'
];

function validateEnvironment() {
  const errors = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters long');
    }
    if (process.env.JWT_SECRET === 'fallback-secret-key' || 
        process.env.JWT_SECRET === 'your-secret-key' ||
        process.env.JWT_SECRET === 'secret') {
      errors.push('JWT_SECRET must not use default/weak values');
    }
  }

  // Validate MongoDB URI
  if (process.env.MONGO_URI) {
    if (!process.env.MONGO_URI.startsWith('mongodb://') && 
        !process.env.MONGO_URI.startsWith('mongodb+srv://')) {
      errors.push('MONGO_URI must be a valid MongoDB connection string');
    }
  }

  // Check for development/production consistency
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.COGNITO_CLIENT_ID || process.env.COGNITO_CLIENT_ID.includes('xxx')) {
      warnings.push('AWS Cognito not configured for production');
    }
  }

  // Report results
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Environment warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  console.log('✅ Environment validation passed');
}

function generateSecureJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

function createEnvTemplate() {
  const template = `# GreenSphere Server Environment Variables
# Copy this file to .env and fill in your values

# Required Variables
JWT_SECRET=${generateSecureJWTSecret()}
MONGO_URI=mongodb://localhost:27017/greensphere
NODE_ENV=development
PORT=5001

# AWS Cognito (Optional - for production authentication)
COGNITO_CLIENT_ID=your-cognito-client-id
COGNITO_USER_POOL_ID=your-user-pool-id
AWS_REGION=us-east-1

# News API Keys (Optional - for live news feeds)
NEWS_API_KEY=your-newsapi-key
GUARDIAN_API_KEY=your-guardian-api-key

# Email Configuration (Optional - for OTP emails)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
`;

  return template;
}

module.exports = {
  validateEnvironment,
  generateSecureJWTSecret,
  createEnvTemplate
};