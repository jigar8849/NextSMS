"use client";

import React, { useState } from "react";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  error?: string;
  success?: string;
};

export default function ResidentLogin({ error, success }: Props) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      setLocalSuccess(null);
      return;
    }

    setLocalError(null);
    setLocalSuccess(null);
    setLoading(true);

    try {
      const backendUrl = "https://nextsms.onrender.com";

      const res = await fetch(`${backendUrl}/admin/resident-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include", // SESSION COOKIE 👌
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setLocalError(body?.message || "Login failed");
        return;
      }

      setLocalSuccess(body?.message || "Resident logged in!");
      setLocalError(null);

      router.push("/resident/dashboard"); // redirect
    } catch (err: any) {
      setLocalError("Network error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-50">
      <div className="w-full max-w-md p-6 md:p-8 rounded-2xl shadow-xl bg-white border border-gray-100 flex flex-col gap-4">
        {/* Back Link */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 text-blue-700 hover:underline transition font-medium">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <span className="rounded-full bg-sky-100 p-4">
            <FaUser className="text-blue-700 text-3xl" />
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-center font-bold text-2xl mt-4">Resident Portal</h3>
        <p className="text-center text-gray-500 mb-2">Access your society services</p>

        {/* Alerts */}
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

        {/* Form */}
        <form className="w-full mt-2" onSubmit={handleSubmit} autoComplete="on">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="resident@society.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 transition font-medium"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 transition font-medium"
          />

          <div className="flex flex-col sm:flex-row items-center justify-end gap-2 mt-4">
            <Link href="#" className="text-blue-600 hover:underline text-sm mt-2 sm:mt-0">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow transition-transform active:scale-95 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login as Resident"}
          </button>
        </form>

        {/* Footer Text */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          New resident?
          <b className="block font-semibold text-blue-700 mt-1">
            Contact your society admin for account setup
          </b>
        </div>
         <div className="text-center mt-2">
          <p><b>Credential : jigar@gmail.com </b><br></br></p>
        <p><b>Pass : jigar1234</b></p>
        </div>
      </div>
    </div>
  );
}
