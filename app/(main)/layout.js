"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/utils";

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0C0D0E] text-[#F4F0E6] flex">
      {/* Persistent Left Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          collapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Sticky Top Header */}
        <AppHeader onOpenMobile={() => setMobileOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>

        {/* App Footer (Reference 7, 10, etc.) */}
        <footer className="py-8 px-8 border-t border-[#1C1D22] text-xs text-[#5C5D63] font-mono">
          Ledger — every number in its place.
        </footer>
      </div>
    </div>
  );
}
