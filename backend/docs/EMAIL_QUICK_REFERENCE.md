# 📧 Email System - Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Configure Gmail App Password

```bash
1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Click "App passwords"
4. Select "Mail" → Generate
5. Copy the 16-character password
```

### Step 2: Update .env

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # Your app password
FRONTEND_URL=http://localhost:3000
```

### Step 3: Test Email

```javascript
// Create test route
router.post('/test-email', async (req, res) => {
    const { sendEmail } = await import('./utils/email/sendEmail.js');
    const { welcomeTemplate } = await import('./utils/email/templates/welcomeTemplate.js');

    const result = await sendEmail({
        to: 'your-test-email@gmail.com',
        subject: 'Test Email',
        html: welcomeTemplate('Test User')
    });

    res.json(result);
});
```

---

## 📋 Available Templates

| Template | Use Case | Parameters |
|----------|----------|------------|
| `welcomeTemplate` | New user registration | `name` |
| `loginAlertTemplate` | Security notification | `name, time, ipAddress, location` |
| `resetPasswordTemplate` | Forgot password | `name, resetUrl` |
| `resetConfirmationTemplate` | Password changed | `name` |
| `enrollmentTemplate` | Course enrollment | `name, courseTitle, description, instructor` |
| `certificateTemplate` | Course completion | `name, courseTitle, completionDate` |

---

## 🔥 Common Use Cases

### Send Welcome Email

```javascript
import { sendEmail } from '../utils/email/sendEmail.js';
import { welcomeTemplate } from '../utils/email/templates/welcomeTemplate.js';

await sendEmail({
    to: user.email,
    subject: 'Welcome to GENAICOURSE.IO!',
    html: welcomeTemplate(user.name)
});
```

### Send Email with Attachment

```javascript
await sendEmail({
    to: user.email,
    subject: 'Your Certificate',
    html: certificateTemplate(user.name, course.title),
    attachments: [{
        filename: 'certificate.pdf',
        path: './certificates/cert-123.pdf',
        contentType: 'application/pdf'
    }]
});
```

### Send Critical Email with Retry

```javascript
import { sendEmailWithRetry } from '../utils/email/sendEmail.js';

await sendEmailWithRetry({
    to: user.email,
    subject: 'Password Reset',
    html: resetPasswordTemplate(user.name, resetUrl)
}, 3); // Retry 3 times
```

---

## 🔐 Security Features

✅ **Reset tokens are hashed** (SHA256)  
✅ **Tokens expire in 15 minutes**  
✅ **Single-use tokens** (cleared after use)  
✅ **User enumeration prevented**  
✅ **Gmail App Password** (not regular password)  
✅ **HTTPS required** in production  
✅ **Rate limiting** on forgot-password  

---

## 🛠️ API Endpoints

### Forgot Password

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
    "email": "user@example.com"
}
```

**Response:**

```json
{
    "success": true,
    "message": "If an account exists with this email, you will receive password reset instructions."
}
```

### Reset Password

```http
PUT /api/auth/reset-password/:token
Content-Type: application/json

{
    "password": "newPassword123"
}
```

**Response:**

```json
{
    "success": true,
    "message": "Password reset successful",
    "data": {
        "user": { ... },
        "token": "jwt-token"
    }
}
```

---

## 🎨 Customizing Templates

### Modify Existing Template

```javascript
// utils/email/templates/welcomeTemplate.js

export const welcomeTemplate = (name, customMessage) => {
    return `
    <!DOCTYPE html>
    <html>
    <body>
        <h1>Welcome, ${name}!</h1>
        <p>${customMessage || 'Thank you for joining!'}</p>
        <!-- Your custom HTML -->
    </body>
    </html>
    `;
};
```

### Create New Template

```javascript
// utils/email/templates/customTemplate.js

export const customTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif;">
        <h2>${data.title}</h2>
        <p>${data.message}</p>
    </body>
    </html>
    `;
};

export default customTemplate;
```

---

## 🚨 Troubleshooting

### Problem: Emails not sending

**Solutions:**

1. ✅ Check `.env` has correct `EMAIL_USER` and `EMAIL_PASS`
2. ✅ Verify you're using **App Password**, not regular password
3. ✅ Check console for error messages
4. ✅ Test transporter connection:

```javascript
const transporter = getTransporter();
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to send emails');
    }
});
```

### Problem: Emails going to spam

**Solutions:**

1. ✅ Use verified domain (SendGrid/SES)
2. ✅ Add SPF/DKIM records to your domain
3. ✅ Avoid spam trigger words ("FREE", "CLICK HERE", etc.)
4. ✅ Include unsubscribe link

### Problem: Token expired

**Solution:**

- Tokens expire in 15 minutes (security feature)
- User must request new reset link
- To extend: Change `15 * 60 * 1000` to `30 * 60 * 1000` in `forgotPassword` controller

---

## 📊 Production Checklist

- [ ] Replace Gmail with SendGrid or Amazon SES
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Enable HTTPS
- [ ] Add rate limiting to forgot-password route
- [ ] Set up email monitoring/analytics
- [ ] Configure SPF/DKIM records
- [ ] Test all email flows
- [ ] Set up error alerting (Sentry, etc.)
- [ ] Document email templates for team
- [ ] Train support team on email issues

---

## 🔄 Migration to SendGrid

### Install SendGrid

```bash
npm install @sendgrid/mail
```

### Update transporter.js

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});
```

### Update .env

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
```

---

## 📈 Performance Tips

### 1. Send Emails Asynchronously

```javascript
// ❌ BAD: Blocks response
await sendEmail({ ... });
res.json({ success: true });

// ✅ GOOD: Non-blocking
sendEmail({ ... }).catch(console.error);
res.json({ success: true });
```

### 2. Use Background Jobs for High Volume

```javascript
import Queue from 'bull';

const emailQueue = new Queue('email');

emailQueue.process(async (job) => {
    return await sendEmail(job.data);
});

// Add to queue
await emailQueue.add({ to, subject, html });
```

### 3. Batch Multiple Emails

```javascript
const emails = users.map(user => ({
    to: user.email,
    subject: 'Update',
    html: template(user.name)
}));

await Promise.all(emails.map(sendEmail));
```

---

## 📞 Support

- **Documentation:** `/backend/docs/EMAIL_SYSTEM_DOCUMENTATION.md`
- **Examples:** `/backend/docs/EMAIL_INTEGRATION_EXAMPLES.js`
- **Email:** support@genaicourse.io

---

**Last Updated:** 2026-02-13  
**Version:** 1.0.0  
**Status:** Production Ready ✅
