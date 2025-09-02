# 🔐 AWS Cognito Setup Guide for GreenSphere

This guide will help you set up AWS Cognito for production-ready authentication in GreenSphere.

## 📋 Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured (optional)
- Basic understanding of AWS services

## 🚀 Step-by-Step Setup

### 1. Create AWS Cognito User Pool

1. **Login to AWS Console**
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - Navigate to **Cognito** service

2. **Create User Pool**
   - Click "Create user pool"
   - Choose "Email" as sign-in option
   - Configure password policy:
     - Minimum length: 8 characters
     - Require uppercase letters
     - Require lowercase letters
     - Require numbers
     - Require special characters

3. **Configure Sign-up Experience**
   - Required attributes: `email`, `name`
   - Enable email verification
   - Set verification message customization

4. **Configure Message Delivery**
   - Choose "Send email with Cognito" for development
   - For production, configure SES for better deliverability

5. **Create User Pool**
   - Review settings and create the pool
   - **Note down the User Pool ID** (format: `us-east-1_xxxxxxxxx`)

### 2. Create App Client

1. **In your User Pool**
   - Go to "App integration" tab
   - Click "Create app client"

2. **Configure App Client**
   - App type: "Public client"
   - App client name: "GreenSphere-Web"
   - Authentication flows:
     - ✅ ALLOW_USER_PASSWORD_AUTH
     - ✅ ALLOW_REFRESH_TOKEN_AUTH
     - ✅ ALLOW_USER_SRP_AUTH

3. **Create App Client**
   - **Note down the Client ID** (format: `xxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 3. Configure IAM User (Optional for Enhanced Security)

1. **Create IAM User**
   - Go to IAM service
   - Create user: "greensphere-cognito-user"

2. **Attach Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "cognito-idp:AdminCreateUser",
           "cognito-idp:AdminDeleteUser",
           "cognito-idp:AdminGetUser",
           "cognito-idp:AdminListGroupsForUser",
           "cognito-idp:AdminSetUserPassword",
           "cognito-idp:AdminUpdateUserAttributes",
           "cognito-idp:InitiateAuth",
           "cognito-idp:SignUp",
           "cognito-idp:ConfirmSignUp",
           "cognito-idp:ForgotPassword",
           "cognito-idp:ConfirmForgotPassword",
           "cognito-idp:ChangePassword"
         ],
         "Resource": "arn:aws:cognito-idp:*:*:userpool/*"
       }
     ]
   }
   ```

3. **Create Access Keys**
   - Generate access key and secret key
   - **Store securely** - you'll need these for environment variables

## 🔧 Environment Configuration

### Server Environment (.env)

Update your `/server/.env` file:

```env
# Database
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key-for-greensphere

# Server
PORT=9000

# AWS Cognito Configuration
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# AWS Credentials (Optional - for enhanced security)
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
```

### Client Environment (.env)

Update your `/client/.env` file:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:9000/api

# AWS Cognito Configuration
REACT_APP_AWS_REGION=us-east-1
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
REACT_APP_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Development
WDS_SOCKET_HOST=localhost
WDS_SOCKET_PORT=3000
```

## 🧪 Testing the Setup

### 1. Test Registration Flow

```bash
# Start the servers
npm run dev

# Test registration with a real email
# Check your email for OTP verification
```

### 2. Test Login Flow

```bash
# Try logging in with registered credentials
# Should work with AWS Cognito authentication
```

### 3. Fallback Testing

```bash
# If Cognito is not configured, the system will:
# 1. Use local authentication
# 2. Generate OTP in console logs
# 3. Store passwords locally with bcrypt
```

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit real AWS credentials to version control
- Use different Cognito pools for development/staging/production
- Rotate access keys regularly

### 2. Cognito Configuration
- Enable MFA for admin accounts
- Set up proper password policies
- Configure account lockout policies
- Enable advanced security features

### 3. Network Security
- Use HTTPS in production
- Configure CORS properly
- Implement rate limiting

## 🚨 Troubleshooting

### Common Issues

1. **"User Pool not found"**
   - Check User Pool ID format
   - Verify AWS region matches

2. **"Invalid client id"**
   - Verify App Client ID
   - Check if client is enabled

3. **"Access denied"**
   - Check IAM permissions
   - Verify AWS credentials

4. **Email not sending**
   - Check Cognito email configuration
   - Consider setting up SES for production

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=true
NODE_ENV=development
```

## 📚 Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Cognito User Pool Best Practices](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings.html)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)

## 🆘 Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with demo credentials first
4. Check AWS CloudWatch logs for Cognito errors

---

**Note**: The system includes fallback authentication, so it will work even without AWS Cognito configured. However, for production use, proper AWS Cognito setup is recommended for security and scalability.