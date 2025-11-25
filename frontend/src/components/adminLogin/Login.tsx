"use client";

import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = { error?: string; success?: string };

export default function AdminLogin({ error, success }: Props) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-fill saved email
  useEffect(() => {
    const saved = localStorage.getItem("admin_email");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) {
      setLocalError("Please fill all fields correctly.");
      setLocalSuccess(null);
      return;
    }

    setLocalError(null);
    setLocalSuccess(null);
    setLoading(true);

    try {
      // 🔥 Direct URL (No ENV needed)
      const backendUrl = "https://nextsms.onrender.com";

      const res = await fetch(`${backendUrl}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include", // keep cookie
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setLocalError(body?.error || `Login failed (${res.status})`);
        setLocalSuccess(null);
        return;
      }

      // Success
      setLocalSuccess(body?.message || "Logged in successfully!");
      setLocalError(null);

      // Remember email
      if (remember) localStorage.setItem("admin_email", email);
      else localStorage.removeItem("admin_email");

      // Redirect to dashboard
      const to = body?.redirect || "/admin/dashboard";
      router.push(to);
    } catch (err: any) {
      setLocalError(err?.message || "Network error");
      setLocalSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-6 md:p-8 rounded-2xl shadow-xl bg-white border border-gray-100 flex flex-col gap-4">
        
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 text-blue-700 hover:underline transition font-medium">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>

        <div className="flex justify-center">
          <span className="rounded-full bg-blue-100 p-4">
            <FaShieldAlt className="text-blue-700 text-3xl" />
          </span>
        </div>

        <h3 className="text-center font-bold text-2xl mt-4">Admin Portal</h3>
        <p className="text-center text-gray-500 mb-2">Sign in to manage your society</p>

        {(localError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-2 text-center text-sm">
            {localError || error}
          </div>
        )}
        {(localSuccess || success) && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-2 text-center text-sm">
            {localSuccess || success}
          </div>
        )}

        <form className="w-full mt-2" onSubmit={handleSubmit} autoComplete="on">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="admin@society.com"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 transition font-medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="block text-gray-700 font-semibold mb-1 mt-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 transition font-medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="form-checkbox h-4 w-4 accent-blue-600"
              />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-blue-600 hover:underline text-sm mt-2 sm:mt-0">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow transition-transform active:scale-95 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Need to create a society account?
          <Link href="/createAccount" className="ml-1 text-blue-600 hover:underline font-semibold">
            Register here
          </Link>
        </div>

        <div className="text-center mt-2">
          <p><b>Credential : admin@gmail.com</b></p>
          <p><b>Pass : admin1234</b></p>
        </div>
      </div>
    </div>
  );
}
