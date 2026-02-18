import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send OTP Email
export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  const subject = purpose === 'verification' 
    ? 'Verify Your Job Portal Account' 
    : 'Reset Your Password';
  
  const message = purpose === 'verification'
    ? `Your verification OTP is: ${otp}. Valid for 5 minutes.`
    : `Your password reset OTP is: ${otp}. Valid for 5 minutes.`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">${subject}</h2>
        <p>Hello,</p>
        <p>${message}</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h1 style="color: #1f2937; text-align: center; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        <p style="color: #6b7280; font-size: 14px;">This OTP will expire in 5 minutes.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};
