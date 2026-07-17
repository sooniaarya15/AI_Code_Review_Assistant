"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";

export default function NewProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [sourceCode, setSourceCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify({
          project_name: projectName,
          language,
          source_code: sourceCode,
        }),
      });
      router.push(`/projects/${data.project.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">New Project</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm text-gray-600 mb-1">Project Name</label>
          <input
            className="w-full border rounded-lg px-3 py-2 mb-4"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />

          <label className="block text-sm text-gray-600 mb-1">Language</label>
          <select
            className="w-full border rounded-lg px-3 py-2 mb-4"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
          </select>
          <p className="text-xs text-gray-400 mb-4">
            (Only JavaScript is supported for static analysis right now)
          </p>

          <label className="block text-sm text-gray-600 mb-1">Paste your code</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 mb-6 font-mono text-sm h-64"
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            required
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}