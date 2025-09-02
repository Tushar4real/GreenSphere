# 📧 Email Setup Guide for GreenSphere

This guide will help you configure email functionality to send OTP codes to users' email addresses.

## 🚀 Quick Setup (Gmail)

### 1. **Create Gmail App Password**

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled
4. Go to **App passwords**
5. Generate a new app password for "GreenSphere"
6. Copy the 16-character password

### 2. **Update Environment Variables**

Add these to your `/server/.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 3. **Test Email Functionality**

```bash
# Start the server
cd server && npm start

# Test registration with a real email
curl -X POST http://localhost:9000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@gmail.com", "name": "Test User", "password": "TestPass123!", "role": "student"}'
```

## 🔧 Alternative Email Providers

### **Outlook/Hotmail**
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### **Custom SMTP**
Update `/server/utils/emailService.js`:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-server.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## 📋 Email Template Features

The OTP email includes:
- **Professional design** with GreenSphere branding
- **Large, clear OTP code** (6 digits)
- **5-minute expiration notice**
- **Mobile-responsive** HTML template
- **Plain text fallback**

## 🛠️ Troubleshooting

### **Common Issues:**

1. **"Invalid login"**
   - Ensure 2-Step Verification is enabled
   - Use App Password, not regular password
   - Check EMAIL_USER format

2. **"Connection timeout"**
   - Check internet connection
   - Verify SMTP settings
   - Try different email provider

3. **Email not received**
   - Check spam/junk folder
   - Verify email address is correct
   - Check email provider limits

### **Fallback Behavior:**
- If email fails, OTP still appears in server console
- Users can still complete registration using console OTP
- System gracefully handles email failures

## 🔒 Security Notes

- **Never commit** real email credentials to version control
- **Use environment variables** for all sensitive data
- **App passwords** are more secure than regular passwords
- **Rotate credentials** regularly

## 📧 Email Preview

```
Subject: 🌱 Your GreenSphere Verification Code

Hello [Name]! 👋

Welcome to GreenSphere! We're excited to have you join our environmental education community.

To complete your registration, please use the verification code below:

┌─────────────────────────┐
│   Your Verification Code │
│        123456           │
│  This code expires in   │
│       5 minutes         │
└─────────────────────────┘

If you didn't request this code, please ignore this email.

Ready to start your environmental journey? 🌱

© 2024 GreenSphere Platform
```

## ✅ Verification

After setup, you should see:
- ✅ Server console: "📧 Email sent successfully"
- ✅ User receives formatted OTP email
- ✅ Fallback console OTP if email fails
- ✅ Registration completes successfully

---

**Need help?** Check the server logs for detailed error messages.