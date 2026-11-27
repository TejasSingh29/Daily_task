function errorHandler(err, req, res, next) {
  console.error(`[${req.requestId}]`, err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    requestId: req.requestId,
    error: err.message || "Internal Server Error"
  });
}

module.exports = errorHandler;