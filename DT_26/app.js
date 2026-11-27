const express = require("express");

const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const documentRoutes = require("./routes/documents");

const app = express();

app.use(express.json());

// Custom middleware
app.use(requestLogger);

// API routes
app.use("/api/documents", documentRoutes);

// Centralized error handler (must be after routes)
app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});