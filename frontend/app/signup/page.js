"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, setToken } from "../../lib/api";

const NAME_REGEX = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;

const inputClass =
  "w-full border-2 border-slate-400 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isNameValid = name.trim().length === 0 ? true : NAME_REGEX.test(name.trim());

  function handleNameChange(e) {
    setName(e.target.value);
    if (!nameTouched) setNameTouched(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!NAME_REGEX.test(name.trim()) || name.trim().length < 2) {
      setError("Please enter a valid name — only letters and spaces are allowed.");
      return;
    }

    try {
      const data = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), email, password }),
      });
      setToken(data.token);
      router.push("/dashboard");
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
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Account</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          className={`${inputClass} mb-1 ${
            nameTouched && !isNameValid ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
          }`}
          value={name}
          onChange={handleNameChange}
          placeholder="e.g. Aakash Singh"
          required
        />
        {nameTouched && !isNameValid && (
          <p className="text-red-500 text-xs mb-3">
            Invalid — only letters and spaces are allowed (no numbers or symbols).
          </p>
        )}
        {(!nameTouched || isNameValid) && <div className="mb-4" />}

        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          className={`${inputClass} mb-4`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            className={`${inputClass} pr-16`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password"
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

        <button
          disabled={nameTouched && !isNameValid}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Sign Up
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium">Login</a>
        </p>
      </form>
    </main>
  );
}