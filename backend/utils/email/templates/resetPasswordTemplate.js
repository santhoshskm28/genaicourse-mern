/**
 * Password Reset Email Template
 * 
 * Sent when: User clicks "Forgot Password"
 * Purpose: Provide a secure link to reset account password
 * 
 * @param {string} name - User's full name
 * @param {string} resetUrl - Unique reset password URL
 * @returns {string} HTML email template
 */

export const resetPasswordTemplate = (name, resetUrl) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - GENAICOURSE.IO</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f7fa;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #1a1a2e;
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.8;
    }
    .reset-box {
      text-align: center;
      margin: 30px 0;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 32px;
      background: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
    }
    .token-expiry {
      background-color: #fee2e2;
      color: #b91c1c;
      padding: 10px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      margin-top: 20px;
    }
    .footer {
      background-color: #f8f9fa;
      color: #666;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>GENAICOURSE.IO</h1>
    </div>
    <div class="content">
      <h2>Hello ${name},</h2>
      <p>Someone requested a password reset for your account. If this was you, click the button below to set a new password:</p>
      
      <div class="reset-box">
        <a href="${resetUrl}" class="cta-button">Reset Password</a>
      </div>

      <div class="token-expiry">
        This link will expire in 15 minutes.
      </div>

      <p style="margin-top: 30px;">If you did not request this, please ignore this email or contact support if you have concerns.</p>
      
      <p>Alternatively, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #4f46e5; font-size: 13px;">${resetUrl}</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} GENAICOURSE.IO Team</p>
    </div>
  </div>
</body>
</html>
  `;
};

export default resetPasswordTemplate;
