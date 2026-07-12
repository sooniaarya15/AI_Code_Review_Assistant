const pool = require("../config/db");
const { runStaticAnalysis } = require("../services/staticAnalysis.service");

// ---------- RUN STATIC ANALYSIS ON A PROJECT ----------
async function analyzeProject(req, res) {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    // 1. Make sure this project belongs to the logged-in user
    const projectResult = await pool.query(
      `SELECT id, source_code, language FROM projects WHERE id = $1 AND user_id = $2`,
      [projectId, userId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const project = projectResult.rows[0];

    if (project.language !== "javascript") {
      return res.status(400).json({
        error: `Static analysis for '${project.language}' isn't supported yet. Only 'javascript' is supported in this phase.`,
      });
    }

    // 2. Run ESLint on the stored source code
    const { findings, overallScore, summary } = await runStaticAnalysis(project.source_code);

    // 3. Save the review
    const reviewResult = await pool.query(
      `INSERT INTO reviews (project_id, review_type, overall_score, summary)
       VALUES ($1, 'static', $2, $3)
       RETURNING id, review_type, overall_score, summary, created_at`,
      [projectId, overallScore, summary]
    );
    const review = reviewResult.rows[0];

    // 4. Save each finding, linked to this review
    for (const f of findings) {
      await pool.query(
        `INSERT INTO review_findings
           (review_id, severity, issue, explanation, suggested_fix, file_name, line_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [review.id, f.severity, f.issue, f.explanation, f.suggested_fix, f.file_name, f.line_number]
      );
    }

    return res.status(201).json({ review, findings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not analyze project." });
  }
}

// ---------- GET ALL REVIEWS FOR A PROJECT (history) ----------
async function getReviewsForProject(req, res) {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    // confirm ownership first
    const ownerCheck = await pool.query(
      `SELECT id FROM projects WHERE id = $1 AND user_id = $2`,
      [projectId, userId]
    );
    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const reviews = await pool.query(
      `SELECT id, review_type, overall_score, summary, created_at
       FROM reviews
       WHERE project_id = $1
       ORDER BY created_at DESC`,
      [projectId]
    );

    // attach findings to each review
    const reviewsWithFindings = [];
    for (const review of reviews.rows) {
      const findings = await pool.query(
        `SELECT id, severity, issue, explanation, suggested_fix, file_name, line_number
         FROM review_findings WHERE review_id = $1`,
        [review.id]
      );
      reviewsWithFindings.push({ ...review, findings: findings.rows });
    }

    return res.json({ reviews: reviewsWithFindings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not fetch reviews." });
  }
}

module.exports = { analyzeProject, getReviewsForProject };