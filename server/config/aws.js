const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');

// Configure AWS Cognito Client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

module.exports = {
  cognitoClient
};