/**
 * Certificate Completion Template
 * 
 * Sent when: User completes a course and earns a certificate
 * Purpose: Celebrate achievement and deliver the certificate
 * 
 * @param {string} name - User's full name
 * @param {string} courseTitle - Title of the course
 * @returns {string} HTML email template
 */

export const certificateTemplate = (name, courseTitle) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Congratulations on your Certification! - GENAICOURSE.IO</title>
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
      background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.8;
      text-align: center;
    }
    .badge {
      font-size: 64px;
      margin-bottom: 20px;
      display: block;
    }
    .footer {
      background-color: #111827;
      color: #9ca3af;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 style="margin: 0;">YOU DID IT!</h1>
    </div>
    <div class="content">
      <span class="badge">🏆</span>
      <h2>Congratulations, ${name}!</h2>
      <p>You have successfully completed the course:</p>
      <h3 style="color: #4f46e5; font-size: 24px;">${courseTitle}</h3>
      
      <p>We are incredibly proud of your achievement. Your hard-earned certificate is attached to this email as a PDF. Feel free to download, print, and share it on your LinkedIn profile!</p>

      <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 12px;">
        <p style="margin: 0; font-weight: bold; color: #92400e;">Next Step? Share your success!</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Tag <strong>#GenaicourseAI</strong> for a chance to be featured on our social media.</p>
      </div>

      <p>Keep that momentum going! Check out your next recommended course in your dashboard.</p>
    </div>
    <div class="footer">
      <p>GENAICOURSE.IO | The Future of AI Education</p>
    </div>
  </div>
</body>
</html>
  `;
};

export default certificateTemplate;
