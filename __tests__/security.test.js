const request = require('supertest');
const express = require('express');

// Mock config before requiring security middleware
jest.mock('../config/config', () => ({
    port: 3000,
    env: 'test',
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
}));

const securityMiddleware = require('../middleware/security');

describe('Security Middleware', () => {
    let app;

    beforeEach(() => {
        app = express();
        // Apply all security middleware
        securityMiddleware.forEach(middleware => app.use(middleware));
        
        // Add test routes
        app.get('/test', (req, res) => {
            res.json({ message: 'test' });
        });

        app.post('/test', express.json(), (req, res) => {
            res.json(req.body);
        });
    });

    describe('Basic Security Headers', () => {
        test('should set essential security headers', async () => {
            const response = await request(app).get('/test');
            
            // Essential security headers
            expect(response.headers).toHaveProperty('x-frame-options');
            expect(response.headers).toHaveProperty('x-content-type-options');
            expect(response.headers).toHaveProperty('content-security-policy');
            
            // Should not expose server information
            expect(response.headers).not.toHaveProperty('x-powered-by');
        });
    });

    describe('CORS', () => {
        test('should handle CORS preflight requests', async () => {
            const response = await request(app)
                .options('/test')
                .set('Origin', 'http://localhost:3000')
                .set('Access-Control-Request-Method', 'GET');

            expect(response.headers).toHaveProperty('access-control-allow-origin');
            expect(response.status).toBe(204);
        });
    });

    describe('Content Security', () => {
        test('should set Content-Security-Policy headers', async () => {
            const response = await request(app).get('/test');
            
            const csp = response.headers['content-security-policy'];
            expect(csp).toBeDefined();
            expect(csp).toMatch(/frame-ancestors 'none'/);
            expect(csp).toMatch(/default-src/);
        });

        test('should sanitize request body', async () => {
            const response = await request(app)
                .post('/test')
                .send({
                    field: '<script>alert("xss")</script>'
                });
            
            // XSS-Clean will sanitize the input
            const sanitizedField = response.body.field;
            expect(sanitizedField).not.toBe('<script>alert("xss")</script>');
        });
    });

    describe('Rate Limiting', () => {
        test('should include rate limit headers', async () => {
            const response = await request(app).get('/test');
            
            expect(response.headers).toHaveProperty('ratelimit-limit');
            expect(response.headers).toHaveProperty('ratelimit-remaining');
        });
    });

    describe('Error Handling', () => {
        test('should handle malformed JSON', async () => {
            const response = await request(app)
                .post('/test')
                .set('Content-Type', 'application/json')
                .send('{"invalid json}');
            
            expect(response.status).toBe(400);
        });
    });
}); 