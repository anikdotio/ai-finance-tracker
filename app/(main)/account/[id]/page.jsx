import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarLoader } from "react-spinners";
import { Plus } from "lucide-react";
import { getAccountWithTransactions } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { TransactionTable } from "../_components/transaction-table";
import { AccountChart } from "../_components/account-chart";

export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F4F0E6] capitalize font-normal">
            {account.name}
          </h1>
          <p className="text-xs text-[#8E8E93] font-mono mt-1">
            {account.type.toLowerCase()} account · {account._count.transactions} recorded entries
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-mono font-medium text-[#F4F0E6]">
              ${parseFloat(account.balance).toFixed(2)}
            </div>
            <div className="text-[10px] font-mono text-[#71727A] uppercase">
              Current balance
            </div>
          </div>

          <Link href={`/transaction/create?accountId=${account.id}`}>
            <Button
              variant="cream"
              size="sm"
              className="text-xs font-medium h-9 px-3.5 gap-1.5 shadow-sm"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>New entry</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Account Chart Section */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#EAE0D5" />}
      >
        <div className="bg-[#121316] border border-[#212226] rounded-xl p-5 shadow-sm">
          <AccountChart transactions={transactions} />
        </div>
      </Suspense>

      {/* Transactions Table Section (Reference 8 & 9) */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#EAE0D5" />}
      >
        <TransactionTable
          transactions={transactions}
          defaultAccountName={account.name}
        />
      </Suspense>
    </div>
  );
}
