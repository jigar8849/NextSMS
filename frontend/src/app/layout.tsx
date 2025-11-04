"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/NavSide/Sidebar";
import Navbar from "@/components/NavSide/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
            <Sidebar />
            <div className="ml-64 flex-1">
              <Navbar />
              <main className="p-6">{children}</main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
