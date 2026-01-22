import request from 'supertest';
import app from '../server.js';

// Mock MongoDB connection for tests
jest.mock('../config/database.js', () => ({
    default: jest.fn(() => Promise.resolve())
}));

describe('API Routes', () => {
    describe('GET /', () => {
        it('should return welcome message', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('Welcome to GenAI Course Platform');
        });
    });

    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Server is running');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('database');
            expect(response.body).toHaveProperty('environment');
        });
    });

    describe('404 Handler', () => {
        it('should return 404 for unknown routes', async () => {
            const response = await request(app)
                .get('/unknown-route')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('not found');
        });
    });
});