# 🔧 OTP Email Fix for Render Deployment

## Problem
OTP emails are not being sent when deployed on Render, but work fine locally.

## Root Causes
1. **Gmail blocks emails from unknown server IPs** (Render's servers)
2. **App Password might be revoked or restricted**
3. **Missing environment variables on Render**
4. **Firewall/Port restrictions**

---

## ✅ Solutions (Try in Order)

### Solution 1: Verify Gmail App Password (MOST COMMON)
Your current app password: `puwvhzetcgoltccw`

**Steps:**
1. Go to: https://myaccount.google.com/apppasswords
2. Delete the old app password
3. Create a NEW app password:
   - Select app: "Mail"
   - Select device: "Other" → Name it "Job Portal Render"
4. Copy the NEW 16-character password
5. Update on Render:
   - Go to your Render dashboard
   - Select your service
   - Environment → Add/Update: `EMAIL_PASSWORD=<new_password>`
6. Redeploy the service

---

### Solution 2: Enable Less Secure Apps (If App Password Fails)
1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Wait 5-10 minutes
4. Redeploy on Render

---

### Solution 3: Unlock CAPTCHA
Sometimes Gmail blocks server IPs. Unlock it:
1. While logged into `ayushranjan9531@gmail.com`
2. Visit: https://accounts.google.com/DisplayUnlockCaptcha
3. Click "Continue"
4. Try sending OTP again within 10 minutes

---

### Solution 4: Use Alternative Email Service (RECOMMENDED FOR PRODUCTION)

#### Option A: SendGrid (Free 100 emails/day)
```bash
npm install @sendgrid/mail
```

Create `server/utils/sendgridService.js`:
```javascript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  const subject = purpose === 'verification' 
    ? 'Verify Your Job Portal Account' 
    : 'Reset Your Password';
  
  const message = purpose === 'verification'
    ? `Your verification OTP is: ${otp}. Valid for 5 minutes.`
    : `Your password reset OTP is: ${otp}. Valid for 5 minutes.`;

  const msg = {
    to: email,
    from: 'noreply@yourdomain.com', // Use your verified sender
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2563eb;">${subject}</h2>
        <p>${message}</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
          <h1 style="text-align: center; letter-spacing: 5px;">${otp}</h1>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error: error.message };
  }
};
```

**Setup:**
1. Sign up: https://sendgrid.com/
2. Verify sender email
3. Get API key
4. Add to Render: `SENDGRID_API_KEY=your_key`

---

#### Option B: AWS SES (Best for Production)
```bash
npm install @aws-sdk/client-ses
```

---

### Solution 5: Check Render Environment Variables
Ensure these are set on Render:
```
EMAIL_USER=ayushranjan9531@gmail.com
EMAIL_PASSWORD=puwvhzetcgoltccw
```

**Verify:**
1. Render Dashboard → Your Service
2. Environment tab
3. Check both variables exist
4. No extra spaces or quotes

---

### Solution 6: Test Email Locally First
```bash
cd server
node -e "
import('./utils/emailService.js').then(async (module) => {
  const result = await module.sendOTPEmail('test@example.com', '123456');
  console.log('Result:', result);
  process.exit(0);
});
"
```

---

## 🔍 Debugging on Render

### Check Logs:
1. Render Dashboard → Your Service
2. Logs tab
3. Look for:
   - `✅ Email server is ready to send messages` (Good)
   - `❌ Email transporter verification failed` (Bad - check credentials)
   - `📧 Attempting to send OTP email to:` (Email attempt)
   - `✅ Email sent successfully` (Success)
   - `❌ Email send error` (Failure - check error details)

### Common Error Messages:
- **"Invalid login"** → Wrong EMAIL_PASSWORD
- **"EAUTH"** → Authentication failed, regenerate app password
- **"ETIMEDOUT"** → Firewall/network issue
- **"Greeting never received"** → SMTP server unreachable

---

## 🚀 Quick Fix (If Urgent)

**Temporary workaround:** Use a different Gmail account
1. Create new Gmail: `jobportal.noreply@gmail.com`
2. Enable 2FA
3. Generate app password
4. Update Render env vars
5. Redeploy

---

## ✅ Verification Steps

After applying fixes:
1. Redeploy on Render
2. Check logs for "Email server is ready"
3. Test registration with real email
4. Check spam folder
5. Try resend OTP feature

---

## 📝 Best Practices for Production

1. **Use dedicated email service** (SendGrid/AWS SES)
2. **Add retry logic** for failed emails
3. **Log all email attempts** with timestamps
4. **Monitor email delivery rates**
5. **Have fallback notification method** (SMS)

---

## 🆘 Still Not Working?

Contact me with:
1. Render logs (last 50 lines)
2. Error message from browser console
3. Network tab screenshot of OTP request
4. Confirmation that env vars are set

---

## Updated Code Summary

I've already updated:
- ✅ `emailService.js` - Better error handling & logging
- ✅ `companyController.js` - Proper error responses
- ✅ Added transporter verification on startup
- ✅ Detailed error logging for debugging

**Next:** Deploy to Render and check logs!
