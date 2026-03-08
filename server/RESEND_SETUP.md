# 🚀 Resend API Setup Guide

## ✅ Migration Complete!
Nodemailer has been replaced with Resend API.

---

## 📝 Setup Steps

### 1. Add Your Resend API Key to `.env`
```env
RESEND_API_KEY=re_your_actual_api_key_here
```

### 2. Add to Render Environment Variables
1. Go to Render Dashboard
2. Select your service
3. Environment tab
4. Add: `RESEND_API_KEY` = `your_api_key`
5. Save & Redeploy

### 3. Get Resend API Key (if you don't have it)
1. Go to: https://resend.com/
2. Sign up / Login
3. Go to API Keys section
4. Create new API key
5. Copy and paste into `.env`

---

## 🎯 What Changed

- ❌ Removed: `nodemailer` package
- ❌ Removed: `EMAIL_USER` and `EMAIL_PASSWORD` env vars
- ✅ Added: `resend` package
- ✅ Added: `RESEND_API_KEY` env var
- ✅ Updated: `emailService.js` to use Resend

---

## 📧 Email Sender

Default sender: `Job Portal <onboarding@resend.dev>`

**To use custom domain:**
1. Verify your domain in Resend dashboard
2. Update `emailService.js` line 8:
   ```javascript
   from: 'Job Portal <noreply@yourdomain.com>',
   ```

---

## ✅ Benefits of Resend

- ✅ Works perfectly on Render free tier
- ✅ No Gmail restrictions
- ✅ 100 emails/day free
- ✅ Better deliverability
- ✅ Simple API
- ✅ No SMTP configuration needed

---

## 🧪 Test Locally

```bash
cd server
npm run dev
```

Then test registration with OTP!

---

## 🚀 Deploy to Render

1. Add `RESEND_API_KEY` to Render environment
2. Push code to GitHub
3. Render will auto-deploy
4. Test OTP functionality

---

## 🆘 Troubleshooting

**Error: "Missing API key"**
- Check `.env` has `RESEND_API_KEY`
- Check Render environment variables

**Error: "Invalid API key"**
- Regenerate key in Resend dashboard
- Update in `.env` and Render

**Emails not received:**
- Check spam folder
- Verify API key is correct
- Check Resend dashboard logs

---

## 📊 Monitor Emails

View sent emails in Resend dashboard:
https://resend.com/emails
