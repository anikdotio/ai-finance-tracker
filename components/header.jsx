import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full bg-[#0C0D0E]/85 backdrop-blur-md z-50 border-b border-[#1E1F24]">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded border border-[#2D2E35] bg-[#141518] flex items-center justify-center font-serif text-[#F4F0E6] text-sm font-semibold">
            L
          </div>
          <span className="font-serif text-lg tracking-normal text-[#F4F0E6]">Ledger</span>
        </Link>

        {/* Center Links (Reference 1) */}
        <div className="hidden md:flex items-center space-x-8 text-sm text-[#8E8E93]">
          <a href="#capabilities" className="hover:text-[#F4F0E6] transition-colors">
            Capabilities
          </a>
          <a href="#receipt-scanner" className="hover:text-[#F4F0E6] transition-colors">
            Receipt Scanner
          </a>
          <a href="#how-it-works" className="hover:text-[#F4F0E6] transition-colors">
            How it works
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="dark"
                size="sm"
                className="text-xs h-8 px-3 text-[#F4F0E6] gap-2"
              >
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button
                variant="cream"
                size="sm"
                className="text-xs h-8 px-3 gap-1.5"
              >
                <PenBox size={14} />
                <span>Add Transaction</span>
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full border border-[#2D2E35]",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="text-xs text-[#8E8E93] hover:text-[#F4F0E6] transition-colors font-medium px-2"
            >
              Sign in
            </Link>
            <Link href="/sign-up">
              <Button
                variant="cream"
                size="sm"
                className="text-xs h-8 px-3.5 font-medium rounded"
              >
                Open Ledger
              </Button>
            </Link>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Header;
