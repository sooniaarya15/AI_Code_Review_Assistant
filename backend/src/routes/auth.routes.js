const express = require("express");
const router = express.Router();
const { signup, login, getProfile } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Public routes
router.post("/signup", signup);       // POST /api/auth/signup
router.post("/login", login);         // POST /api/auth/login

// Protected route (needs a valid token)
router.get("/profile", authMiddleware, getProfile); // GET /api/auth/profile

module.exports = router;