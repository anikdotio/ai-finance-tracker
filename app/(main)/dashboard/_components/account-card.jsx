"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { updateDefaultAccount, deleteAccount } from "@/actions/account";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error: updateError,
  } = useFetch(updateDefaultAccount);

  const {
    loading: deleteLoading,
    fn: deleteAccountFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteAccount);

  const handleMakeDefault = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDefault) {
      toast.info("This is already your primary vault");
      return;
    }

    await updateDefaultFn(id);
  };

  const handleConfirmDelete = async () => {
    await deleteAccountFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default vault updated successfully");
      router.refresh();
    }
  }, [updatedAccount, router]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError.message || "Failed to update default vault");
    }
  }, [updateError]);

  useEffect(() => {
    if (deleteResult?.success) {
      toast.success(`Vault "${name}" removed successfully`);
      setIsDeleteDialogOpen(false);
      router.refresh();
    }
  }, [deleteResult, name, router]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError.message || "Failed to remove vault");
    }
  }, [deleteError]);

  return (
    <>
      <div className="bg-[#121316] border border-[#212226] rounded-xl p-6 shadow-sm hover:border-[#2D2E35] transition-all space-y-5 group">
        {/* Top row: Title, Type & USD Badge (Reference 10) */}
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/account/${id}`}
              className="font-medium text-base text-[#F4F0E6] hover:text-white transition-colors block"
            >
              {name}
            </Link>
            <div className="text-[10px] font-mono text-[#71727A] uppercase mt-0.5">
              {type} {isDefault ? "· PRIMARY VAULT" : ""}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDefault && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#C29B38]/15 text-[#C29B38] border border-[#C29B38]/30">
                DEFAULT
              </span>
            )}
            <span className="text-[10px] font-mono border border-[#2B2C33] text-[#71727A] px-1.5 py-0.5 rounded">
              USD
            </span>
          </div>
        </div>

        {/* Balance (Reference 10) */}
        <div>
          <div className="font-mono text-3xl font-medium tracking-tight text-[#F4F0E6]">
            ${parseFloat(balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Bottom Action Links (Reference 10) */}
        <div className="pt-3 border-t border-[#1C1D22] flex items-center justify-between text-xs font-mono text-[#8E8E93]">
          <div className="flex items-center gap-3">
            <Link
              href={`/transaction/create?accountId=${id}`}
              className="hover:text-[#F4F0E6] transition-colors flex items-center gap-1 text-[11px]"
            >
              <span>+ New entry</span>
            </Link>

            {!isDefault && (
              <button
                type="button"
                onClick={handleMakeDefault}
                disabled={updateDefaultLoading}
                className="hover:text-[#F4F0E6] transition-colors text-[11px] text-[#71727A]"
              >
                Make default
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-[#71727A]">
            <Link
              href={`/account/${id}`}
              className="hover:text-[#F4F0E6] transition-colors p-1 rounded"
              title="View ledger"
            >
              <ArrowRight size={14} />
            </Link>

            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="hover:text-[#E05A47] transition-colors p-1 rounded"
              title="Remove vault"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal (Reference 9 style) */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Remove this vault?"
        description={`"${name}" ($${parseFloat(balance).toFixed(2)}) — all recorded transactions associated with this vault will also be deleted.`}
        cancelText="Keep it"
        confirmText="Remove"
      />
    </>
  );
}
