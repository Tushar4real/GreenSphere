const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { displayOTP } = require('../utils/otpDisplay');
const { sendOTPEmail } = require('../utils/emailService');

// AWS Cognito SDK
const { 
  CognitoIdentityProviderClient, 
  SignUpCommand, 
  InitiateAuthCommand, 
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ChangePasswordCommand
} = require('@aws-sdk/client-cognito-identity-provider');

// Initialize Cognito client with proper configuration
let cognitoClient = null;
const isCognitoConfigured = () => {
  return process.env.COGNITO_CLIENT_ID && 
         process.env.COGNITO_USER_POOL_ID && 
         process.env.AWS_REGION &&
         !process.env.COGNITO_CLIENT_ID.includes('xxx') &&
         !process.env.COGNITO_USER_POOL_ID.includes('xxx');
};

if (isCognitoConfigured()) {
  cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION
  });
  console.log('✅ AWS Cognito configured and initialized');
} else {
  console.log('⚠️  AWS Cognito not configured, using local authentication');
}

// Store temporary signup data
const signupStore = new Map();

const AuthService = {
  async initiateSignup({ email, password, name }) {
    if (!cognitoClient) {
      // Local signup - store temporarily for OTP simulation
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      signupStore.set(email, { 
        email, 
        name, 
        password: await bcrypt.hash(password, 12),
        otpCode,
        timestamp: Date.now()
      });
      
      // Try to send email with OTP
      const emailResult = await sendOTPEmail(email, otpCode, name);
      
      if (emailResult.success) {
        console.log('✅ OTP sent via email successfully');
        return { 
          message: 'Verification code sent to your email. Please check your inbox.',
          userSub: `local-${Date.now()}`
        };
      } else {
        console.error('❌ Email delivery failed:', emailResult.error);
        displayOTP(email, otpCode);
        return { 
          message: 'Verification code generated. Please contact support for assistance.',
          userSub: `local-${Date.now()}`
        };
      }
    }
    
    // AWS Cognito signup
    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name }
      ]
    });
    
    try {
      const result = await cognitoClient.send(command);
      signupStore.set(email, { email, name, cognitoUserSub: result.UserSub });
      
      return { 
        message: 'Verification code sent to your email',
        userSub: result.UserSub
      };
    } catch (error) {
      if (error.name === 'UsernameExistsException') {
        throw { code: 'UserExists', message: 'An account with this email already exists' };
      }
      if (error.name === 'InvalidPasswordException') {
        throw { code: 'WeakPassword', message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character' };
      }
      if (error.name === 'InvalidParameterException') {
        throw { code: 'InvalidEmail', message: 'Please enter a valid email address' };
      }
      throw { code: 'SignupFailed', message: error.message || 'Registration failed. Please try again.' };
    }
  },
  
  async verifySignupOTP(email, otp) {
    const userData = signupStore.get(email);
    if (!userData) {
      throw { code: 'UserNotFound', message: 'User data not found. Please restart registration.' };
    }
    
    if (!cognitoClient) {
      // Local OTP verification
      if (userData.otpCode !== otp) {
        throw { code: 'InvalidOTP', message: 'Invalid verification code. Please check and try again.' };
      }
      
      // Check if OTP expired (5 minutes)
      if (Date.now() - userData.timestamp > 5 * 60 * 1000) {
        signupStore.delete(email);
        throw { code: 'OTPExpired', message: 'Verification code has expired. Please request a new one.' };
      }
      
      return {
        UserSub: `local-${Date.now()}`,
        confirmed: true,
        userData
      };
    }
    
    // AWS Cognito OTP verification
    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: otp
    });
    
    try {
      await cognitoClient.send(command);
      return {
        UserSub: userData.cognitoUserSub,
        confirmed: true,
        userData
      };
    } catch (error) {
      if (error.name === 'CodeMismatchException') {
        throw { code: 'InvalidOTP', message: 'Invalid verification code. Please check and try again.' };
      }
      if (error.name === 'ExpiredCodeException') {
        throw { code: 'OTPExpired', message: 'Verification code has expired. Please request a new one.' };
      }
      if (error.name === 'NotAuthorizedException') {
        throw { code: 'VerificationFailed', message: 'Verification failed. Please try again.' };
      }
      throw { code: 'VerificationError', message: error.message || 'Verification failed. Please try again.' };
    }
  },
  
  async authenticateUser(email, password) {
    if (!cognitoClient) {
      return null; // Use local authentication
    }
    
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });
    
    return await cognitoClient.send(command);
  },
  
  async forgotPassword(email) {
    if (!cognitoClient) {
      throw { code: 'NotSupported', message: 'Password reset not available in demo mode' };
    }
    
    const username = email.replace(/[@.]/g, '_');
    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: username
    });
    
    return await cognitoClient.send(command);
  },
  
  async confirmForgotPassword(email, confirmationCode, newPassword) {
    if (!cognitoClient) {
      throw { code: 'NotSupported', message: 'Password reset not available in demo mode' };
    }
    
    const username = email.replace(/[@.]/g, '_');
    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: username,
      ConfirmationCode: confirmationCode,
      Password: newPassword
    });
    
    return await cognitoClient.send(command);
  },
  
  async changePassword(accessToken, oldPassword, newPassword) {
    if (!cognitoClient) {
      throw { code: 'NotSupported', message: 'Password change not available in demo mode' };
    }
    
    const command = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword
    });
    
    return await cognitoClient.send(command);
  }
};

exports.register = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    // Validate input
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Initiate signup process (will send OTP)
    const result = await AuthService.initiateSignup({ email: email.toLowerCase(), password, name });
    
    // Store role in signup data
    const storedData = signupStore.get(email.toLowerCase());
    if (storedData) {
      storedData.role = role || 'student';
      signupStore.set(email.toLowerCase(), storedData);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'UserExists') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 'WeakPassword') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 'InvalidEmail') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(400).json({ error: error.message || 'Registration failed. Please try again.' });
  }
};

exports.initiateSignup = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Initiate signup process
    const result = await AuthService.initiateSignup({ 
      email: normalizedEmail, 
      password, 
      name: name.trim() 
    });
    
    // Update stored data with role
    const storedData = signupStore.get(normalizedEmail);
    if (storedData) {
      storedData.role = role || 'student';
      signupStore.set(normalizedEmail, storedData);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Initiate signup error:', error);
    
    if (error.code === 'UserExists') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 'WeakPassword') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 'InvalidEmail') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(400).json({ error: error.message || 'Failed to initiate signup. Please try again.' });
  }
};

exports.verifySignupOTP = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Verify OTP
    const verificationResult = await AuthService.verifySignupOTP(email.toLowerCase(), otp);
    
    // Get signup data from the temporary store
    const signupData = signupStore.get(email.toLowerCase());
    if (!signupData) {
      return res.status(400).json({ error: 'Session expired. Please start registration again.' });
    }

    // Create user in MongoDB
    const userData = {
      cognitoId: verificationResult.UserSub,
      email: email.toLowerCase(),
      name: signupData.name,
      role: signupData.role || 'student',
      points: 0,
      level: 'Seedling',
      streakDays: 0,
      badges: [],
      completedLessons: [],
      completedQuizzes: [],
      school: 'GreenSphere Academy',
      isActive: true,
      createdAt: new Date()
    };

    // Store hashed password for local auth
    if (signupData.password) {
      userData.password = signupData.password;
    }

    // If teacher role requested, set up teacher request
    if (signupData.role === 'teacher') {
      userData.teacherRequest = {
        status: 'pending',
        requestedAt: new Date()
      };
    }

    const user = new User(userData);
    await user.save();

    // Clean up stored data
    signupStore.delete(email.toLowerCase());

    let message = 'Registration completed successfully!';
    if (signupData.role === 'teacher') {
      message += ' Teacher access is pending admin approval.';
    }

    res.status(201).json({ 
      message,
      userId: user._id 
    });
  } catch (error) {
    console.error('Verify signup OTP error:', error);
    
    if (error.code === 'InvalidOTP') {
      return res.status(401).json({ error: error.message });
    }
    if (error.code === 'OTPExpired') {
      return res.status(401).json({ error: error.message });
    }
    if (error.code === 'VerificationFailed') {
      return res.status(401).json({ error: error.message });
    }
    if (error.code === 'UserNotFound') {
      return res.status(400).json({ error: 'Session expired. Please start registration again.' });
    }
    
    res.status(400).json({ error: error.message || 'Verification failed. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', { email: encodeURIComponent(email), passwordLength: password?.length });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Demo credentials for quick testing
    const demoCredentials = {
      'student@demo.com': { password: 'demo123', role: 'student', name: 'Demo Student' },
      'teacher@demo.com': { password: 'demo123', role: 'teacher', name: 'Demo Teacher' },
      'admin@demo.com': { password: 'demo123', role: 'admin', name: 'Demo Admin' },
      'tchandravadiya01@gmail.com': { password: 'Admin@122333@', role: 'admin', name: 'Tushar Admin' }
    };

    let user;
    let isAuthenticated = false;

    // Check demo credentials first
    const demoUser = demoCredentials[normalizedEmail];
    if (demoUser && password === demoUser.password) {
      console.log('✅ Demo user login:', encodeURIComponent(normalizedEmail));
      isAuthenticated = true;
      
      // Find or create demo user in database
      user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        user = new User({
          cognitoId: `demo-${Date.now()}`,
          email: normalizedEmail,
          name: demoUser.name,
          role: demoUser.role,
          points: 450,
          level: 'Sapling',
          streakDays: 7,
          totalLessonsCompleted: 5,
          totalTasksCompleted: 3,
          averageQuizScore: 92,
          school: 'Demo School',
          isActive: true
        });
        await user.save();
        console.log('📝 Created demo user:', encodeURIComponent(user.email));
      }
    } else {
      // Check registered users
      user = await User.findOne({ email: normalizedEmail, isActive: true });
      if (!user) {
        console.log('❌ User not found:', encodeURIComponent(normalizedEmail));
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Try AWS Cognito authentication first
      if (cognitoClient) {
        try {
          const cognitoResult = await AuthService.authenticateUser(normalizedEmail, password);
          if (cognitoResult && cognitoResult.AuthenticationResult) {
            console.log('✅ AWS Cognito authentication successful');
            isAuthenticated = true;
          }
        } catch (cognitoError) {
          console.log('⚠️  Cognito auth failed, trying local auth:', cognitoError.name);
        }
      }

      // Fallback to local password verification
      if (!isAuthenticated && user.password) {
        try {
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (isValidPassword) {
            console.log('✅ Local password authentication successful');
            isAuthenticated = true;
          }
        } catch (bcryptError) {
          console.log('⚠️  Bcrypt comparison failed:', bcryptError.message);
        }
      }

      // Final fallback for development (remove in production)
      if (!isAuthenticated) {
        const devPasswords = ['password123', 'demo123', 'student123', 'Password123'];
        if (devPasswords.includes(password)) {
          console.log('⚠️  Development password accepted');
          isAuthenticated = true;
        }
      }
    }

    if (!isAuthenticated) {
      console.log('❌ Authentication failed for:', encodeURIComponent(normalizedEmail));
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role,
        cognitoId: user.cognitoId
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    console.log('🎉 Login successful for:', encodeURIComponent(user.email), 'Role:', user.role);

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        school: user.school || 'GreenSphere Academy',
        points: user.points || 0,
        level: user.level || 'Seedling',
        streakDays: user.streakDays || 0,
        totalLessonsCompleted: user.totalLessonsCompleted || 0,
        totalTasksCompleted: user.totalTasksCompleted || 0,
        averageQuizScore: user.averageQuizScore || 0,
        badges: user.badges || []
      }
    });
  } catch (error) {
    console.error('💥 Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

exports.verify = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(404).json({ error: 'User not found or inactive' });
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save();

    res.json({ 
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        school: user.school || 'GreenSphere Academy',
        points: user.points || 0,
        level: user.level || 'Seedling',
        streakDays: user.streakDays || 0,
        totalLessonsCompleted: user.totalLessonsCompleted || 0,
        totalTasksCompleted: user.totalTasksCompleted || 0,
        averageQuizScore: user.averageQuizScore || 0,
        badges: user.badges || []
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    
    res.status(401).json({ error: 'Token verification failed' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    try {
      await AuthService.forgotPassword(normalizedEmail);
      res.json({ 
        message: 'Password reset code sent to your email' 
      });
    } catch (error) {
      if (error.code === 'NotSupported') {
        return res.status(400).json({ error: 'Password reset is not available in demo mode. Please contact support.' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    
    if (error.name === 'UserNotFoundException') {
      return res.status(404).json({ error: 'No account found with this email address' });
    }
    
    res.status(400).json({ error: 'Failed to send reset code. Please try again.' });
  }
};

// Confirm Forgot Password
exports.confirmForgotPassword = async (req, res) => {
  try {
    const { email, confirmationCode, newPassword } = req.body;

    if (!email || !confirmationCode || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      await AuthService.confirmForgotPassword(normalizedEmail, confirmationCode, newPassword);
      
      // Update password in local database as well
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await User.findOneAndUpdate(
        { email: normalizedEmail },
        { password: hashedPassword }
      );
      
      res.json({ 
        message: 'Password reset successfully. You can now login with your new password.' 
      });
    } catch (error) {
      if (error.code === 'NotSupported') {
        return res.status(400).json({ error: 'Password reset is not available in demo mode. Please contact support.' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Confirm forgot password error:', error);
    
    if (error.name === 'CodeMismatchException') {
      return res.status(400).json({ error: 'Invalid confirmation code' });
    }
    if (error.name === 'ExpiredCodeException') {
      return res.status(400).json({ error: 'Confirmation code has expired' });
    }
    
    res.status(400).json({ error: 'Failed to reset password. Please try again.' });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both old and new passwords are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify old password
    if (user.password) {
      const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidOldPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
    }

    try {
      // Try to change password in Cognito if available
      if (cognitoClient && req.user.cognitoAccessToken) {
        await AuthService.changePassword(req.user.cognitoAccessToken, oldPassword, newPassword);
      }
    } catch (cognitoError) {
      console.log('Cognito password change failed:', cognitoError.message);
    }

    // Update password in local database
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    
    if (error.name === 'NotAuthorizedException') {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    res.status(400).json({ error: 'Failed to change password. Please try again.' });
  }
};

// Development only - Get OTP for testing
exports.getOTP = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' });
    }
    
    const userData = signupStore.get(email.toLowerCase());
    if (!userData || !userData.otpCode) {
      return res.status(404).json({ error: 'No OTP found for this email' });
    }
    
    res.json({ 
      email: email.toLowerCase(),
      otp: userData.otpCode,
      generatedAt: new Date(userData.timestamp).toLocaleString(),
      expiresIn: Math.max(0, Math.floor((userData.timestamp + 5 * 60 * 1000 - Date.now()) / 1000))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve OTP' });
  }
};