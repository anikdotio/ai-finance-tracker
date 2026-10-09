"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryIcon } from "@/components/category-icon";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { bulkDeleteTransactions } from "@/actions/account";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 15;

export function TransactionTable({ transactions = [], defaultAccountName = "" }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [accountFilter, setAccountFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Deletion modal state (Reference 9)
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Extract unique accounts and categories from transactions
  const uniqueAccounts = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      const name = t.account?.name || defaultAccountName;
      if (name) set.add(name);
    });
    return Array.from(set);
  }, [transactions, defaultAccountName]);

  const uniqueCategories = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [transactions]);

  // Filtering
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesDesc = (t.description || "").toLowerCase().includes(query);
        const matchesCat = (t.category || "").toLowerCase().includes(query);
        if (!matchesDesc && !matchesCat) return false;
      }

      // Account filter
      if (accountFilter !== "ALL") {
        const accName = t.account?.name || defaultAccountName;
        if (accName !== accountFilter) return false;
      }

      // Type filter
      if (typeFilter !== "ALL") {
        if (t.type !== typeFilter) return false;
      }

      // Category filter
      if (categoryFilter !== "ALL") {
        if (t.category !== categoryFilter) return false;
      }

      // Date range filters
      if (startDate) {
        const tDate = new Date(t.date);
        const sDate = new Date(startDate);
        if (tDate < sDate) return false;
      }
      if (endDate) {
        const tDate = new Date(t.date);
        const eDate = new Date(endDate);
        if (tDate > eDate) return false;
      }

      return true;
    });
  }, [
    transactions,
    searchTerm,
    accountFilter,
    typeFilter,
    categoryFilter,
    startDate,
    endDate,
    defaultAccountName,
  ]);

  // Sorting
  const sortedTransactions = useMemo(() => {
    const list = [...filteredTransactions];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") {
        cmp = new Date(a.date) - new Date(b.date);
      } else if (sortField === "amount") {
        cmp = parseFloat(a.amount) - parseFloat(b.amount);
      } else if (sortField === "description") {
        cmp = (a.description || "").localeCompare(b.description || "");
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filteredTransactions, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedTransactions, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await bulkDeleteTransactions([itemToDelete.id]);
      if (res.success) {
        toast.success("Entry removed and account balance restored.");
        setItemToDelete(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete entry");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete entry");
    } finally {
      setDeleteLoading(false);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setAccountFilter("ALL");
    setTypeFilter("ALL");
    setCategoryFilter("ALL");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    accountFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    categoryFilter !== "ALL" ||
    startDate ||
    endDate;

  return (
    <div className="space-y-5">
      {/* Reference 8: Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-[#121316] border border-[#212226] p-3 rounded-xl">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71727A]" />
          <input
            type="text"
            placeholder="Search descriptions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#16171B] border border-[#26272D] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F4F0E6] placeholder:text-[#5C5D63] focus:border-[#EAE0D5] focus:outline-none transition-colors"
          />
        </div>

        {/* All Accounts Dropdown */}
        <Select
          value={accountFilter}
          onValueChange={(val) => {
            setAccountFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[140px] h-8 bg-[#16171B] border-[#26272D] text-xs text-[#C6C7CC] rounded-lg">
            <SelectValue placeholder="All accounts" />
          </SelectTrigger>
          <SelectContent className="bg-[#16171B] border-[#26272D] text-[#F4F0E6] text-xs">
            <SelectItem value="ALL">All accounts</SelectItem>
            {uniqueAccounts.map((acc) => (
              <SelectItem key={acc} value={acc}>
                {acc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* All Types Dropdown */}
        <Select
          value={typeFilter}
          onValueChange={(val) => {
            setTypeFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[110px] h-8 bg-[#16171B] border-[#26272D] text-xs text-[#C6C7CC] rounded-lg">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent className="bg-[#16171B] border-[#26272D] text-[#F4F0E6] text-xs">
            <SelectItem value="ALL">All types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>

        {/* All Categories Dropdown */}
        <Select
          value={categoryFilter}
          onValueChange={(val) => {
            setCategoryFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[130px] h-8 bg-[#16171B] border-[#26272D] text-xs text-[#C6C7CC] rounded-lg">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent className="bg-[#16171B] border-[#26272D] text-[#F4F0E6] text-xs">
            <SelectItem value="ALL">All categories</SelectItem>
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Inputs: dd - mm - dd - mm */}
        <div className="flex items-center gap-1.5 text-xs text-[#71727A] font-mono">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#16171B] border border-[#26272D] text-[#C6C7CC] px-2 py-1 rounded text-xs focus:outline-none"
          />
          <span>—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#16171B] border border-[#26272D] text-[#C6C7CC] px-2 py-1 rounded text-xs focus:outline-none"
          />
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="p-1.5 text-[#8E8E93] hover:text-[#F4F0E6] transition-colors rounded"
            title="Clear filters"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Reference 8: Ledger Data Table */}
      <div className="bg-[#121316] border border-[#212226] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1F2025] text-[#71727A] font-mono uppercase text-[10px] tracking-wider">
                <th
                  onClick={() => handleSort("date")}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F4F0E6] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    {sortField === "date" && (sortDirection === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("description")}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F4F0E6] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Description</span>
                    {sortField === "description" && (sortDirection === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </div>
                </th>
                <th className="py-3.5 px-4">Account</th>
                <th className="py-3.5 px-4">Status</th>
                <th
                  onClick={() => handleSort("amount")}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-[#F4F0E6] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    {sortField === "amount" && (sortDirection === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1B1C20] text-[#F4F0E6]">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#71727A] font-mono">
                    No transactions match current criteria
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((t) => {
                  const isIncome = t.type === "INCOME";
                  const formattedDate = format(new Date(t.date), "yyyy-MM-dd");
                  const accountName = t.account?.name || defaultAccountName || "Everyday Checking";

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-[#16171B]/60 transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-3 px-4 font-mono text-[#8E8E93] text-[11px] whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Description with icon and category subtitle */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded bg-[#18191E] border border-[#26272D] flex items-center justify-center shrink-0">
                            <CategoryIcon category={t.category} className="w-3.5 h-3.5 text-[#8E8E93]" />
                          </div>
                          <div>
                            <div className="font-medium text-[#F4F0E6] group-hover:text-white transition-colors">
                              {t.description || "Untitled Transaction"}
                            </div>
                            <div className="text-[10px] text-[#71727A] font-mono">
                              {t.category || "General"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Account */}
                      <td className="py-3 px-4 text-[#A0A2AA] font-mono text-[11px] whitespace-nowrap">
                        {accountName}
                      </td>

                      {/* Status / Badges */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isIncome ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#48BB78]/10 text-[#48BB78] border border-[#48BB78]/20">
                              INCOME
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E05A47]/10 text-[#E05A47] border border-[#E05A47]/20">
                              EXPENSE
                            </span>
                          )}
                          {t.isRecurring && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-[#2B2C33] text-[#7E8088]">
                              RECURRING
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right font-mono text-xs whitespace-nowrap">
                        <span className={cn("font-medium", isIncome ? "text-[#48BB78]" : "text-[#F4F0E6]")}>
                          {isIncome ? `+$${parseFloat(t.amount).toFixed(2)}` : `-$${parseFloat(t.amount).toFixed(2)}`}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 text-[#71727A]">
                          <Link href={`/transaction/create?edit=${t.id}`}>
                            <button
                              title="Edit entry"
                              className="p-1 hover:text-[#F4F0E6] transition-colors rounded"
                            >
                              <Pencil size={13} />
                            </button>
                          </Link>
                          <button
                            onClick={() => setItemToDelete(t)}
                            title="Remove entry"
                            className="p-1 hover:text-[#E05A47] transition-colors rounded"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1F2025] text-xs font-mono text-[#71727A]">
            <div>
              Showing {sortedTransactions.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedTransactions.length)} of {sortedTransactions.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="dark"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 px-2.5 text-xs"
              >
                <ChevronLeft size={13} className="mr-1" /> Prev
              </Button>
              <span>{currentPage} / {totalPages}</span>
              <Button
                variant="dark"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-7 px-2.5 text-xs"
              >
                Next <ChevronRight size={13} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Reference 9: Modal Dialog - Remove this entry? */}
      <DeleteConfirmationDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Remove this entry?"
        description={
          itemToDelete
            ? `${itemToDelete.description || "Untitled entry"} $${parseFloat(itemToDelete.amount).toFixed(2)} — the account balance will be restored as if it never happened.`
            : ""
        }
        cancelText="Keep it"
        confirmText="Remove"
      />
    </div>
  );
}
