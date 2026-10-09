"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { updateDefaultAccount } from "@/actions/account";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleMakeDefault = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDefault) {
      toast.info("This is already your primary vault");
      return;
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default vault updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default vault");
    }
  }, [error]);

  return (
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
              onClick={handleMakeDefault}
              disabled={updateDefaultLoading}
              className="hover:text-[#F4F0E6] transition-colors text-[11px] text-[#71727A]"
            >
              Make default
            </button>
          )}
        </div>

        <Link
          href={`/account/${id}`}
          className="text-[#71727A] hover:text-[#F4F0E6] transition-colors"
          title="View ledger"
        >
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
