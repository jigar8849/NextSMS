"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { X } from "lucide-react";
import {
  // shared / admin icons
  Home, Users, CreditCard, Car, UserCog, Building2, MessageSquare, LogOut,
  // resident-only icons
  Calendar, FileText, BarChart2, Shield
} from "lucide-react";

type MenuItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }> };
type MenuConfig = { title: string; items: MenuItem[] };

// --- Admin menu config
const adminMenu: MenuConfig = {
  title: "Admin Panel",
  items: [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Residents", href: "/admin/residents", icon: Users },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Parking", href: "/admin/parking", icon: Car },
    { name: "Employees", href: "/admin/employees", icon: UserCog },
    { name: "Flat List", href: "/admin/flats", icon: Building2 },
    { name: "Complaints", href: "/admin/complaints", icon: MessageSquare },
  ],
};

// --- Resident menu config (matches your screenshot)
const residentMenu: MenuConfig = {
  title: "Resident Panel",
  items: [
    { name: "Dashboard",        href: "/resident/dashboard",             icon: Home },
    { name: "Bills & Payments", href: "/resident/billing",     icon: CreditCard },
    { name: "Complaints",       href: "/resident/complaints",  icon: MessageSquare },
    { name: "Book Events",      href: "/resident/eventss",      icon: Calendar },
    { name: "Owner List",       href: "/resident/owners",      icon: FileText },
    { name: "Vehicle Search",   href: "/resident/vehicles",    icon: Car },
    { name: "Society Staff",    href: "/resident/staff",       icon: BarChart2 },
    { name: "Profile",          href: "/resident/profile",     icon: Shield },
  ],
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  // Decide role by URL
  const isAdmin = pathname?.startsWith("/admin");
  const isResident = pathname?.startsWith("/resident");

  // If we're not on an admin/resident page, don't render a sidebar
  if (!isAdmin && !isResident) return null;

  const menu = isAdmin ? adminMenu : residentMenu;

  // helper: mark active for exact and nested routes
  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 flex h-screen w-64 flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 select-none border-b border-gray-200 bg-blue-500 text-center text-white relative">
          <div className="flex h-full items-center justify-center text-xl font-extrabold tracking-tight">
            {menu.title}
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 text-white lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {menu.items.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setSidebarOpen(false)} // Close sidebar on link click for mobile
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors",
                isActive(href)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              )}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <Icon
                className={clsx(
                  "h-5 w-5 shrink-0",
                  isActive(href) ? "text-white" : "text-gray-500"
                )}
                aria-hidden="true"
              />
              {name}
            </Link>
          ))}
        </nav>

        {/* Separator */}
        <div className="border-t border-gray-200" />

        {/* Logout */}
        <div className="mt-auto px-4 py-6">
          {/* If you don't have auth, link this wherever makes sense (e.g., "/") */}
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)} // Close sidebar on logout click for mobile
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 font-semibold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
}
