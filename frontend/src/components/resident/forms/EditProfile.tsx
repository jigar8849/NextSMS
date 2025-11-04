"use client";

import { useState, FormEvent } from "react";

export default function AddMemberPage() {
  const [form, setForm] = useState({
    firstName: "Jigar",
    lastName: "Prajapati",
    mobile: "8849602896",
    members: "2",
    emergencyMobile: "7383390261",
    birthDate: "",
    fourWheeler: "GJ-01-KY-43533",
    twoWheeler: "GJ-01-XW-5434",
    email: "jigar@gmail.com",
  });

  const handleChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting member:", form);
    alert("Member submitted (demo). Hook this to your backend!");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 mt-15">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900">
        Add New Member
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
      >
        {/* 2-column on md+, single column on mobile */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* First Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={handleChange("firstName")}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={handleChange("lastName")}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="tel"
              value={form.mobile}
              onChange={handleChange("mobile")}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Number of Members */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Number of Members
            </label>
            <input
              type="number"
              min={1}
              value={form.members}
              onChange={handleChange("members")}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Emergency Mobile */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Emergency Mobile Number
            </label>
            <input
              type="tel"
              value={form.emergencyMobile}
              onChange={handleChange("emergencyMobile")}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Birth Date
            </label>
            <input
              type="date"
              value={form.birthDate}
              onChange={handleChange("birthDate")}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Four Wheeler */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Four Wheeler
            </label>
            <input
              type="text"
              value={form.fourWheeler}
              onChange={handleChange("fourWheeler")}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Two Wheeler */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Two Wheeler
            </label>
            <input
              type="text"
              value={form.twoWheeler}
              onChange={handleChange("twoWheeler")}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Email (full width on md as well? keep left column) */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6">
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-base font-semibold text-white shadow hover:bg-emerald-700"
          >
            Submit Form
          </button>
        </div>
      </form>
    </main>
  );
}
