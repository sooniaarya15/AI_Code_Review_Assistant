"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800">AI Code Review Assistant</h1>
      <p className="text-gray-600">Paste your code. Get instant feedback.</p>
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Login
        </Link>
        <Link href="/signup" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
          Sign Up
        </Link>
      </div>
    </main>
  );
}
