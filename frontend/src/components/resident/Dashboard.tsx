// app/(resident)/resident/page.tsx
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Car,
  CreditCard,
  FileText,
  Home,
  Megaphone,
  Shield,
  Wallet,
  QrCode,
  ThumbsUp,
} from "lucide-react";

// ----- Types (replace with your real ones later)
type Bill = { id: string; title: string; due: string; amount: number; status: "Pending" | "Paid" };
type Event = { id: string; title: string; date: string; place: string };
type Notification = { id: string; text: string; timeAgo: string };

// ----- Demo data (frontend only)
const stats = [
  { label: "Pending Bills", value: 2, Icon: CreditCard, tone: "bg-rose-100" },
  { label: "Open Complaints", value: 1, Icon: Megaphone, tone: "bg-amber-100" },
  { label: "Upcoming Events", value: 3, Icon: CalendarDays, tone: "bg-indigo-100" },
  { label: "Your Vehicles", value: 2, Icon: Car, tone: "bg-emerald-100" },
];

// ----- Small UI bits
function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  Icon,
  action,
}: {
  title: string;
  Icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}) {
  const Ico = Icon;
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        {Ico && <Ico className="h-5 w-5" />} {title}
      </h2>
      {action}
    </div>
  );
}

export default function ResidentDashboard() {
  const residentName = "Jigar Prajapati";

  return (
    <div className="space-y-6 mt-15">
      {/* HERO */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="px-5 py-6 sm:px-8">
          <p className="text-sm/6 opacity-90">Welcome,</p>
          <h1 className="text-2xl font-extrabold sm:text-3xl">
            {residentName.includes(" ") ? (
              <>
                {residentName.split(" ")[0]},{" "}
                <span className="underline decoration-white/60 underline-offset-4">
                  {residentName.split(" ").slice(1).join(" ")}
                </span>
              </>
            ) : (
              residentName
            )}
          </h1>
          <p className="mt-1 max-w-3xl text-sm opacity-90">
            Manage your society life with ease — bills, complaints, events and more
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/resident/billing"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium ring-1 ring-inset ring-white/30 hover:bg-white/15"
            >
              <Wallet className="h-4 w-4" /> Pay a bill
            </Link>
            <Link
              href="/resident/complaints"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium ring-1 ring-inset ring-white/30 hover:bg-white/15"
            >
              <Megaphone className="h-4 w-4" /> File complaint
            </Link>
          </div>
        </div>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, tone }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${tone}`}>
                <Icon className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ===== NEW MAIN GRID (replaces bills/notifications/events) ===== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Resident ID Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-white">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="h-5 w-5" />
              Resident ID
            </h3>
          </div>
          <div className="flex flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:items-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-white/40">
              <Home className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-gray-900">{residentName}</p>
              <p className="text-sm text-gray-600">Flat: Home D-11 • Tower: Home</p>
              <p className="text-xs text-gray-500">Member since Jan 2023</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-gray-200 p-3">
                <QrCode className="h-10 w-10 text-gray-700" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 px-6 py-3">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/resident/profile"
                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100"
              >
                View Profile
              </Link>
              <Link
                href="/resident/vehicles"
                className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-200 hover:bg-blue-100"
              >
                Show Vehicle Pass
              </Link>
            </div>
          </div>
        </Card>

        {/* Progress / Gamification */}
        <Card>
          <SectionHeader title="Your Progress" Icon={ThumbsUp} />
          <div className="space-y-5 p-5">
            <Progress label="Profile Completion" value={85} />
            <Progress label="On-time Payments" value={92} tone="emerald" />
            <Progress label="Community Participation" value={60} tone="indigo" />
            <div className="mt-2 text-xs text-gray-500">
              Tip: Earn badges by attending events and paying bills before the due date.
            </div>
          </div>
        </Card>

        {/* Community Poll / CTA */}
        <Card>
          <SectionHeader title="Community Poll" Icon={Megaphone} />
          <div className="space-y-4 p-5">
            <p className="font-medium text-gray-900">
              Which amenity should we improve next?
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Gym equipment upgrade</li>
              <li>• Children’s play area flooring</li>
              <li>• CCTV in parking</li>
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                href="/resident/polls"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <ThumbsUp className="h-4 w-4" />
                Vote Now
              </Link>
              <Link
                href="/resident/events"
                className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-200 hover:bg-gray-100"
              >
                See Community Plan
              </Link>
            </div>
          </div>
        </Card>
      </div>
      {/* ===== END NEW SECTION ===== */}

      {/* QUICK ACTIONS */}
      <Card>
        <div className="px-4 py-3">
          <h3 className="text-lg font-semibold">Quick-Action</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/resident/billing"
            className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 font-medium text-blue-700 ring-1 ring-inset ring-blue-200 hover:bg-blue-100"
          >
            <CreditCard className="h-5 w-5" /> Pay Bills
          </Link>
          <Link
            href="/resident/complaints"
            className="flex items-center gap-3 rounded-lg bg-rose-50 px-4 py-3 font-medium text-rose-700 ring-1 ring-inset ring-rose-200 hover:bg-rose-100"
          >
            <Megaphone className="h-5 w-5" /> File Complaint
          </Link>
          <Link
            href="/resident/events"
            className="flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-3 font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100"
          >
            <CalendarDays className="h-5 w-5" /> Book Event
          </Link>
          <Link
            href="/resident/vehicles"
            className="flex items-center gap-3 rounded-lg bg-indigo-50 px-4 py-3 font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100"
          >
            <Car className="h-5 w-5" /> Vehicle Search
          </Link>
        </div>
      </Card>

      {/* Helpful footer links */}
      <div className="flex flex-wrap justify-between gap-3 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Home className="h-4 w-4" /> <span>Society Resident Portal</span>
        </span>
        <div className="flex gap-4">
          <Link href="/resident/profile" className="hover:text-gray-700">
            Profile
          </Link>
          <Link href="/resident" className="hover:text-gray-700">
            Dashboard
          </Link>
          <Link href="/" className="hover:text-gray-700">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- tiny components ---------- */
function Progress({
  label,
  value,
  tone = "blue",
}: {
  label: string;
  value: number;
  tone?: "blue" | "emerald" | "indigo";
}) {
  const color =
    tone === "emerald"
      ? "bg-emerald-600"
      : tone === "indigo"
      ? "bg-indigo-600"
      : "bg-blue-600";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-800">{label}</span>
        <span className="text-gray-600">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full ${color} rounded-full transition-[width] duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
