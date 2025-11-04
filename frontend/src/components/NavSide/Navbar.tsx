"use client";

import { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="fixed  top-0 left-64 right-0 h-16 bg-white shadow-md border-b border-gray-200 flex items-center justify-between px-6 z-40">
      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-900 select-none">Society Management</h1>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          {/* Notification indicator */}
          <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full ring-1 ring-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={profileMenuOpen}
            onClick={() => setProfileMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-md p-2 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm select-none">
              A
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm leading-4">Admin</p>
              <p className="text-gray-500 text-xs leading-3">Administrator</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform ${
                profileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown menu (example static UI, toggle logic needed) */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                // onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
