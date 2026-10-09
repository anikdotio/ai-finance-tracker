import React from "react";
import { Plus } from "lucide-react";
import { getUserAccounts } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { AccountCard } from "@/app/(main)/dashboard/_components/account-card";

export default async function AccountsVaultsPage() {
  const accounts = await getUserAccounts();

  const combinedPosition = accounts.reduce(
    (acc, a) => acc + (parseFloat(a.balance) || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Reference 10: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F4F0E6] font-normal">
            Accounts & Vaults
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E93] mt-1 font-mono">
            Where the money actually lives.
          </p>
        </div>

        <CreateAccountDrawer>
          <Button
            variant="cream"
            className="text-xs font-medium h-9 px-4 rounded-md gap-1.5 shadow-sm"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>Add account</span>
          </Button>
        </CreateAccountDrawer>
      </div>

      {/* Reference 10: Combined Position Banner */}
      <div className="bg-[#121316] border border-[#212226] rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-[11px] font-mono tracking-wider text-[#8E8E93] uppercase">
          Combined Position
        </div>
        <div className="font-mono text-3xl sm:text-4xl font-medium tracking-tight text-[#F4F0E6]">
          ${combinedPosition.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Reference 10: Vaults Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}

