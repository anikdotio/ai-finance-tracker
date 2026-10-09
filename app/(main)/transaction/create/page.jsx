import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F4F0E6] font-normal">
          {editId ? "Edit Ledger Entry" : "Record Movement"}
        </h1>
        <p className="text-xs sm:text-sm text-[#8E8E93] font-mono">
          {editId
            ? "Adjust the recorded details of this transaction."
            : "Enter details manually or scan a paper receipt to parse and reconcile."}
        </p>
      </div>

      <div className="bg-[#121316] border border-[#212226] rounded-xl p-6 sm:p-8 shadow-sm">
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
