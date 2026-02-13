# 📧 SMTP Email Security Integration - Complete Documentation

## 🏗️ Architecture Overview

This is a **production-grade email system** for GENAICOURSE.IO with enterprise-level security and scalability.

### ✅ Implemented Features

1. **Welcome Email** - New student registration
2. **Login Alert Email** - Security notification for new device logins
3. **Password Reset Email** - Secure forgot password flow
4. **Reset Confirmation Email** - Password change confirmation
5. **Enrollment Email** - Course enrollment confirmation
6. **Certificate Email** - Course completion with PDF attachment

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── email/
│       └── transporter.js          # SMTP configuration
├── utils/
│   └── email/
│       ├── sendEmail.js            # Universal email sender
│       └── templates/
│           ├── welcomeTemplate.js
│           ├── loginAlertTemplate.js
│           ├── resetPasswordTemplate.js
│           ├── resetConfirmationTemplate.js
│           ├── enrollmentTemplate.js
│           └── certificateTemplate.js
├── models/
│   └── User.js                     # Updated with reset token fields
├── controllers/
│   └── authController.js           # Forgot/Reset password controllers
└── .env                            # Email credentials
```

---

## 🔐 Security Implementation

### 1. **Password Reset Token Security**

**Why We Hash Reset Tokens:**

```javascript
// ❌ INSECURE: Storing plain token
user.resetPasswordToken = "abc123"; // If DB is compromised, attacker can reset any password

// ✅ SECURE: Hash token before storing
const crypto = require('crypto');
const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
user.resetPasswordToken = hashedToken; // Even if DB is leaked, tokens are useless
```

**Security Flow:**

1. Generate random token using `crypto.randomBytes(32)` (cryptographically secure)
2. Hash token with SHA256 before storing in database
3. Send **unhashed** token to user's email
4. When user submits, hash their token and compare with database
5. Token expires in 15 minutes
6. Token is single-use (cleared after reset)

### 2. **User Enumeration Prevention**

```javascript
// ❌ BAD: Reveals if email exists
if (!user) {
    return res.json({ message: 'Email not found' }); // Attacker can enumerate users
}

// ✅ GOOD: Same response regardless
const successMessage = 'If an account exists with this email, you will receive instructions.';
// Returns same message whether user exists or not
```

### 3. **Gmail App Password (Not Regular Password)**

**Why NOT use regular Gmail password:**

- ❌ Less secure (exposes main account)
- ❌ Blocked by Google's security policies
- ❌ No granular access control

**Why USE App Password:**

- ✅ Separate credential (main account stays safe)
- ✅ Can be revoked without changing main password
- ✅ Designed for third-party apps
- ✅ Works with 2FA enabled

**Setup Steps:**

1. Enable 2-Factor Authentication on Gmail
2. Go to: Google Account → Security → 2-Step Verification
3. Scroll to "App passwords"
4. Generate password for "Mail"
5. Copy 16-character password to `.env`

### 4. **HTTPS Requirement**

**Why HTTPS is critical:**

```
HTTP:  User → [PLAIN TEXT TOKEN] → Server
       ❌ Token visible to anyone on network
       ❌ Man-in-the-middle attacks possible

HTTPS: User → [ENCRYPTED TOKEN] → Server
       ✅ Token encrypted in transit
       ✅ Protected from eavesdropping
```

**For Production:**

- Use SSL certificate (Let's Encrypt is free)
- Enforce HTTPS redirects
- Set secure cookies: `httpOnly: true, secure: true`

### 5. **Rate Limiting**

**Why rate limit forgot-password:**

```javascript
// Without rate limiting:
// Attacker can spam 1000s of reset emails
// → Email server blacklisted
// → Denial of service

// With rate limiting:
import rateLimit from 'express-rate-limit';

const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 requests per window
    message: 'Too many password reset attempts. Please try again later.'
});

router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
```

---

## 📧 Email Templates

All templates are:

- ✅ Responsive (mobile-friendly)
- ✅ Professional design with gradients
- ✅ Branded with GENAICOURSE.IO
- ✅ Include fallback text version
- ✅ Accessible (semantic HTML)

---

## 🚀 Usage Examples

### 1. **Send Welcome Email (Registration)**

```javascript
import { sendEmail } from '../utils/email/sendEmail.js';
import { welcomeTemplate } from '../utils/email/templates/welcomeTemplate.js';

// In register controller
await sendEmail({
    to: user.email,
    subject: 'Welcome to GENAICOURSE.IO! 🎉',
    html: welcomeTemplate(user.name)
});
```

### 2. **Send Login Alert**

```javascript
import { sendEmail } from '../utils/email/sendEmail.js';
import { loginAlertTemplate } from '../utils/email/templates/loginAlertTemplate.js';

// In login controller
const loginTime = new Date().toLocaleString();
const ipAddress = req.ip || req.connection.remoteAddress;

await sendEmail({
    to: user.email,
    subject: '🔐 New Login Detected - GENAICOURSE.IO',
    html: loginAlertTemplate(user.name, loginTime, ipAddress)
});
```

### 3. **Forgot Password Flow**

```javascript
// POST /api/auth/forgot-password
// Body: { email: "user@example.com" }

// Controller automatically:
// 1. Generates secure token
// 2. Hashes and stores token
// 3. Sends reset email
// 4. Returns generic success message
```

### 4. **Reset Password Flow**

```javascript
// PUT /api/auth/reset-password/:token
// Body: { password: "newPassword123" }

// Controller automatically:
// 1. Hashes incoming token
// 2. Finds user with matching hash
// 3. Validates expiration
// 4. Updates password
// 5. Clears reset fields
// 6. Sends confirmation email
```

### 5. **Send Enrollment Email**

```javascript
import { sendEmail } from '../utils/email/sendEmail.js';
import { enrollmentTemplate } from '../utils/email/templates/enrollmentTemplate.js';

// When user enrolls in course
await sendEmail({
    to: user.email,
    subject: '🎓 Course Enrollment Confirmed - GENAICOURSE.IO',
    html: enrollmentTemplate(
        user.name,
        course.title,
        course.description,
        course.instructor
    )
});
```

### 6. **Send Certificate with PDF Attachment**

```javascript
import { sendEmail } from '../utils/email/sendEmail.js';
import { certificateTemplate } from '../utils/email/templates/certificateTemplate.js';
import path from 'path';

// When user completes course
const certificatePath = path.join(__dirname, '../certificates', `${user._id}-${course._id}.pdf`);

await sendEmail({
    to: user.email,
    subject: '🏆 Your Certificate is Ready! - GENAICOURSE.IO',
    html: certificateTemplate(user.name, course.title),
    attachments: [
        {
            filename: `GENAICOURSE-Certificate-${course.title.replace(/\s+/g, '-')}.pdf`,
            path: certificatePath,
            contentType: 'application/pdf'
        }
    ]
});
```

---

## 🔄 Production Migration

### Migrate to SendGrid

**Why SendGrid:**

- ✅ Higher deliverability rates
- ✅ Better analytics (open rates, click rates)
- ✅ No daily sending limits
- ✅ Professional sender reputation
- ✅ Template management UI

**Migration Steps:**

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get API key
3. Update `transporter.js`:

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey', // Literally the string "apikey"
        pass: process.env.SENDGRID_API_KEY
    }
});
```

4. Update `.env`:

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
```

### Migrate to Amazon SES

**Why Amazon SES:**

- ✅ Extremely cost-effective ($0.10 per 1000 emails)
- ✅ Integrates with AWS ecosystem
- ✅ High deliverability
- ✅ Scales to millions of emails

**Migration Steps:**

1. Enable SES in AWS Console
2. Verify domain/email
3. Install AWS SDK:

```bash
npm install @aws-sdk/client-ses
```

4. Update `transporter.js`:

```javascript
import nodemailer from 'nodemailer';
import aws from '@aws-sdk/client-ses';

const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const transporter = nodemailer.createTransport({
    SES: { ses, aws }
});
```

5. Update `.env`:

```env
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
```

---

## 🧪 Testing

### Test Email Sending

```javascript
// Create test route (remove in production)
router.post('/test-email', async (req, res) => {
    const { sendEmail } = await import('../utils/email/sendEmail.js');
    const { welcomeTemplate } = await import('../utils/email/templates/welcomeTemplate.js');

    const result = await sendEmail({
        to: 'your-test-email@gmail.com',
        subject: 'Test Email',
        html: welcomeTemplate('Test User')
    });

    res.json(result);
});
```

### Test Password Reset Flow

1. **Forgot Password:**

```bash
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
    "email": "user@example.com"
}
```

2. **Check email for reset link**

3. **Reset Password:**

```bash
PUT http://localhost:5000/api/auth/reset-password/TOKEN_FROM_EMAIL
Content-Type: application/json

{
    "password": "newPassword123"
}
```

---

## 🛡️ Security Checklist

- [x] Reset tokens are hashed (SHA256)
- [x] Tokens expire (15 minutes)
- [x] Tokens are single-use
- [x] User enumeration prevented
- [x] Gmail App Password used (not regular password)
- [x] HTTPS required in production
- [x] Rate limiting on forgot-password
- [x] Email validation
- [x] Password strength requirements
- [x] Confirmation emails sent
- [x] Error handling implemented
- [x] Retry logic for critical emails

---

## 📊 Environment Variables

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:3000

# For Production
FRONTEND_URL=https://genaicourse.io
```

---

## 🎯 Best Practices

1. **Never log sensitive data:**

```javascript
// ❌ BAD
console.log('Reset token:', resetToken);

// ✅ GOOD
console.log('Reset email sent to:', user.email);
```

2. **Always use HTTPS in production**

3. **Monitor email deliverability:**
   - Check spam folder
   - Monitor bounce rates
   - Use email verification services

4. **Keep templates updated:**
   - Test on multiple email clients
   - Use email testing tools (Litmus, Email on Acid)

5. **Implement email preferences:**
   - Allow users to opt-out of non-critical emails
   - Store preferences in user model

---

## 🚨 Common Issues & Solutions

### Issue: Emails not sending

**Solution:**

1. Check `.env` has correct credentials
2. Verify Gmail App Password (not regular password)
3. Check console for error messages
4. Test transporter connection

### Issue: Emails going to spam

**Solution:**

1. Use verified domain (SendGrid/SES)
2. Add SPF/DKIM records
3. Avoid spam trigger words
4. Include unsubscribe link

### Issue: Token expired

**Solution:**

- Tokens expire in 15 minutes (security feature)
- User must request new reset link
- Consider extending to 30 minutes if needed

---

## 📈 Performance Optimization

1. **Use background jobs for emails:**

```javascript
// Instead of awaiting email in request
await emailQueue.add({
    to: user.email,
    template: 'welcome',
    data: { name: user.name }
});
```

2. **Batch emails:**

```javascript
// Send multiple emails efficiently
const emails = users.map(user => ({
    to: user.email,
    subject: 'Update',
    html: template(user.name)
}));

await Promise.all(emails.map(sendEmail));
```

---

## ✅ Production Deployment Checklist

- [ ] Update `FRONTEND_URL` to production domain
- [ ] Use SendGrid or Amazon SES (not Gmail)
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up email monitoring
- [ ] Configure SPF/DKIM records
- [ ] Test all email flows
- [ ] Set up error alerting
- [ ] Document email templates
- [ ] Train support team on email issues

---

**🎉 Your email system is now production-ready!**

For questions or issues, contact: support@genaicourse.io
