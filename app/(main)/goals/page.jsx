"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const INITIAL_GOALS = [
  {
    id: "g-1",
    title: "Emergency Fund",
    currentAmount: 3250,
    targetAmount: 10000,
    targetDate: "Jun 1, 2027",
    daysOut: 236,
    autoContribution: 200,
  },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [fundingGoal, setFundingGoal] = useState(null);
  const [fundAmount, setFundAmount] = useState("");

  const [formTitle, setFormTitle] = useState("");
  const [formCurrent, setFormCurrent] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formContribution, setFormContribution] = useState("");

  const openNewGoal = () => {
    setEditingGoal(null);
    setFormTitle("");
    setFormCurrent("0");
    setFormTarget("10000");
    setFormContribution("200");
    setIsModalOpen(true);
  };

  const openEdit = (g) => {
    setEditingGoal(g);
    setFormTitle(g.title);
    setFormCurrent(g.currentAmount.toString());
    setFormTarget(g.targetAmount.toString());
    setFormContribution(g.autoContribution.toString());
    setIsModalOpen(true);
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (!formTitle) {
      toast.error("Please enter a goal title");
      return;
    }
    const cur = parseFloat(formCurrent) || 0;
    const tgt = parseFloat(formTarget) || 1000;

    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id
            ? {
                ...g,
                title: formTitle,
                currentAmount: cur,
                targetAmount: tgt,
                autoContribution: parseFloat(formContribution) || 0,
              }
            : g
        )
      );
      toast.success("Capital goal updated");
    } else {
      const newG = {
        id: `g-${Date.now()}`,
        title: formTitle,
        currentAmount: cur,
        targetAmount: tgt,
        targetDate: "Dec 31, 2027",
        daysOut: 400,
        autoContribution: parseFloat(formContribution) || 100,
      };
      setGoals((prev) => [...prev, newG]);
      toast.success("Capital goal established");
    }
    setIsModalOpen(false);
  };

  const handleAddFunds = (e) => {
    e.preventDefault();
    const add = parseFloat(fundAmount);
    if (isNaN(add) || add <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setGoals((prev) =>
      prev.map((g) =>
        g.id === fundingGoal.id
          ? { ...g, currentAmount: g.currentAmount + add }
          : g
      )
    );
    toast.success(`Deposited $${add.toFixed(2)} towards ${fundingGoal.title}`);
    setFundingGoal(null);
    setFundAmount("");
  };

  const handleDelete = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    toast.info("Goal retired");
  };

  return (
    <div className="space-y-8">
      {/* Reference 13: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F4F0E6] font-normal">
            Capital Goals
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E93] mt-1 font-mono">
            Targets worth funding on purpose.
          </p>
        </div>

        <Button
          variant="cream"
          onClick={openNewGoal}
          className="text-xs font-medium h-9 px-4 rounded-md gap-1.5 shadow-sm"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>New goal</span>
        </Button>
      </div>

      {/* Reference 13: Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => {
          const pct = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          );

          return (
            <div
              key={goal.id}
              className="bg-[#121316] border border-[#212226] rounded-xl p-6 shadow-sm space-y-4 hover:border-[#2D2E35] transition-colors"
            >
              {/* Card top */}
              <div className="flex items-start justify-between">
                <div className="font-medium text-base text-[#F4F0E6]">
                  {goal.title}
                </div>
                <span className="text-[10px] font-mono border border-[#2B2C33] text-[#A0A2AA] px-1.5 py-0.5 rounded">
                  {pct}%
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-medium text-[#F4F0E6]">
                  ${goal.currentAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-mono text-[#71727A]">
                  of ${goal.targetAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#18191E] h-1.5 rounded-full overflow-hidden border border-[#26272D]">
                <div
                  className="bg-[#EAE0D5] h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Details metadata */}
              <div className="space-y-1 text-xs font-mono text-[#8E8E93]">
                <div>Target {goal.targetDate} · {goal.daysOut} days out</div>
                <div className="text-[11px] text-[#71727A]">
                  Auto-contribution ${goal.autoContribution}/month
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#1C1D22] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFundingGoal(goal)}
                    className="hover:text-[#F4F0E6] text-[#C6C7CC] transition-colors flex items-center gap-1"
                  >
                    <span>+ Add funds</span>
                  </button>

                  <button
                    onClick={() => openEdit(goal)}
                    className="hover:text-[#F4F0E6] text-[#71727A] transition-colors flex items-center gap-1"
                  >
                    <Pencil size={12} />
                    <span>Edit</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(goal.id)}
                  className="text-[#71727A] hover:text-[#E05A47] transition-colors"
                  title="Remove goal"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-[#131417] border border-[#212226] rounded-xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#F4F0E6]">
                {editingGoal ? "Edit Capital Goal" : "New Capital Goal"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#71727A] hover:text-[#F4F0E6]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#8E8E93] block mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Emergency Fund"
                  className="w-full bg-[#16171B] border border-[#26272D] rounded-lg px-3 py-2 text-sm text-[#F4F0E6] focus:border-[#EAE0D5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#8E8E93] block mb-1">
                  Initial Saved (USD)
                </label>
                <input
                  type="number"
                  value={formCurrent}
                  onChange={(e) => setFormCurrent(e.target.value)}
                  className="w-full bg-[#16171B] border border-[#26272D] rounded-lg px-3 py-2 text-sm font-mono text-[#F4F0E6] focus:border-[#EAE0D5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#8E8E93] block mb-1">
                  Target Amount (USD)
                </label>
                <input
                  type="number"
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  className="w-full bg-[#16171B] border border-[#26272D] rounded-lg px-3 py-2 text-sm font-mono text-[#F4F0E6] focus:border-[#EAE0D5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#8E8E93] block mb-1">
                  Monthly Contribution (USD)
                </label>
                <input
                  type="number"
                  value={formContribution}
                  onChange={(e) => setFormContribution(e.target.value)}
                  className="w-full bg-[#16171B] border border-[#26272D] rounded-lg px-3 py-2 text-sm font-mono text-[#F4F0E6] focus:border-[#EAE0D5] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="dark"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="cream"
                  size="sm"
                  className="h-8 text-xs font-medium"
                >
                  Save Goal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {fundingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setFundingGoal(null)}
          />
          <div className="relative bg-[#131417] border border-[#212226] rounded-xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#F4F0E6]">
                Add Funds: {fundingGoal.title}
              </h3>
              <button
                onClick={() => setFundingGoal(null)}
                className="text-[#71727A] hover:text-[#F4F0E6]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddFunds} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#8E8E93] block mb-1">
                  Contribution Amount (USD)
                </label>
                <input
                  type="number"
                  autoFocus
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="250.00"
                  className="w-full bg-[#16171B] border border-[#26272D] rounded-lg px-3 py-2 text-sm font-mono text-[#F4F0E6] focus:border-[#EAE0D5] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="dark"
                  size="sm"
                  onClick={() => setFundingGoal(null)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="cream"
                  size="sm"
                  className="h-8 text-xs font-medium"
                >
                  Deposit Funds
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
