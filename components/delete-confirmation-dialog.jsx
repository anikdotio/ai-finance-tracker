"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Remove this entry?",
  description,
  confirmText = "Remove",
  cancelText = "Keep it",
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card (Reference 9) */}
      <div className="relative bg-[#131417] border border-[#212226] rounded-xl p-6 sm:p-7 max-w-md w-full shadow-2xl z-10 space-y-5 animate-in fade-in-0 zoom-in-95">
        <div className="flex items-start justify-between">
          <h3 className="font-serif text-2xl font-normal text-[#F4F0E6]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-[#71727A] hover:text-[#F4F0E6] transition-colors p-1 -mr-1"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button
            type="button"
            variant="dark"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="h-9 px-4 text-xs font-medium"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive-ledger"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="h-9 px-4 text-xs font-medium"
          >
            {loading ? "Removing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

