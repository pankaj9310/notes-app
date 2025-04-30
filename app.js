const express = require('express');
const { errorHandler, notFoundHandler } = require('./middleware/error');
const logger = require('./utils/logger');
const noteRoutes = require('./routes/v1/noteRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      params: req.params,
      query: req.query,
      ip: req.ip
    }
  });
  next();
});

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Notes API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// API v1 routes
app.use('/api/v1/notes', noteRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`API v1 is available at http://localhost:${PORT}/api/v1`);
});

module.exports = app; 