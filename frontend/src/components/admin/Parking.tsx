"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Bike,
  Car,
  Plus,
  Filter,
  Phone,
  User2,
  Home,
} from "lucide-react";

type Vehicle = {
  reg: string;
  type: "2-wheeler" | "4-wheeler";
};

type Resident = {
  id: number;
  name: string;
  phone: string;
  block: string; // e.g. "Block D"
  flat: string;  // e.g. "11"
  vehicles: Vehicle[];
};

export default function ParkingManagement() {
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState<
    "all" | "2-wheeler" | "4-wheeler"
  >("all");

  // --- Mock data (replace with your data) ---
  const twoWTotal = 3;
  const fourWTotal = 32;
  const data: Resident[] = [
    {
      id: 1,
      name: "Jigar Prajapati",
      phone: "+91 8849602896",
      block: "Block D",
      flat: "11",
      vehicles: [
        { reg: "GJ-01-KY-43533", type: "4-wheeler" },
        { reg: "GJ-01-XW-5434", type: "2-wheeler" },
      ],
    },
  ];

  // derived values
  const occupied2 = data.reduce(
    (n, r) => n + r.vehicles.filter((v) => v.type === "2-wheeler").length,
    0
  );
  const occupied4 = data.reduce(
    (n, r) => n + r.vehicles.filter((v) => v.type === "4-wheeler").length,
    0
  );
  const available4 = Math.max(0, fourWTotal - occupied4);
  const occRate = Math.round(
    ((occupied2 + occupied4) / (twoWTotal + fourWTotal)) * 100
  );

  // filtering
  const results = useMemo(() => {
    const q = search.toLowerCase().trim();
    return data.filter((r) => {
      const matchesText =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.block.toLowerCase().includes(q) ||
        r.flat.toLowerCase().includes(q) ||
        r.vehicles.some((v) => v.reg.toLowerCase().includes(q));

      const matchesType =
        vehicleFilter === "all" ||
        r.vehicles.some((v) => v.type === vehicleFilter);

      return matchesText && matchesType;
    });
  }, [search, vehicleFilter, data]);

  return (
    <div className="p-6 mt-15">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Parking Management</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Two Wheeler Slots</p>
            <h2 className="text-xl font-bold"> {occupied2}/{twoWTotal}</h2>
          </div>
          <Bike className="h-10 w-10 text-blue-600" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Four Wheeler Slots</p>
            <h2 className="text-xl font-bold">{occupied4}/{fourWTotal}</h2>
          </div>
          <Car className="h-10 w-10 text-emerald-600" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Available 4W Slots</p>
            <h2 className="text-xl font-bold text-green-700">{available4}</h2>
          </div>
          <Plus className="h-10 w-10 text-green-600" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Occupancy Rate</p>
            <h2 className="text-xl font-bold text-purple-700">{occRate}%</h2>
          </div>
          <Filter className="h-10 w-10 text-purple-600" />
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <div className="flex items-center border rounded-md px-3 py-2 flex-1 bg-white">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by registration, owner name, or flat…"
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border px-3 py-2 rounded-md bg-white"
          value={vehicleFilter}
          onChange={(e) =>
            setVehicleFilter(e.target.value as "all" | "2-wheeler" | "4-wheeler")
          }
        >
          <option value="all">All Vehicles</option>
          <option value="4-wheeler">4-wheeler</option>
          <option value="2-wheeler">2-wheeler</option>
        </select>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold">Search Results</h2>

        {results.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded-lg shadow">
            {/* registrations */}
            <div className="space-y-2">
              {r.vehicles.map((v) => (
                <div key={v.reg} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-100 grid place-items-center">
                    {v.type === "4-wheeler" ? (
                      <Car className="h-5 w-5 text-blue-700" />
                    ) : (
                      <Bike className="h-5 w-5 text-emerald-700" />
                    )}
                  </div>
                  <p className="font-semibold">{v.reg}</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-md font-medium ${
                      v.type === "4-wheeler"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {v.type}
                  </span>
                </div>
              ))}
            </div>

            {/* owner details */}
            <div className="mt-4 grid gap-1 text-sm sm:text-base">
              <p className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Owner:</span> {r.name}
              </p>
              <p className="flex items-center gap-2">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Flat:</span> {r.block} – {r.flat}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Phone:</span> {r.phone}
              </p>
            </div>

            {/* actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Contact Owner
              </button>
              <button className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200">
                Report Issue
              </button>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
