require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    swagger: {
        path: '/api-docs',
        title: 'Notes API',
        version: '1.0.0',
        description: 'A simple Notes API for managing notes'
    }
}; 