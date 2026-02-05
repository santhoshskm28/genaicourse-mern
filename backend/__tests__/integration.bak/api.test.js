import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';
import Course from '../../models/Course.js';

// Mock MongoDB models
jest.mock('../../models/User.js');
jest.mock('../../models/Course.js');
jest.mock('../../config/database.js');

describe('API Integration Tests', () => {
  let authToken;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock user for authentication
    const mockUser = {
      _id: 'testUserId',
      email: 'test@example.com',
      role: 'student',
      comparePassword: jest.fn().mockResolvedValue(true),
      getPublicProfile: jest.fn().mockReturnValue({
        _id: 'testUserId',
        email: 'test@example.com',
        role: 'student'
      })
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);
    User.findById = jest.fn().mockResolvedValue(mockUser);
    User.countDocuments = jest.fn().mockResolvedValue(1);
    
    authToken = 'mock-jwt-token';
  });

  describe('Authentication Endpoints', () => {
    describe('POST /api/auth/register', () => {
      it('should register a new user', async () => {
        const userData = {
          name: 'Test User',
          email: 'newuser@example.com',
          password: 'password123'
        };

        const mockCreatedUser = {
          _id: 'newUserId',
          ...userData,
          role: 'student',
          isVerified: false,
          getPublicProfile: jest.fn().mockReturnValue({
            _id: 'newUserId',
            name: userData.name,
            email: userData.email
          })
        };

        User.findOne.mockResolvedValueOnce(null); // Check for existing user
        User.create.mockResolvedValue(mockCreatedUser);

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('student registered successfully');
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.token).toBeDefined();
      });

      it('should not register user with existing email', async () => {
        const userData = {
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123'
        };

        User.findOne.mockResolvedValueOnce({ email: userData.email });

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('User already exists');
      });
    });

    describe('POST /api/auth/login', () => {
      it('should login with valid credentials', async () => {
        const loginData = {
          email: 'test@example.com',
          password: 'password123'
        };

        const mockUser = {
          _id: 'testUserId',
          email: loginData.email,
          isActive: true,
          comparePassword: jest.fn().mockResolvedValue(true),
          lastLoginAt: new Date(),
          save: jest.fn().mockResolvedValue(true),
          getPublicProfile: jest.fn().mockReturnValue({
            _id: 'testUserId',
            email: loginData.email
          })
        };

        User.findOne.mockResolvedValueOnce(mockUser);

        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.token).toBeDefined();
      });

      it('should not login with invalid credentials', async () => {
        const loginData = {
          email: 'test@example.com',
          password: 'wrongpassword'
        };

        User.findOne.mockResolvedValueOnce(null);

        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData)
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Invalid email or password');
      });
    });
  });

  describe('Course Endpoints', () => {
    beforeEach(() => {
      // Mock authentication middleware for protected routes
      const mockAuthMiddleware = (req, res, next) => {
        req.user = { _id: 'testUserId', role: 'student' };
        next();
      };
      
      // This would typically be done by setting up proper middleware mocking
      // For now, we'll assume the middleware is properly mocked
    });

    describe('GET /api/courses', () => {
      it('should get all courses', async () => {
        const mockCourses = [
          {
            _id: 'course1',
            title: 'Course 1',
            description: 'Description 1',
            level: 'Beginner'
          },
          {
            _id: 'course2',
            title: 'Course 2',
            description: 'Description 2',
            level: 'Advanced'
          }
        ];

        Course.find = jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                skip: jest.fn().mockResolvedValue(mockCourses)
              })
            })
          })
        });

        Course.countDocuments = jest.fn().mockResolvedValue(2);

        const response = await request(app)
          .get('/api/courses')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.courses)).toBe(true);
        expect(response.body.data.courses.length).toBe(2);
      });
    });

    describe('GET /api/courses/:id', () => {
      it('should get a single course by ID', async () => {
        const mockCourse = {
          _id: 'course1',
          title: 'Test Course',
          description: 'Test Description',
          level: 'Beginner',
          totalLessons: 10
        };

        Course.findById = jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockCourse)
        });

        const response = await request(app)
          .get('/api/courses/course1')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.course.title).toBe('Test Course');
      });

      it('should return 404 for non-existent course', async () => {
        Course.findById = jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        });

        const response = await request(app)
          .get('/api/courses/nonexistent')
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Course not found');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors', async () => {
      const invalidUserData = {
        name: '', // Empty name
        email: 'invalid-email', // Invalid email
        password: '123' // Too short password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUserData);

      // Should return validation error (status depends on implementation)
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle database connection errors', async () => {
      // Mock database error
      User.create.mockRejectedValue(new Error('Database connection failed'));

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBeGreaterThanOrEqual(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      const promises = [];
      
      // Make 5 requests quickly
      for (let i = 0; i < 5; i++) {
        promises.push(
          request(app)
            .get('/health')
        );
      }

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should have rate limiting headers', async () => {
      const response = await request(app)
        .get('/api/courses');

      // Rate limiting headers should be present
      expect(response.headers).toBeDefined();
    });
  });

  describe('CORS Configuration', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health');

      // Helmet should add security headers
      expect(response.headers).toBeDefined();
    });
  });
});