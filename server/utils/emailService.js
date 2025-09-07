const nodemailer = require('nodemailer');

// Create transporter with validation
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
      process.env.EMAIL_USER.includes('your-email') || 
      process.env.EMAIL_PASS.includes('app-password')) {
    throw new Error('Email credentials not properly configured');
  }
  
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send OTP email
const sendOTPEmail = async (email, otpCode, name = 'User') => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    const transporter = createTransporter();
    
    // Verify transporter configuration with timeout
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email verification timeout')), 5001)
      )
    ]);
    
    const mailOptions = {
      from: {
        name: 'GreenSphere Platform',
        address: process.env.EMAIL_USER || 'greensphere.platform@gmail.com'
      },
      to: email,
      subject: '🌱 Your GreenSphere Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #28A745, #20C997); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .otp-box { background: #f8f9fa; border: 2px solid #28A745; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #28A745; letter-spacing: 5px; margin: 10px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
            .btn { background: #28A745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 GreenSphere</h1>
              <p style="color: white; margin: 5px 0;">Environmental Education Platform</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}! 👋</h2>
              <p>Welcome to GreenSphere! We're excited to have you join our environmental education community.</p>
              
              <p>To complete your registration, please use the verification code below:</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #666;">Your Verification Code</p>
                <div class="otp-code">${otpCode}</div>
                <p style="margin: 0; color: #666; font-size: 14px;">This code expires in 5 minutes</p>
              </div>
              
              <p>If you didn't request this code, please ignore this email.</p>
              
              <p>Ready to start your environmental journey? 🌱</p>
            </div>
            
            <div class="footer">
              <p>© 2025 GreenSphere Platform. Making environmental education engaging!</p>
              <p style="font-size: 12px;">This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${name}!
        
        Welcome to GreenSphere! 
        
        Your verification code is: ${otpCode}
        
        This code expires in 5 minutes.
        
        If you didn't request this code, please ignore this email.
        
        - GreenSphere Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully to:', email);
    console.log('🆔 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail
};