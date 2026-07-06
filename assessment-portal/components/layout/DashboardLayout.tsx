"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "../../lib/context";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, loading } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  // Sync collapsed state with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar-collapsed");
      if (stored !== null) {
        setCollapsed(stored === "true");
      } else {
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        setCollapsed(isTablet);
      }
    }
  }, []);

  // Redirect to login if user session is absent and not loading
  useEffect(() => {
    if (!loading && !currentUser && pathname !== "/") {
      router.push("/");
    }
  }, [currentUser, loading, pathname, router]);

  const handleCollapseToggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebar-collapsed", String(next));
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-primary">Loading Xebia LMS...</span>
        </div>
      </div>
    );
  }

  // If logged out and on the landing/login route, just render children directly
  if (!currentUser && pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background relative flex overflow-hidden">
      {/* Sidebar Panel */}
      <Sidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onCollapseToggle={handleCollapseToggle}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar
          onMenuToggle={() => setMobileOpen(true)}
          collapsed={collapsed}
        />

        {/* Scrollable Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
