"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Download,
  Building2,
  Home,
  Car,
  Plus,
  Filter,
} from "lucide-react";

type Block = {
  id: string; // A,B,C...
  flats: number;
  occupiedSlots: number;
  totalSlots: number;
};

export default function FlatManagement() {
  // --- mock data (swap with API) ---
  const blocks: Block[] = [
    { id: "A", flats: 120, occupiedSlots: 30, totalSlots: 200 },
    { id: "B", flats: 140, occupiedSlots: 50, totalSlots: 220 },
    { id: "C", flats: 100, occupiedSlots: 45, totalSlots: 180 },
    { id: "D", flats: 90,  occupiedSlots: 25, totalSlots: 160 },
    { id: "E", flats: 110, occupiedSlots: 70, totalSlots: 210 },
    { id: "F", flats: 95,  occupiedSlots: 35, totalSlots: 170 },
  ];

  // derived stats
  const totalBlocks = blocks.length;
  const totalFlats = blocks.reduce((s, b) => s + b.flats, 0);
  const totalSlots = blocks.reduce((s, b) => s + b.totalSlots, 0);
  const occupied = blocks.reduce((s, b) => s + b.occupiedSlots, 0);
  const availableSlots = Math.max(0, totalSlots - occupied);
  const occupancyRate = totalSlots ? Math.round((occupied / totalSlots) * 100) : 0;

  return (
    <div className="p-6 mt-15">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Flat Management</h1>
        <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Download className="h-5 w-5" />
          Download PDF
        </button>
      </div>

      {/* Stat cards — same style as your parking stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Total Blocks</p>
            <h2 className="text-xl font-bold">{totalBlocks}</h2>
          </div>
          <Building2 className="h-10 w-10 text-blue-600" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Total Flats</p>
            <h2 className="text-xl font-bold">{totalFlats}</h2>
          </div>
          <Home className="h-10 w-10 text-emerald-600" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Available Slots</p>
            <h2 className="text-xl font-bold text-green-700">{availableSlots}</h2>
          </div>
          <Plus className="h-10 w-10 text-green-600" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Occupancy Rate</p>
            <h2 className="text-xl font-bold text-purple-700">{occupancyRate}%</h2>
          </div>
          <Filter className="h-10 w-10 text-purple-600" />
        </div>
      </div>

      {/* Blocks grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blocks.map((b) => (
          <Link
            key={b.id}
            href={`/blocks/${b.id}`}
            className="group rounded-xl border bg-white p-8 text-center shadow hover:shadow-md transition"
          >
            <span className="text-lg font-semibold text-blue-700 underline decoration-2 decoration-blue-300 group-hover:decoration-blue-600">
              {`Block-${b.id}`}
            </span>

            <div className="mt-3 text-sm text-gray-500">
              <span className="mr-3">Flats: {b.flats}</span>
              <span>
                Slots: {b.occupiedSlots}/{b.totalSlots}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
