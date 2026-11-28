
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20kb" }));

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/screenings", require("./routes/screeningRoutes"));

app.get("/", (req, res) => {
  res.json({
    message: "Resume Screening Assistant API is running."
  });
});

// Centralized error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error("API error:", err.message);

  res.status(500).json({
    message: "Internal server error."
  });
});

const startServer = async () => {
  if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
    throw new Error("JWT_SECRET and MONGO_URI must be configured.");
  }

  if (process.env.JWT_SECRET.length < 64) {
    throw new Error("JWT_SECRET must contain at least 64 characters.");
  }

  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
