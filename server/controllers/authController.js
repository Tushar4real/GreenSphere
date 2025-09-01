const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Cognito SDK without AWS credentials
const { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');
const crypto = require('crypto');

// Initialize Cognito client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION
});

// Store temporary signup data
const signupStore = new Map();

const AuthService = {
  async initiateSignup({ email, password, name }) {
    // Create user in Cognito directly - this will send email verification
    // Generate username from email (remove @ and .)
    const username = email.replace(/[@.]/g, '_');
    
    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name }
      ]
    });
    
    try {
      const result = await cognitoClient.send(command);
      
      // Store user data for later MongoDB creation
      signupStore.set(email, { email, name, username, cognitoUserSub: result.UserSub });
      
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
    const { ConfirmSignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');
    
    // Get stored user data to get username
    const userData = signupStore.get(email);
    if (!userData) {
      throw { code: 'UserNotFound', message: 'User data not found' };
    }
    
    // Confirm signup with Cognito verification code
    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: userData.username,
      ConfirmationCode: otp
    });
    
    try {
      const result = await cognitoClient.send(command);
      
      // Clean up stored data
      signupStore.delete(email);
      
      return {
        UserSub: userData?.cognitoUserSub || crypto.randomUUID(),
        confirmed: true
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
    // Use the same username format as signup (email with @ and . replaced)
    const username = email.replace(/[@.]/g, '_');
    
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
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

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user in MongoDB (demo mode - no Cognito)
    const userData = {
      cognitoId: `user-${Date.now()}`,
      email,
      name,
      role: role || 'student',
      points: 0,
      level: 'Seedling',
      streakDays: 0,
      badges: [],
      completedLessons: [],
      completedQuizzes: [],
      school: 'GreenSphere Academy'
    };

    // If teacher role requested, set up teacher request
    if (role === 'teacher') {
      userData.teacherRequest = {
        status: 'pending',
        requestedAt: new Date()
      };
    }

    const user = new User(userData);
    await user.save();

    let message = 'User registered successfully';
    if (role === 'teacher') {
      message += '. Teacher access pending admin approval.';
    }

    res.status(201).json({ 
      message,
      userId: user._id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
};

exports.initiateSignup = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Store role in signup data
    const result = await AuthService.initiateSignup({ email, password, name });
    
    // Update stored data with role
    const storedData = signupStore.get(email);
    if (storedData) {
      storedData.role = role;
      signupStore.set(email, storedData);
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
    
    res.status(400).json({ error: error.message || 'Failed to initiate signup' });
  }
};

exports.verifySignupOTP = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Verify OTP and create Cognito user
    const cognitoResult = await AuthService.verifySignupOTP(email, otp);
    
    // Get signup data from the temporary store
    const signupData = signupStore.get(email) || { name: 'User', role: 'student' };

    // Create user in MongoDB
    const userData = {
      cognitoId: cognitoResult.UserSub,
      email,
      name: signupData.name,
      role: 'student', // Always start as student
      points: 0,
      level: 1,
      badges: [],
      completedLessons: [],
      completedQuizzes: []
    };

    // If teacher role requested, set up teacher request
    if (role === 'teacher') {
      userData.teacherRequest = {
        status: 'pending',
        requestedAt: new Date()
      };
    }

    const user = new User(userData);
    await user.save();

    let message = 'User registered successfully';
    if (role === 'teacher') {
      message += '. Teacher access pending admin approval.';
    }

    res.status(201).json({ 
      message,
      userId: user._id 
    });
  } catch (error) {
    console.error('Verify signup OTP error:', error);
    
    if (error.code === 'InvalidOTP') {
      return res.status(401).json({ error: error.message || 'Invalid verification code' });
    }
    if (error.code === 'OTPExpired') {
      return res.status(401).json({ error: error.message || 'Verification code expired' });
    }
    if (error.code === 'VerificationFailed') {
      return res.status(401).json({ error: error.message || 'Verification failed' });
    }
    if (error.code === 'UserNotFound') {
      return res.status(400).json({ error: 'Session expired. Please start registration again.' });
    }
    
    res.status(400).json({ error: error.message || 'Signup verification failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Demo credentials
    const demoCredentials = {
      'student@demo.com': { password: 'demo123', role: 'student', name: 'Demo Student' },
      'teacher@demo.com': { password: 'demo123', role: 'teacher', name: 'Demo Teacher' },
      'admin@demo.com': { password: 'demo123', role: 'admin', name: 'Demo Admin' },
      'tchandravadiya01@gmail.com': { password: 'Admin@122333@', role: 'admin', name: 'Tushar Admin' }
    };

    // Check if it's a demo login
    const demoUser = demoCredentials[email];
    if (demoUser && password === demoUser.password) {
      // Find or create demo user
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          cognitoId: `demo-${Date.now()}`,
          email,
          name: demoUser.name,
          role: demoUser.role,
          points: 450,
          level: 'Sapling',
          streakDays: 7,
          totalLessonsCompleted: 5,
          totalTasksCompleted: 3,
          averageQuizScore: 92,
          school: 'Demo School'
        });
        await user.save();
      }

      // Update last activity
      user.lastActivity = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          school: user.school,
          points: user.points,
          level: user.level,
          streakDays: user.streakDays,
          totalLessonsCompleted: user.totalLessonsCompleted,
          totalTasksCompleted: user.totalTasksCompleted,
          averageQuizScore: user.averageQuizScore,
          badges: user.badges || []
        }
      });
    }

    // For any other email/password, allow login if password is at least 6 characters
    if (password.length >= 6) {
      let user = await User.findOne({ email });
      if (!user) {
        // Create new user for any valid email/password combination
        user = new User({
          cognitoId: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
          role: 'student',
          points: 0,
          level: 'Seedling',
          streakDays: 0,
          school: 'GreenSphere Academy'
        });
        await user.save();
      }

      // Update last activity
      user.lastActivity = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          school: user.school,
          points: user.points,
          level: user.level,
          streakDays: user.streakDays || 0,
          totalLessonsCompleted: user.totalLessonsCompleted || 0,
          totalTasksCompleted: user.totalTasksCompleted || 0,
          averageQuizScore: user.averageQuizScore || 0,
          badges: user.badges || []
        }
      });
    }

    return res.status(401).json({ error: 'Invalid credentials. Password must be at least 6 characters.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

exports.verify = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('badges');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await AuthService.forgotPassword(email);
    
    res.json({ 
      message: 'Password reset code sent to your email' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    
    if (error.code === 'UserNotFoundException') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(400).json({ error: 'Failed to send reset code' });
  }
};

// Confirm Forgot Password
exports.confirmForgotPassword = async (req, res) => {
  try {
    const { email, confirmationCode, newPassword } = req.body;

    if (!email || !confirmationCode || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await AuthService.confirmForgotPassword(email, confirmationCode, newPassword);
    
    res.json({ 
      message: 'Password reset successfully' 
    });
  } catch (error) {
    console.error('Confirm forgot password error:', error);
    
    if (error.code === 'CodeMismatchException') {
      return res.status(400).json({ error: 'Invalid confirmation code' });
    }
    if (error.code === 'ExpiredCodeException') {
      return res.status(400).json({ error: 'Confirmation code expired' });
    }
    
    res.status(400).json({ error: 'Failed to reset password' });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const cognitoAccessToken = req.user.cognitoAccessToken;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both old and new passwords are required' });
    }

    if (!cognitoAccessToken) {
      return res.status(401).json({ error: 'Cognito access token not found' });
    }

    await AuthService.changePassword(cognitoAccessToken, oldPassword, newPassword);
    
    res.json({ 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    
    if (error.code === 'NotAuthorizedException') {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    res.status(400).json({ error: 'Failed to change password' });
  }
};