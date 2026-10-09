import React from "react";
import { getDaysInMonth, getDate } from "date-fns";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { BudgetsLimitsClient } from "./_components/budgets-client";

export default async function BudgetsPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault) || accounts?.[0];

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const now = new Date();
  const daysInMonth = getDaysInMonth(now);
  const currentDay = getDate(now);
  const daysLeft = Math.max(1, daysInMonth - currentDay);

  return (
    <div className="space-y-8">
      {/* Client component for interactive adjustments */}
      <BudgetsLimitsClient
        initialBudgetData={budgetData}
        transactions={transactions || []}
        daysLeft={daysLeft}
      />
    </div>
  );
}
