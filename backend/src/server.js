const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const reviewRoutes = require("./routes/review.routes");

const app = express();

// Middleware
app.use(cors());              // allows frontend (different port) to call this API
app.use(express.json());     // allows server to read JSON in request body

// Health check route — visit this to confirm server is running
app.get("/", (req, res) => {
  res.json({ message: "AI Code Review Assistant API is running 🚀" });
});

// Feature routes
app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});