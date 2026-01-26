# Assessment Upload Guide

This guide explains how to upload assessments to your MERN stack application using the provided templates and upload methods.

## 📋 Supported Formats

### 1. JSON Format (Recommended)
Use the structured JSON format for better control and validation.

### 2. CSV Format
Simple format for quick import from spreadsheets.

## 🚀 Upload Methods

### Method 1: File Upload
1. **Download Template**: Click "JSON Template" or "CSV Template"
2. **Fill in your data**: Edit the downloaded file with your questions
3. **Upload**: Use the file upload interface

### Method 2: JSON Paste
1. **Copy your JSON**: Copy the complete assessment JSON
2. **Paste**: Paste directly into the JSON input field
3. **Upload**: Click "Upload JSON"

## 📝 JSON Template Structure

```json
{
  "title": "Your Assessment Title",
  "description": "Brief description of the assessment",
  "timeLimit": 60,
  "maxAttempts": 3,
  "passingScore": 80,
  "shuffleQuestions": false,
  "showResults": true,
  "allowReview": true,
  "questions": [
    {
      "question": "Your question text here?",
      "options": [
        "Option A",
        "Option B", 
        "Option C",
        "Option D"
      ],
      "correctAnswer": "Option A",
      "points": 5,
      "explanation": "Explanation for why this answer is correct"
    }
  ]
}
```

## 📊 CSV Template Structure

```csv
Question,Option1,Option2,Option3,Option4,CorrectAnswer,Points,Explanation
"What is React?","A library","A framework","A database","An OS","A library","5","React is a JavaScript library"
```

## ✅ Requirements

### Required Fields:
- **title**: Assessment title
- **questions**: Array of questions

### Question Requirements:
- **question**: Question text
- **options**: Array of answer choices (min 2, max 6)
- **correctAnswer**: The correct answer (must match one of the options)

### Optional Fields:
- **description**: Assessment description
- **timeLimit**: Time limit in minutes (1-180, default: 60)
- **maxAttempts**: Maximum attempts (1-10, default: 3)
- **passingScore**: Passing percentage (0-100, default: 80)
- **points**: Points per question (default: 5)
- **explanation**: Answer explanation
- **shuffleQuestions**: Whether to shuffle question order
- **showResults**: Whether to show results to students
- **allowReview**: Whether students can review answers

## 📁 File Upload Limits

- **File Size**: Maximum 5MB
- **File Types**: .json, .csv
- **Max Questions**: 100 per assessment
- **Max Options**: 6 per question

## 🔧 Upload Process

1. **Prepare your data** using the template format
2. **Validate** your JSON/CSV structure
3. **Choose upload method** (File or Paste)
4. **Select course** (optional) to link assessment
5. **Upload** and wait for validation
6. **Review** the uploaded assessment details

## ⚠️ Common Errors

### JSON Errors:
- Missing comma or bracket
- Invalid JSON syntax
- Missing required fields

### Validation Errors:
- Correct answer not in options list
- Too many or too few options
- Invalid time limits or scores

### Solutions:
- Use JSON validators like jsonlint.com
- Download and use provided templates
- Check field requirements carefully

## 📚 Example Assessments

### Sample JSON Assessment
See `sample-assessment.json` in the project root for a complete 20-question MERN stack assessment.

### Quick CSV Example
```csv
Question,Option1,Option2,Option3,Option4,CorrectAnswer,Points,Explanation
"What is 2+2?","3","4","5","6","4","1","Basic addition"
```

## 🛠️ Management Features

After uploading, you can:
- **View** all your assessments
- **Edit** assessment details
- **Delete** unwanted assessments
- **Track** student performance
- **Manage** course links

## 📱 Access Points

- **Instructor Dashboard**: `/instructor`
- **Assessment Upload**: `/instructor/upload`
- **Manage Assessments**: `/instructor/manage`

## 🔐 Permissions

Only users with **instructor** or **admin** roles can upload and manage assessments.

## 💡 Tips

1. **Start with templates** to ensure proper formatting
2. **Test with small datasets** first
3. **Use clear, concise questions**
4. **Provide explanations** for learning value
5. **Set appropriate time limits** based on question complexity
6. **Review all questions** before uploading

## 🆘 Support

If you encounter issues:
1. Check console error messages
2. Verify JSON syntax using online validators
3. Ensure all required fields are present
4. Contact admin for permission issues