import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock routes for testing
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mock backend running successfully',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: 'Introduction to AI', description: 'Basic AI concepts' },
      { id: 2, title: 'Machine Learning 101', description: 'ML fundamentals' }
    ]
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    token: 'mock-jwt-token',
    user: { id: 1, email: 'test@example.com', name: 'Test User' }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});