"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    // Filter transactions within date range
    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    // Group transactions by date
    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  // Calculate totals for the selected period
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1E1F24]">
        <div>
          <h3 className="font-serif text-lg text-[#F4F0E6]">
            Movement Analysis
          </h3>
          <p className="text-xs text-[#8E8E93] font-mono">
            Calibrated daily inflow vs outflow
          </p>
        </div>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] h-8 bg-[#16171B] border-[#26272D] text-xs text-[#C6C7CC] rounded-lg">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="bg-[#16171B] border-[#26272D] text-[#F4F0E6] text-xs">
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-[#16171B] border border-[#212226]">
          <p className="text-[10px] font-mono uppercase text-[#71727A]">Total Inflow</p>
          <p className="text-base sm:text-lg font-mono font-medium text-[#48BB78]">
            +${totals.income.toFixed(2)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-[#16171B] border border-[#212226]">
          <p className="text-[10px] font-mono uppercase text-[#71727A]">Total Outflow</p>
          <p className="text-base sm:text-lg font-mono font-medium text-[#E05A47]">
            -${totals.expense.toFixed(2)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-[#16171B] border border-[#212226]">
          <p className="text-[10px] font-mono uppercase text-[#71727A]">Net Balance</p>
          <p
            className={`text-base sm:text-lg font-mono font-medium ${
              totals.income - totals.expense >= 0
                ? "text-[#48BB78]"
                : "text-[#E05A47]"
            }`}
          >
            {totals.income - totals.expense >= 0 ? "+" : ""}${(totals.income - totals.expense).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="h-[260px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2025" />
            <XAxis
              dataKey="date"
              fontSize={11}
              stroke="#5C5D63"
              tickLine={false}
              axisLine={{ stroke: "#212226" }}
            />
            <YAxis
              fontSize={11}
              stroke="#5C5D63"
              tickLine={false}
              axisLine={{ stroke: "#212226" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value) => [`$${value.toFixed(2)}`, undefined]}
              contentStyle={{
                backgroundColor: "#16171B",
                border: "1px solid #2B2C33",
                borderRadius: "8px",
                color: "#F4F0E6",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="income"
              name="Inflow"
              fill="#48BB78"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="expense"
              name="Outflow"
              fill="#E05A47"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
