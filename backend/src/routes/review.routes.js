const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { analyzeProject, getReviewsForProject } = require("../controllers/review.controller");
const { aiAnalyzeProject } = require("../controllers/aiReview.controller");

// POST /api/reviews/analyze/:projectId  -> run static analysis (ESLint) on a project
router.post("/analyze/:projectId", authMiddleware, analyzeProject);

// POST /api/reviews/ai-analyze/:projectId -> run AI-based review (OpenAI) on a project
router.post("/ai-analyze/:projectId", authMiddleware, aiAnalyzeProject);

// GET /api/reviews/project/:projectId   -> get review history for a project
router.get("/project/:projectId", authMiddleware, getReviewsForProject);

module.exports = router;