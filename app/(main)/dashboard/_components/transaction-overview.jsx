"use client";

import React, { useState, useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { CategoryIcon } from "@/components/category-icon";
import { cn } from "@/lib/utils";

export function DashboardOverview({ accounts = [], transactions = [], budgetData = null }) {
  const [filterType, setFilterType] = useState("ALL");

  // Current date and month limits
  const now = useMemo(() => new Date(), []);
  const currentMonthStart = useMemo(() => startOfMonth(now), [now]);
  const currentMonthEnd = useMemo(() => endOfMonth(now), [now]);

  // Aggregate Total Balance across all accounts
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, account) => acc + (parseFloat(account.balance) || 0), 0);
  }, [accounts]);

  // Current month's transactions
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return isWithinInterval(d, { start: currentMonthStart, end: currentMonthEnd });
    });
  }, [transactions, currentMonthStart, currentMonthEnd]);

  // Inflow & Outflow for current month
  const thisMonthInflow = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0);
  }, [currentMonthTransactions]);

  const thisMonthOutflow = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0);
  }, [currentMonthTransactions]);

  // Budget progress
  const totalBudget = budgetData?.budget?.amount ? parseFloat(budgetData.budget.amount) : 1210;
  const budgetSpent = budgetData?.currentExpenses ? parseFloat(budgetData.currentExpenses) : thisMonthOutflow;
  const budgetPercent = totalBudget > 0 ? Math.min(100, (budgetSpent / totalBudget) * 100) : 0;

  // Six-Month Flow Data
  const sixMonthFlowData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const mStart = startOfMonth(d);
      const mEnd = endOfMonth(d);
      const mLabel = format(d, "MMM");

      const mTransactions = transactions.filter((t) => {
        const td = new Date(t.date);
        return isWithinInterval(td, { start: mStart, end: mEnd });
      });

      const income = mTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

      const expense = mTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

      months.push({
        month: mLabel,
        income,
        expense,
      });
    }
    return months;
  }, [transactions, now]);

  // Where This Month Went (Category ranking)
  const whereThisMonthWent = useMemo(() => {
    const catMap = {};
    const expenseTx = currentMonthTransactions.filter((t) => t.type === "EXPENSE");
    const totalExp = expenseTx.reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0);

    expenseTx.forEach((t) => {
      const cat = t.category || "General";
      catMap[cat] = (catMap[cat] || 0) + (parseFloat(t.amount) || 0);
    });

    const sorted = Object.entries(catMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExp > 0 ? Math.round((amount / totalExp) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return sorted.slice(0, 4);
  }, [currentMonthTransactions]);

  // Filtered Recent Transactions
  const filteredRecent = useMemo(() => {
    let list = [...transactions];
    if (filterType === "INCOME") {
      list = list.filter((t) => t.type === "INCOME");
    } else if (filterType === "EXPENSE") {
      list = list.filter((t) => t.type === "EXPENSE");
    } else if (filterType === "RECURRING") {
      list = list.filter((t) => t.isRecurring);
    }
    return list.slice(0, 10);
  }, [transactions, filterType]);

  return (
    <div className="space-y-8">
      {/* Reference 6: Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Balance Card */}
        <div className="bg-[#121316] border border-[#212226] rounded-xl p-5 shadow-sm space-y-3">
          <div className="text-[11px] font-mono tracking-wider text-[#8E8E93] uppercase">
            Total Balance
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#F4F0E6]">
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#71727A] font-mono">
            across {accounts.length} {accounts.length === 1 ? "vault" : "vaults"}
          </div>
        </div>

        {/* This Month Inflow / Outflow Card */}
        <div className="bg-[#121316] border border-[#212226] rounded-xl p-5 shadow-sm space-y-3">
          <div className="text-[11px] font-mono tracking-wider text-[#8E8E93] uppercase">
            This Month
          </div>
          <div className="flex items-center gap-4 text-xl sm:text-2xl font-mono font-medium">
            <span className="text-[#48BB78] flex items-center">
              <span className="mr-1">↗</span>
              ${thisMonthInflow.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[#E05A47] flex items-center">
              <span className="mr-1">↘</span>
              ${thisMonthOutflow.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-xs text-[#71727A] font-mono">
            inflow vs outflow, to date
          </div>
        </div>

        {/* Budget Consumed Card */}
        <div className="bg-[#121316] border border-[#212226] rounded-xl p-5 shadow-sm space-y-3">
          <div className="text-[11px] font-mono tracking-wider text-[#8E8E93] uppercase">
            Budget Consumed
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-mono font-medium text-[#F4F0E6]">
              ${budgetSpent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-[#71727A] font-mono">
              of ${totalBudget.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#18191E] h-1.5 rounded-full overflow-hidden border border-[#26272D]">
            <div
              className="bg-[#EAE0D5] h-full rounded-full transition-all duration-500"
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          <div className="text-xs text-[#71727A] font-mono">
            {budgetPercent.toFixed(1)}% of ceilings used
          </div>
        </div>
      </div>

      {/* Reference 6: Middle Section (Six-Month Flow & Category/Vaults) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Six-Month Flow Chart */}
        <div className="lg:col-span-7 bg-[#121316] border border-[#212226] rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono tracking-wider text-[#8E8E93] uppercase">
              Six-Month Flow
            </h3>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-[#A0A2AA]">
                <div className="w-2 h-2 rounded-full bg-[#48BB78]" />
                <span>Income</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#A0A2AA]">
                <div className="w-2 h-2 rounded-full bg-[#E05A47]" />
                <span>Expense</span>
              </div>
            </div>
          </div>

          <div className="h-[260px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sixMonthFlowData}>
                <defs>
                  <linearGradient id="flowIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#48BB78" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#48BB78" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="flowExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E05A47" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#E05A47" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#5C5D63"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#212226" }}
                />
                <YAxis
                  stroke="#5C5D63"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#212226" }}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#16171B",
                    borderColor: "#2B2C33",
                    borderRadius: "8px",
                    color: "#F4F0E6",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`$${parseFloat(value).toFixed(2)}`]}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#48BB78"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#flowIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#E05A47"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#flowExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Where This Month Went & Vaults */}
        <div className="lg:col-span-5 space-y-6">
          {/* Where This Month Went Card */}
          <div className="bg-[#121316] border border-[#212226] rounded-xl p-5 shadow-sm space-y-4">
            <div className="text-[11px] font-mono tracking-wider text-[#8E8E93] uppercase">
              Where This Month Went
            </div>

            {whereThisMonthWent.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#71727A] font-mono">
                No recorded outflows this month
              </div>
            ) : (
              <div className="space-y-3.5">
                {whereThisMonthWent.map((item) => (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 text-[#C6C7CC]">
                        <CategoryIcon category={item.category} className="w-3.5 h-3.5 text-[#8E8E93]" />
                        <span>{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#F4F0E6]">${item.amount.toFixed(2)}</span>
                        <span className="text-[#71727A] w-7 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                    {/* Tiny bar */}
                    <div className="w-full bg-[#18191E] h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-[#EAE0D5] h-full rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vaults Card */}
          <div className="bg-[#121316] border border-[#212226] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider text-[#8E8E93] uppercase">
                Vaults
              </span>
              <Link
                href="/account"
                className="text-xs text-[#8E8E93] hover:text-[#F4F0E6] transition-colors font-medium"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-2 pt-1">
              {accounts.slice(0, 3).map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#16171B] border border-[#212226]"
                >
                  <div>
                    <div className="text-xs font-medium text-[#F4F0E6]">{acc.name}</div>
                    <div className="text-[10px] font-mono text-[#71727A] uppercase">
                      {acc.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-medium text-[#F4F0E6]">
                      ${parseFloat(acc.balance).toFixed(2)}
                    </span>
                    <Link href={`/transaction/create?accountId=${acc.id}`}>
                      <button
                        title="Add entry to this vault"
                        className="w-6 h-6 rounded bg-[#202126] text-[#A0A2AA] hover:text-[#F4F0E6] hover:bg-[#2B2C33] flex items-center justify-center text-xs transition-colors"
                      >
                        +
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reference 6 & 7: Recent Ledger Lines with Filter Tabs */}
      <div className="bg-[#121316] border border-[#212226] rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xs font-mono tracking-wider text-[#8E8E93] uppercase">
            Recent Ledger Lines
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0A0B0C] border border-[#212226] rounded-lg">
            {["ALL", "INCOME", "EXPENSE", "RECURRING"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-3 py-1 rounded text-[11px] font-mono transition-colors",
                  filterType === type
                    ? "bg-[#1E1F24] text-[#F4F0E6] font-medium"
                    : "text-[#71727A] hover:text-[#C6C7CC]"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-[#1C1D22]">
          {filteredRecent.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#71727A] font-mono">
              No transactions matching &quot;{filterType}&quot; filter
            </div>
          ) : (
            filteredRecent.map((t) => {
              const isIncome = t.type === "INCOME";
              const formattedDate = format(new Date(t.date), "yyyy-MM-dd");

              return (
                <div
                  key={t.id}
                  className="py-3 flex items-center justify-between group hover:bg-[#141519] px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#18191E] border border-[#26272D] flex items-center justify-center shrink-0">
                      <CategoryIcon category={t.category} className="w-4 h-4 text-[#A0A2AA]" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#F4F0E6] group-hover:text-white transition-colors">
                        {t.description || "Untitled Transaction"}
                      </div>
                      <div className="text-[11px] text-[#71727A] font-mono flex items-center gap-2">
                        <span>{t.category || "General"}</span>
                        <span>·</span>
                        <span>{formattedDate}</span>
                        {t.isRecurring && (
                          <span className="text-[#A0A2AA] border border-[#2A2B31] px-1 rounded text-[9px]">
                            RECURRING
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={cn(
                        "text-xs font-mono font-medium",
                        isIncome ? "text-[#48BB78]" : "text-[#F4F0E6]"
                      )}
                    >
                      {isIncome ? `+$${parseFloat(t.amount).toFixed(2)}` : `-$${parseFloat(t.amount).toFixed(2)}`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Link: View the full ledger */}
        <div className="pt-3 border-t border-[#1C1D22]">
          <Link
            href="/transaction"
            className="text-xs text-[#8E8E93] hover:text-[#F4F0E6] transition-colors font-medium flex items-center gap-1.5"
          >
            <span>View the full ledger</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
