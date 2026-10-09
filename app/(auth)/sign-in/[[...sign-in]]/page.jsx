import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-[#0C0D0E] text-[#F4F0E6]">
      {/* Left Column: Reference 4 Editorial Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 border-r border-[#1C1D22] bg-[#0A0B0C]">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded border border-[#2D2E35] bg-[#141518] flex items-center justify-center font-serif text-[#F4F0E6] text-sm font-semibold">
            L
          </div>
          <span className="font-serif text-lg tracking-normal text-[#F4F0E6]">Ledger</span>
        </Link>

        {/* Editorial Text */}
        <div className="max-w-md space-y-6 my-auto">
          <div className="w-12 h-[1px] bg-[#C29B38]/70" />
          <h1 className="font-serif text-5xl leading-[1.12] font-normal text-[#F4F0E6]">
            Every number
            <br />
            in its place.
          </h1>
          <p className="text-sm text-[#8E8E93] leading-relaxed">
            The quiet precision of personal balance — accounts, ceilings and goals on one calm surface.
          </p>
        </div>

        {/* Footer */}
        <div className="text-xs text-[#5C5D63] font-mono">
          © Ledger — preview
        </div>
      </div>

      {/* Right Column: Reference 4 Auth Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded border border-[#2D2E35] bg-[#141518] flex items-center justify-center font-serif text-[#F4F0E6] text-sm font-semibold">
              L
            </div>
            <span className="font-serif text-lg tracking-normal text-[#F4F0E6]">Ledger</span>
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-6 pt-16 lg:pt-0">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none p-0 text-[#F4F0E6]",
                headerTitle: "font-serif text-3xl font-normal text-[#F4F0E6]",
                headerSubtitle: "text-xs text-[#8E8E93] mt-1",
                formButtonPrimary:
                  "bg-[#EAE0D5] hover:bg-[#F3EDE4] text-[#0C0D0E] font-medium text-sm py-2.5 rounded-md transition-colors",
                formFieldInput:
                  "bg-[#131417] border border-[#212226] text-[#F4F0E6] placeholder:text-[#5C5D63] focus:border-[#EAE0D5] rounded-md h-10 px-3 text-sm",
                formFieldLabel:
                  "text-[11px] font-mono tracking-wider text-[#8E8E93] uppercase mb-1.5",
                footerActionLink: "text-[#EAE0D5] hover:underline text-xs",
                footerActionText: "text-[#8E8E93] text-xs",
                dividerLine: "bg-[#212226]",
                dividerText: "text-[#71727A] text-xs",
                socialButtonsBlockButton:
                  "bg-[#131417] border border-[#212226] text-[#F4F0E6] hover:bg-[#1A1B20] text-sm",
              },
            }}
          />

          {/* Quick Demo Access Trigger */}
          <div className="pt-2 border-t border-[#1C1D22]">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center h-10 rounded-md bg-[#16171B] border border-[#26272D] text-xs font-medium text-[#F4F0E6] hover:bg-[#1F2026] transition-colors"
            >
              Use demo access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
