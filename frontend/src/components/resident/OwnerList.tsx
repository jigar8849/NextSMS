"use client";

import { useState, useMemo } from "react";
import { Download, Mail, Phone, Users, Home } from "lucide-react";

/* ---------- demo data ---------- */
type Resident = {
  id: string;
  name: string;
  flat: string;
  phone: string;
  email: string;
  members: number;
  role: "Owner" | "Tenant";
  since: string;   // ISO date
  initials?: string;
};

const DATA: Record<string, Resident[]> = {
  a: [
    {
      id: "a1",
      name: "Ramesh Kumar",
      flat: "A-101",
      phone: "9999999999",
      email: "ramesh@example.com",
      members: 4,
      role: "Owner",
      since: "2024-05-01",
      initials: "RK",
    },
  ],
  d: [
    {
      id: "d1",
      name: "Jigar Prajapati",
      flat: "D-11",
      phone: "8849602896",
      email: "jigar@gmail.com",
      members: 2,
      role: "Owner",
      since: "2025-07-24",
      initials: "JP",
    },
  ],
  // add more blocks: b,c,e,f
};

/* ---------- utils ---------- */
const friendlyDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/* ---------- component ---------- */
export default function OwnersPage() {
  const BLOCKS = ["A", "B", "C", "D", "E", "F"];

  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const residents = selectedBlock ? DATA[selectedBlock.toLowerCase()] ?? [] : [];

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return residents;
    return residents.filter(
      (r) =>
        r.name.toLowerCase().includes(t) ||
        r.flat.toLowerCase().includes(t) ||
        r.email.toLowerCase().includes(t)
    );
  }, [q, residents]);

  const onDownload = () => {
    alert(`Downloading Block-${selectedBlock} residents as PDF (demo)`);
  };

  /* ---------- if no block selected, show grid ---------- */
  if (!selectedBlock) {
    return (
      <div className="space-y-8 mt-20">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Owners &amp; Residents List
          </h1>
          <p className="text-sm text-gray-600">Directory of all society members</p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {BLOCKS.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBlock(b)}
              className="rounded-2xl border border-gray-200 bg-white p-10 text-center font-semibold text-blue-700 shadow-sm transition hover:shadow hover:underline"
            >
              Block-{b}
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ---------- else show residents list ---------- */
  return (
    <div className="space-y-6 mt-15">
      <div className="flex flex-wrap  items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl  font-extrabold tracking-tight">
            Block-{selectedBlock} Residents List
          </h1>
          <p className="text-sm text-gray-600">Directory of all society members</p>
        </div>

        <button
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>

      {/* search */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-2"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or flat number..."
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button className="h-11 shrink-0 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
            Search
          </button>
        </form>
      </div>

      {/* list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          No residents found for your search.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => (
            <li key={r.id}>
              <ResidentCard r={r} />
            </li>
          ))}
        </ul>
      )}

      {/* back button */}
      <div className="pt-2">
        <button
          onClick={() => setSelectedBlock(null)}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"
        >
          <Home className="h-4 w-4" />
          Back to Blocks
        </button>
      </div>
    </div>
  );
}

/* ---------- resident card ---------- */
function ResidentCard({ r }: { r: Resident }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {r.initials || r.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{r.name}</h3>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {r.role}
            </span>
          </div>
        </div>
      </div>

      <ul className="mt-3 space-y-2 text-sm text-gray-700">
        <li className="inline-flex items-center gap-2">
          <Home className="h-4 w-4 text-gray-500" />
          <span>{r.flat}</span>
        </li>
        <li className="inline-flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <a href={`tel:${r.phone}`} className="hover:underline">
            {r.phone}
          </a>
        </li>
        <li className="inline-flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <a href={`mailto:${r.email}`} className="truncate hover:underline">
            {r.email}
          </a>
        </li>
        <li className="inline-flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span>{r.members} family members</span>
        </li>
      </ul>

      <hr className="my-3" />
      <p className="text-xs text-gray-500">Resident since {friendlyDate(r.since)}</p>
    </article>
  );
}
