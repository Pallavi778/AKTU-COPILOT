/**
 * Centered Error Handling Middleware
 * Catch-all for API route errors.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
