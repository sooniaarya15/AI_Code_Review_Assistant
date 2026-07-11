const pool = require("../config/db");

// ---------- CREATE PROJECT (paste code) ----------
async function createProject(req, res) {
  try {
    const { project_name, language, source_code } = req.body;
    const userId = req.user.id; // comes from auth middleware

    if (!project_name || !source_code) {
      return res.status(400).json({ error: "project_name and source_code are required." });
    }

    const result = await pool.query(
      `INSERT INTO projects (user_id, project_name, language, source_code)
       VALUES ($1, $2, $3, $4)
       RETURNING id, project_name, language, created_at`,
      [userId, project_name, language || "javascript", source_code]
    );

    return res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not create project." });
  }
}

// ---------- GET ALL PROJECTS FOR LOGGED-IN USER ----------
async function getProjects(req, res) {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT id, project_name, language, created_at
       FROM projects
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return res.json({ projects: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not fetch projects." });
  }
}

// ---------- GET ONE PROJECT (with its source code) ----------
async function getProjectById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, project_name, language, source_code, created_at
       FROM projects
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    return res.json({ project: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not fetch project." });
  }
}

// ---------- DELETE PROJECT ----------
async function deleteProject(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    return res.json({ message: "Project deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not delete project." });
  }
}

module.exports = { createProject, getProjects, getProjectById, deleteProject };