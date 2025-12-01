'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type BillType = 'Maintenance' | 'Parking' | 'Water' | 'Electricity' | 'Other';

type Props = {
  onSubmit?: (data: {
    title: string;
    type: BillType | '';
    amount: string;
    penalty: string;
    dueDate: string; // yyyy-mm-dd
  }) => void;
};

export default function CreateBillForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<BillType | ''>('');
  const [amount, setAmount] = useState('');
  const [penalty, setPenalty] = useState('0');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Helper to validate numeric input (allows decimals)
  function isValidNumber(value: string) {
    return /^\d*\.?\d*$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return setError('Please enter bill title.');
    if (!type) return setError('Please select a bill type.');
    if (!amount || Number(amount) <= 0) return setError('Please enter a valid amount.');
    if (!dueDate) return setError('Please select a due date.');

    setError(null);

    const payload = {
      title: title.trim(),
      type,
      amount: amount.trim(),
      penalty: penalty.trim() || '0',
      dueDate,
    };

    if (onSubmit) {
      onSubmit(payload);
      return;
    }

    setLoading(true);
  try {
      // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://nextsms.onrender.com';
      const response = await fetch(`https://next-sms-ten.vercel.app/admin/createBill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/admin/payments');
      } else {
        // Try parse JSON error first, fallback to text
        let errorData = '';
        try {
          const json = await response.json();
          errorData = json.error || JSON.stringify(json);
        } catch {
          errorData = await response.text();
        }
        setError(`Failed to create bill: ${errorData}`);
      }
    } catch (err) {
      console.error('Error creating bill:', err);
      setError('Failed to create bill. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen mt-15 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl bg-white shadow-xl border border-gray-100">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-blue-700">
              Create New Bill
            </h1>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
              {/* Bill Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Bill Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  aria-required="true"
                  aria-invalid={!!error && !title.trim()}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g., Monthly Maintenance - April 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Bill Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Bill Type
                </label>
                <select
                  id="type"
                  name="type"
                  aria-required="true"
                  aria-invalid={!!error && !type}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={type}
                  onChange={(e) => setType(e.target.value as BillType)}
                  disabled={loading}
                >
                  <option value="">Select Type</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Parking">Parking</option>
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Amount & Penalty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="text"
                    inputMode="decimal"
                    aria-required="true"
                    aria-invalid={!!error && (!amount || Number(amount) <= 0)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., 1200"
                    value={amount}
                    onChange={(e) => {
                      if (isValidNumber(e.target.value)) setAmount(e.target.value);
                    }}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="penalty" className="block text-sm font-medium text-gray-700 mb-1">
                    Penalty (₹)
                  </label>
                  <input
                    id="penalty"
                    name="penalty"
                    type="text"
                    inputMode="decimal"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="0"
                    value={penalty}
                    onChange={(e) => {
                      if (isValidNumber(e.target.value)) setPenalty(e.target.value);
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  aria-required="true"
                  aria-invalid={!!error && !dueDate}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-4 w-full rounded-lg text-white font-semibold px-6 py-3 shadow transition-all active:scale-[0.98] ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Creating...' : 'Create Bill'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
