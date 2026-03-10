# 🚀 Deploy to Render - Fix Cached Build

## The error is from Render's old cached build with nodemailer

---

## ✅ Steps to Fix:

### 1. Add RESEND_API_KEY to Render
1. Go to Render Dashboard
2. Select your service
3. Click **Environment** tab
4. Click **Add Environment Variable**
5. Key: `RESEND_API_KEY`
6. Value: `your_resend_api_key`
7. Click **Save**

### 2. Clear Build Cache & Redeploy
**Option A: Manual Deploy (Recommended)**
1. In Render Dashboard → Your Service
2. Click **Manual Deploy** dropdown
3. Select **Clear build cache & deploy**
4. Wait for deployment to complete

**Option B: Force Push**
```bash
git add .
git commit -m "Replace nodemailer with Resend"
git push origin main --force
```

### 3. Verify Deployment
Check logs for:
- ✅ No nodemailer errors
- ✅ "Email sent via Resend" when OTP is sent

---

## 🔑 Get Resend API Key

If you don't have it yet:
1. Go to: https://resend.com/
2. Sign up with GitHub/Email
3. Dashboard → API Keys
4. Click **Create API Key**
5. Name: "Job Portal Production"
6. Copy the key (starts with `re_`)

---

## ⚠️ Important

- Remove old env vars from Render:
  - ❌ `EMAIL_USER`
  - ❌ `EMAIL_PASSWORD`
- Keep only:
  - ✅ `RESEND_API_KEY`

---

## 🧪 Test After Deploy

1. Open your deployed app
2. Try company registration
3. Check if OTP email arrives
4. Check Render logs for success message

---

## 📊 Monitor Emails

View all sent emails:
https://resend.com/emails
