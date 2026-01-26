import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Generate PDF certificate
export const generateCertificatePDF = async (certificateData) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Generate HTML certificate
    const html = generateCertificateHTML(certificateData);
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF certificate:', error);
    throw new Error('Failed to generate PDF certificate');
  }
};

// @desc    Generate HTML for certificate
function generateCertificateHTML(data) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Completion</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Montserrat', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .certificate-container {
            background: white;
            width: 100%;
            max-width: 1200px;
            height: 850px;
            position: relative;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
            border: 15px solid #f0f0f0;
        }
        
        .certificate-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
            z-index: 1;
        }
        
        .certificate-content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px;
            text-align: center;
        }
        
        .certificate-header {
            margin-bottom: 40px;
        }
        
        .certificate-logo {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            font-size: 48px;
            color: white;
            font-weight: bold;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        
        .certificate-title {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            color: #2c3e50;
            margin-bottom: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        
        .certificate-subtitle {
            font-size: 18px;
            color: #7f8c8d;
            font-style: italic;
            margin-bottom: 50px;
        }
        
        .recipient-name {
            font-family: 'Playfair Display', serif;
            font-size: 42px;
            color: #2c3e50;
            margin-bottom: 20px;
            font-weight: 700;
            padding: 20px;
            border-bottom: 3px solid #667eea;
            display: inline-block;
            min-width: 500px;
        }
        
        .certificate-text {
            font-size: 18px;
            color: #34495e;
            line-height: 1.6;
            margin-bottom: 30px;
            max-width: 800px;
        }
        
        .course-name {
            font-size: 28px;
            color: #667eea;
            font-weight: 600;
            margin-bottom: 20px;
            padding: 15px 30px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 10px;
            display: inline-block;
        }
        
        .certificate-details {
            display: flex;
            justify-content: space-around;
            width: 100%;
            max-width: 800px;
            margin: 40px 0;
            padding: 30px;
            background: rgba(52, 73, 94, 0.05);
            border-radius: 15px;
        }
        
        .detail-item {
            text-align: center;
        }
        
        .detail-label {
            font-size: 14px;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        
        .detail-value {
            font-size: 20px;
            color: #2c3e50;
            font-weight: 600;
        }
        
        .grade {
            font-size: 36px;
            color: #27ae60;
            font-weight: 700;
        }
        
        .certificate-footer {
            position: absolute;
            bottom: 60px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            padding: 0 100px;
        }
        
        .signature-block {
            text-align: center;
        }
        
        .signature-line {
            width: 200px;
            height: 2px;
            background: #34495e;
            margin-bottom: 10px;
        }
        
        .signature-text {
            font-size: 14px;
            color: #7f8c8d;
        }
        
        .certificate-seal {
            position: absolute;
            bottom: 80px;
            right: 100px;
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #f39c12, #e67e22);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            text-align: center;
            box-shadow: 0 5px 20px rgba(243, 156, 18, 0.3);
            border: 3px solid white;
        }
        
        .certificate-id {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: #95a5a6;
            font-family: monospace;
        }
        
        .border-decoration {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-image: linear-gradient(45deg, #667eea, #764ba2, #667eea) 1;
            border-radius: 15px;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="certificate-background"></div>
        <div class="border-decoration"></div>
        
        <div class="certificate-content">
            <div class="certificate-header">
                <div class="certificate-logo">GC</div>
                <h1 class="certificate-title">Certificate of Completion</h1>
                <p class="certificate-subtitle">This is to certify that</p>
            </div>
            
            <h2 class="recipient-name">${data.userName}</h2>
            
            <p class="certificate-text">
                has successfully completed the course
            </p>
            
            <div class="course-name">${data.courseTitle}</div>
            
            <p class="certificate-text">
                with outstanding performance and dedication to learning
            </p>
            
            <div class="certificate-details">
                <div class="detail-item">
                    <div class="detail-label">Score</div>
                    <div class="detail-value">${data.score}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Grade</div>
                    <div class="detail-value grade">${data.grade}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Date</div>
                    <div class="detail-value">${new Date(data.completionDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</div>
                </div>
            </div>
        </div>
        
        <div class="certificate-footer">
            <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-text">${data.instructorName || 'Course Instructor'}</div>
            </div>
            <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-text">GenAICourse.io Director</div>
            </div>
        </div>
        
        <div class="certificate-seal">
            VERIFIED<br/>CERTIFICATE
        </div>
        
        <div class="certificate-id">
            Certificate ID: ${data.certificateId}
        </div>
    </div>
</body>
</html>
  `;
}