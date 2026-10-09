"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const INITIAL_CATEGORIES = [
  { name: "Dining", type: "EXPENSE" },
  { name: "Education", type: "EXPENSE" },
  { name: "Entertainment", type: "EXPENSE" },
  { name: "Groceries", type: "EXPENSE" },
  { name: "Health", type: "EXPENSE" },
  { name: "Housing", type: "EXPENSE" },
  { name: "Other", type: "EXPENSE" },
  { name: "Shopping", type: "EXPENSE" },
  { name: "Subscriptions", type: "EXPENSE" },
  { name: "Transport", type: "EXPENSE" },
  { name: "Travel", type: "EXPENSE" },
  { name: "Utilities", type: "EXPENSE" },
  { name: "Freelance", type: "INCOME" },
  { name: "Gift", type: "INCOME" },
  { name: "Investment", type: "INCOME" },
  { name: "Salary", type: "INCOME" },
];

export function PreferencesClient({ transactions = [] }) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'categories' | 'export'

  // Profile & Currency state
  const [name, setName] = useState(user?.fullName || "Demo");
  const [currency, setCurrency] = useState("USD");
  const userEmail = user?.primaryEmailAddress?.emailAddress || "demo@ledger.app";

  // Categories state
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState("expense");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success("Preferences updated successfully");
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    const exists = categories.some(
      (c) => c.name.toLowerCase() === newCatName.trim().toLowerCase()
    );
    if (exists) {
      toast.error("Category already exists");
      return;
    }
    setCategories((prev) => [
      ...prev,
      {
        name: newCatName.trim(),
        type: newCatType.toUpperCase(),
      },
    ]);
    setNewCatName("");
    toast.success(`Category "${newCatName.trim()}" added to pickers`);
  };

  const handleDeleteCategory = (catName) => {
    setCategories((prev) => prev.filter((c) => c.name !== catName));
    toast.info(`Category "${catName}" retired from pickers`);
  };

  // CSV Export
  const downloadCSV = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const headers = ["Date", "Type", "Account", "Category", "Description", "Amount"];
    const rows = transactions.map((t) => [
      t.date ? new Date(t.date).toISOString().split("T")[0] : "",
      t.type || "",
      `"${(t.account?.name || "").replace(/"/g, '""')}"`,
      `"${(t.category || "").replace(/"/g, '""')}"`,
      `"${(t.description || "").replace(/"/g, '""')}"`,
      t.amount || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ledger_transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded");
  };

  // JSON Export
  const downloadJSON = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(transactions, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `ledger_transactions_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("JSON archive downloaded");
  };

  return (
    <div className="space-y-8">
      {/* Header (References 11, 14, 16, 17) */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F4F0E6] font-normal">
          Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#8E8E93] font-mono">
          How the ledger behaves, speaks and exports.
        </p>
      </div>

      {/* Segmented Tabs Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#121316] border border-[#212226] rounded-lg max-w-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={cn(
            "px-3.5 py-1.5 rounded text-xs font-mono transition-colors",
            activeTab === "profile"
              ? "bg-[#1E1F24] text-[#F4F0E6] font-medium"
              : "text-[#71727A] hover:text-[#C6C7CC]"
          )}
        >
          Profile & Currency
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={cn(
            "px-3.5 py-1.5 rounded text-xs font-mono transition-colors",
            activeTab === "categories"
              ? "bg-[#1E1F24] text-[#F4F0E6] font-medium"
              : "text-[#71727A] hover:text-[#C6C7CC]"
          )}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={cn(
            "px-3.5 py-1.5 rounded text-xs font-mono transition-colors",
            activeTab === "export"
              ? "bg-[#1E1F24] text-[#F4F0E6] font-medium"
              : "text-[#71727A] hover:text-[#C6C7CC]"
          )}
        >
          Data Export
        </button>
      </div>

      {/* Tab 1: Profile & Currency (References 11 & 14) */}
      {activeTab === "profile" && (
        <div className="bg-[#121316] border border-[#212226] rounded-xl p-6 sm:p-8 max-w-lg shadow-sm space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#8E8E93] block">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#16171B] border border-[#26272D] rounded-lg px-3.5 py-2 text-sm text-[#F4F0E6] focus:border-[#EAE0D5] focus:outline-none transition-colors"
              />
              <p className="text-[11px] font-mono text-[#71727A]">
                Signed in as {userEmail}
              </p>
            </div>

            {/* Currency Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#8E8E93] block">
                Default Currency
              </label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full h-10 bg-[#16171B] border-[#26272D] text-sm text-[#F4F0E6] rounded-lg">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-[#16171B] border-[#26272D] text-[#F4F0E6] text-xs">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] font-mono text-[#71727A]">
                Used for headline figures: each vault keeps its own currency.
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="cream"
                size="sm"
                className="h-9 px-4 text-xs font-medium rounded-md shadow-sm"
              >
                Save changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Categories (Reference 17) */}
      {activeTab === "categories" && (
        <div className="bg-[#121316] border border-[#212226] rounded-xl p-6 sm:p-8 max-w-2xl shadow-sm space-y-6">
          {/* Add Category Form */}
          <form
            onSubmit={handleAddCategory}
            className="flex flex-wrap sm:flex-nowrap items-center gap-3"
          >
            <input
              type="text"
              placeholder="New category name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 bg-[#16171B] border border-[#26272D] rounded-lg px-3.5 py-2 text-sm text-[#F4F0E6] placeholder:text-[#5C5D63] focus:border-[#EAE0D5] focus:outline-none"
            />

            <Select value={newCatType} onValueChange={setNewCatType}>
              <SelectTrigger className="w-[120px] h-10 bg-[#16171B] border-[#26272D] text-xs text-[#C6C7CC] rounded-lg">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#16171B] border-[#26272D] text-[#F4F0E6] text-xs">
                <SelectItem value="expense">expense</SelectItem>
                <SelectItem value="income">income</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              variant="cream"
              size="sm"
              className="h-10 px-4 text-xs font-medium rounded-lg shrink-0 gap-1"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Add</span>
            </Button>
          </form>

          {/* Categories Grid (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-2">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between py-2 border-b border-[#1C1D22] text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-[#F4F0E6]">{cat.name}</span>
                  <span
                    className={cn(
                      "text-[9px] font-mono px-1.5 py-0.5 rounded uppercase border",
                      cat.type === "INCOME"
                        ? "bg-[#48BB78]/10 text-[#48BB78] border-[#48BB78]/25"
                        : "bg-[#E05A47]/10 text-[#E05A47] border-[#E05A47]/25"
                    )}
                  >
                    {cat.type}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.name)}
                  className="text-[#71727A] hover:text-[#E05A47] p-1 transition-colors rounded"
                  title="Retire category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Explanatory note */}
          <div className="pt-3 text-[11px] font-mono text-[#71727A] border-t border-[#1C1D22]">
            Entries already recorded keep their category name — removing one only retires it from pickers.
          </div>
        </div>
      )}

      {/* Tab 3: Data Export (Reference 16) */}
      {activeTab === "export" && (
        <div className="bg-[#121316] border border-[#212226] rounded-xl p-6 sm:p-8 max-w-2xl shadow-sm space-y-5">
          <div className="space-y-1">
            <div className="text-[10px] font-mono tracking-wider text-[#8E8E93] uppercase">
              Transactions Archive
            </div>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
              Every recorded entry — date, type, account, category, description, amount — in the format your accountant prefers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Button
              type="button"
              variant="cream"
              onClick={downloadCSV}
              className="h-9 px-4 text-xs font-medium rounded-md gap-2 shadow-sm"
            >
              <Download size={14} />
              <span>Download CSV</span>
            </Button>

            <Button
              type="button"
              variant="dark"
              onClick={downloadJSON}
              className="h-9 px-4 text-xs font-medium rounded-md gap-2"
            >
              <Download size={14} />
              <span>Download JSON</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
