import { notFound } from 'next/navigation';

interface EditResidentPageProps {
  params: {
    id: string;
  };
}

export default function EditResidentPage({ params }: EditResidentPageProps) {
  // For now, redirect to the backend edit form
  // In a full implementation, this would be a Next.js page that fetches data and provides editing functionality

  return (
    <div className="p-4 mt-15 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Resident</h1>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Edit functionality not yet implemented in Next.js
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  The edit functionality is currently handled by the backend Express server.
                  To edit this resident, please use the backend admin panel directly.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Resident ID: <span className="font-mono text-sm">{params.id}</span>
          </p>

          <div className="flex gap-4">
            <a
              href={`/admin/residents`}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Back to Residents
            </a>
            <a
              href={`http://localhost:3001/admin/residents/${params.id}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Open Backend Edit Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
