const { randomUUID } = require("crypto");

function requestLogger(req, res, next) {
  req.requestId = randomUUID();

  console.log(
    `[${req.requestId}] ${req.method} ${req.originalUrl}`
  );

  res.setHeader("X-Request-ID", req.requestId);

  next();
}

module.exports = requestLogger;