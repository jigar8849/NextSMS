"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Home, Mail, Phone, UsersIcon, Car, Pencil, Plus, Key } from "lucide-react";

type Profile = {
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

type Vehicle = { id: string; regNo: string; type: "2-wheeler" | "4-wheeler" };

type ProfileData = {
  profile: Profile;
  family: string[];
  vehicles: Vehicle[];
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('https://nextsms.onrender.com/resident/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <div className="p-6 mt-15 text-center">Loading profile data...</div>;
  if (error) return <div className="p-6 mt-15 text-center text-red-500">Error: {error}</div>;
  if (!profileData) return <div className="p-6 mt-15 text-center">No profile data available</div>;

  const { profile, family, vehicles } = profileData;

  const dateIN = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const vehicleBadge = (t: Vehicle["type"]) =>
    t === "2-wheeler" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700";

  return (
    <div className="space-y-6 mt-15">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
          <p className="text-sm text-gray-600">Manage your personal information and family details</p>
        </div>
        <Link href="/resident/forms/editProfile" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700">
          <Pencil className="h-4 w-4" /> Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Profile Card */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-blue-600 text-white shadow-sm">
              <User className="h-12 w-12" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-gray-900">{profile.firstName} {profile.lastName}</h2>
            <a href="#" className="text-blue-700 underline-offset-4 hover:underline" title={profile.flat}>{profile.flat}</a>
            <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
              <Home className="h-4 w-4" /> {profile.role}
            </span>
          </div>

          <ul className="mt-6 space-y-3">
            <li className="grid grid-cols-[20px_1fr] items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <span className="truncate text-sm text-gray-800">{profile.email}</span>
            </li>
            <li className="grid grid-cols-[20px_1fr] items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <a href={`tel:${profile.phone}`} className="text-sm font-medium text-gray-900 hover:underline">{profile.phone}</a>
            </li>
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            <MetaChip><UsersIcon className="h-4 w-4" />{family.length} {family.length === 1 ? "family member" : "family members"}</MetaChip>
            <MetaChip><Car className="h-4 w-4" />{vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"}</MetaChip>
            <MetaChip><span className="inline-block h-3 w-3 rounded-sm bg-gray-400" />Resident since {new Date(profile.since).toLocaleString("en-IN", { month: "short", year: "numeric" })}</MetaChip>
          </div>

          <Link href="/resident/forms/changePassword" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
            <Key className="h-4 w-4" /> Change Password
          </Link>
        </section>

        {/* Personal Information */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 px-6 py-6 sm:grid-cols-2">
            <Field label="First Name" value={profile.firstName} />
            <Field label="Last Name" value={profile.lastName} />
            <Field label="Email Address" value={profile.email} />
            <Field label="Phone Number" value={profile.phone} />
            <Field label="Date of Birth" value={dateIN(profile.dob)} />
            <Field label="Emergency Contact" value={profile.emergency} />
            <Field label="Family Members" value={String(family.length)} />
            <Field label="Block" value={profile.block} />
            <Field label="Floor Number" value={String(profile.floorNumber)} />
            <Field label="Flat Number" value={String(profile.flatNumber)} />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Family Members */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h3 className="text-xl font-semibold">Family Members</h3>
            <Link href="/resident/forms/addFamilyMember" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Add Member
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {family.map((name, i) => (
              <li key={`${name}-${i}`} className="px-6 py-3 text-sm">{name}</li>
            ))}
            {family.length === 0 && <li className="px-6 py-4 text-sm text-gray-600">No family members yet.</li>}
          </ul>
        </section>

        {/* Registered Vehicles */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h3 className="text-xl font-semibold">Registered Vehicles</h3>
            <Link href="/resident/forms/addVehicle" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Add Vehicle
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {vehicles.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-3 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{v.regNo}</p>
                    <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${vehicleBadge(v.type)}`}>
                      {v.type}
                    </span>
                  </div>
                </div>
                <Link href={`/resident/forms/editVehicle?id=${v.id}`} className="rounded p-1 text-blue-700 hover:bg-blue-50" aria-label="Edit vehicle">
                  <Pencil className="h-4 w-4" />
                </Link>
              </li>
            ))}
            {vehicles.length === 0 && <li className="px-6 py-4 text-sm text-gray-600">No vehicles added.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
      {children}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="mt-1 text-sm text-gray-700">{value || "—"}</p>
    </div>
  );
}