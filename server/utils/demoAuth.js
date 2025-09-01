// Demo authentication for development without AWS Cognito
class DemoAuth {
  static async registerUser(userData) {
    // Simulate Cognito user creation
    return {
      User: {
        Username: userData.email,
        UserStatus: 'CONFIRMED'
      }
    };
  }

  static async authenticateUser(email, password) {
    // Simple demo validation
    if (password.length < 6) {
      const error = new Error('Password too short');
      error.code = 'NotAuthorizedException';
      throw error;
    }

    // Simulate successful authentication
    return {
      AuthenticationResult: {
        AccessToken: 'demo-access-token',
        IdToken: 'demo-id-token',
        RefreshToken: 'demo-refresh-token'
      }
    };
  }

  static async forgotPassword(email) {
    return { message: 'Demo: Password reset code sent' };
  }

  static async confirmForgotPassword(email, code, newPassword) {
    return { message: 'Demo: Password reset confirmed' };
  }

  static async changePassword(accessToken, oldPassword, newPassword) {
    return { message: 'Demo: Password changed' };
  }
}

module.exports = DemoAuth;