"use client";

import { useState, FormEvent } from "react";
import { Send } from "lucide-react";

export default function NewComplaintPage() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
    date: "",
    file: null as File | null,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous message
    try {
      const response = await fetch('/api/resident/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          priority: form.priority,
          description: form.description,
          date: form.date,
          resident: undefined, // Will use session from backend
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Complaint submitted successfully!' });
        // Reset form
        setForm({
          title: '',
          category: '',
          priority: '',
          description: '',
          date: '',
          file: null,
        });
      } else {
        setMessage({ type: 'error', text: `Error: ${data.message}` });
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setMessage({ type: 'error', text: 'Failed to submit complaint. Please try again.' });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6 mt-10 sm:py-10">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900">
          Submit a Complaint
        </h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
        >
          {/* Complaint Title */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Complaint Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder=""
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none ring-blue-600/20 placeholder:text-gray-400 focus:border-blue-600 focus:ring-4"
            />
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Category
            </label>
            <div className="relative">
              <select
                name="category"
                required
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none ring-blue-600/20 focus:border-blue-600 focus:ring-4"
              >
                <option value="">Select Category</option>
                <option>Maintenance</option>
                <option>Security</option>
                <option>Noise</option>
                <option>Parking</option>
                <option>Cleaning</option>
                <option>Other</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                ▾
              </span>
            </div>
          </div>

          {/* Priority */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Priority
            </label>
            <div className="relative">
              <select
                name="priority"
                required
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: e.target.value }))
                }
                className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none ring-blue-600/20 focus:border-blue-600 focus:ring-4"
              >
                <option value="">Select Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                ▾
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={6}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder=""
              className="block w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none ring-blue-600/20 placeholder:text-gray-400 focus:border-blue-600 focus:ring-4"
            />
          </div>

          {/* Date */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Complaint Creation Date
            </label>
            <input
              type="date"
              name="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none ring-blue-600/20 placeholder:text-gray-400 focus:border-blue-600 focus:ring-4"
            />
            <p className="mt-1 text-xs text-gray-500">Format: dd-mm-yyyy</p>
          </div>

          {/* Attachment */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Attachment (optional)
            </label>
            <input
              type="file"
              onChange={(e) =>
                setForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))
              }
              className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-gray-200 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-300"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col items-stretch sm:flex-row sm:justify-start">
            <button
              type="submit"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 sm:w-auto"
            >
              <Send className="h-4 w-4" />
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
