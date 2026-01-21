# GenAI Course Platform (MERN Stack)

## Project Overview
A comprehensive e-learning platform for GenAI courses built with the MERN stack. Features include slide-based course viewing, user progress tracking, admin dashboard, and JWT authentication with structured JSON course content.

## 🎯 Core Features Implemented

### Frontend Views (SPA Routes)
- ✅ **Home View**: Platform overview with clear value proposition and CTA buttons
- ✅ **How It Works View**: Step-by-step explanation with icons and illustrations
- ✅ **Course Catalogue View**: Fetch and display courses with search/filter functionality
- ✅ **Authentication Views**: Login/Register with client-side validation and error handling
- ✅ **Course Player**: Slide-based learning with Next/Previous navigation and progress tracking

### Backend APIs
- ✅ **User Management**: Register/Login with JWT authentication and role-based access
- ✅ **Course CRUD Operations**: Fetch, upload (JSON), edit, delete courses
- ✅ **Admin Features**: Upload/edit/delete courses, view users, restricted admin APIs
- ✅ **Progress Tracking**: Track course access and user progress

### Database Design
- ✅ **Users Collection**: name, email, hashed password, role
- ✅ **Courses Collection**: title, description, structured JSON content, created date
- ✅ **User Progress Collection**: userId, courseId, progress tracking

## 🛠 Technologies Used
- **Frontend**: React.js, React Router, Tailwind CSS, Framer Motion, Axios
- **Backend**: Node.js, Express.js, JWT, bcryptjs, CORS, helmet, morgan
- **Database**: MongoDB with Mongoose
- **Development**: Vite, nodemon, express-validator

## 📋 Prerequisites
- Node.js (v16+)
- MongoDB (running locally or Atlas URI)

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
# Configure .env file (already configured with MongoDB Atlas)
npm run dev
```

The backend server runs on `http://localhost:5000`.

### 2. Database Setup (Optional Seeding)
```bash
cd backend
# The database is already configured with MongoDB Atlas
# Local setup: Update MONGODB_URI in .env to use local MongoDB
```

**Default Admin Credentials (if seeded):**
- Email: `admin@genaicourse.io`
- Password: `Admin@123`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend application runs on `http://localhost:5173`.

## 📁 Project Structure

```
genaicourse-mern/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication & error handling
│   ├── models/          # MongoDB schemas (User, Course, UserProgress)
│   ├── routes/          # API routes (auth, courses, admin)
│   └── utils/           # Utility functions
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/       # Page components (Home, Login, etc.)
│   │   └── services/    # API service functions
│   └── public/          # Static assets
└── README.md
```

## 🎨 Frontend Features

### Course Content System (CRITICAL)
- ✅ Text-based content with structured JSON conversion
- ✅ JSON schema supports: Modules → Lessons → Key points
- ✅ Slide-based/step-based learning UI
- ✅ Navigation: Next/Previous with progress indicator

### User Interface
- ✅ Modern dark theme with gradient accents
- ✅ Responsive design for all screen sizes
- ✅ Smooth animations and transitions
- ✅ Toast notifications for user feedback

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- CORS configuration
- Rate limiting
- Helmet security headers
- Input validation and sanitization

## 📊 Admin Dashboard
- User management (view all users)
- Course management (CRUD operations)
- Progress tracking analytics
- Role-based access control

## 🚀 Deployment Ready
- Frontend: Ready for Vercel/Netlify deployment
- Backend: Ready for Railway/Heroku/Render deployment
- Environment variables properly configured
- Production-ready security middleware

## 🔧 Development Commands

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📝 Course JSON Schema
The system accepts structured JSON course content:

```json
{
  "title": "Course Title",
  "description": "Course description",
  "modules": [
    {
      "title": "Module Title",
      "description": "Module description",
      "lessons": [
        {
          "title": "Lesson Title",
          "content": "Lesson content",
          "keyPoints": ["Key point 1", "Key point 2"],
          "duration": 30
        }
      ]
    }
  ]
}
```
