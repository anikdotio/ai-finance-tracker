import React from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Scan, Landmark, PieChart, CreditCard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0C0D0E] text-[#F4F0E6] flex flex-col selection:bg-[#EAE0D5] selection:text-[#0C0D0E]">
      {/* Reference 1 Header */}
      <Header />

      {/* Reference 1 Hero & Live Balance Widget */}
      <main className="flex-1">
        <HeroSection />

        {/* Reference 2: Capabilities Section */}
        <section id="capabilities" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#1C1D22]">
          <div className="space-y-4 mb-12">
            <div className="text-[11px] font-mono tracking-widest text-[#C29B38] uppercase">
              Capabilities
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F4F0E6]">
              Everything you need, nothing you don&apos;t.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#121316] border border-[#212226] rounded-xl p-7 space-y-4 hover:border-[#2D2E35] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#18191E] border border-[#26272D] flex items-center justify-center text-[#EAE0D5]">
                <Scan size={20} />
              </div>
              <h3 className="font-medium text-lg text-[#F4F0E6]">
                Intelligent Ledger Engine
              </h3>
              <p className="text-sm text-[#8E8E93] leading-relaxed">
                Point a camera at a receipt and the entry writes itself — merchant,
                amount, category, date. Every line reconciled without the tedium.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#121316] border border-[#212226] rounded-xl p-7 space-y-4 hover:border-[#2D2E35] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#18191E] border border-[#26272D] flex items-center justify-center text-[#EAE0D5]">
                <Landmark size={20} />
              </div>
              <h3 className="font-medium text-lg text-[#F4F0E6]">
                Liquidity & Consolidation
              </h3>
              <p className="text-sm text-[#8E8E93] leading-relaxed">
                Checking, savings, credit lines and cash vaults in one calibrated
                view. Your true position, always current.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#121316] border border-[#212226] rounded-xl p-7 space-y-4 hover:border-[#2D2E35] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#18191E] border border-[#26272D] flex items-center justify-center text-[#EAE0D5]">
                <PieChart size={20} />
              </div>
              <h3 className="font-medium text-lg text-[#F4F0E6]">
                Budget Ceilings, Zero Judgment
              </h3>
              <p className="text-sm text-[#8E8E93] leading-relaxed">
                Set a monthly ceiling per category and watch the runway. Quiet
                gauges, honest numbers, no gamified shame.
              </p>
            </div>
          </div>
        </section>

        {/* Reference 2 & 3: Receipt Scanner Section */}
        <section id="receipt-scanner" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#1C1D22]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Description */}
            <div className="lg:col-span-6 space-y-5">
              <div className="text-[11px] font-mono tracking-widest text-[#C29B38] uppercase">
                Receipt Scanner
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight font-normal text-[#F4F0E6]">
                A receipt becomes a ledger line before you set the camera down.
              </h2>
              <p className="text-base text-[#8E8E93] leading-relaxed max-w-lg">
                The parser reads the merchant, the grand total, the date and a sensible
                category — you review, adjust if needed, and record. Ten seconds, start
                to finish.
              </p>
            </div>

            {/* Right Preview Widget (Raw Input vs Parsed Entry) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Raw Input Card */}
              <div className="bg-[#121316] border border-[#212226] rounded-xl p-5 space-y-4 font-mono text-xs shadow-xl">
                <div className="text-[10px] uppercase tracking-wider text-[#71727A]">
                  Raw Input
                </div>
                <div className="space-y-2 text-[#9A9BA3] pt-1 leading-relaxed">
                  <div>GREENLINE MARKET No 42</div>
                  <div className="text-[11px] text-[#696A72]">ORGANIC KALE 3.49</div>
                  <div className="text-[11px] text-[#696A72]">SOURDOUGH LOAF 5.99</div>
                  <div className="text-[11px] text-[#696A72]">OAT MILK 2L 6.49</div>
                  <div className="pt-4 text-[#F4F0E6] font-medium border-t border-[#1E1F24]">
                    TOTAL 91.12
                  </div>
                </div>
              </div>

              {/* Parsed Entry Card */}
              <div className="bg-[#121316] border border-[#212226] rounded-xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#71727A] mb-3">
                    Parsed Entry
                  </div>
                  <div className="font-medium text-base text-[#F4F0E6]">
                    Greenline Market
                  </div>
                </div>

                <div className="space-y-2.5 text-xs border-t border-[#1F2025] pt-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8E8E93]">Amount</span>
                    <span className="text-[#F4F0E6] font-semibold">$91.12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8E8E93]">Category</span>
                    <span className="text-[#F4F0E6]">Groceries</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8E8E93]">Date</span>
                    <span className="text-[#8E8E93]">— today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reference 3: How It Works Section */}
        <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#1C1D22]">
          <div className="space-y-3 mb-12">
            <div className="text-[11px] font-mono tracking-widest text-[#71727A] uppercase">
              How It Works
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 01 */}
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#71727A]">01</div>
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-[#EAE0D5]" />
                <h3 className="font-medium text-base text-[#F4F0E6]">
                  Open your account
                </h3>
              </div>
              <p className="text-sm text-[#8E8E93] leading-relaxed">
                A name, an email, a password. Your first vault takes thirty seconds.
              </p>
            </div>

            {/* Step 02 */}
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#71727A]">02</div>
              <h3 className="font-medium text-base text-[#F4F0E6]">
                Record the movement
              </h3>
              <p className="text-sm text-[#8E8E93] leading-relaxed">
                Scan a receipt or type a figure. The ledger files it where it belongs.
              </p>
            </div>

            {/* Step 03 */}
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#71727A]">03</div>
              <h3 className="font-medium text-base text-[#F4F0E6]">
                Read the signals
              </h3>
              <p className="text-sm text-[#8E8E93] leading-relaxed">
                Trends, ceilings and savings rates surface as calm, precise analytics.
              </p>
            </div>
          </div>

          {/* Reference 3: Begin the First Page CTA Banner */}
          <div className="mt-20 bg-[#121316] border border-[#212226] rounded-xl p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2">
              <h3 className="font-serif text-3xl sm:text-4xl text-[#F4F0E6]">
                Begin the first page.
              </h3>
              <p className="text-sm text-[#8E8E93]">
                Free while in preview. Your numbers stay yours.
              </p>
            </div>

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
          </div>
        </section>
      </main>

      {/* Reference 3 Footer */}
      <footer className="py-12 border-t border-[#1C1D22] text-center text-xs text-[#5C5D63] font-sans">
        <p>Ledger — the quiet precision of personal balance.</p>
      </footer>
    </div>
  );
}
