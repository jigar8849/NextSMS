'use client';

import React, { useState } from 'react';

type Status = 'pending' | 'in-progress' | 'complete' | 'on-hold' | 'reject';

type Props = {
  initial?: Status;                 // default selected status
  onSave?: (status: Status) => void; // optional callback
  onCancel?: () => void;
};

export default function ManageComplaintCard({
  initial = 'pending',
  onSave,
  onCancel,
}: Props) {
  const [status, setStatus] = useState<Status>(initial);

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden bg-white">
        {/* header */}
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-white text-2xl font-extrabold">Manage Complaint</h2>
        </div>

        {/* body */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Select Status
            </label>
            <select
              className="w-full rounded-lg border border-blue-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 px-4 py-2 bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="complete">Complete</option>
              <option value="on-hold">On-Hold</option>
              <option value="reject">Reject</option>
            </select>
          </div>

          {/* actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => (onCancel ? onCancel() : console.log('UI only: cancel'))}
              className="rounded-md border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                onSave ? onSave(status) : console.log('UI only: save', status)
              }
              className="rounded-md bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
