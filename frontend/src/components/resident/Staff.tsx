"use client";

import { useMemo, useState, useEffect } from "react";
import { IdCard, Phone, MapPin, Search, Calendar, DollarSign, UserCheck } from "lucide-react";

type Employee = {
  _id: string;
  name: string;
  role: string;
  contact: number;
  salary: number;
  join_date: string;
  status: "Active" | "Inactive";
  location: string;
};

type EmployeeResponse = {
  employees: Employee[];
  stats: {
    totalEmployees: number;
    totalActiveEmployees: number;
    totalInactiveEmployees: number;
    totalSalaryAmount: number;
  };
};

export default function SocietyStaffPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"All" | string>("All");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/resident/employees', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data: EmployeeResponse = await response.json();
        setEmployees(data.employees);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const roles: ("All" | string)[] = useMemo(() => {
    const unique = Array.from(new Set(employees.map((s) => s.role))).sort();
    return ["All", ...unique];
  }, [employees]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return employees.filter((s) => {
      const byRole = role === "All" || s.role === role;
      if (!t) return byRole;
      const hit =
        s.name.toLowerCase().includes(t) ||
        s.role.toLowerCase().includes(t) ||
        s.location.toLowerCase().includes(t) ||
        s.contact.toString().includes(t);
      return byRole && hit;
    });
  }, [q, role, employees]);

  if (loading) {
    return (
      <div className="space-y-6 mt-15">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">Society Staff</h1>
          <p className="text-sm text-gray-600">Loading staff details...</p>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 mt-15">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">Society Staff</h1>
          <p className="text-sm text-red-600">Error loading staff: {error}</p>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-15">
      {/* header */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Society Staff</h1>
        <p className="text-sm text-gray-600">This page shows society staff details</p>
      </header>

      {/* search + filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]"
          role="search"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by employee name or role..."
              className="h-11 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Search staff"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Filter staff role"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All Staff" : r}
              </option>
            ))}
          </select>
        </form>
      </div>

      {/* grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          No staff match your search.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((s) => (
            <li key={s._id}>
              <StaffCard staff={s} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- small component ---------------- */
function StaffCard({ staff }: { staff: Employee }) {
  const tel = staff.contact.toString();
  const money = (n: number) =>
    `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 grid place-items-center">
        <div className="grid h-14 w-14 place-items-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200">
          <IdCard className="h-6 w-6" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 text-center">{staff.name}</h3>
      <p className="mt-1 text-center text-sm text-gray-600">{staff.role}</p>

      <div className="mt-6 space-y-3 text-sm text-gray-800">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <a href={`tel:${tel}`} className="font-medium hover:underline">
            {staff.contact}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span>{staff.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span>{money(staff.salary)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{new Date(staff.join_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-gray-500" />
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${
              staff.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {staff.status}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <a
          href={`tel:${tel}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Call
        </a>
      </div>
    </article>
  );
}
