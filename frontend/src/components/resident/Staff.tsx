"use client";

import { useMemo, useState } from "react";
import { IdCard, Phone, MapPin, Search } from "lucide-react";

/* ---------------- types ---------------- */
type StaffRole =
  | "Security Guard"
  | "Cleaner"
  | "Gardener"
  | "Electrician"
  | "Plumber"
  | "Other";

type Staff = {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  location: string; // gate / block / area / city
};

/* ---------------- demo data ---------------- */
const STAFF: Staff[] = [
  { id: "s1", name: "bhavya",        role: "Security Guard", phone: "908907089",  location: "Gate-1 block-A" },
  { id: "s2", name: "shaddha",       role: "Cleaner",        phone: "8849602896", location: "Paras" },
  { id: "s3", name: "eee",           role: "Other",          phone: "90890700",   location: "Surat" },
  { id: "s4", name: "bhavyafgtrgt",  role: "Security Guard", phone: "8849602896", location: "Ahmedabad" },
  // add more…
];

/* ---------------- page ---------------- */
export default function SocietyStaffPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"All" | StaffRole>("All");

  const roles: ("All" | StaffRole)[] = useMemo(() => {
    const unique = Array.from(new Set(STAFF.map((s) => s.role))).sort();
    return ["All", ...unique];
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return STAFF.filter((s) => {
      const byRole = role === "All" || s.role === role;
      if (!t) return byRole;
      const hit =
        s.name.toLowerCase().includes(t) ||
        s.role.toLowerCase().includes(t) ||
        s.location.toLowerCase().includes(t) ||
        s.phone.replace(/\s+/g, "").includes(t.replace(/\s+/g, ""));
      return byRole && hit;
    });
  }, [q, role]);

  return (
    <div className="space-y-6 mt-15">
      {/* header */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Society Staff</h1>
        <p className="text-sm text-gray-600">This page was regarding to society staff</p>
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
            onChange={(e) => setRole(e.target.value as any)}
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
            <li key={s.id}>
              <StaffCard staff={s} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- small component ---------------- */
function StaffCard({ staff }: { staff: Staff }) {
  const tel = staff.phone.replace(/\s+/g, "");
  return (
    <article className="rounded-2xl  border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 grid place-items-center">
        <div className="grid h-14 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200">
          <IdCard className="h-6 w-6" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 text-center">{staff.name}</h3>
      <p className="mt-1 text-center text-sm text-gray-600">{staff.role}</p>

      <div className="mt-6 space-y-3 text-sm text-gray-800">
        <div className="inline-flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <a href={`tel:${tel}`} className="font-medium hover:underline">
            {staff.phone}
          </a>
        </div>
        <div className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span>{staff.location}</span>
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
