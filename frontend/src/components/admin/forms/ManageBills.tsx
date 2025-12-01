"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Bill = {
  _id: string;
  title: string;
  type: "Maintenance" | "Parking" | "Water" | "Electricity" | "Other";
  amount: number;
  dueDate: string;
};

export default function BillManagement() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "https://next-sms-ten.vercel.app";

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token"); // If JWT stored

        const res = await fetch(`${BASE_URL}/admin/bills`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // use cookies if required
        });

        if (!res.ok) throw new Error("Failed to fetch bills");

        const data = await res.json();
        setBills(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading)
    return (
      <p className="text-center py-10 text-gray-600 font-semibold">
        Loading bills...
      </p>
    );

  if (error)
    return (
      <p className="text-center py-10 text-red-600 font-semibold">
        {error}
      </p>
    );

  return (
    <div className="p-4 sm:p-6 mt-15">
      <div className="mx-auto w-full max-w-5xl rounded-2xl shadow-xl border bg-white">

        {/* Header */}
        <div className="flex items-center justify-between bg-blue-600 px-6 py-4 rounded-t-2xl">
          <h1 className="text-white text-2xl font-bold">Bill Management</h1>

          <Link
            href="/admin/forms/createBill"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-md font-semibold shadow hover:bg-gray-200"
          >
            <Plus className="w-5 h-5" /> Create New Bill
          </Link>
        </div>

        {/* Table */}
        <div className="px-6 py-4 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left font-semibold">Title</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Amount</th>
                <th className="py-3 px-4 text-left font-semibold">Due Date</th>
                <th className="py-3 px-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bills.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="py-3 px-4">{b.title}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                      {b.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">₹{b.amount}</td>
                  <td className="py-3 px-4">
                    {new Date(b.dueDate).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/billing/edit/${b._id}`}
                        className="inline-flex items-center gap-1 bg-yellow-400 px-3 py-1 rounded font-semibold hover:bg-yellow-500"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </Link>

                      <button
                        className="inline-flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded font-semibold hover:bg-red-600"
                        onClick={() => alert(`Delete ${b._id}`)}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {bills.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No bills found.{" "}
                    <Link
                      href="/admin/forms/createBill"
                      className="text-blue-600 font-semibold"
                    >
                      Create one
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
  );
}
