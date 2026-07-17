"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../../../lib/api";

const severityColors = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProject();
    loadReviews();
  }, [id]);

  async function loadProject() {
    try {
      const data = await apiFetch(`/projects/${id}`);
      setProject(data.project);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadReviews() {
    try {
      const data = await apiFetch(`/reviews/project/${id}`);
      setReviews(data.reviews);
    } catch (err) {
      setError(err.message);
    }
  }

  async function runStaticAnalysis() {
    setLoading(true);
    setError("");
    try {
      await apiFetch(`/reviews/analyze/${id}`, { method: "POST" });
      await loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function runAiReview() {
    setLoading(true);
    setError("");
    try {
      await apiFetch(`/reviews/ai-analyze/${id}`, { method: "POST" });
      await loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!project) {
    return <main className="p-8 text-gray-500">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{project.project_name}</h1>
        <p className="text-sm text-gray-500 mb-6">{project.language}</p>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
          {project.source_code}
        </pre>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex gap-3 mb-8">
          <button
            onClick={runStaticAnalysis}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Running..." : "Run Static Analysis"}
          </button>
          <button
            onClick={runAiReview}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Running..." : "Run AI Review"}
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Review History</h2>

        {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-5 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800 uppercase text-xs tracking-wide">
                  {review.review_type} review
                </span>
                <span className="font-bold text-lg text-gray-800">
                  Score: {review.overall_score}/100
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{review.summary}</p>

              <div className="space-y-2">
                {review.findings.map((f) => (
                  <div key={f.id} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColors[f.severity] || "bg-gray-100 text-gray-700"}`}>
                        {f.severity}
                      </span>
                      <span className="font-medium text-gray-800 text-sm">{f.issue}</span>
                      {f.line_number && (
                        <span className="text-xs text-gray-400">Line {f.line_number}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{f.explanation}</p>
                    <p className="text-sm text-green-700 mt-1">💡 {f.suggested_fix}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}