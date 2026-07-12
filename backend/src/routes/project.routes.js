const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} = require("../controllers/project.controller");

// All project routes require login
router.post("/", authMiddleware, createProject);        // POST   /api/projects
router.get("/", authMiddleware, getProjects);            // GET    /api/projects
router.get("/:id", authMiddleware, getProjectById);       // GET    /api/projects/:id
router.delete("/:id", authMiddleware, deleteProject);     // DELETE /api/projects/:id

module.exports = router;