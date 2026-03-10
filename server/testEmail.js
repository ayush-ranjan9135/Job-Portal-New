import 'dotenv/config';
import { sendOTPEmail } from './utils/emailService.js';

const testEmail = async () => {
  console.log('🧪 Testing Brevo email service...\n');
  
  const testOTP = '123456';
  const testEmailAddress = 'test@example.com'; // Replace with your email
  
  const result = await sendOTPEmail(testEmailAddress, testOTP, 'verification');
  
  if (result.success) {
    console.log('\n✅ Test passed! Email sent successfully.');
    console.log('Message ID:', result.messageId);
  } else {
    console.log('\n❌ Test failed!');
    console.log('Error:', result.error);
  }
};

testEmail();
