"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, clearToken, getToken } from "../../lib/api";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await apiFetch("/projects");
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
          <div className="flex gap-3">
            <Link href="/projects/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              + New Project
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Logout
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="space-y-3">
          {projects.length === 0 && (
            <p className="text-gray-500">No projects yet. Create one!</p>
          )}
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md border"
            >
              <p className="font-semibold text-gray-800">{p.project_name}</p>
              <p className="text-sm text-gray-500">{p.language} · {new Date(p.created_at).toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}