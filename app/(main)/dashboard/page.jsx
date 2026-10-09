import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { DashboardOverview } from "./_components/transaction-overview";

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault) || accounts?.[0];

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const currentMonthName = format(new Date(), "MMMM");

  return (
    <div className="space-y-8">
      {/* Reference 6 Header: Overview & + New entry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F4F0E6] font-normal">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E93] mt-1 font-mono">
            Your position at a glance — {currentMonthName}
          </p>
        </div>

        <Link href="/transaction/create">
          <Button
            variant="cream"
            className="text-xs font-medium h-9 px-4 rounded-md gap-1.5 shadow-sm"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>New entry</span>
          </Button>
        </Link>
      </div>

      {/* Complete Dashboard Overview (Stats, Chart, Breakdown, Vaults, Filterable Ledger) */}
      <DashboardOverview
        accounts={accounts || []}
        transactions={transactions || []}
        budgetData={budgetData}
      />
    </div>
  );
}
