'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type EmployeeRole =
  | 'Security Guard'
  | 'Plumber'
  | 'Gardener'
  | 'Housekeeping'
  | 'Other';

type EmployeeStatus = 'Active' | 'Inactive';

export default function AddEmployeeForm() {
  const router = useRouter();

  const API_BASE = '';
  const API_PATH = '/api/admin/addNewEmployee';

  const [name, setName] = useState('');
  const [role, setRole] = useState<EmployeeRole | ''>('');
  const [contact, setContact] = useState('');
  const [salary, setSalary] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<EmployeeStatus | ''>('');

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  function toNumber(v: string) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function validate(): string | null {
    if (!name.trim()) return 'Please enter employee name.';
    if (!role) return 'Please select a role.';
    if (!contact.trim()) return 'Please enter contact number.';
    if (!salary || toNumber(salary) === null || toNumber(salary)! <= 0) return 'Please enter a valid salary.';
    if (!joinDate) return 'Please select join date.';
    if (!location.trim()) return 'Please enter location.';
    if (!status) return 'Please select status.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const message = validate();
    if (message) {
      setLocalError(message);
      setLocalSuccess(null);
      return;
    }

    setLoading(true);
    setLocalError(null);
    setLocalSuccess(null);

    const payload = {
      name: name.trim(),
      role,
      contact: toNumber(contact),
      salary: toNumber(salary),
      join_date: joinDate, // map to schema field
      location: location.trim(),
      status,
      society: '507f1f77bcf86cd799439011', // Temporary hardcoded society ID for testing
    };

    // Final safety check for numeric fields
    if (payload.contact === null) {
      setLocalError('Please enter a valid contact number.');
      setLoading(false);
      return;
    }
    if (payload.salary === null) {
      setLocalError('Please enter a valid salary.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}${API_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setLocalError(body?.error || `Request failed (${res.status})`);
        return;
      }

      setLocalSuccess(body?.message || 'Employee added successfully');
      // Redirect after success
      router.push('/admin/employees');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen mt-15 bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Add New Employee</h1>

        {localError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {localError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6"
        >
          <div className="space-y-5">
            {/* Employee Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee Name</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="e.g., Ramesh Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={role}
                onChange={(e) => setRole(e.target.value as EmployeeRole)}
              >
                <option value="">Select Role</option>
                <option>Security Guard</option>
                <option>Housekeeping</option>
                <option>Electrician</option>
                <option>Plumber</option>
                <option>Gardener</option>
                <option>Manager</option>
                <option>Other</option>
              </select>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                inputMode="tel"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                placeholder="10-digit mobile"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Salary</label>
              <input
                inputMode="decimal"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                placeholder="e.g., 15000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            {/* Join Date + Location (2-col on sm+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Join Date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location in Society</label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                  placeholder="e.g., Block A, Gate 1"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={status}
                onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
              >
                <option value="">Select Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 shadow active:scale-[0.98]"
              >
                Add Employee
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
