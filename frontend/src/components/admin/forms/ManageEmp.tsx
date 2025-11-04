'use client';

import React, { useState } from 'react';

type EmployeeRole =
  | 'Security Guard'
  | 'Housekeeping'
  | 'Electrician'
  | 'Plumber'
  | 'Gardener'
  | 'Manager'
  | 'Other';

type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive';

type Employee = {
  name: string;
  role: EmployeeRole;
  contact: string;
  salary: string;      // keep as string for UI
  joinDate: string;    // yyyy-mm-dd
  status: EmployeeStatus;
};

type Props = {
  initial?: Partial<Employee>;
  onSubmit?: (data: Employee) => void;
};

export default function UpdateEmployeeForm({ initial, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? 'bhavya');
  const [role, setRole] = useState<EmployeeRole>(initial?.role ?? 'Security Guard');
  const [contact, setContact] = useState(initial?.contact ?? '908907089');
  const [salary, setSalary] = useState(initial?.salary ?? '1234');
  const [joinDate, setJoinDate] = useState(initial?.joinDate ?? '2025-07-24'); // ISO for date input
  const [status, setStatus] = useState<EmployeeStatus>(initial?.status ?? 'Active');

  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter name.');
    if (!contact.trim()) return setError('Please enter contact.');
    if (!salary || Number(salary) <= 0) return setError('Please enter a valid salary.');
    if (!joinDate) return setError('Please pick join date.');
    setError(null);

    const payload: Employee = {
      name: name.trim(),
      role,
      contact: contact.trim(),
      salary,
      joinDate,
      status,
    };
    onSubmit ? onSubmit(payload) : console.log('UI only:', payload);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 mt-15">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl bg-white shadow-xl border border-gray-100">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-center text-3xl font-extrabold text-gray-900">
              Update Employee Details
            </h1>

            {error && (
              <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={role}
                  onChange={(e) => setRole(e.target.value as EmployeeRole)}
                >
                  <option>Security Guard</option>
                  <option>Housekeeping</option>
                  <option>Electrician</option>
                  <option>Plumber</option>
                  <option>Gardener</option>
                  <option>Manager</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  inputMode="tel"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  inputMode="decimal"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                >
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 shadow transition-all active:scale-[0.98]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
