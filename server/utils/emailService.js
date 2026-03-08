import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  const subject = purpose === 'verification' 
    ? 'Verify Your Job Portal Account' 
    : 'Reset Your Password';
  
  const message = purpose === 'verification'
    ? `Your verification OTP is: ${otp}. Valid for 5 minutes.`
    : `Your password reset OTP is: ${otp}. Valid for 5 minutes.`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Job Portal <onboarding@resend.dev>',
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
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email sent via Resend:', data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
};
