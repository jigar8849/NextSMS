"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

type ProfileData = {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    emergency: string;
    dob: string;
    flat: string;
    role: string;
    since: string;
    block: string;
    floorNumber: number;
    flatNumber: number;
  };
  family: string[];
  vehicles: { id: string; regNo: string; type: "2-wheeler" | "4-wheeler" }[];
};

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    emergency: "",
    dob: "",
    email: "",
    familyMembers: [] as string[]
  });

  // Fetch current profile data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('https://nextsms.onrender.com/resident/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data: ProfileData = await response.json();
        
        console.log('Fetched profile data:', data); // Debug log
        
        // Set form with current data from database
        setForm({
          firstName: data.profile.firstName || "",
          lastName: data.profile.lastName || "",
          phone: data.profile.phone || "",
          emergency: data.profile.emergency || "",
          dob: data.profile.dob || "",
          email: data.profile.email || "",
          familyMembers: data.family || []
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const handleFamilyMemberChange = (index: number, value: string) => {
    const updatedFamily = [...form.familyMembers];
    updatedFamily[index] = value;
    setForm(f => ({ ...f, familyMembers: updatedFamily }));
  };

  const addFamilyMember = () => {
    setForm(f => ({ 
      ...f, 
      familyMembers: [...f.familyMembers, ""] 
    }));
  };

  const removeFamilyMember = (index: number) => {
    setForm(f => ({
      ...f,
      familyMembers: f.familyMembers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() || !form.emergency.trim() || !form.dob) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch('https://nextsms.onrender.com/resident/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          emergency: form.emergency.trim(),
          dob: form.dob,
          familyMembers: form.familyMembers.filter(name => name.trim() !== "")
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const result = await response.json();
      console.log('Profile updated successfully:', result);
      
      // Redirect back to profile page
      router.push('/resident/profile');
      router.refresh();
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 mt-15">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile data...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 mt-15">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Edit Profile
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Update your personal information and family details. All fields marked with * are required.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
      >
        {/* Personal Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* First Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={handleChange("firstName")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={handleChange("lastName")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                placeholder="Enter your last name"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={form.email}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Email address cannot be modified for security reasons</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={handleChange("phone")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Emergency Contact *
              </label>
              <input
                type="tel"
                required
                value={form.emergency}
                onChange={handleChange("emergency")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                placeholder="Enter emergency contact number"
              />
            </div>

            {/* Birth Date */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={form.dob}
                onChange={handleChange("dob")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>
        </div>

        {/* Family Members Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Family Members
            </h2>
            <button
              type="button"
              onClick={addFamilyMember}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Member
            </button>
          </div>

          <div className="space-y-3">
            {form.familyMembers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No family members added yet. Click "Add Member" to add family members.
              </div>
            ) : (
              form.familyMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => handleFamilyMemberChange(index, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    placeholder={`Family member ${index + 1} name`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    className="rounded-lg p-2.5 text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove family member"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-base font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}