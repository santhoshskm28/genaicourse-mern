/**
 * Password Reset Confirmation Template
 * 
 * Sent when: User successfully changes their password
 * Purpose: Security notification that password was successfully updated
 * 
 * @param {string} name - User's full name
 * @returns {string} HTML email template
 */

export const resetConfirmationTemplate = (name) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed Successfully - GENAICOURSE.IO</title>
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
      background: #059669;
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.8;
    }
    .success-icon {
      font-size: 48px;
      margin-bottom: 20px;
      display: block;
      text-align: center;
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
      <span class="success-icon">✅</span>
      <h2>Success, ${name}!</h2>
      <p>Your password has been changed successfully. You can now log in using your new password.</p>
      
      <p style="margin-top: 30px; padding: 15px; background: #fef2f2; border-left: 4px solid #ef4444; color: #991b1b; font-size: 14px;">
        <strong>Didn't make this change?</strong><br>
        If you did not authorize this change, please contact our security team immediately at <strong>security@genaicourse.io</strong>.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 12px 28px; background: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Log In Now</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} GENAICOURSE.IO Team</p>
    </div>
  </div>
</body>
</html>
  `;
};

export default resetConfirmationTemplate;
