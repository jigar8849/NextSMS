"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, DollarSign, CreditCard, Filter, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface Payment {
  id: string;
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
  paidAt: string | null;
  paymentStatus: string;
  residentId: string;
  billTemplateId: string;
}

export default function PaymentManagement() {
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/payments');
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to mark payment as paid');
      }
      // Refresh the payments list
      fetchPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment');
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.residentName.toLowerCase().includes(search.toLowerCase()) ||
    payment.flat.toLowerCase().includes(search.toLowerCase()) ||
    payment.billTitle.toLowerCase().includes(search.toLowerCase())
  );

  const totalCollected = payments
    .filter(p => p.isPaid)
    .reduce((sum, p) => sum + p.currentAmount, 0);

  const pendingAmount = payments
    .filter(p => !p.isPaid)
    .reduce((sum, p) => sum + p.currentAmount, 0);

  const collectionRate = payments.length > 0
    ? Math.round((payments.filter(p => p.isPaid).length / payments.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="p-6 mt-15">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading payments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mt-15">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-15">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <div className="flex gap-2">
          {/* Manage Created Bills -> link */}
          <Link
            href="/admin/forms/manageBills"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Manage Created Bills
          </Link>

          {/* Create Bills -> link */}
          <Link
            href="/admin/forms/createBill"
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
            <h2 className="text-xl font-bold text-green-600">₹{totalCollected.toLocaleString()}</h2>
          </div>
          <DollarSign className="h-10 w-10 text-green-500" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Pending Amount</p>
            <h2 className="text-xl font-bold text-red-500">₹{pendingAmount.toLocaleString()}</h2>
          </div>
          <CreditCard className="h-10 w-10 text-yellow-500" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Collection Rate</p>
            <h2 className="text-xl font-bold text-blue-600">{collectionRate}%</h2>
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
            placeholder="Search residents by name, flat number, or bill type..."
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="border px-3 py-2 rounded-md bg-white">
          <option>All Status</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Overdue</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border-collapse bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 font-semibold">RESIDENT DETAILS</th>
              <th className="p-3 font-semibold">BILL DETAILS</th>
              <th className="p-3 font-semibold">AMOUNT</th>
              <th className="p-3 font-semibold">DUE DATE</th>
              <th className="p-3 font-semibold">STATUS</th>
              <th className="p-3 font-semibold">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <p className="font-bold">{payment.residentName}</p>
                  <p className="text-sm text-gray-600">{payment.flat}</p>
                </td>
                <td className="p-3">
                  <p className="font-medium">{payment.billTitle}</p>
                  <p className="text-sm text-gray-500">{payment.billType}</p>
                </td>
                <td className="p-3">
                  <p className="font-semibold">₹{payment.currentAmount.toLocaleString()}</p>
                  {payment.penaltyAmount > 0 && (
                    <p className="text-sm text-red-600">
                      +₹{payment.penaltyAmount.toLocaleString()} penalty
                    </p>
                  )}
                </td>
                <td className="p-3">
                  <p>{payment.dueDate}</p>
                  {payment.isOverdue && (
                    <p className="text-sm text-red-600">
                      {payment.daysOverdue} days overdue
                    </p>
                  )}
                  {payment.paidAt && (
                    <p className="text-xs text-green-600">Paid: {payment.paidAt}</p>
                  )}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-md text-sm font-medium ${
                    payment.paymentStatus === 'Paid'
                      ? 'bg-green-100 text-green-600'
                      : payment.paymentStatus === 'Overdue'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {payment.paymentStatus === 'Paid' && <CheckCircle className="inline h-4 w-4 mr-1" />}
                    {payment.paymentStatus === 'Pending' && <Clock className="inline h-4 w-4 mr-1" />}
                    {payment.paymentStatus === 'Overdue' && <AlertTriangle className="inline h-4 w-4 mr-1" />}
                    {payment.paymentStatus}
                  </span>
                </td>
                <td className="p-3">
                  {!payment.isPaid ? (
                    <button
                      onClick={() => markAsPaid(payment.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <span className="text-green-600 font-medium">Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No payments found matching your search.
        </div>
      )}
    </div>
  );
}
