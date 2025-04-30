const logger = require('../utils/logger');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    logger.error(`${err.name}: ${err.message}`);
    logger.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = errorHandler; 