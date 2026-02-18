import crypto from 'crypto';

// Generate 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Hash OTP for secure storage
export const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

// Verify OTP
export const verifyOTP = (inputOTP, hashedOTP) => {
  const inputHash = hashOTP(inputOTP);
  return inputHash === hashedOTP;
};

// Check if OTP is expired
export const isOTPExpired = (otpExpiry) => {
  return new Date() > new Date(otpExpiry);
};

// Generate OTP expiry time (5 minutes from now)
export const getOTPExpiry = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};
