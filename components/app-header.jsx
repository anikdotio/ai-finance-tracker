"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const breadcrumbMap = {
  "/dashboard": "Overview",
  "/transaction": "Ledger & Transactions",
  "/transaction/create": "Ledger & Transactions",
  "/account": "Accounts & Vaults",
  "/budget": "Budgets & Limits",
  "/goals": "Capital Goals",
  "/analytics": "Analytics & Trends",
  "/preferences": "Preferences",
};

export function AppHeader({ onOpenMobile }) {
  const pathname = usePathname();
  const { user } = useUser();

  // Find matching breadcrumb
  let title = "Overview";
  for (const [path, label] of Object.entries(breadcrumbMap)) {
    if (pathname === path || (path !== "/dashboard" && pathname.startsWith(path))) {
      title = label;
      break;
    }
  }

  return (
    <header className="h-16 border-b border-[#1C1D22] bg-[#0A0B0C]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Left Breadcrumb & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden text-[#8E8E93] hover:text-[#F4F0E6] p-1 rounded-md"
        >
          <Menu size={20} />
        </button>

        <span className="text-sm font-normal text-[#8E8E93]">{title}</span>
      </div>

      {/* Right Action: + Add Transaction & User Avatar */}
      <div className="flex items-center gap-4">
        <Link href="/transaction/create">
          <Button
            variant="cream"
            size="sm"
            className="h-8 px-3.5 text-xs font-medium rounded gap-1.5 shadow-sm"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>Add Transaction</span>
          </Button>
        </Link>

        {/* User Button / Initials circle */}
        <div className="flex items-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full border border-[#2D2E35]",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
