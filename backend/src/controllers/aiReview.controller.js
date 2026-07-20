const pool = require("../config/db");
const { runAiReview } = require("../services/aiReview.service");

async function aiAnalyzeProject(req, res) {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const projectResult = await pool.query(
      `SELECT id, source_code, language FROM projects WHERE id = $1 AND user_id = $2`,
      [projectId, userId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const project = projectResult.rows[0];

    const { overall_score, summary, findings } = await runAiReview(
      project.source_code,
      project.language
    );

    const reviewResult = await pool.query(
      `INSERT INTO reviews (project_id, review_type, overall_score, summary)
       VALUES ($1, 'ai', $2, $3)
       RETURNING id, review_type, overall_score, summary, created_at`,
      [projectId, overall_score, summary]
    );
    const review = reviewResult.rows[0];

    for (const f of findings) {
      await pool.query(
        `INSERT INTO review_findings
           (review_id, severity, issue, explanation, suggested_fix, file_name, line_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [review.id, f.severity, f.issue, f.explanation, f.suggested_fix, "submission", f.line_number]
      );
    }

    return res.status(201).json({ review, findings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not run AI review.", details: err.message });
  }
}

module.exports = { aiAnalyzeProject };