"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Home,
  Mail,
  Phone,
  Users as UsersIcon,
  Car,
  Pencil,
  Plus,
  Key,
} from "lucide-react";

/* ---------------- types ---------------- */
type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emergency: string;
  dob: string; // ISO
  flat: string; // "Home D-11"
  role: "Owner" | "Tenant";
  since: string; // ISO
};
type Vehicle = { id: string; regNo: string; type: "2-wheeler" | "4-wheeler" };

/* ---------------- demo data ---------------- */
const INITIAL_PROFILE: Profile = {
  firstName: "Jigar",
  lastName: "Prajapati",
  email: "jigar@gmail.com",
  phone: "8849602896",
  emergency: "0-0-0-0-0-",
  dob: "2025-06-30",
  flat: "Home D-11",
  role: "Owner",
  since: "2023-01-01",
};
const INITIAL_FAMILY = ["Nilesh Prajapati", "jigar"];
const INITIAL_VEHICLES: Vehicle[] = [
  { id: "v1", regNo: "GJ-01-KY-43533", type: "4-wheeler" },
  { id: "v2", regNo: "GJ-01-YW-5434", type: "2-wheeler" },
];

/* ---------------- utils ---------------- */
const fullName = (p: Profile) => `${p.firstName} ${p.lastName}`;
const dateIN = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
const vehicleBadge = (t: Vehicle["type"]) =>
  t === "2-wheeler" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700";

/* ---------------- page ---------------- */
export default function ProfilePage() {
  const [profile] = useState<Profile>(INITIAL_PROFILE);
  const [family, setFamily] = useState<string[]>(INITIAL_FAMILY);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  // removed: showEdit + EditProfileModal
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const onAddMember = (name: string) => {
    if (name.trim()) setFamily((f) => [...f, name.trim()]);
    setShowAddMember(false);
  };
  const onSaveVehicle = (next: Vehicle) => {
    setVehicles((vs) => vs.map((v) => (v.id === next.id ? next : v)));
    setEditingVehicle(null);
  };

  return (
    <div className="space-y-6 mt-15">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
          <p className="text-sm text-gray-600">
            Manage your personal information and family details
          </p>
        </div>

        {/* Edit Profile → Link */}
        <Link
          href="/resident/forms/editProfile"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Link>
      </div>

      {/* top grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* LEFT: Identity card */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* avatar + name */}
          <div className="flex flex-col items-center text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-blue-600 text-white shadow-sm">
              <User className="h-12 w-12" />
            </div>

            <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
              {fullName(profile)}
            </h2>

            <a
              href="#"
              className="text-blue-700 underline-offset-4 hover:underline"
              title={profile.flat}
            >
              {profile.flat}
            </a>

            <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
              <Home className="h-4 w-4" />
              {profile.role}
            </span>
          </div>

          {/* contact rows */}
          <ul className="mt-6 space-y-3">
            <li className="grid grid-cols-[20px_1fr] items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <span className="truncate text-sm text-gray-800" title={profile.email}>
                {profile.email}
              </span>
            </li>
            <li className="grid grid-cols-[20px_1fr] items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <a
                href={`tel:${profile.phone}`}
                className="text-sm font-medium text-gray-900 hover:underline"
              >
                {profile.phone}
              </a>
            </li>
          </ul>

          {/* meta chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            <MetaChip>
              <UsersIcon className="h-4 w-4" />
              {family.length} {family.length === 1 ? "family member" : "family members"}
            </MetaChip>
            <MetaChip>
              <Car className="h-4 w-4" />
              {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"}
            </MetaChip>
            <MetaChip>
              <span className="inline-block h-3 w-3 rounded-sm bg-gray-400" />
              Resident since{" "}
              {new Date(profile.since).toLocaleString("en-IN", {
                month: "short",
                year: "numeric",
              })}
            </MetaChip>
          </div>

          {/* Change Password → Link */}
          <Link
            href="/resident/forms/changePassword"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            <Key className="h-4 w-4" />
            Change Password
          </Link>
        </section>

        {/* RIGHT: personal information */}
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
          </div>
        </section>
      </div>

      {/* bottom grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Family */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h3 className="text-xl font-semibold">Family Members</h3>
            <button
              onClick={() => setShowAddMember(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {family.map((name, i) => (
              <li key={`${name}-${i}`} className="px-6 py-3 text-sm">
                {name}
              </li>
            ))}
            {family.length === 0 && (
              <li className="px-6 py-4 text-sm text-gray-600">No family members yet.</li>
            )}
          </ul>
        </section>

        {/* Vehicles */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="text-xl font-semibold">Registered Vehicles</h3>
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
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${vehicleBadge(
                        v.type
                      )}`}
                    >
                      {v.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setEditingVehicle(v)}
                  className="rounded p-1 text-blue-700 hover:bg-blue-50"
                  aria-label="Edit vehicle"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </li>
            ))}
            {vehicles.length === 0 && (
              <li className="px-6 py-4 text-sm text-gray-600">No vehicles added.</li>
            )}
          </ul>
        </section>
      </div>

      {/* Modals (kept) */}
      {showAddMember && (
        <AddMemberModal onClose={() => setShowAddMember(false)} onSave={onAddMember} />
      )}

      {editingVehicle && (
        <EditVehicleModal
          initial={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSave={onSaveVehicle}
        />
      )}
    </div>
  );
}

/* ---------------- tiny bits ---------------- */

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

/* ---- Add Member Modal ---- */
function AddMemberModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="border-b border-gray-100 px-5 py-3">
          <h3 className="text-lg font-semibold">Add Family Member</h3>
        </div>
        <div className="px-5 py-4">
          <Text label="Full Name" value={name} onChange={setName} />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-3">
          <button
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() => onSave(name)}
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Edit Vehicle Modal ---- */
function EditVehicleModal({
  initial,
  onClose,
  onSave,
}: {
  initial: Vehicle;
  onClose: () => void;
  onSave: (v: Vehicle) => void;
}) {
  const [form, setForm] = useState<Vehicle>(initial);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="border-b border-gray-100 px-5 py-3">
          <h3 className="text-lg font-semibold">Edit Vehicle</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 px-5 py-4">
          <Text
            label="Registration No."
            value={form.regNo}
            onChange={(v) => setForm({ ...form, regNo: v })}
          />
          <Select
            label="Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v as Vehicle["type"] })}
            options={["2-wheeler", "4-wheeler"]}
          />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-3">
          <button
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- tiny inputs ---- */
function Text({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
