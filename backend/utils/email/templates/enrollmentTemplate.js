/**
 * Course Enrollment Template
 * 
 * Sent when: User enrolls in a new course
 * Purpose: Confirm enrollment and provide quick access to learning
 * 
 * @param {string} name - User's full name
 * @param {string} courseTitle - Title of the course
 * @returns {string} HTML email template
 */

export const enrollmentTemplate = (name, courseTitle) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enrollment Confirmed - GENAICOURSE.IO</title>
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
      background: #4f46e5;
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.8;
    }
    .course-card {
      background: #f3f4f6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #e5e7eb;
      text-align: center;
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
      <h1>Enrollment Confirmed!</h1>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>Congratulations! You have successfully enrolled in our AI course. You now have full access to all lectures, materials, and certificates for this course.</p>
      
      <div class="course-card">
        <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Enrolled Course</p>
        <h3 style="margin: 10px 0; color: #111827; font-size: 22px;">${courseTitle}</h3>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Start Learning</a>
      </div>

      <p>Mastering AI is a journey. We recommend setting aside a few hours each week to stay consistent. Your progress will be saved automatically.</p>
      
      <p style="margin-top: 30px;">Happy studying!<br>The GENAICOURSE.IO Learning Team</p>
    </div>
    <div class="footer">
      <p>GENAICOURSE.IO | Addison, TX</p>
    </div>
  </div>
</body>
</html>
  `;
};

export default enrollmentTemplate;
