"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, Lock, FileScan, Coins, EyeOff } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline and Call-to-actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-[11px] font-mono tracking-widest text-[#C29B38] uppercase">
            Personal finance, precisely
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[72px] leading-[1.08] tracking-[-0.02em] text-[#F4F0E6] font-normal">
            Order, not noise.
            <br />
            Your complete balance
            <br />
            sheet.
          </h1>

          <p className="text-base sm:text-lg text-[#8E8E93] max-w-xl font-normal leading-relaxed">
            Ledger is a calm, highly calibrated financial workstation. Accounts,
            receipts, ceilings and goals — held in one warm-dark surface that treats
            your money with the seriousness it deserves.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/dashboard">
              <Button
                variant="cream"
                size="lg"
                className="h-11 px-6 text-sm font-medium rounded-md gap-2"
              >
                <span>Open Personal Ledger</span>
                <span>→</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="dark"
                size="lg"
                className="h-11 px-6 text-sm rounded-md"
              >
                Explore the demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Live Balance Widget (Reference 1) */}
        <div className="lg:col-span-5">
          <div className="bg-[#121316] border border-[#212226] rounded-xl p-6 shadow-2xl max-w-md ml-auto w-full space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider text-[#8E8E93] uppercase">
                Available Balance
              </span>
              <span className="text-[10px] font-mono border border-[#2B2C33] text-[#71727A] px-1.5 py-0.5 rounded">
                USD
              </span>
            </div>

            <div className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#F4F0E6]">
              $4,850.20
            </div>

            <div className="pt-2 border-t border-[#1F2025] space-y-3">
              <div className="text-[10px] font-mono tracking-wider text-[#71727A] uppercase">
                Recent ledger lines
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#C6C7CC]">Salary — Acme Studio</span>
                  <span className="text-[#48BB78] font-medium">+4200.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#C6C7CC]">Rent — Marsh Lane Apt</span>
                  <span className="text-[#F4F0E6]">-1450.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#C6C7CC]">Greenline Market</span>
                  <span className="text-[#F4F0E6]">-91.12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#C6C7CC]">Cafe Aurelio</span>
                  <span className="text-[#F4F0E6]">-38.50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Strip (Reference 1) */}
      <div className="mt-16 pt-8 border-t border-[#1C1D22] flex flex-wrap items-center justify-between gap-4 text-[#7E8088] text-[11px] font-mono tracking-wider uppercase">
        <div className="flex items-center gap-2">
          <Lock size={12} className="text-[#A0A2AA]" />
          <span>AES-256 Vault Encryption</span>
        </div>
        <div className="hidden sm:inline text-[#26272D]">•</div>
        <div className="flex items-center gap-2">
          <EyeOff size={12} className="text-[#A0A2AA]" />
          <span>Zero Data Resale</span>
        </div>
        <div className="hidden sm:inline text-[#26272D]">•</div>
        <div className="flex items-center gap-2">
          <FileScan size={12} className="text-[#A0A2AA]" />
          <span>Instant Receipt OCR</span>
        </div>
        <div className="hidden md:inline text-[#26272D]">•</div>
        <div className="flex items-center gap-2">
          <Coins size={12} className="text-[#A0A2AA]" />
          <span>Multi-Currency Parity</span>
        </div>
        <div className="hidden md:inline text-[#26272D]">•</div>
        <div className="flex items-center gap-2">
          <Shield size={12} className="text-[#A0A2AA]" />
          <span>Bank-Grade Privacy</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
