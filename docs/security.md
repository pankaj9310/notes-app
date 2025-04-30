# Security Configuration Documentation

This document outlines the security measures implemented in the Notes API application.

## Overview

The application implements multiple layers of security using various middleware and configurations to protect against common web vulnerabilities and attacks.

## Security Middleware

### 1. Helmet.js
Helmet helps secure Express apps by setting various HTTP headers.

```javascript
const helmetConfig = {
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            frameAncestors: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
};
```

#### Key Features:
- **Content Security Policy (CSP)**: Restricts resource loading to trusted sources
- **Cross-Origin Policies**: Controls how the application interacts with other origins
- **HSTS**: Forces HTTPS connections
- **Frame Protection**: Prevents clickjacking attacks
- **XSS Protection**: Basic XSS filtering
- **MIME Type Sniffing Prevention**: Prevents browsers from interpreting files as a different MIME type

### 2. CORS Configuration
Cross-Origin Resource Sharing (CORS) is configured to control which origins can access the API.

```javascript
const corsOptions = {
    origin: config.cors.origin,
    methods: config.cors.methods,
    allowedHeaders: config.cors.allowedHeaders,
    exposedHeaders: ['X-Total-Count'],
    credentials: true,
    maxAge: 86400 // 24 hours
};
```

#### Key Features:
- Origin restriction
- Method restriction
- Header control
- Credentials handling
- Cache duration

### 3. Rate Limiting
Protects against brute force and DoS attacks by limiting the number of requests from a single IP.

```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});
```

#### Key Features:
- 100 requests per 15 minutes per IP
- Standard rate limit headers
- Custom error message

### 4. XSS Protection
Uses `xss-clean` to sanitize user input and prevent XSS attacks.

```javascript
app.use(xss());
```

#### Key Features:
- Sanitizes request body
- Sanitizes query parameters
- Sanitizes request headers

### 5. HTTP Parameter Pollution Protection
Uses `hpp` to prevent HTTP Parameter Pollution attacks.

```javascript
app.use(hpp());
```

#### Key Features:
- Prevents duplicate parameters
- Maintains parameter consistency

## Security Headers

The application sets the following security headers:

1. `X-Frame-Options: DENY` - Prevents clickjacking
2. `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
3. `Content-Security-Policy` - Controls resource loading
4. `Strict-Transport-Security` - Enforces HTTPS
5. `X-XSS-Protection` - Basic XSS protection
6. `Referrer-Policy` - Controls referrer information
7. `X-DNS-Prefetch-Control` - Controls DNS prefetching

## Testing

Security features are tested in `__tests__/security.test.js`. The test suite covers:

1. Basic Security Headers
   - Essential header presence
   - Server information hiding

2. CORS
   - Preflight request handling
   - Origin validation

3. Content Security
   - CSP header validation
   - XSS prevention

4. Rate Limiting
   - Header presence
   - Request limiting

5. Error Handling
   - Malformed request handling
   - JSON parsing errors

## Configuration

Security settings can be configured through environment variables:

```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=http://localhost:3000
```

## Best Practices

1. Always use HTTPS in production
2. Keep dependencies updated
3. Monitor rate limit logs
4. Regularly review security headers
5. Test security features after updates

## Additional Security Measures

1. Input validation in routes
2. Error handling middleware
3. Request logging
4. Environment-specific configurations

## Updating Security Configuration

To modify security settings:

1. Update the configuration in `middleware/security.js`
2. Run the security test suite
3. Test the changes in a staging environment
4. Monitor for any security-related issues

## Troubleshooting

Common issues and solutions:

1. CORS errors
   - Check allowed origins
   - Verify request methods
   - Check credentials settings

2. Rate limiting issues
   - Adjust window size
   - Modify request limits
   - Check IP detection

3. CSP violations
   - Review CSP directives
   - Check resource loading
   - Monitor CSP reports 