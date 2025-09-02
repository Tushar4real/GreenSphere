#!/usr/bin/env node

/**
 * Authentication System Test Script
 * Tests the complete authentication flow including registration, OTP verification, and login
 */

const axios = require('axios');
const readline = require('readline');

const API_BASE = process.env.API_URL || 'http://localhost:9000/api';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function testRegistration() {
  console.log('\n🚀 Testing Registration Flow...\n');
  
  const email = await question('Enter test email: ');
  const name = await question('Enter full name: ');
  const password = await question('Enter password (min 8 chars): ');
  const role = await question('Enter role (student/teacher): ') || 'student';

  try {
    console.log('\n📤 Sending registration request...');
    const response = await axios.post(`${API_BASE}/auth/register`, {
      email,
      name,
      password,
      role
    });

    console.log('✅ Registration initiated:', response.data.message);
    
    // Get OTP from user
    const otp = await question('\n🔐 Enter OTP (check console logs if in dev mode): ');
    
    console.log('\n📤 Verifying OTP...');
    const verifyResponse = await axios.post(`${API_BASE}/auth/verify-signup-otp`, {
      email,
      otp,
      role
    });

    console.log('✅ Registration completed:', verifyResponse.data.message);
    return { email, password };
    
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data?.error || error.message);
    return null;
  }
}

async function testLogin(credentials) {
  console.log('\n🔐 Testing Login Flow...\n');
  
  const email = credentials?.email || await question('Enter email: ');
  const password = credentials?.password || await question('Enter password: ');

  try {
    console.log('\n📤 Sending login request...');
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password
    });

    console.log('✅ Login successful!');
    console.log('👤 User:', response.data.user.name);
    console.log('🎭 Role:', response.data.user.role);
    console.log('🏫 School:', response.data.user.school);
    console.log('⭐ Points:', response.data.user.points);
    console.log('🏆 Level:', response.data.user.level);
    
    return response.data.token;
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.error || error.message);
    return null;
  }
}

async function testTokenVerification(token) {
  console.log('\n🔍 Testing Token Verification...\n');
  
  try {
    const response = await axios.get(`${API_BASE}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Token verification successful!');
    console.log('👤 Verified user:', response.data.user.name);
    return true;
    
  } catch (error) {
    console.error('❌ Token verification failed:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testDemoLogin() {
  console.log('\n🎮 Testing Demo Login...\n');
  
  const demoAccounts = [
    { email: 'student@demo.com', password: 'demo123', role: 'Student' },
    { email: 'teacher@demo.com', password: 'demo123', role: 'Teacher' },
    { email: 'admin@demo.com', password: 'demo123', role: 'Admin' }
  ];

  for (const account of demoAccounts) {
    try {
      console.log(`\n📤 Testing ${account.role} demo login...`);
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: account.email,
        password: account.password
      });

      console.log(`✅ ${account.role} demo login successful!`);
      console.log('👤 User:', response.data.user.name);
      console.log('🎭 Role:', response.data.user.role);
      
    } catch (error) {
      console.error(`❌ ${account.role} demo login failed:`, error.response?.data?.error || error.message);
    }
  }
}

async function main() {
  console.log('🌍 GreenSphere Authentication System Test');
  console.log('==========================================\n');
  
  console.log('Available tests:');
  console.log('1. Full Registration + Login Flow');
  console.log('2. Login Only');
  console.log('3. Demo Account Login');
  console.log('4. All Tests');
  
  const choice = await question('\nSelect test (1-4): ');
  
  let credentials = null;
  let token = null;
  
  switch (choice) {
    case '1':
      credentials = await testRegistration();
      if (credentials) {
        token = await testLogin(credentials);
        if (token) {
          await testTokenVerification(token);
        }
      }
      break;
      
    case '2':
      token = await testLogin();
      if (token) {
        await testTokenVerification(token);
      }
      break;
      
    case '3':
      await testDemoLogin();
      break;
      
    case '4':
      console.log('\n🔄 Running all tests...\n');
      await testDemoLogin();
      credentials = await testRegistration();
      if (credentials) {
        token = await testLogin(credentials);
        if (token) {
          await testTokenVerification(token);
        }
      }
      break;
      
    default:
      console.log('❌ Invalid choice');
  }
  
  console.log('\n✨ Test completed!');
  rl.close();
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('\n💥 Unhandled error:', error.message);
  rl.close();
  process.exit(1);
});

// Start the test
main().catch((error) => {
  console.error('\n💥 Test failed:', error.message);
  rl.close();
  process.exit(1);
});