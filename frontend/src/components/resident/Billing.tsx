"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  Download,
  AlertCircle,
} from "lucide-react";

type BillStatus = "Unpaid" | "Paid" | "Overdue";

type Bill = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  amount: number;
  status: BillStatus;
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const isUnpaid = (b: Bill) => b.status !== "Paid";

export default function Billing() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  /** Fetch Bills + Load Razorpay Script */
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch(
          "https://next-sms-ten.vercel.app/resident/bills",
          {
            method: "GET",
            credentials: "include", // very important
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch bills");
        }

        setBills(data.bills);

        // Default select only unpaid bills
        const initialSel = data.bills
          .filter(isUnpaid)
          .reduce((acc: Record<string, boolean>, b: Bill) => {
            acc[b.id] = true;
            return acc;
          }, {} as Record<string, boolean>);

        setSelected(initialSel);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();

    /** Load Razorpay checkout script */
    if (!window.Razorpay) {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  /** ------------------ STATS ------------------ **/
  const stats = useMemo(() => {
    const unpaid = bills.filter(isUnpaid);
    const pendingTotal = unpaid.reduce((s, b) => s + b.amount, 0);

    const paidThisMonth = bills
      .filter((b) => b.status === "Paid")
      .reduce((s, b) => s + b.amount, 0);

    const nextDue = unpaid.length
      ? unpaid.sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0].dueDate
      : null;

    const selectedTotal = bills
      .filter((b) => selected[b.id])
      .reduce((s, b) => s + b.amount, 0);

    const allUnpaidIds = unpaid.map((b) => b.id);
    const allUnpaidSelected =
      allUnpaidIds.length > 0 &&
      allUnpaidIds.every((id) => Boolean(selected[id]));

    return {
      pendingTotal,
      paidThisMonth,
      nextDue,
      selectedTotal,
      allUnpaidSelected,
    };
  }, [bills, selected]);

  const toggleAllUnpaid = () => {
    const target = !stats.allUnpaidSelected;
    const unpaid = bills.filter(isUnpaid);

    setSelected((prev) => {
      const next = { ...prev };
      unpaid.forEach((b) => (next[b.id] = target));
      return next;
    });
  };

  const toggleOne = (id: string) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  /** ------------------ PAYMENT HANDLER ------------------ **/
  const paySelected = async () => {
    if (stats.selectedTotal <= 0) return;

    const billIds = Object.keys(selected).filter((id) => selected[id]);

    try {
      const res = await fetch(
        "https://next-sms-ten.vercel.app/resident/payment/order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // <--- important
          body: JSON.stringify({ billIds }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Society Management",
        description: "Bill Payment",
        order_id: data.orderId,

        handler: async (resp: Record<string, string>) => {
          try {
            const verifyResp = await fetch(
              "https://next-sms-ten.vercel.app/resident/payment/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // <--- Important!
                body: JSON.stringify({
                  ...resp,
                  billIds,
                }),
              }
            );

            const verifyJson = await verifyResp.json();

            if (!verifyResp.ok || !verifyJson.success) {
              alert("Payment verification failed.");
              return;
            }

            setBills((prev) =>
              prev.map((b) =>
                billIds.includes(b.id) ? { ...b, status: "Paid" } : b
              )
            );

            setSelected({});
            alert("Payment successful!");
          } catch {
            alert("Payment successful but verification failed.");
          }
        },

        prefill: {
          name: "Resident",
          email: "resident@example.com",
          contact: "9999999999",
        },

        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed, try again.");
    }
  };

  /** ------------------ UI ------------------ **/

  if (loading) return <p className="text-center mt-20">Loading bills…</p>;
  if (error)
    return (
      <p className="text-center mt-20 text-red-600 font-semibold">{error}</p>
    );

  return (
    <div className="space-y-6 mt-15">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Bills & Payments</h1>
          <p className="text-gray-600 text-sm">
            Manage your society bills and payments
          </p>
        </div>

        <button
          onClick={() => alert("Downloading history…")}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700"
        >
          <Download className="h-4 w-4" />
          Download History
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          title="Pending Bills"
          amount={inr(stats.pendingTotal)}
          Icon={AlertCircle}
          tone="bg-rose-50 text-rose-700 border-rose-200"
        />

        <StatCard
          title="Paid This Month"
          amount={inr(stats.paidThisMonth)}
          Icon={CheckCircle2}
          tone="bg-emerald-50 text-emerald-700 border-emerald-200"
        />

        <StatCard
          title="Next Due"
          amount={stats.nextDue ? formatFriendly(stats.nextDue) : "No dues"}
          Icon={CalendarCheck2}
          tone="bg-indigo-50 text-indigo-700 border-indigo-200"
        />
      </div>

      {/* QUICK PAY */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white shadow">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-lg font-bold">Quick Pay Pending Bills</p>
            <p className="opacity-90 text-sm">
              Pay all your pending bills in one go
            </p>
          </div>

          <button
            disabled={stats.selectedTotal === 0}
            onClick={paySelected}
            className="px-4 py-2 bg-white/10 ring-1 ring-white/30 rounded-lg text-sm font-semibold hover:bg-white/20 disabled:opacity-40"
          >
            <CreditCard className="inline h-4 w-4 mr-2" />
            Pay Selected ({inr(stats.selectedTotal)})
          </button>
        </div>
      </div>

      {/* BILL LIST */}
      <section className="border border-gray-200 rounded-xl shadow bg-white">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">All Bills</h2>
        </div>

        <div className="flex items-center gap-2 px-4 py-3">
          <input
            type="checkbox"
            checked={stats.allUnpaidSelected}
            onChange={toggleAllUnpaid}
            className="h-4 w-4"
          />
          <span>Select all unpaid bills</span>
        </div>

        <ul className="divide-y divide-gray-100">
          {bills.map((b) => (
            <li key={b.id} className="p-4">
              <BillRow
                bill={b}
                checked={Boolean(selected[b.id])}
                disabled={b.status === "Paid"}
                onToggle={() => toggleOne(b.id)}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* MOBILE PAY BAR */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 p-3 shadow md:hidden">
        <div className="flex justify-between max-w-3xl mx-auto">
          <span>
            Total:{" "}
            <span className="font-semibold">{inr(stats.selectedTotal)}</span>
          </span>

          <button
            disabled={stats.selectedTotal === 0}
            onClick={paySelected}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow disabled:opacity-50"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
}

/** Small UI Components */
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
    <div className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="font-bold text-2xl mt-1">{amount}</p>
        </div>

        <span className={`p-3 rounded-lg ${tone}`}>
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-100">
      <div className="flex gap-3 items-start">
        <input
          type="checkbox"
          checked={!disabled && checked}
          disabled={disabled}
          onChange={onToggle}
          className="h-4 w-4 mt-1"
        />

        <div>
          <div className="flex gap-2 items-center">
            <h3 className="font-semibold">{bill.title}</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs ${pill}`}>
              {bill.status}
            </span>
          </div>

          <p className="text-sm text-gray-600">
            {bill.description} — Due {formatFriendly(bill.dueDate)}
          </p>
        </div>
      </div>

      <div className="flex sm:flex-col sm:items-end justify-between gap-3">
        <div className="text-lg font-semibold">{inr(bill.amount)}</div>

        {bill.status !== "Paid" ? (
          <button
            onClick={onToggle}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm ring-1 ring-blue-200 hover:bg-blue-100"
          >
            <CreditCard className="inline h-4 w-4 mr-1" />
            Add to Pay
          </button>
        ) : (
          <span className="text-xs text-gray-500">Paid</span>
        )}
      </div>
    </div>
  );
}

/** Utils */
function formatFriendly(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;

  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
