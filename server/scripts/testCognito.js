const { 
  CognitoIdentityProviderClient, 
  ListUsersCommand,
  DescribeUserPoolCommand 
} = require('@aws-sdk/client-cognito-identity-provider');

require('dotenv').config();

async function testCognitoConnection() {
  console.log('🔍 Testing Cognito Configuration...\n');

  // Check environment variables
  const requiredVars = [
    'AWS_REGION',
    'COGNITO_USER_POOL_ID', 
    'COGNITO_CLIENT_ID'
  ];

  console.log('📋 Environment Variables:');
  let allConfigured = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    const isConfigured = value && !value.includes('xxx') && !value.includes('your_');
    console.log(`  ${varName}: ${isConfigured ? '✅' : '❌'} ${value ? value.substring(0, 20) + '...' : 'Not set'}`);
    if (!isConfigured) allConfigured = false;
  });

  if (!allConfigured) {
    console.log('\n❌ Please configure all required environment variables');
    console.log('📖 See COGNITO_SETUP_GUIDE.md for instructions');
    return;
  }

  // Test Cognito connection
  try {
    const client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION
    });

    console.log('\n🔗 Testing Cognito Connection...');
    
    // Test user pool access
    const describeCommand = new DescribeUserPoolCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID
    });
    
    const userPoolInfo = await client.send(describeCommand);
    console.log('✅ Successfully connected to User Pool:', userPoolInfo.UserPool.Name);
    
    // Test listing users (to verify permissions)
    const listCommand = new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Limit: 1
    });
    
    await client.send(listCommand);
    console.log('✅ User Pool permissions verified');
    
    console.log('\n🎉 Cognito configuration is working correctly!');
    console.log('🚀 You can now use signup/login with OTP verification');
    
  } catch (error) {
    console.log('\n❌ Cognito connection failed:');
    console.log('Error:', error.message);
    
    if (error.name === 'ResourceNotFoundException') {
      console.log('💡 Check if your User Pool ID is correct');
    } else if (error.name === 'UnauthorizedOperation') {
      console.log('💡 Check your AWS credentials and permissions');
    } else {
      console.log('💡 Verify your AWS region and Cognito configuration');
    }
  }
}

// Run the test
testCognitoConnection().catch(console.error);