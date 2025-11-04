"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Bill = {
  id: string | number;
  title: string;
  type: "Maintenance" | "Parking" | "Water" | "Electricity" | "Other";
  amount: number; // in INR
  dueDate: string; // yyyy-mm-dd
};

const dummyBills: Bill[] = [
  { id: 1, title: "Maintenance", type: "Maintenance", amount: 700, dueDate: "2025-08-15" },
];

export default function BillManagement() {
  const bills = dummyBills;

  return (
    <div className="p-4 sm:p-6 mt-15">
      <div className="mx-auto w-full max-w-5xl rounded-2xl shadow-xl border border-gray-100 bg-white/60 backdrop-blur">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-blue-600 px-4 sm:px-6 py-4">
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold">Bill Management</h1>

          {/* Create New Bill -> Link */}
          <Link
            href="/admin/forms/createBill"
            className="inline-flex items-center gap-2 rounded-md bg-white text-gray-900 px-4 py-2 font-semibold shadow hover:bg-gray-100"
          >
            <Plus className="h-5 w-5" />
            Create New Bill
          </Link>
        </div>

        {/* Table */}
        <div className="px-4 sm:px-6 py-4">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-gray-700 bg-gray-100">
                  <th className="py-3 px-3 sm:px-4 font-semibold">Title</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold">Type</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold">Amount</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-3 sm:px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="py-4 px-3 sm:px-4">{b.title}</td>
                    <td className="py-4 px-3 sm:px-4">
                      <span className="inline-flex items-center rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold px-3 py-1">
                        {b.type}
                      </span>
                    </td>
                    <td className="py-4 px-3 sm:px-4">₹{b.amount}</td>
                    <td className="py-4 px-3 sm:px-4">
                      {new Date(b.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        {/* Edit -> Link */}
                        <Link
                          href={`/admin/billing/edit/${b.id}`}
                          className="inline-flex items-center gap-2 rounded-md bg-yellow-400/90 hover:bg-yellow-500 text-gray-900 px-3 py-2 text-sm font-semibold"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>

                        {/* Delete -> button (kept as a button since it's destructive) */}
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-md bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 text-sm font-semibold"
                          onClick={() => alert(`UI-only: delete bill ${b.id}`)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {bills.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No bills found.{" "}
                      <Link href="/admin/billing/create" className="text-blue-600 hover:underline font-semibold">
                        Create your first bill
                      </Link>
                      .
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
