# AWS Cognito Setup Guide for GreenSphere

## Prerequisites
- AWS Account
- AWS CLI installed (optional but recommended)

## Step 1: Create User Pool

1. **Go to AWS Cognito Console**
   - Navigate to https://console.aws.amazon.com/cognito/
   - Click "User pools"

2. **Create User Pool**
   - Click "Create user pool"
   - Choose "Email" as sign-in option
   - Click "Next"

3. **Configure Security Requirements**
   - Password policy: Default (or customize as needed)
   - Multi-factor authentication: Optional (recommended: OFF for development)
   - Click "Next"

4. **Configure Sign-up Experience**
   - Self-service sign-up: Enable
   - Required attributes: 
     - Email (already selected)
     - Name
   - Custom attributes: Add these:
     - `role` (String, Mutable)
     - `school` (String, Mutable)
   - Click "Next"

5. **Configure Message Delivery**
   - Email provider: Send email with Cognito (for development)
   - Click "Next"

6. **Integrate Your App**
   - User pool name: `greensphere-users`
   - App client name: `greensphere-client`
   - Client secret: Generate (IMPORTANT: Keep this secure)
   - Click "Next"

7. **Review and Create**
   - Review settings
   - Click "Create user pool"

## Step 2: Get Configuration Values

After creating the user pool, note these values:

1. **User Pool ID**: Found on the user pool overview page
   - Format: `us-east-1_xxxxxxxxx`

2. **App Client ID**: Go to "App integration" tab
   - Click on your app client
   - Copy the "Client ID"

3. **App Client Secret**: In the same app client page
   - Copy the "Client secret"

4. **Region**: The AWS region where you created the pool
   - Example: `us-east-1`

## Step 3: Create IAM User (Recommended)

1. **Go to IAM Console**
   - Navigate to https://console.aws.amazon.com/iam/

2. **Create User**
   - Click "Users" → "Create user"
   - Username: `greensphere-cognito-user`
   - Access type: Programmatic access

3. **Attach Policy**
   - Create custom policy with these permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "cognito-idp:AdminCreateUser",
           "cognito-idp:AdminSetUserPassword",
           "cognito-idp:AdminInitiateAuth",
           "cognito-idp:AdminGetUser",
           "cognito-idp:AdminDeleteUser",
           "cognito-idp:ForgotPassword",
           "cognito-idp:ConfirmForgotPassword",
           "cognito-idp:ChangePassword"
         ],
         "Resource": "arn:aws:cognito-idp:*:*:userpool/*"
       }
     ]
   }
   ```

4. **Get Credentials**
   - Save the Access Key ID and Secret Access Key

## Step 4: Update Environment Variables

Update your `.env` files:

### Server (.env)
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/greensphere
JWT_SECRET=your-super-secret-jwt-key-for-development

# AWS Cognito Configuration
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=your-client-id
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

### Client (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_AWS_REGION=us-east-1
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
REACT_APP_COGNITO_CLIENT_ID=your-client-id
```

## Step 5: Test the Setup

1. **Start your servers**
   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev
   
   # Terminal 2 - Client
   cd client
   npm start
   ```

2. **Test Registration**
   - Go to http://localhost:3000/register
   - Create a test account
   - Check AWS Cognito console to see the user

3. **Test Login**
   - Use the same credentials to login
   - Verify JWT token is generated

## Troubleshooting

### Common Issues:

1. **"User pool does not exist"**
   - Check COGNITO_USER_POOL_ID format
   - Ensure region matches

2. **"Invalid client id"**
   - Verify COGNITO_CLIENT_ID
   - Check if app client exists

3. **"Access denied"**
   - Verify IAM permissions
   - Check AWS credentials

4. **"Password policy violation"**
   - Ensure password meets Cognito requirements
   - Default: 8+ characters, mixed case, numbers

### Demo Mode
If you encounter issues, the app will automatically use demo mode with these credentials:
- AWS_ACCESS_KEY_ID=demo-access-key
- Any email/password combination will work in demo mode

## Security Notes

- Never commit real AWS credentials to version control
- Use IAM roles in production
- Enable MFA for production environments
- Regularly rotate access keys
- Use least privilege principle for IAM policies

## Production Considerations

1. **Custom Domain**: Set up custom domain for Cognito
2. **SES Integration**: Use Amazon SES for email delivery
3. **Lambda Triggers**: Add custom validation/processing
4. **Monitoring**: Set up CloudWatch alerts
5. **Backup**: Regular user pool backups