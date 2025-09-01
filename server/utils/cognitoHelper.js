const AWS = require('aws-sdk');

// Configure AWS Cognito
AWS.config.update({
  region: process.env.AWS_REGION
});

const cognito = new AWS.CognitoIdentityServiceProvider();

class CognitoHelper {
  // Register user with email verification
  static async registerUser(userData) {
    const { email, password, name } = userData;
    
    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      TemporaryPassword: password,
      MessageAction: 'SUPPRESS', // Don't send welcome email
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
        { Name: 'email_verified', Value: 'true' }
      ]
    };

    const cognitoUser = await cognito.adminCreateUser(params).promise();
    
    // Set permanent password
    await cognito.adminSetUserPassword({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true
    }).promise();

    return cognitoUser;
  }

  // Authenticate user
  static async authenticateUser(email, password) {
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };

    const result = await cognito.adminInitiateAuth(params).promise();
    return result;
  }

  // Send verification code for password reset
  static async forgotPassword(email) {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email
    };

    return await cognito.forgotPassword(params).promise();
  }

  // Confirm password reset with code
  static async confirmForgotPassword(email, confirmationCode, newPassword) {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: newPassword
    };

    return await cognito.confirmForgotPassword(params).promise();
  }

  // Change password for authenticated user
  static async changePassword(accessToken, oldPassword, newPassword) {
    const params = {
      AccessToken: accessToken,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword
    };

    return await cognito.changePassword(params).promise();
  }

  // Get user details from Cognito
  static async getUserDetails(email) {
    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email
    };

    return await cognito.adminGetUser(params).promise();
  }

  // Delete user from Cognito
  static async deleteUser(email) {
    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email
    };

    return await cognito.adminDeleteUser(params).promise();
  }
}

module.exports = CognitoHelper;