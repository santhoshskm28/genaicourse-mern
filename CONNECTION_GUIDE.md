# MERN Stack Connection Guide

## ✅ Current Configuration

### Backend (Port 5000)
- **URL**: `http://localhost:5000`
- **API Base**: `http://localhost:5000/api`
- **Database**: MongoDB Atlas
- **Environment**: Development

### Frontend (Port 5173)
- **URL**: `http://localhost:5173`
- **API URL**: `http://localhost:5000/api`
- **Framework**: React + Vite

## 🔗 API Endpoints

### Root & Health
- `GET /` - Welcome message with API info
- `GET /health` - Server health check with DB status

### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Courses (`/api/courses`)
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses/:id/enroll` - Enroll in course (Protected)
- `GET /api/courses/:id/progress` - Get progress (Protected)
- `PUT /api/courses/:id/progress` - Update progress (Protected)

### Admin (`/api/admin`)
- Admin-only routes for course management

## 🚀 Running the Application

### Backend
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:5000`

### Frontend
```bash
cd frontend
npm run dev
```
Application will start on `http://localhost:5173`

## 🔍 Testing Connections

### Test Backend (PowerShell)
```powershell
# Test root endpoint
curl http://localhost:5000/

# Test health endpoint
curl http://localhost:5000/health

# Test courses API
curl http://localhost:5000/api/courses
```

### Test Frontend
1. Open browser to `http://localhost:5173`
2. Check the API Status widget in bottom-right corner
3. Should show:
   - Backend: ✓ connected
   - Database: ✓ connected

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Symptom**: Frontend can't connect to backend
**Solution**: 
- Verify `CLIENT_URL` in `backend/.env` is `http://localhost:5173`
- Check CORS configuration in `backend/server.js`

### Issue 2: Port Already in Use
**Symptom**: `EADDRINUSE` error
**Solution**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process
taskkill /PID <process_id> /F
```

### Issue 3: MongoDB Connection Failed
**Symptom**: Database shows "disconnected"
**Solution**:
- Check `MONGODB_URI` in `backend/.env`
- Verify MongoDB Atlas IP whitelist includes your IP
- Check network connection

### Issue 4: API Returns 404
**Symptom**: Routes not found
**Solution**:
- Verify route files exist in `backend/routes/`
- Check route imports in `backend/server.js`
- Ensure route paths match exactly

### Issue 5: Frontend Shows Blank Page
**Symptom**: White screen or errors in console
**Solution**:
- Check browser console for errors
- Verify all dependencies installed: `npm install`
- Check `ErrorBoundary` component
- Verify `.env` file has `VITE_API_URL`

## 📝 Environment Variables

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## ✨ Features Implemented

### Frontend
- ✅ React Router for SPA navigation
- ✅ Authentication context
- ✅ Protected routes
- ✅ API service layer with Axios
- ✅ Error boundary
- ✅ Toast notifications
- ✅ API connection status indicator

### Backend
- ✅ Express server with security middleware
- ✅ MongoDB connection with error handling
- ✅ JWT authentication
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Comprehensive API routes
- ✅ Error handling middleware

## 🎯 Next Steps

1. **Test Authentication**
   - Register a new user
   - Login with credentials
   - Access protected routes

2. **Test Course Features**
   - Browse course catalogue
   - View course details
   - Enroll in courses (requires login)

3. **Admin Features**
   - Login as admin
   - Create/edit courses
   - Manage users

## 📚 API Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "stack": "Stack trace (development only)"
}
```

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Token sent in Authorization header for protected routes
5. Backend verifies token and grants access

## 📊 Database Schema

### User
- email, password, name, role
- enrolledCourses, progress

### Course
- title, description, instructor
- sections, lessons, content
- published status

## 🛠️ Development Tools

- **Backend**: Nodemon for auto-restart
- **Frontend**: Vite HMR for instant updates
- **Database**: MongoDB Compass for viewing data
- **API Testing**: Postman or curl
- **Browser**: Chrome DevTools

---

**Last Updated**: 2026-01-21
**Status**: ✅ Fully Connected and Operational
