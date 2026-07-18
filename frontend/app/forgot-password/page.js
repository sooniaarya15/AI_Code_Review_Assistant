"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";

const inputClass =
  "w-full border-2 border-slate-400 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const data = await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, newPassword }),
      });
      setSuccess(data.message || "Password reset successfully.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg border-2 border-slate-300 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Reset Password</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your account email and choose a new password.
        </p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          className={`${inputClass} mb-4`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            className={`${inputClass} pr-16`}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
        <input
          type={showPassword ? "text" : "password"}
          className={`${inputClass} mb-6`}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
          Reset Password
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-600 font-medium">Login</a>
        </p>
      </form>
    </main>
  );
}