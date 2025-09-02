# 🔐 AWS Cognito Setup Guide for GreenSphere

## Quick Setup Steps

### 1. Create AWS Cognito User Pool

1. **Go to AWS Console** → Cognito → User Pools
2. **Click "Create user pool"**
3. **Configure sign-in experience:**
   - Provider types: `Cognito user pool`
   - Cognito user pool sign-in options: ✅ `Email`

4. **Configure security requirements:**
   - Password policy: `Cognito defaults` (or custom)
   - Multi-factor authentication: `No MFA` (for simplicity)
   - User account recovery: ✅ `Enable self-service account recovery - Recommended`
   - Delivery method for user account recovery messages: `Email only`

5. **Configure sign-up experience:**
   - Self-registration: ✅ `Enable self-registration`
   - Cognito-assisted verification and confirmation: ✅ `Allow Cognito to automatically send messages to verify and confirm - Recommended`
   - Verifying attribute changes: ✅ `Keep original attribute value active when an update is pending - Recommended`
   - Required attributes: `email`, `name`

6. **Configure message delivery:**
   - Email provider: `Send email with Cognito` (for testing)
   - FROM email address: `no-reply@verificationemail.com`

7. **Integrate your app:**
   - User pool name: `GreenSphere-UserPool`
   - App client name: `GreenSphere-Client`
   - Client secret: `Don't generate a client secret`

### 2. Configure App Client Settings

After creating the user pool:

1. **Go to your User Pool** → App integration → App clients
2. **Click on your app client**
3. **Note down:**
   - User Pool ID (e.g., `us-east-1_xxxxxxxxx`)
   - Client ID (e.g., `xxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 3. Update Environment Variables

**Server (.env):**
```env
# Replace with your actual values
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Client (.env):**
```env
# Replace with your actual values
REACT_APP_AWS_REGION=us-east-1
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
REACT_APP_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Test the Authentication Flow

1. **Start your servers:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start

   # Terminal 2 - Frontend  
   cd client
   npm start
   ```

2. **Test signup:**
   - Go to `/register`
   - Fill in the form
   - Check your email for OTP
   - Verify with the OTP code

3. **Test login:**
   - Go to `/login`
   - Use your registered credentials

## 🔧 Current Authentication Features

Your system already supports:

✅ **Signup Flow:**
- User registration with email/password
- Automatic OTP generation via Cognito
- Email delivery of verification codes
- OTP verification and account activation

✅ **Login Flow:**
- Email/password authentication
- JWT token generation
- Role-based access (student/teacher/admin)
- Automatic token refresh

✅ **Security Features:**
- Password validation (8+ characters)
- Email verification required
- Secure token storage
- Role-based authorization

✅ **Fallback System:**
- Local authentication if Cognito fails
- Demo accounts for testing
- Development mode support

## 🚀 Ready to Use!

Once you update your environment variables with the actual Cognito User Pool ID and Client ID, your authentication system will work seamlessly with:

- **Custom UI** (no Amplify required)
- **OTP verification** via email
- **Secure login/signup** flow
- **Role management** for students/teachers/admins

## 🔍 Troubleshooting

If you encounter issues:

1. **Check environment variables** are properly set
2. **Verify Cognito configuration** in AWS Console
3. **Check browser console** for error messages
4. **Test with demo accounts** first (student@demo.com / demo123)

Your authentication system is production-ready! 🎉