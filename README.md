# GenAI Course Platform

A comprehensive MERN stack learning management system for AI and technology courses with CI/CD pipeline.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access
- **Course Management**: Create, enroll, and track progress through courses
- **Admin Dashboard**: Full administrative controls for course management
- **Responsive Design**: Modern UI with Tailwind CSS and Framer Motion
- **API-First**: RESTful API with comprehensive documentation
- **Docker Support**: Containerized deployment with Docker Compose
- **CI/CD Ready**: GitHub Actions for automated testing and deployment

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for routing
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **React Toastify** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** and **CORS** for security

### DevOps
- **Docker** & **Docker Compose**
- **GitHub Actions** for CI/CD
- **ESLint** for code linting
- **Jest** for testing

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd genaicourse-mern
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Backend
   cp backend/.env.example backend/.env

   # Frontend
   cp frontend/.env.example frontend/.env
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```

### Docker Development

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run with coverage
cd backend && npm run test:coverage
```

## 🔧 CI/CD Pipeline

### GitHub Actions

The project includes a comprehensive CI/CD pipeline that:

1. **Testing**: Runs tests on multiple Node.js versions
2. **Linting**: Checks code quality with ESLint
3. **Building**: Ensures frontend builds successfully
4. **Deployment**: Automated deployment on main branch pushes

### Pipeline Stages

- **Test**: Unit tests, linting, and build verification
- **Deploy**: Production deployment

### Environment Variables for CI/CD

Create GitHub Secrets:
- `JWT_SECRET`: JWT signing secret
- `MONGODB_URI`: MongoDB connection string
- `CLIENT_URL`: Frontend URL for CORS

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d --build

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

## 📁 Project Structure

```
genaicourse-mern/
├── backend/                 # Node.js/Express API
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Database configuration
│   ├── __tests__/          # Backend tests
│   ├── Dockerfile          # Backend container config
│   └── package.json
├── frontend/                # React/Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend container config
│   └── package.json
├── .github/workflows/       # GitHub Actions CI/CD
├── docker-compose.yml       # Development containers
├── docker-compose.prod.yml  # Production containers
└── package.json            # Root package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course

### Admin (Protected)
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course

## 🎯 Core Features

### Course Content System
- Text-based content with structured JSON conversion
- JSON schema supports: Modules → Lessons → Key points
- Slide-based/step-based learning UI
- Navigation: Next/Previous with progress indicator

### User Interface
- Modern dark theme with gradient accents
- Responsive design for all screen sizes
- Smooth animations and transitions
- Toast notifications for user feedback

### Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- CORS configuration
- Rate limiting
- Helmet security headers
- Input validation and sanitization

## 📝 Course JSON Schema

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
🔐 Admin Credentials & Information
👤 Admin User Details:
- Admin ID: 69719ad9d9caabe01a8f659c
- Name: System Admin
- Email: admin@genaicourse.io
- Password: Admin@123
- Role: admin
🚀 How to Access Admin Features:
1. Login via Web Interface:
- Navigate to: http://localhost:3001/login
- Enter email: admin@genaicourse.io
- Enter password: Admin@123
2. Direct API Login:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@genaicourse.io","password":"Admin@123"}'
3. Admin Dashboard Access:
After login, the admin user will have access to:
- Dashboard: User management and analytics
- Course Management: Create, edit, delete courses
- User Management: View and manage all users
- System Administration: Full platform control
📊 Admin User Profile:
- Avatar: Auto-generated from name
- Bio: "System Administrator"
- Stats: All initialized to zero (new admin account)
- Created: Database seeding timestamp
🔑 Admin API Token:
When logged in, the admin gets a JWT token that grants access to all admin endpoints:
- /api/admin/* - Administrative functions
- /api/courses - Course management (full CRUD)
- /api/auth/users - User management
⚠️ Security Notes:
- Change the default password in production
- Update JWT_SECRET in environment variables
- Configure proper CORS for production domains
Admin ID: 69719ad9d9caabe01a8f659c