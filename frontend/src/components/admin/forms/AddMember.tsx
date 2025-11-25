'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  apiPath?: string;
};

// Define a type-safe payload
type MemberPayload = {
  first_name: string;
  last_name: string;
  birth_date: string;
  role: string;
  mobile_number: number;
  emergency_number: number;
  number_of_member: number;
  name_of_each_member: string[];
  block: string;
  floor_number: number;
  status: string;
  two_wheeler?: string;
  four_wheeler?: string;
  flat_number: number;
  email: string;
  create_password: string;
};

export default function AddNewMemberForm({ apiPath }: Props) {
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
  const API_PATH = apiPath || '/admin/addNewResident';

  // Form states
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [mobile_number, setMobile] = useState('');
  const [emergency_number, setEmergency] = useState('');
  const [birth_date, setBirthDate] = useState('');
  const [number_of_member, setNumMembers] = useState('');
  const [name_of_each_member, setMembers] = useState<string[]>(['']);
  const [block, setBlock] = useState('');
  const [floor_number, setFloor] = useState('');
  const [flat_number, setFlat] = useState('');
  const [four_wheeler, setFour] = useState('');
  const [two_wheeler, setTwo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const toNumber = (value: string): number | null => {
    const n = Number(value);
    return isFinite(n) ? n : null;
  };

  const validate = (): string | null => {
    if (!first_name || !last_name) return 'Please enter first and last name.';
    if (!mobile_number || !emergency_number) return 'Please enter both mobile numbers.';
    if (!birth_date) return 'Please select birth date.';
    if (toNumber(number_of_member) === null) return 'Enter a valid number of members.';
    if (!block) return 'Block is required.';
    if (toNumber(floor_number) === null) return 'Enter a valid floor number.';
    if (toNumber(flat_number) === null) return 'Enter a valid flat number.';
    if (!email) return 'Email is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';

    const names = name_of_each_member.map(n => n.trim()).filter(Boolean);
    if (names.length === 0) return 'Add at least one member name.';

    return null;
  };

  const setMemberAt = (i: number, value: string) => {
    setMembers(prev => prev.map((m, idx) => (idx === i ? value : m)));
  };

  const addMemberField = () => setMembers(prev => [...prev, '']);

  const removeMemberField = (i: number) => {
    setMembers(prev => (prev.length === 1 ? [''] : prev.filter((_, idx) => idx !== i)));
  };

  const createPayload = (): MemberPayload | null => {
    const nums = {
      mobile: toNumber(mobile_number),
      emergency: toNumber(emergency_number),
      members: toNumber(number_of_member),
      floor: toNumber(floor_number),
      flat: toNumber(flat_number),
    };

    if (
      nums.mobile === null ||
      nums.emergency === null ||
      nums.members === null ||
      nums.floor === null ||
      nums.flat === null
    ) {
      setLocalError('Please enter valid numeric values.');
      return null;
    }

    return {
      first_name,
      last_name,
      birth_date,
      role: 'resident',
      mobile_number: nums.mobile,
      emergency_number: nums.emergency,
      number_of_member: nums.members,
      name_of_each_member: name_of_each_member.map(n => n.trim()).filter(Boolean),
      block,
      floor_number: nums.floor,
      status: 'active',
      two_wheeler: two_wheeler || undefined,
      four_wheeler: four_wheeler || undefined,
      flat_number: nums.flat,
      email,
      create_password: password,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const error = validate();
    if (error) {
      setLocalError(error);
      setLocalSuccess(null);
      return;
    }

    const payload = createPayload();
    if (!payload) return;

    setLoading(true);
    setLocalError(null);
    setLocalSuccess(null);

    try {
      const res = await fetch(`${API_BASE}${API_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const body: { message?: string; error?: string } = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLocalError(body.error || `Request failed (${res.status})`);
        return;
      }

      setLocalSuccess(body.message || 'Member created successfully');
      resetForm();
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Network error';
      setLocalError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setMobile('');
    setEmergency('');
    setBirthDate('');
    setNumMembers('');
    setMembers(['']);
    setBlock('');
    setFloor('');
    setFlat('');
    setFour('');
    setTwo('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-3 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-5">Add New Member</h1>

        {localError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {localError}
          </div>
        )}
        {localSuccess && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
            {localSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Owner name */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner First Name</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={first_name}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner Last Name</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={last_name}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                inputMode="numeric"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={mobile_number}
                onChange={e => setMobile(e.target.value)}
                placeholder="10-digit mobile"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Members</label>
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={number_of_member}
                onChange={e => setNumMembers(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Birth Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={birth_date}
                onChange={e => setBirthDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Mobile Number</label>
              <input
                inputMode="numeric"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={emergency_number}
                onChange={e => setEmergency(e.target.value)}
                placeholder="Emergency mobile"
                required
              />
            </div>

            {/* Member names (dynamic) */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Name of Each Member</label>
              <div className="mt-1 space-y-2">
                {name_of_each_member.map((val, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Member Name"
                      value={val}
                      onChange={(e) => setMemberAt(i, e.target.value)}
                      required={i === 0}
                    />
                    <button
                      type="button"
                      onClick={() => removeMemberField(i)}
                      className="rounded-md border border-gray-300 p-2 hover:bg-gray-100"
                      aria-label="Remove member name"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMemberField}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-3 py-2 text-sm font-medium hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" /> Add Member Name
                </button>
              </div>
            </div>
          </section>

          {/* Address / flat */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700">Block</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={block}
                onChange={e => setBlock(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Floor Number</label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={floor_number}
                onChange={e => setFloor(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Flat Number</label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={flat_number}
                onChange={e => setFlat(e.target.value)}
                required
              />
            </div>
          </section>

          {/* Vehicles */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700">Four wheeler</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="GJ-11-XX-1234"
                value={four_wheeler}
                onChange={e => setFour(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Two wheeler</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="GJ-01-XX-1234"
                value={two_wheeler}
                onChange={e => setTwo(e.target.value)}
              />
            </div>
          </section>

          {/* Auth */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Create Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </section>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-white font-semibold shadow hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? 'Submitting…' : 'Submit Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
