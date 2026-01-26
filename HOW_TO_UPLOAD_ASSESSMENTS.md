# How to Upload Assessments in the Application

This guide provides step-by-step instructions for uploading assessments in your MERN stack application.

## 🚀 Quick Start

### 1. Access the Upload Interface
- **URL**: `http://localhost:3001/instructor` (or your frontend URL)
- **Login**: Use instructor or admin credentials
- **Navigate**: Click "Upload New" tab

### 2. Choose Upload Method

## 📋 Method 1: File Upload (Recommended)

### Step 1: Download Template
1. Go to the upload page
2. Scroll down to "Download Templates" section
3. Click **"JSON Template"** or **"CSV Template"**
4. Save the file to your computer

### Step 2: Edit the Template
**For JSON Template:**
```json
{
  "title": "Your Assessment Title",
  "description": "Brief description",
  "timeLimit": 60,
  "maxAttempts": 3,
  "passingScore": 80,
  "questions": [
    {
      "question": "What is React?",
      "options": ["Library", "Framework", "Database", "OS"],
      "correctAnswer": "Library",
      "points": 5,
      "explanation": "React is a JavaScript library"
    }
  ]
}
```

**For CSV Template:**
```csv
Question,Option1,Option2,Option3,Option4,CorrectAnswer,Points,Explanation
"What is React?","Library","Framework","Database","OS","Library","5","React is a JavaScript library"
```

### Step 3: Upload the File
1. Click the upload area or drag & drop your file
2. Select your edited JSON or CSV file
3. Click **"Import File"**
4. Wait for validation and upload confirmation

## 📝 Method 2: JSON Paste

### Step 1: Prepare Your JSON
Copy your complete assessment JSON data:
```json
{
  "title": "JavaScript Basics",
  "description": "Test fundamental JavaScript knowledge",
  "timeLimit": 30,
  "maxAttempts": 2,
  "passingScore": 75,
  "questions": [
    {
      "question": "What keyword declares a variable?",
      "options": ["var", "let", "const", "All of the above"],
      "correctAnswer": "All of the above",
      "points": 5,
      "explanation": "var, let, and const all declare variables"
    }
  ]
}
```

### Step 2: Paste and Upload
1. Go to the "Paste JSON Data" section
2. Paste your JSON into the text area
3. Click **"Upload JSON"**
4. Wait for validation

## 🎯 Method 3: Use Sample Assessment

### Quick Test with Provided Sample
1. Copy the content from `sample-assessment.json`
2. Use Method 2 (JSON Paste) to upload
3. This contains 20 MERN stack questions ready to use

## 📱 Complete Upload Process

### Interface Navigation:
```
Instructor Dashboard
├── Dashboard (overview stats)
├── Manage Assessments (list & edit)
└── Upload New (create new assessment)
```

### Upload Steps:
1. **Login** as instructor/admin
2. **Navigate** to Instructor Dashboard
3. **Click** "Upload New" tab
4. **Choose** upload method (File or JSON)
5. **Prepare** your assessment data
6. **Upload** and wait for validation
7. **Confirm** successful upload
8. **View** in "Manage Assessments"

## ✅ Upload Success Indicators

### When Upload Succeeds:
- ✅ Green success message appears
- 📊 Assessment appears in the list
- 🔗 Can be linked to courses
- 👥 Students can take the assessment

### Common Success Messages:
- "Assessment uploaded successfully!"
- "Assessment imported successfully!"
- "Assessment created and linked to course"

## ⚠️ Troubleshooting Common Issues

### Error: "Invalid JSON format"
**Solution:**
- Use online JSON validator (jsonlint.com)
- Check for missing commas, brackets
- Ensure all strings are quoted

### Error: "Required field missing"
**Solution:**
- Verify you have: `title` and `questions` array
- Each question needs: `question`, `options`, `correctAnswer`
- Check spelling of field names

### Error: "Correct answer not in options"
**Solution:**
- Ensure `correctAnswer` exactly matches one option
- Check for extra spaces or capitalization
- Example: If options are ["A", "B"], correctAnswer must be "A" or "B"

### Error: "File too large"
**Solution:**
- Keep file under 5MB
- Split large assessments into smaller ones
- Maximum 100 questions per assessment

## 🔧 Advanced Features

### Link to Course:
1. Select course from dropdown during upload
2. Assessment automatically linked to course
3. Students can access via course page

### Assessment Settings:
- **timeLimit**: Minutes allowed (1-180)
- **maxAttempts**: Retries allowed (1-10)
- **passingScore**: Percentage to pass (0-100)
- **shuffleQuestions**: Randomize order
- **showResults**: Display score to students

### Question Options:
- **points**: Custom points per question
- **explanation**: Why answer is correct
- **options**: 2-6 choices per question

## 📊 Upload Interface Features

### File Upload Area:
```
┌─────────────────────────────────────┐
│        📁 Click to upload           │
│    or drag and drop your file       │
│                                     │
│  JSON or CSV files up to 5MB       │
│                                     │
│        [Import File]                │
└─────────────────────────────────────┘
```

### JSON Editor:
```
┌─────────────────────────────────────┐
│ Paste your assessment JSON data     │
│ here...                             │
│                                     │
│  [Large text area for JSON]        │
│                                     │
│        [Upload JSON]                │
└─────────────────────────────────────┘
```

### Template Downloads:
- 📄 **JSON Template**: Structured format
- 📊 **CSV Template**: Spreadsheet format
- 💡 **Sample Data**: Ready-to-use example

## 🎓 Best Practices

### Before Uploading:
1. **Test JSON** with validator
2. **Check all questions** for accuracy
3. **Review explanations** for clarity
4. **Set appropriate time limits**
5. **Choose passing score** carefully

### Question Writing Tips:
- Keep questions clear and concise
- Use plausible distractors
- Provide helpful explanations
- Balance difficulty levels
- Test different concepts

### Assessment Structure:
- Start with easier questions
- Mix question types if needed
- Group related topics
- Consider time per question
- Review total assessment time

## 📞 Support

### If Upload Fails:
1. **Check console** for error details
2. **Verify JSON syntax** online
3. **Review field requirements**
4. **Contact admin** for permission issues
5. **Try smaller file** first

### Success Checklist:
- ✅ JSON/CSV format is valid
- ✅ All required fields present
- ✅ Correct answers match options
- ✅ File size under 5MB
- ✅ User has instructor/admin role
- ✅ Course selected (if linking)

## 🚀 Next Steps After Upload

### After Successful Upload:
1. **View** in Manage Assessments
2. **Edit** if needed (title, description)
3. **Link** to course (if not done during upload)
4. **Test** with student account
5. **Monitor** student performance
6. **Update** as course content changes

### Student Experience:
- Students see assessment in course
- Can take assessment with timer
- Receive immediate results
- Get certificate if they pass
- Can review correct answers

You're now ready to upload assessments! Start with the sample JSON file to test the system, then create your own assessments using the templates.