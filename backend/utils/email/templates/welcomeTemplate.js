/**
 * Welcome Email Template
 * 
 * Sent when: User successfully registers
 * Purpose: Welcome new students and guide them to get started
 * 
 * @param {string} name - User's full name
 * @returns {string} HTML email template
 */

export const welcomeTemplate = (name) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to GENAICOURSE.IO</title>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.8;
    }
    .content h2 {
      color: #667eea;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .content p {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      transition: transform 0.3s ease;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .features {
      background-color: #f8f9fa;
      padding: 30px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .feature-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }
    .feature-icon {
      width: 24px;
      height: 24px;
      background-color: #667eea;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      margin-right: 15px;
      flex-shrink: 0;
    }
    .footer {
      background-color: #1a1a2e;
      color: #ffffff;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>🎓 GENAICOURSE.IO</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Master AI Skills, Transform Your Career</p>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Welcome Aboard, ${name}! 🚀</h2>
      
      <p>We're thrilled to have you join the <strong>GENAICOURSE.IO</strong> community! You've just taken the first step toward mastering cutting-edge AI skills that will transform your career.</p>

      <p>Your learning journey starts now, and we're here to support you every step of the way.</p>

      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/courses" class="cta-button">
          Explore Courses →
        </a>
      </div>

      <!-- Features Section -->
      <div class="features">
        <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
        
        <div class="feature-item">
          <div class="feature-icon">✓</div>
          <div>Browse our comprehensive AI course catalog</div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">✓</div>
          <div>Complete courses and earn verified certificates</div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">✓</div>
          <div>Join our community of AI learners</div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">✓</div>
          <div>Track your progress on your personalized dashboard</div>
        </div>
      </div>

      <p>Need help getting started? Check out our <a href="${process.env.FRONTEND_URL}/how-it-works" style="color: #667eea; text-decoration: none;">Getting Started Guide</a> or reach out to our support team.</p>

      <p style="margin-top: 30px;">
        <strong>Happy Learning!</strong><br>
        The GENAICOURSE.IO Team
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>GENAICOURSE.IO</strong></p>
      <p>5080 Spectrum Drive, Suite 575E, Addison, TX 75001</p>
      
      <div class="social-links">
        <a href="#">Twitter</a> | 
        <a href="#">LinkedIn</a> | 
        <a href="#">Instagram</a>
      </div>
      
      <p style="margin-top: 20px; font-size: 12px; color: #999;">
        You're receiving this email because you signed up for GENAICOURSE.IO.<br>
        <a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a> | <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

export default welcomeTemplate;
