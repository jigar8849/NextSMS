"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Car,
  Bike,
  Search,
  User,
  Home,
  Phone,
  Mail,
} from "lucide-react";

/* ---------------- types ---------------- */
type VehicleType = "2-wheeler" | "4-wheeler";
type Vehicle = {
  id: string;
  regNo: string;
  type: VehicleType;
};

type RecordItem = {
  id: string;
  vehicles: Vehicle[];
  owner: {
    name: string;
    flat: string; // e.g., "Block D - 11"
    phone: string;
    email: string;
  };
};

/* ---------------- demo data ---------------- */
const DATA: RecordItem[] = [
  {
    id: "r1",
    vehicles: [
      { id: "v1", regNo: "GJ-01-KY-43533", type: "4-wheeler" },
      { id: "v2", regNo: "GJ-01-XW-5434", type: "2-wheeler" },
    ],
    owner: {
      name: "Jigar Prajapati",
      flat: "Block D - 11",
      phone: "+91 8849602896",
      email: "jigar@gmail.com",
    },
  },
];

const typeBadge = (t: VehicleType) =>
  t === "2-wheeler"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-indigo-50 text-indigo-700";

/* ---------------- page ---------------- */
export default function VehicleSearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | VehicleType>("all");

  // Flat counts for stat cards
  const stats = useMemo(() => {
    const allVehicles = DATA.flatMap((r) => r.vehicles);
    const two = allVehicles.filter((v) => v.type === "2-wheeler").length;
    const four = allVehicles.filter((v) => v.type === "4-wheeler").length;
    return { total: allVehicles.length, two, four };
  }, []);

  // Filtered list
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA.filter((rec) => {
      const matchesFilter =
        filter === "all" ||
        rec.vehicles.some((v) => v.type === filter);

      if (!matchesFilter) return false;
      if (!q) return true;

      const hitVehicle = rec.vehicles.some((v) =>
        v.regNo.toLowerCase().includes(q)
      );
      const hitOwner =
        rec.owner.name.toLowerCase().includes(q) ||
        rec.owner.flat.toLowerCase().includes(q);
      return hitVehicle || hitOwner;
    });
  }, [query, filter]);

  return (
    <div className="space-y-6 mt-15">
      {/* header */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Vehicle Search</h1>
        <p className="text-sm text-gray-600">
          Find vehicle owners for complaints or inquiries
        </p>
      </header>

      {/* stat cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total Vehicles" value={stats.total} Icon={Car} tone="text-blue-700" />
        <StatCard label="Two Wheelers" value={stats.two} Icon={Bike} tone="text-emerald-700" />
        <StatCard label="Four Wheelers" value={stats.four} Icon={Car} tone="text-yellow-600" />
      </div>

      {/* search + filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by registration number, owner name, or flat..."
              className="h-11 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Search vehicles"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Filter vehicle type"
          >
            <option value="all">All Vehicles</option>
            <option value="2-wheeler">Two Wheelers</option>
            <option value="4-wheeler">Four Wheelers</option>
          </select>
        </form>
      </div>

      {/* results */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-xl font-semibold">Search Results</h2>
        </div>

        {results.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">
            No matching vehicles. Try a different query or filter.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {results.map((rec) => (
              <li key={rec.id} className="px-4 py-4">
                <ResultCard rec={rec} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/* ---------------- small components ---------------- */

function StatCard({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: number;
  Icon: React.ComponentType<{ className?: string }>;
  tone: string; // text color classes
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <span className={`rounded-lg border border-gray-200 p-3 ${tone}`}>
          <Icon className="h-6 w-6" />
        </span>
      </div>
    </div>
  );
}

function ResultCard({ rec }: { rec: RecordItem }) {
  return (
    <article className="rounded-xl border  border-gray-100 p-4 sm:flex sm:justify-between sm:gap-8">
      {/* left: vehicles list */}
      <div className="flex-1">
        {rec.vehicles.map((v) => (
          <div key={v.id} className="mb-4 last:mb-0">
            <div className="flex items-center gap-3">
              {v.type === "2-wheeler" ? (
                <Bike className="h-6 w-6 text-emerald-700" />
              ) : (
                <Car className="h-6 w-6 text-blue-700" />
              )}

              <h3 className="text-lg font-semibold text-gray-900">{v.regNo}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeBadge(v.type)}`}>
                {v.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* right: owner details & actions */}
      <div className="mt-4 w-full max-w-sm sm:mt-0">
        <div className="space-y-2 text-sm text-gray-700">
          <div className="inline-flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span>
              <span className="font-semibold">Owner :</span> {rec.owner.name}
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Home className="h-4 w-4 text-gray-500" />
            <span>
              <span className="font-semibold">Flat :</span> {rec.owner.flat}
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <a className="font-semibold hover:underline" href={`tel:${rec.owner.phone.replace(/\s+/g, "")}`}>
              {rec.owner.phone}
            </a>
          </div>
          <div className="inline-flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <a className="hover:underline" href={`mailto:${rec.owner.email}`}>
              {rec.owner.email}
            </a>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`tel:${rec.owner.phone.replace(/\s+/g, "")}`}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Contact Owner
          </a>
          <Link
            href={`/resident/complaints?subject=${encodeURIComponent(
              `Vehicle issue for ${rec.vehicles[0]?.regNo}`
            )}`}
            className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-200 hover:bg-gray-200"
          >
            Report Issue
          </Link>
        </div>
      </div>
    </article>
  );
}
