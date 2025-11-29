"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/NavSide/Sidebar";
import Navbar from "@/components/NavSide/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Paths where sidebar + navbar should be hidden
  const hiddenPaths = ["/", "/adminLogin", "/residentLogin", "/createAccount"];
  const hideNavAndSidebar = hiddenPaths.includes(pathname);

  return (
    <html lang="en">
      <body>
        {hideNavAndSidebar ? (
          <main>{children}</main>
        ) : (
          <div className="flex">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="lg:ml-64 flex-1">
              <Navbar setSidebarOpen={setSidebarOpen} />
              <main className="p-6">{children}</main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
