import { 
  CognitoIdentityProviderClient, 
  SignUpCommand, 
  InitiateAuthCommand, 
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand
} from '@aws-sdk/client-cognito-identity-provider';

class CognitoAuthService {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    this.init();
  }

  init() {
    const userPoolId = process.env.REACT_APP_COGNITO_USER_POOL_ID;
    const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
    const region = process.env.REACT_APP_AWS_REGION;

    if (userPoolId && clientId && region && 
        !userPoolId.includes('xxx') && !clientId.includes('xxx')) {
      this.client = new CognitoIdentityProviderClient({ region });
      this.userPoolId = userPoolId;
      this.clientId = clientId;
      this.isConfigured = true;
      console.log('✅ Cognito configured successfully');
    } else {
      console.log('⚠️ Cognito not configured, using backend authentication');
    }
  }

  async signUp(email, password, name) {
    if (!this.isConfigured) {
      throw new Error('Cognito not configured');
    }

    const username = email.replace(/[@.]/g, '_');
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name }
      ]
    });

    return await this.client.send(command);
  }

  async confirmSignUp(email, confirmationCode) {
    if (!this.isConfigured) {
      throw new Error('Cognito not configured');
    }

    const username = email.replace(/[@.]/g, '_');
    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: confirmationCode
    });

    return await this.client.send(command);
  }

  async signIn(email, password) {
    if (!this.isConfigured) {
      throw new Error('Cognito not configured');
    }

    const username = email.replace(/[@.]/g, '_');
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    });

    return await this.client.send(command);
  }

  async forgotPassword(email) {
    if (!this.isConfigured) {
      throw new Error('Cognito not configured');
    }

    const username = email.replace(/[@.]/g, '_');
    const command = new ForgotPasswordCommand({
      ClientId: this.clientId,
      Username: username
    });

    return await this.client.send(command);
  }

  async confirmForgotPassword(email, confirmationCode, newPassword) {
    if (!this.isConfigured) {
      throw new Error('Cognito not configured');
    }

    const username = email.replace(/[@.]/g, '_');
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
      Password: newPassword
    });

    return await this.client.send(command);
  }
}

export default new CognitoAuthService();