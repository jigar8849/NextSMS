'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Status = 'Pending' | 'InProgress' | 'Complete' | 'On-hold' | 'Reject';

type Props = {
  initial?: Status;                 // default selected status
  onSave?: (status: Status) => void; // optional callback
  onCancel?: () => void;
};

export default function ManageComplaintCard({
  initial = 'Pending',
  onSave,
  onCancel,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const complaintId = searchParams.get('id');

  const [status, setStatus] = useState<Status>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // If no complaint ID, redirect back
  useEffect(() => {
    if (!complaintId) {
      router.push('/admin/complaints');
    }
  }, [complaintId, router]);

  const handleSave = async () => {
    if (!complaintId) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`http://localhost:5000/admin/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update complaint status');
      }

      const data = await response.json();
      setSuccess(data.message || 'Complaint status updated successfully');

      // Redirect back to complaints page after a short delay
      setTimeout(() => {
        router.push('/admin/complaints');
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/complaints');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden bg-white">
        {/* header */}
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-white text-2xl font-extrabold">Manage Complaint</h2>
        </div>

        {/* body */}
        <div className="p-6 space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Select Status
            </label>
            <select
              className="w-full rounded-lg border border-blue-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-2 bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              disabled={loading}
            >
              <option value="Pending">Pending</option>
              <option value="InProgress">In-Progress</option>
              <option value="Complete">Complete</option>
              <option value="On-hold">On-Hold</option>
              <option value="Reject">Reject</option>
            </select>
          </div>

          {/* actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-md border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="rounded-md bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
