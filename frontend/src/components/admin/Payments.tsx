"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, DollarSign, CreditCard, Filter } from "lucide-react";

interface Payment {
  _id: string;
  residentName: string;
  flat: string;
  billTitle: string;
  billType: string;
  baseAmount: number;
  penaltyAmount: number;
  currentAmount: number;
  dueDate: string;
  isOverdue: boolean;
  daysOverdue: number;
  isPaid: boolean;
  paidAt: string;
  paymentStatus: string;
  residentId: string;
  billTemplateId: string;
}


export default function PaymentManagement() {
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalCollected: 0,
    pendingAmount: 0,
    collectionRate: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
  try {
    setLoading(true);

    const response = await fetch('https://nextsms.onrender.com/admin/payments', {
      method: 'GET',
      credentials: 'include', // 🔥 This sends cookies to backend
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }

    const data = await response.json();
    setPayments(data);

    // Calculate stats
    const totalCollected = data
      .filter((p: Payment) => p.isPaid)
      .reduce((sum: number, p: Payment) => sum + p.currentAmount, 0);

    const pendingAmount = data
      .filter((p: Payment) => !p.isPaid)
      .reduce((sum: number, p: Payment) => sum + p.currentAmount, 0);

    const totalPayments = data.length;
    const paidPayments = data.filter((p: Payment) => p.isPaid).length;
    const collectionRate = totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0;

    setStats({
      totalCollected,
      pendingAmount,
      collectionRate,
    });
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setLoading(false);
  }
};


  const filteredPayments = payments.filter((payment) =>
    payment.residentName.toLowerCase().includes(search.toLowerCase()) ||
    payment.flat.toLowerCase().includes(search.toLowerCase()) ||
    payment.billTitle.toLowerCase().includes(search.toLowerCase())
  );

 const handleMarkAsPaid = async (id: string) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`https://nextsms.onrender.com/admin/payments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to mark as paid");

    alert("Bill Updated Successfully!");
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
};




  return (
    <div className="p-6 mt-15">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <div className="flex gap-2">
          {/* Manage Created Bills -> link */}
          <Link
            href="/admin/forms/manageBills" /* change if your route differs */
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Manage Created Bills
          </Link>

          {/* Create Bills -> link */}
          <Link
            href="/admin/forms/createBill" /* change if your route differs */
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Bills
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Total Collected</p>
            <h2 className="text-xl font-bold text-green-600">₹{stats.totalCollected}</h2>
          </div>
          <DollarSign className="h-10 w-10 text-green-500" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Pending Amount</p>
            <h2 className="text-xl font-bold text-red-500">₹{stats.pendingAmount}</h2>
          </div>
          <CreditCard className="h-10 w-10 text-yellow-500" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Collection Rate</p>
            <h2 className="text-xl font-bold text-blue-600">{stats.collectionRate}%</h2>
          </div>
          <Filter className="h-10 w-10 text-blue-500" />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <div className="flex items-center border rounded-md px-3 py-2 flex-1 bg-white">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search residents by name, flat number, or block..."
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="border px-3 py-2 rounded-md bg-white">
          <option>All Status</option>
          <option>Paid</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        {loading ? (
          <div className="text-center py-8">Loading payments...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <table className="min-w-full border-collapse bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 font-semibold">RESIDENT DETAILS</th>
                <th className="p-3 font-semibold">BILL DETAILS</th>
                <th className="p-3 font-semibold">AMOUNT</th>
                <th className="p-3 font-semibold">DUE DATE</th>
                <th className="p-3 font-semibold">STATUS</th>
                <th className="p-3 font-semibold">PAYMENT METHOD</th>
                <th className="p-3 font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">

                  <td className="p-3">
                    <p className="font-bold">{p.residentName}</p>
                    <p className="text-sm text-gray-600">{p.flat}</p>
                  </td>
                  <td className="p-3">{p.billTitle}</td>
                  <td className="p-3">
                    ₹{p.currentAmount}
                    {p.penaltyAmount > 0 && (
                      <p className="text-xs text-red-500">Penalty: ₹{p.penaltyAmount}</p>
                    )}
                  </td>
                  <td className="p-3">
                    {p.dueDate}
                    {p.isPaid && p.paidAt && (
                      <p className="text-xs text-gray-500">Paid: {p.paidAt}</p>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${
                        p.isPaid
                          ? 'bg-green-100 text-green-600'
                          : p.isOverdue
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {p.isPaid ? 'Paid' : p.isOverdue ? 'Overdue' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-3">{p.isPaid ? 'Online' : '-'}</td>
                  <td className="p-3">
                    {!p.isPaid && (
                      <button
                        onClick={() => handleMarkAsPaid(p._id)}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Mark as Paid
                      </button>
                    )}
                    <button className="text-blue-600 hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
