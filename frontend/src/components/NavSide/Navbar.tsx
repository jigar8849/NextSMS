"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [nameInitial, setNameInitial] = useState("A");

  useEffect(() => {
    async function fetchUserRole() {
      try {
        // Check Admin
        const adminRes = await fetch(
          "https://nextsms.onrender.com/admin/profile",
          { credentials: "include" }
        );

        if (adminRes.ok) {
          const data = await adminRes.json();
          setRole("Administrator");
          setNameInitial(data?.firstName?.[0]?.toUpperCase() || "A");
          return;
        }

        // Check Resident
        const residentRes = await fetch(
          "https://nextsms.onrender.com/resident/profile",
          { credentials: "include" }
        );

        if (residentRes.ok) {
          const data = await residentRes.json();
          setRole("Resident");
          setNameInitial(data?.firstName?.[0]?.toUpperCase() || "R");
          return;
        }

        setRole(null);
      } catch (error) {
        console.error("Role detection failed", error);
      }
    }

    fetchUserRole();
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md border-b border-gray-200 flex items-center justify-between px-6 z-40">
      <h1 className="text-lg font-semibold text-gray-900 select-none">
        Society Management
      </h1>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2 rounded-md hover:bg-blue-100 transition"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full ring-1 ring-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-md p-2 hover:bg-blue-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {nameInitial}
            </div>

            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm leading-4">
                {role === "Administrator" ? "Admin" : "Resident"}
              </p>
              <p className="text-gray-500 text-xs leading-3">{role}</p>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform ${
                profileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <Link
                href="/"
                className="flex w-full items-center gap-3 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
