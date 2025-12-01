"use client";
import Link from "next/link";

import { useMemo, useState, useEffect } from "react";
import {
  MessageSquareText,
  Clock3,
  CheckCircle2,
  Loader2,
  Search,
  Paperclip,
  ChevronDown,
} from "lucide-react";

type Status = "Pending" | "In-Progress" | "Resolved";
type Priority = "Low" | "Medium" | "High";

type Complaint = {
  id: string;
  title: string;
  description: string;
  resident: string;
  flat: string;
  category: string;
  priority: Priority;
  status: Status;
  date: string; // YYYY-MM-DD
  attachments?: number;
};

type Stats = {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
};

export default function ComplaintsManagement() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Priority>("All");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://next-sms-ten.vercel.app/admin/complaints', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        const data = await response.json();
        setComplaints(data.complaints || []);
        setStats(data.stats || { total: 0, pending: 0, inProgress: 0, resolved: 0 });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // --- derived stats ---
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter(
    (c) => c.status === "In-Progress"
  ).length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  // --- filters + search ---
  const rows = useMemo(() => {
    const text = q.trim().toLowerCase();
    return complaints.filter((c) => {
      const byStatus = statusFilter === "All" || c.status === statusFilter;
      const byPriority =
        priorityFilter === "All" || c.priority === priorityFilter;
      const byText =
        !text ||
        c.title.toLowerCase().includes(text) ||
        c.resident.toLowerCase().includes(text) ||
        c.flat.toLowerCase().includes(text) ||
        c.category.toLowerCase().includes(text);
      return byStatus && byPriority && byText;
    });
  }, [q, statusFilter, priorityFilter, complaints]);

  const statusBadge = (s: Status) =>
    ({
      Pending: "bg-rose-100 text-rose-700",
      "In-Progress": "bg-amber-100 text-amber-700",
      Resolved: "bg-emerald-100 text-emerald-700",
    }[s]);

  const priorityBadge = (p: Priority) =>
    ({
      Low: "bg-blue-100 text-blue-700",
      Medium: "bg-indigo-100 text-indigo-700",
      High: "bg-rose-100 text-rose-700",
    }[p]);

  if (error) {
    return (
      <div className="p-6 mt-15">
        <h1 className="text-2xl font-bold">Complaints Management</h1>
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error loading complaints: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-15">
      {/* Header */}
      <h1 className="text-2xl font-bold">Complaints Management</h1>

      {/* ✅ Stat Cards — same style as before */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Total Complaints</p>
            <h2 className="text-xl font-bold">{total}</h2>
          </div>
          <MessageSquareText className="h-10 w-10 text-blue-600" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Pending</p>
            <h2 className="text-xl font-bold text-rose-600">{pending}</h2>
          </div>
          <Clock3 className="h-10 w-10 text-rose-500" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">In-Progress</p>
            <h2 className="text-xl font-bold text-amber-600">{inProgress}</h2>
          </div>
          <Loader2 className="h-10 w-10 text-amber-500" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Resolved</p>
            <h2 className="text-xl font-bold text-emerald-700">{resolved}</h2>
          </div>
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4">
        <div className="flex items-center border rounded-md px-3 py-2 bg-white">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <input
            placeholder="Search by complaint title or resident name..."
            className="w-full outline-none"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="relative">
          <select
            className="appearance-none border bg-white px-3 py-2 pr-9 rounded-md w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | Status)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>In-Progress</option>
            <option>Resolved</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        <div className="relative">
          <select
            className="appearance-none border bg-white px-3 py-2 pr-9 rounded-md w-full"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as "All" | Priority)}
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border-collapse bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 font-semibold">Complaint Details</th>
              <th className="p-3 font-semibold">Resident</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Priority</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50 align-top">
                <td className="p-3">
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm text-gray-600">{c.description}</div>
                  {c.attachments ? (
                    <a
                      href="#"
                      className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <Paperclip className="h-4 w-4" />
                      {c.attachments} attachment(s)
                    </a>
                  ) : null}
                </td>

                <td className="p-3">
                  <div className="font-semibold">{c.resident}</div>
                  <div className="text-sm text-gray-500">{c.flat}</div>
                </td>

                <td className="p-3">{c.category}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-md text-sm font-medium ${priorityBadge(
                      c.priority
                    )}`}
                  >
                    {c.priority}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-md text-sm font-medium ${statusBadge(
                      c.status
                    )}`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="p-3">{c.date}</td>

                <td className="p-3">
                  <Link
                    href={`/admin/forms/manageComplain?id=${c.id}`}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
