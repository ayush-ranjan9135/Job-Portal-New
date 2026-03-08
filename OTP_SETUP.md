# Email OTP Verification & Forgot Password Setup

## Backend Setup

### 1. Install nodemailer
```bash
cd server
npm install nodemailer
```

### 2. Configure Gmail for sending emails

**Option A: Using Gmail App Password (Recommended)**
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App passwords
4. Generate an app password for "Mail"
5. Copy the 16-character password

**Option B: Using Less Secure Apps (Not Recommended)**
1. Go to Google Account → Security
2. Enable "Less secure app access"

### 3. Update .env file
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

### 4. Update Render Environment Variables
Add these to your Render backend:
- `EMAIL_USER`: your-email@gmail.com
- `EMAIL_PASSWORD`: your-app-password

## Features Implemented

### ✅ Company Registration with OTP
- Company registers → OTP sent to email
- Account marked as `isVerified: false`
- Must verify OTP to activate account
- OTP expires in 5 minutes
- Maximum 5 OTP attempts

### ✅ Email OTP Verification
- 6-digit OTP sent via email
- Secure OTP storage (hashed)
- Resend OTP option (1-minute cooldown)
- Auto-login after verification

### ✅ Forgot Password
- Enter email → Receive OTP
- Verify OTP → Reset password
- New password securely hashed
- OTP expires in 5 minutes

## Security Features

1. **OTP Hashing**: OTPs stored as SHA-256 hash
2. **Rate Limiting**: 1-minute cooldown between OTP requests
3. **Attempt Limiting**: Maximum 5 verification attempts
4. **Expiration**: OTPs expire after 5 minutes
5. **Password Hashing**: Bcrypt with salt rounds

## API Endpoints

### Registration & Verification
- `POST /api/company/register` - Register company (sends OTP)
- `POST /api/company/verify-otp` - Verify OTP
- `POST /api/company/resend-otp` - Resend OTP

### Login
- `POST /api/company/login` - Login (checks verification status)

### Password Reset
- `POST /api/company/forgot-password` - Send reset OTP
- `POST /api/company/verify-reset-otp` - Verify reset OTP
- `POST /api/company/reset-password` - Reset password

## Testing Locally

1. Start backend: `npm run server`
2. Start frontend: `npm run dev`
3. Register a new company
4. Check your email for OTP
5. Enter OTP to verify account

## Deployment Notes

- Add EMAIL_USER and EMAIL_PASSWORD to Render environment variables
- Ensure MongoDB connection is working
- Test email sending in production

## Troubleshooting

**Email not sending?**
- Check Gmail app password is correct
- Verify 2FA is enabled
- Check spam folder
- Try different email service if needed

**OTP expired?**
- Click "Resend OTP"
- Wait 1 minute between resends

**Too many attempts?**
- Request new OTP
- Attempts reset with new OTP
