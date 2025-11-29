"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Menu } from "lucide-react";

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [role, setRole] = useState<string>("Loading...");
  const [nameInitial, setNameInitial] = useState("U");

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType === "admin") {
      setRole("Administrator");
    } else if (userType === "resident") {
      setRole("Resident");
    }

    validateRole();
  }, []);

  async function validateRole() {
    try {
      const responses = [
        fetch("https://nextsms.onrender.com/admin/profile", {
          credentials: "include",
        }),
        fetch("https://nextsms.onrender.com/resident/profile", {
          credentials: "include",
        }),
      ];

      const [adminRes, residentRes] = await Promise.all(responses);

      if (adminRes.ok) {
        const data = await adminRes.json();
        setRole("Administrator");
        setNameInitial(data?.firstName?.[0] || "A");
        localStorage.setItem("userType", "admin");
        return;
      }

      if (residentRes.ok) {
        const data = await residentRes.json();
        setRole("Resident");
        setNameInitial(data?.firstName?.[0] || "R");
        localStorage.setItem("userType", "resident");
        return;
      }

      setRole("Admin");
      localStorage.removeItem("userType");
    } catch (err) {
      console.error("Role validation failed", err);
    }
  }

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white shadow-md px-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 hover:bg-blue-100 rounded-md"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Society Management</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 hover:bg-blue-100">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded-md"
          >
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex justify-center items-center font-semibold">
              {nameInitial}
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold">
                {role === "Administrator" ? "Admin" : role}
              </p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>

            <ChevronDown
              className={`w-4 h-4 transition ${
                profileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg mt-2 border">
              <Link
                href="/"
                className="flex w-full px-3 py-2 text-red-600 font-semibold hover:bg-red-50"
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
