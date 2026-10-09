import React from "react";
import { getUserTransactions } from "@/actions/transaction";
import { AnalyticsTrendsClient } from "./_components/analytics-client";
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const result = await getUserTransactions();
  const transactions = result?.data || [];

  return (
    <div className="space-y-8">
      <AnalyticsTrendsClient transactions={transactions} />
    </div>
  );
}

