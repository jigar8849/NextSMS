"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  Download,
  AlertCircle, // ← replaced ExclamationTriangle
} from "lucide-react";

type BillStatus = "Unpaid" | "Paid" | "Overdue";
type Bill = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date
  amount: number;  // INR
  status: BillStatus;
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const isUnpaid = (b: Bill) => b.status !== "Paid";

export default function Billing() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('/api/resident/bills');
        if (!response.ok) {
          throw new Error('Failed to fetch bills');
        }
        const data = await response.json();
        if (data.success) {
          setBills(data.bills);
          // Initialize selected with unpaid bills
          const unpaidSelected = data.bills.filter(isUnpaid).reduce((acc: Record<string, boolean>, b: Bill) => ({ ...acc, [b.id]: true }), {});
          setSelected(unpaidSelected);
        } else {
          throw new Error(data.error || 'Failed to fetch bills');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();

    // Load Razorpay script
    if (!(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const stats = useMemo(() => {
    const pending = bills.filter(isUnpaid);
    const pendingTotal = pending.reduce((s, b) => s + b.amount, 0);
    const paidThisMonth = bills.filter(b => b.status === "Paid").reduce((s, b) => s + b.amount, 0);
    const nextDue = pending.length ? pending.slice().sort((a,b)=>a.dueDate.localeCompare(b.dueDate))[0].dueDate : null;

    const selectedTotal = bills.filter(b => selected[b.id]).reduce((s, b) => s + b.amount, 0);
    const allUnpaidIds = bills.filter(isUnpaid).map(b => b.id);
    const allUnpaidSelected = allUnpaidIds.length > 0 && allUnpaidIds.every(id => !!selected[id]);

    return { pendingTotal, paidThisMonth, nextDue, selectedTotal, allUnpaidSelected };
  }, [bills, selected]);

  const toggleAllUnpaid = () => {
    const unpaid = bills.filter(isUnpaid);
    const target = !stats.allUnpaidSelected;
    setSelected(prev => {
      const next = { ...prev };
      unpaid.forEach(b => (next[b.id] = target));
      return next;
    });
  };

  const toggleOne = (id: string) => setSelected(s => ({ ...s, [id]: !s[id] }));

  const paySelected = async () => {
    if (stats.selectedTotal === 0) return;

    const selectedBillIds = Object.keys(selected).filter(id => selected[id]);

    try {
      const response = await fetch('/api/resident/payment/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billIds: selectedBillIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      // Open Razorpay checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Society Management',
        description: 'Bill Payment',
        order_id: data.orderId,
        handler: function (response: any) {
          // Payment successful
          setBills(prev => prev.map(b => (selected[b.id] ? { ...b, status: "Paid" } : b)));
          setSelected({});
          alert("Payment successful ✅");
        },
        prefill: {
          name: 'Resident',
          email: 'resident@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new (window as any).Razorpay(options) as any;
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert("Payment failed. Please try again.");
    }
  };

  if (loading) {
    return <div className="mt-15 text-center">Loading bills...</div>;
  }

  if (error) {
    return <div className="mt-15 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 mt-15">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Bills &amp; Payments</h1>
          <p className="text-sm text-gray-600">Manage your society bills and payment history</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
          onClick={() => alert("Downloading history (demo)…")}
        >
          <Download className="h-4 w-4" />
          Download History
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Pending Bills"
          amount={inr(stats.pendingTotal)}
          Icon={AlertCircle} // ← updated
          tone="border-rose-200 bg-rose-50 text-rose-700"
        />
        <StatCard
          title="Paid This Month"
          amount={inr(bills.filter(b => b.status === "Paid").reduce((s, b) => s + b.amount, 0))}
          Icon={CheckCircle2}
          tone="border-emerald-200 bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Next Due Date"
          amount={stats.nextDue ? formatFriendly(stats.nextDue) : "No dues"}
          Icon={CalendarCheck2}
          tone="border-indigo-200 bg-indigo-50 text-indigo-700"
        />
      </div>

      {/* Quick pay */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold">Quick Pay Pending Bills</p>
            <p className="text-sm/6 opacity-90">Pay all your pending bills in one go</p>
          </div>
          <button
            onClick={paySelected}
            disabled={stats.selectedTotal === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-white/30 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CreditCard className="h-4 w-4" />
            Pay Selected ({inr(stats.selectedTotal)})
          </button>
        </div>
      </div>

      {/* List */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-xl font-semibold">All Bills</h2>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 text-sm">
          <input
            id="sel-all"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            checked={stats.allUnpaidSelected}
            onChange={toggleAllUnpaid}
          />
          <label htmlFor="sel-all" className="select-none text-gray-700">
            Select all unpaid bills
          </label>
        </div>

        <ul className="divide-y divide-gray-100">
          {bills.map(b => (
            <li key={b.id} className="p-4">
              <BillRow
                bill={b}
                checked={!!selected[b.id]}
                onToggle={() => toggleOne(b.id)}
                disabled={b.status === "Paid"}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white/90 p-3 shadow backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="text-sm text-gray-700">
            Selected Total: <span className="font-semibold">{inr(stats.selectedTotal)}</span>
          </span>
          <button
            onClick={paySelected}
            disabled={stats.selectedTotal === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CreditCard className="h-4 w-4" />
            Pay
          </button>
        </div>
      </div>
      <div className="h-14 md:hidden" />
    </div>
  );
}

/* ---------- small components ---------- */

function StatCard({
  title,
  amount,
  Icon,
  tone,
}: {
  title: string;
  amount: string | number;
  Icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{amount}</p>
        </div>
        <span className={`rounded-lg p-3 ${tone}`}>
          <Icon className="h-6 w-6" />
        </span>
      </div>
    </div>
  );
}

function BillRow({
  bill,
  checked,
  onToggle,
  disabled,
}: {
  bill: Bill;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const pill =
    bill.status === "Paid"
      ? "bg-emerald-50 text-emerald-700"
      : bill.status === "Overdue"
      ? "bg-rose-50 text-rose-700"
      : "bg-amber-50 text-amber-700";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          disabled={disabled}
          checked={checked && !disabled}
          onChange={onToggle}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 disabled:opacity-40"
          aria-label={`Select ${bill.title}`}
        />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{bill.title}</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${pill}`}>
              {bill.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {bill.description} • Due {formatFriendly(bill.dueDate)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <div className="text-lg font-semibold text-gray-900">{inr(bill.amount)}</div>
        {bill.status !== "Paid" ? (
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-200 hover:bg-blue-100"
          >
            <CreditCard className="h-4 w-4" />
            Add to Pay
          </button>
        ) : (
          <span className="text-xs text-gray-500">Paid</span>
        )}
      </div>
    </div>
  );
}

/* ---------- utils ---------- */

function formatFriendly(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
