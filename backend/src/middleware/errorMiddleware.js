const errorLogger = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.url} - `, err);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred.';

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

const notFound = (req, res, next) => {
  const err = new Error(`Resource not found - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = {
  errorLogger,
  errorHandler,
  notFound,
};
