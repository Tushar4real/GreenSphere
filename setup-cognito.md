# AWS Cognito Setup for GreenSphere

## Quick Setup Steps:

1. **Create Cognito User Pool:**
   - Go to AWS Console → Cognito → User Pools
   - Create new user pool
   - Configure sign-in options: Email
   - Set password policy (minimum 8 characters)
   - Create pool

2. **Create App Client:**
   - In your user pool → App integration → App clients
   - Create app client
   - Enable "ALLOW_USER_PASSWORD_AUTH"
   - Copy Client ID

3. **Update Environment Variables:**

**Server (.env):**
```
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=your-actual-client-id
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

**Client (.env):**
```
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
REACT_APP_COGNITO_CLIENT_ID=your-actual-client-id
```

## Temporary Fix (Demo Mode):
The system will work with local authentication if Cognito is not configured.