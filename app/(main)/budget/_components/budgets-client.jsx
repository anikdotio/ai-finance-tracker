"use client";

import React, { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/category-icon";
import { updateBudget } from "@/actions/budget";
import { cn } from "@/lib/utils";

export function BudgetsLimitsClient({ initialBudgetData, transactions = [], daysLeft = 23 }) {
  const router = useRouter();
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const initialAmount = initialBudgetData?.budget?.amount
    ? parseFloat(initialBudgetData.budget.amount)
    : 1210;

  const [totalCeiling, setTotalCeiling] = useState(initialAmount);
  const [inputAmount, setInputAmount] = useState(initialAmount.toString());
  const [loading, setLoading] = useState(false);

  // Calculate current month expenses
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter((t) => {
      const d = new Date(t.date);
      return (
        t.type === "EXPENSE" &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });
  }, [transactions]);

  const spentThisMonth = useMemo(() => {
    return currentMonthExpenses.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  }, [currentMonthExpenses]);

  const remaining = Math.max(0, totalCeiling - spentThisMonth);
  const safeToSpendDay = daysLeft > 0 ? (remaining / daysLeft).toFixed(2) : remaining.toFixed(2);

  // Group actual expenses by category
  const categoriesData = useMemo(() => {
    const catMap = {
      Dining: { spent: 0, ceilingRatio: 0.25 },
      Groceries: { spent: 0, ceilingRatio: 0.54 },
      Subscriptions: { spent: 0, ceilingRatio: 0.07 },
      Transport: { spent: 0, ceilingRatio: 0.14 },
    };

    currentMonthExpenses.forEach((t) => {
      const cat = t.category || "Other";
      if (!catMap[cat]) {
        catMap[cat] = { spent: 0, ceilingRatio: 0.15 };
      }
      catMap[cat].spent += parseFloat(t.amount) || 0;
    });

    return Object.entries(catMap).map(([category, { spent, ceilingRatio }]) => {
      const ceiling = Math.round(totalCeiling * ceilingRatio);
      const usedPct = ceiling > 0 ? Math.round((spent / ceiling) * 100) : 0;
      const left = Math.max(0, ceiling - spent);
      const dailyLeft = daysLeft > 0 ? (left / daysLeft).toFixed(2) : left.toFixed(2);
      const isOnTrack = usedPct <= 100;

      return {
        category,
        spent,
        ceiling,
        usedPct,
        left,
        dailyLeft,
        isOnTrack,
      };
    });
  }, [currentMonthExpenses, totalCeiling, daysLeft]);

  const handleSaveCeiling = async () => {
    const val = parseFloat(inputAmount);
    if (isNaN(val) || val <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      await updateBudget(val);
      setTotalCeiling(val);
      setIsAdjusting(false);
      toast.success("Budget ceiling updated successfully");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to update ceiling");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Reference 12: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F4F0E6] font-normal">
            Budgets & Limits
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E93] mt-1 font-mono">
            Monthly ceilings per category — quiet gauges, honest numbers.
          </p>
        </div>

        <Button
          variant="cream"
          onClick={() => {
            setInputAmount(totalCeiling.toString());
            setIsAdjusting(true);
          }}
          className="text-xs font-medium h-9 px-4 rounded-md gap-1.5 shadow-sm"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>New ceiling</span>
        </Button>
      </div>

      {/* Reference 12: Top Stats Row */}
      <div className="bg-[#121316] border border-[#212226] rounded-xl p-6 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-1">
          <div className="text-[10px] font-mono tracking-wider text-[#8E8E93] uppercase">
            Total Ceiling
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-medium text-[#F4F0E6]">
            ${totalCeiling.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-mono tracking-wider text-[#8E8E93] uppercase">
            Spent This Month
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-medium text-[#F4F0E6]">
            ${spentThisMonth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-mono tracking-wider text-[#8E8E93] uppercase">
            Remaining
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-medium text-[#48BB78]">
            ${remaining.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-mono tracking-wider text-[#8E8E93] uppercase">
            Safe-To-Spend / Day
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-medium text-[#F4F0E6]">
            ${safeToSpendDay}
          </div>
          <div className="text-[10px] text-[#71727A] font-mono">
            {daysLeft} days left in the month
          </div>
        </div>
      </div>

      {/* Reference 12: Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoriesData.map((item) => (
          <div
            key={item.category}
            className="bg-[#121316] border border-[#212226] rounded-xl p-5 shadow-sm space-y-4 hover:border-[#2D2E35] transition-colors"
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#18191E] border border-[#26272D] flex items-center justify-center shrink-0">
                  <CategoryIcon category={item.category} className="w-4 h-4 text-[#A0A2AA]" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-[#F4F0E6]">{item.category}</h3>
                  <div className="text-[11px] font-mono text-[#71727A]">
                    ${item.spent.toFixed(2)} of ${item.ceiling.toFixed(2)}
                  </div>
                </div>
              </div>

              <span
                className={cn(
                  "text-[9px] font-mono px-2 py-0.5 rounded tracking-wider uppercase border",
                  item.isOnTrack
                    ? "bg-[#48BB78]/10 text-[#48BB78] border-[#48BB78]/25"
                    : "bg-[#E05A47]/10 text-[#E05A47] border-[#E05A47]/25"
                )}
              >
                {item.isOnTrack ? "On track" : "Over ceiling"}
              </span>
            </div>

            {/* Progress Runway bar */}
            <div className="w-full bg-[#18191E] h-1.5 rounded-full overflow-hidden border border-[#26272D]">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  item.isOnTrack ? "bg-[#EAE0D5]" : "bg-[#E05A47]"
                )}
                style={{ width: `${Math.min(100, item.usedPct)}%` }}
              />
            </div>

            {/* Runway details */}
            <div className="flex items-center justify-between text-xs font-mono text-[#8E8E93]">
              <span>{item.usedPct}% used</span>
              <span>
                left ${item.left.toFixed(2)} · ${item.dailyLeft}/day
              </span>
            </div>

            {/* Action footer */}
            <div className="pt-3 border-t border-[#1C1D22] flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => {
                  setSelectedCategory(item.category);
                  setInputAmount(item.ceiling.toString());
                  setIsAdjusting(true);
                }}
                className="text-[#8E8E93] hover:text-[#F4F0E6] transition-colors flex items-center gap-1.5"
              >
                <Pencil size={12} />
                <span>Adjust ceiling</span>
              </button>

              <button
                onClick={() => toast.info("Category ceiling archived")}
                className="text-[#71727A] hover:text-[#E05A47] transition-colors"
                title="Retire category ceiling"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Adjust Ceiling Modal Dialog */}
      {isAdjusting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsAdjusting(false)}
          />
          <div className="relative bg-[#131417] border border-[#212226] rounded-xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#F4F0E6]">
                Adjust {selectedCategory || "Monthly"} Ceiling
              </h3>
              <button
                onClick={() => setIsAdjusting(false)}
                className="text-[#71727A] hover:text-[#F4F0E6]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-[#8E8E93]">
                Monthly Limit Amount (USD)
              </label>
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                placeholder="1210.00"
                className="w-full bg-[#16171B] border border-[#26272D] rounded-lg px-3 py-2 text-sm font-mono text-[#F4F0E6] focus:border-[#EAE0D5] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="dark"
                size="sm"
                onClick={() => setIsAdjusting(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="cream"
                size="sm"
                onClick={handleSaveCeiling}
                disabled={loading}
                className="h-8 text-xs font-medium"
              >
                {loading ? "Saving..." : "Save Ceiling"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
