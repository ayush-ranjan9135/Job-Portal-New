import { BrevoClient } from '@getbrevo/brevo';

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  const subject = purpose === 'verification' 
    ? 'Verify Your Job Portal Account' 
    : 'Reset Your Password';
  
  const message = purpose === 'verification'
    ? `Your verification OTP is: ${otp}. Valid for 5 minutes.`
    : `Your password reset OTP is: ${otp}. Valid for 5 minutes.`;

  try {
    const data = await client.transactionalEmails.sendTransacEmail({
      subject,
      sender: { name: 'Job Portal', email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email }],
      htmlContent: `
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
    });
    console.log('✅ Email sent via Brevo:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('❌ Brevo error:', error);
    return { success: false, error: error.message };
  }
};
