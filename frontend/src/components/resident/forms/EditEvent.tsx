"use client";

import { useState, FormEvent, useEffect } from "react";
import { useParams } from "next/navigation";
import { CalendarDays } from "lucide-react";

const VENUES = [
  { id: "v1", name: "Club House" },
  { id: "v2", name: "Garden Area" },
  { id: "v3", name: "Community Hall" },
  { id: "v4", name: "Terrace Garden" },
];

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [form, setForm] = useState({
    title: "",
    venueId: "",
    attendees: 50,
    date: "",
    startTime: "",
    endTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`https://nextsms.onrender.com/resident/events/${eventId}`, {
          credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
          const event = data.event;
          setForm({
            title: event.title,
            venueId: event.venueId,
            attendees: event.attendees,
            date: event.date,
            startTime: event.startTime,
            endTime: event.endTime,
          });
        } else {
          setMessage({ type: 'error', text: data.message || 'Failed to fetch event' });
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setMessage({ type: 'error', text: 'Failed to load event. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`https://next-sms-ten.vercel.app/resident/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setMessage({ type: 'error', text: 'Failed to update event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 mt-15">
        <div className="mx-auto max-w-2xl text-center">
          <p>Loading event...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 mt-15">
      <div className="mx-auto max-w-2xl text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Edit Event
        </h1>
        <p className="mt-2 text-gray-600">
          Update your event details and venue booking
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white shadow-lg"
      >
        {/* header */}
        <div className="rounded-t-xl bg-blue-600 px-6 py-3">
          <h2 className="text-lg font-semibold text-white">Edit Event Form</h2>
        </div>

        {/* body */}
        <div className="space-y-5 px-6 py-6">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Birthday Party, Wedding..."
              className="mt-1 block w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Venue
            </label>
            <select
              required
              value={form.venueId}
              onChange={(e) => setForm((f) => ({ ...f, venueId: e.target.value }))}
              className="mt-1 block w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="">-- Select Venue --</option>
              {VENUES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expected Attendees
            </label>
            <input
              type="number"
              min={1}
              value={form.attendees}
              onChange={(e) =>
                setForm((f) => ({ ...f, attendees: Number(e.target.value) }))
              }
              placeholder="50"
              className="mt-1 block w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Date
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              placeholder="Select event date"
              className="mt-1 block w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                required
                value={form.startTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startTime: e.target.value }))
                }
                placeholder="Start time"
                className="mt-1 block w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                required
                value={form.endTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endTime: e.target.value }))
                }
                placeholder="End time"
                className="mt-1 block w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-gray-100 px-6 py-4">
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CalendarDays className="h-4 w-4" />
            {isSubmitting ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </main>
  );
}
