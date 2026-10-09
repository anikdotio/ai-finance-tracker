"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  PieChart,
  Target,
  TrendingUp,
  Sliders,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Ledger & Transactions",
    href: "/transaction",
    icon: ArrowLeftRight,
  },
  {
    name: "Accounts & Vaults",
    href: "/account",
    icon: Landmark,
  },
  {
    name: "Budgets & Limits",
    href: "/budget",
    icon: PieChart,
  },
  {
    name: "Capital Goals",
    href: "/goals",
    icon: Target,
  },
  {
    name: "Analytics & Trends",
    href: "/analytics",
    icon: TrendingUp,
  },
  {
    name: "Preferences",
    href: "/preferences",
    icon: Sliders,
  },
];

export function AppSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const { user } = useUser();

  const userDisplayName =
    user?.firstName || user?.fullName || "Demo";
  const userEmail =
    user?.primaryEmailAddress?.emailAddress || "demo@ledger.app";
  const userInitials =
    userDisplayName
      ? userDisplayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "DE";

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 bg-[#0A0B0C] border-r border-[#1C1D22] flex flex-col justify-between transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#1C1D22]">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 overflow-hidden group"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-7 h-7 shrink-0 rounded border border-[#2D2E35] bg-[#141518] flex items-center justify-center font-serif text-[#F4F0E6] text-sm font-semibold shadow-sm">
                L
              </div>
              {!collapsed && (
                <span className="font-serif text-lg tracking-normal text-[#F4F0E6] truncate">
                  Ledger
                </span>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-[#8E8E93] hover:text-[#F4F0E6]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/transaction" &&
                  (pathname.startsWith("/transaction") || pathname.startsWith("/account/"))) ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group",
                    isActive
                      ? "bg-[#16171B] text-[#F4F0E6] border border-[#26272D] shadow-sm"
                      : "text-[#8E8E93] hover:text-[#F4F0E6] hover:bg-[#121316]"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon
                    size={16}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-[#EAE0D5]" : "text-[#71727A] group-hover:text-[#F4F0E6]"
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Area & Collapse Button */}
        <div className="p-3 border-t border-[#1C1D22] space-y-3">
          {/* User Row */}
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg bg-[#121316] border border-[#1E1F24]",
              collapsed ? "justify-center" : ""
            )}
          >
            <div className="w-8 h-8 shrink-0 rounded-full bg-[#18191E] border border-[#2D2E35] flex items-center justify-center font-mono text-xs font-medium text-[#EAE0D5]">
              {userInitials}
            </div>

            {!collapsed && (
              <div className="overflow-hidden flex-1 min-w-0">
                <div className="text-xs font-medium text-[#F4F0E6] truncate">
                  {userDisplayName}
                </div>
                <div className="text-[11px] text-[#71727A] truncate font-mono">
                  {userEmail}
                </div>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center gap-2 px-3 py-2 rounded-md text-xs text-[#71727A] hover:text-[#F4F0E6] hover:bg-[#141518] transition-colors"
          >
            {collapsed ? (
              <ChevronsRight size={14} className="mx-auto" />
            ) : (
              <>
                <ChevronsLeft size={14} />
                <span className="font-mono text-[11px]">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
