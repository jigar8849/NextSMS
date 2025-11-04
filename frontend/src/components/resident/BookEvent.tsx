"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

/* ------------ types ------------ */
type Venue = {
  id: string;
  name: string;
  capacity: number;
  availableToday: boolean;
};

type EventStatus = "Pending" | "Approved" | "Rejected";
type EventItem = {
  id: string;
  title: string;
  date: string; // ISO date (yyyy-mm-dd)
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  venueId: string;
  attendees: number;
  organizer: string;
  status: EventStatus;
};

/* ------------ demo data ------------ */
const VENUES: Venue[] = [
  { id: "v1", name: "Club House", capacity: 100, availableToday: true },
  { id: "v2", name: "Garden Area", capacity: 200, availableToday: true },
  { id: "v3", name: "Community Hall", capacity: 150, availableToday: true },
  { id: "v4", name: "Terrace Garden", capacity: 80, availableToday: true },
];

/* ------------ helpers ------------ */
const venueById = (id: string) =>
  VENUES.find((v) => v.id === id)?.name ?? "—";
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const statusPill = (s: EventStatus) =>
  s === "Approved"
    ? "bg-emerald-50 text-emerald-700"
    : s === "Rejected"
    ? "bg-rose-50 text-rose-700"
    : "bg-amber-50 text-amber-700";

/* ------------ page ------------ */
export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3001/resident/api/events', {
          credentials: 'include', // Include cookies for session
        });

        const data = await response.json();

        if (data.success) {
          setEvents(data.events);
        } else {
          setError(data.message || 'Failed to fetch events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const removeEvent = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/resident/api/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json().catch(() => ({ success: false, message: 'Failed to delete event' }));

      if (data.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        setSuccessMessage('Event deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000); // Hide after 3 seconds
      } else {
        alert(data.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  };

  // simple availability demo
  const availabilityNote = (v: Venue) =>
    v.availableToday ? (
      <div className="inline-flex items-center gap-2 text-emerald-700">
        <CheckCircle2 className="h-4 w-4" />
        <span>Available Today</span>
      </div>
    ) : (
      <div className="inline-flex items-center gap-2 text-rose-700">
        <Clock className="h-4 w-4" />
        <span>Not Available</span>
      </div>
    );

  return (
    <div className="space-y-6 mt-15">
      {/* success message */}
      {successMessage && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Event Booking
          </h1>
          <p className="text-sm text-gray-600">
            Book venues for your events and celebrations
          </p>
        </div>
        <Link
          href="/resident/forms/bookEvent"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Book Event
        </Link>
      </div>

      {/* venues */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {VENUES.map((v) => (
          <div
            key={v.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{v.name}</h3>
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>

            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <div className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>
                  Capacity:{" "}
                  <span className="font-medium">{v.capacity}</span> people
                </span>
              </div>
              {availabilityNote(v)}
            </div>

            <Link
              href={``}
              className="mt-4 block w-full rounded-lg bg-indigo-50 px-4 py-2 text-center text-sm font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100"
            >
              Check Availability
            </Link>
          </div>
        ))}
      </div>

      {/* upcoming events */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        </div>

        {isLoading ? (
          <div className="p-6 text-sm text-gray-600">
            Loading events...
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">
            No upcoming events.{" "}
            <Link
              href="/resident/forms/bookEvent"
              className="text-blue-700 underline hover:text-blue-800"
            >
              Book your first event
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {events.map((ev) => (
              <li key={ev.id} className="px-4 py-4">
                <EventRow
                  ev={ev}
                  onDelete={() => removeEvent(ev.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/* ------------ small components ------------ */

function EventRow({
  ev,
  onDelete,
}: {
  ev: EventItem;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-xl border border-gray-100 p-4">
      <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-start">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{ev.title}</h3>
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2 md:grid-cols-3">
            <div className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              <span>{fmtDate(ev.date)}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>
                {ev.startTime} – {ev.endTime}
              </span>
            </div>
            <div className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{venueById(ev.venueId)}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{ev.attendees} attendees</span>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-700">
            <span className="font-semibold">Organized by :</span> {ev.organizer}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusPill(
              ev.status
            )}`}
          >
            {ev.status}
          </span>
          <Link
            href={`/resident/forms/editEvent/${ev.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-200 hover:bg-blue-100"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 ring-1 ring-inset ring-rose-200 hover:bg-rose-100"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
