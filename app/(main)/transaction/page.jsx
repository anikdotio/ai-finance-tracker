import React, { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { getUserTransactions } from "@/actions/transaction";
import { TransactionTable } from "@/app/(main)/account/_components/transaction-table";
export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const result = await getUserTransactions();
  const transactions = result?.data || [];

  return (
    <div className="space-y-8">
      {/* Reference 8: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F4F0E6] font-normal">
            Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E93] mt-1 font-mono">
            Every movement, in order.
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

      {/* Reference 8 & 9: Filter bar, Ledger Table, and Delete Modal */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#EAE0D5" />}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}

