import React from "react";
import { getUserTransactions } from "@/actions/transaction";
import { PreferencesClient } from "./_components/preferences-client";

export default async function PreferencesPage() {
  const result = await getUserTransactions();
  const transactions = result?.data || [];

  return (
    <div className="space-y-8">
      <PreferencesClient transactions={transactions} />
    </div>
  );
}

