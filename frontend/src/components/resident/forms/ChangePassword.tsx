"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Key, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validation
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        throw new Error('All password fields are required');
      }

      if (form.newPassword !== form.confirmPassword) {
        throw new Error('New password and confirm password do not match');
      }

      if (form.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      const response = await fetch('https://next-sms-ten.vercel.app/resident/change-password', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      // Success
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      // Redirect after success
      setTimeout(() => {
        router.push('/resident/profile');
      }, 2000);

    } catch (err) {
      console.error('Error changing password:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while changing password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 mt-15">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Key className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Change Password
          </h1>
        </div>
        <p className="text-sm text-gray-600 ml-11">
          Update your password to keep your account secure
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Password changed successfully! Redirecting to profile...
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
      >
        {/* Current Password */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Current Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              required
              value={form.currentPassword}
              onChange={handleChange("currentPassword")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            New Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              required
              value={form.newPassword}
              onChange={handleChange("newPassword")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 6 characters long
          </p>
        </div>

        {/* Confirm New Password */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Confirm New Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              required
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-base font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Changing Password...
              </>
            ) : (
              'Change Password'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Security Tips */}
      <div className="mx-auto max-w-md mt-6">
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Password Tips</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Use at least 6 characters</li>
            <li>• Include numbers and special characters</li>
            <li>• Avoid using personal information</li>
            <li>• Don't reuse passwords from other sites</li>
          </ul>
        </div>
      </div>
    </main>
  );
}