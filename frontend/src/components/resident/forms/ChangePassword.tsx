"use client";

import { useState, FormEvent } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [show, setShow] = useState<{ current: boolean; next: boolean; confirm: boolean }>({
    current: false,
    next: false,
    confirm: false,
  });
  const [submitted, setSubmitted] = useState<"idle" | "ok" | "err">("idle");

  // password rules
  const rules = {
    len: form.next.length >= 8,
    upper: /[A-Z]/.test(form.next),
    lower: /[a-z]/.test(form.next),
    num: /[0-9]/.test(form.next),
    sym: /[^A-Za-z0-9]/.test(form.next),
    notSameAsCurrent: form.current && form.next && form.current !== form.next,
    match: form.next && form.confirm && form.next === form.confirm,
  };
  const allGood =
    rules.len &&
    rules.upper &&
    rules.lower &&
    rules.num &&
    rules.sym &&
    rules.notSameAsCurrent &&
    rules.match &&
    !!form.current;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!allGood) return;
    // TODO: replace with your server action / API call
    try {
      console.log("Change password payload", form);
      setSubmitted("ok");
      setForm({ current: "", next: "", confirm: "" });
    } catch {
      setSubmitted("err");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 mt-15">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900">
          Change Password
        </h1>

        {/* success / error alert */}
        {submitted !== "idle" && (
          <div
            className={`mb-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
              submitted === "ok"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {submitted === "ok" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5" />
            )}
            <p>
              {submitted === "ok"
                ? "Password updated successfully."
                : "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="space-y-5 p-5 sm:p-6">
            {/* Current */}
            <Field
              label="Current Password"
              type={show.current ? "text" : "password"}
              value={form.current}
              onChange={(v) => setForm((f) => ({ ...f, current: v }))}
              rightIcon={
                <IconButton
                  onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                  label={show.current ? "Hide" : "Show"}
                >
                  {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </IconButton>
              }
            />

            {/* New */}
            <Field
              label="New Password"
              type={show.next ? "text" : "password"}
              value={form.next}
              onChange={(v) => setForm((f) => ({ ...f, next: v }))}
              rightIcon={
                <IconButton
                  onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                  label={show.next ? "Hide" : "Show"}
                >
                  {show.next ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </IconButton>
              }
              hint={
                <Requirements
                  items={[
                    ["At least 8 characters", rules.len],
                    ["Uppercase letter", rules.upper],
                    ["Lowercase letter", rules.lower],
                    ["Number", rules.num],
                    ["Symbol", rules.sym],
                    ["Not same as current", rules.notSameAsCurrent],
                  ]}
                />
              }
            />

            {/* Confirm */}
            <Field
              label="Confirm New Password"
              type={show.confirm ? "text" : "password"}
              value={form.confirm}
              onChange={(v) => setForm((f) => ({ ...f, confirm: v }))}
              rightIcon={
                <IconButton
                  onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                  label={show.confirm ? "Hide" : "Show"}
                >
                  {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </IconButton>
              }
              hint={
                form.confirm ? (
                  <p
                    className={`text-xs ${
                      rules.match ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {rules.match ? "Passwords match." : "Passwords do not match."}
                  </p>
                ) : undefined
              }
            />
          </div>

          <div className="border-t border-gray-100 p-5 sm:p-6">
            <button
              type="submit"
              disabled={!allGood}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow ${
                allGood
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-blue-300"
              }`}
            >
              <Lock className="h-4 w-4" />
              Update Password
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

/* ----------------- small UI bits ----------------- */

function Field({
  label,
  value,
  onChange,
  type = "text",
  rightIcon,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  rightIcon?: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-800">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 pr-10 text-sm text-gray-900 outline-none ring-blue-600/20 placeholder:text-gray-400 focus:border-blue-600 focus:ring-4"
        />
        {rightIcon && (
          <span className="absolute inset-y-0 right-2 grid place-items-center">{rightIcon}</span>
        )}
      </div>
      {hint && <div className="mt-1">{hint}</div>}
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="rounded p-1 text-gray-600 hover:bg-gray-100"
    >
      {children}
    </button>
  );
}

function Requirements({
  items,
}: {
  items: [label: string, ok: boolean][];
}) {
  return (
    <ul className="mt-1 grid grid-cols-1 gap-1 text-xs text-gray-600 sm:grid-cols-2">
      {items.map(([label, ok]) => (
        <li key={label} className="inline-flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              ok ? "bg-emerald-500" : "bg-gray-300"
            }`}
          />
          <span className={ok ? "text-emerald-700" : ""}>{label}</span>
        </li>
      ))}
    </ul>
  );
}
