# 🚀 Brevo (Sendinblue) Setup Guide

## ✅ Integration Complete!

---

## 📝 Quick Setup

### 1. Get Brevo API Key
1. Go to: https://app.brevo.com/
2. Sign up / Login (Free account: 300 emails/day)
3. Go to: **Settings** → **SMTP & API** → **API Keys**
4. Click **Generate a new API key**
5. Name: "Job Portal"
6. Copy the API key (starts with `xkeysib-`)

### 2. Add to Local `.env`
```env
BREVO_API_KEY=xkeysib-your_actual_api_key_here
```

### 3. Add to Render
1. Render Dashboard → Your Service
2. **Environment** tab
3. Add: `BREVO_API_KEY` = `xkeysib-your_key`
4. **Manual Deploy** → **Clear build cache & deploy**

---

## ✅ Benefits of Brevo

- ✅ No domain verification needed
- ✅ 300 emails/day FREE
- ✅ Works on Render free tier
- ✅ Better deliverability than Gmail
- ✅ Email tracking & analytics
- ✅ Professional email service

---

## 🧪 Test Locally

```bash
cd server
npm run dev
```

Test registration → OTP should arrive!

---

## 📧 Sender Email

Default: `noreply@jobportal.com`

To change, edit `emailService.js` line 33:
```javascript
sendSmtpEmail.sender = { name: 'Job Portal', email: 'your@email.com' };
```

---

## 📊 Monitor Emails

View sent emails in Brevo dashboard:
https://app.brevo.com/statistics/email

---

## 🆘 Troubleshooting

**Error: "Unauthorized"**
- Check API key is correct
- Regenerate key if needed

**Emails not received:**
- Check spam folder
- Verify API key in Brevo dashboard
- Check daily limit (300/day free)

**Error: "Invalid sender"**
- Use any email as sender (no verification needed!)
- Default works fine: `noreply@jobportal.com`

---

## 🎯 Deploy Checklist

- [x] Brevo package installed
- [x] emailService.js updated
- [ ] Add `BREVO_API_KEY` to local `.env`
- [ ] Add `BREVO_API_KEY` to Render
- [ ] Clear Render build cache
- [ ] Deploy & test

---

## 🔑 Free Tier Limits

- 300 emails/day
- Unlimited contacts
- Email tracking
- API access

Perfect for your job portal! 🚀
