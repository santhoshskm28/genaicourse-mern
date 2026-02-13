/**
 * Login Alert Email Template
 * 
 * Sent when: User logs in from a new device/location
 * Purpose: Security notification to alert users of account activity
 * 
 * @param {string} name - User's full name
 * @param {string} time - Login timestamp
 * @param {string} ipAddress - User's IP address
 * @returns {string} HTML email template
 */

export const loginAlertTemplate = (name, time, ipAddress) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert - New Login Detected</title>
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
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .alert-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.8;
    }
    .alert-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .alert-box h3 {
      margin-top: 0;
      color: #856404;
    }
    .info-table {
      width: 100%;
      margin: 20px 0;
      border-collapse: collapse;
    }
    .info-table td {
      padding: 12px;
      border-bottom: 1px solid #e9ecef;
    }
    .info-table td:first-child {
      font-weight: 600;
      color: #666;
      width: 40%;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .footer {
      background-color: #1a1a2e;
      color: #ffffff;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #f093fb;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="alert-icon">🔐</div>
      <h1>Security Alert</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">New Login Detected</p>
    </div>

    <!-- Content -->
    <div class="content">
      <h2 style="color: #333;">Hi ${name},</h2>
      
      <p>We detected a new sign-in to your <strong>GENAICOURSE.IO</strong> account. If this was you, you can safely ignore this email.</p>

      <div class="alert-box">
        <h3>⚠️ Login Details</h3>
        <table class="info-table">
          <tr>
            <td>Time:</td>
            <td>${time}</td>
          </tr>
          <tr>
            <td>IP Address:</td>
            <td>${ipAddress}</td>
          </tr>
          <tr>
            <td>Device:</td>
            <td>Web Browser</td>
          </tr>
        </table>
      </div>

      <p><strong>Wasn't you?</strong></p>
      <p>If you didn't sign in, your account may be compromised. Please secure your account immediately by:</p>
      
      <ol>
        <li>Changing your password</li>
        <li>Reviewing recent account activity</li>
        <li>Enabling two-factor authentication (if available)</li>
      </ol>

      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/account/security" class="cta-button">
          Secure My Account →
        </a>
      </div>

      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        <strong>Security Tip:</strong> Never share your password with anyone. GENAICOURSE.IO will never ask for your password via email.
      </p>

      <p style="margin-top: 30px;">
        <strong>Stay Safe!</strong><br>
        The GENAICOURSE.IO Security Team
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>GENAICOURSE.IO</strong></p>
      <p>5080 Spectrum Drive, Suite 575E, Addison, TX 75001</p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">
        This is an automated security notification.<br>
        <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a> | <a href="mailto:security@genaicourse.io">Report Security Issue</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

export default loginAlertTemplate;
