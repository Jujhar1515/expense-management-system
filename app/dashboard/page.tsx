"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Expense = {
  id: number;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email ?? "");

      const { data, error } = await supabase
        .from("expenses")
        .select("id, amount, category, description, expense_date")
        .eq("user_id", user.id)
        .order("expense_date", { ascending: false });

      if (error) {
        console.error("Error loading expenses:", error.message);
      } else {
        setExpenses(data ?? []);
      }
      const { data: budgetData, error: budgetError } = await supabase
        .from("budget")
        .select("amount")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

       if (budgetError) {
            console.error("Error loading budget:", budgetError.message);
     } else if (budgetData) {
        setBudget(Number(budgetData.amount));
}

      setLoading(false);
    };

    loadDashboard();
  }, [router]);
  const handleDelete = async (id: number) => {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting expense:", error.message);
    return;
  }

  setExpenses((currentExpenses) =>
    currentExpenses.filter((expense) => expense.id !== id)
  );
};
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const totalSpending = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
  const remainingBudget = budget - totalSpending;
  const isOverBudget = remainingBudget < 0;

  const budgetPercentage =
  budget > 0 ? Math.min((totalSpending / budget) * 100, 100) : 0;

  const categoryTotals = expenses.reduce(
  (totals: Record<string, number>, expense) => {
    totals[expense.category] =
      (totals[expense.category] || 0) + Number(expense.amount);

    return totals;
  },
  {}
);

const chartData = Object.entries(categoryTotals).map(
  ([category, amount]) => ({
    category,
    amount,
  })
);
const budgetChartData = [
  {
    name: "Budget",
    amount: budget,
    fill: "#16a34a",
  },
  {
    name: "Spent",
    amount: totalSpending,
    fill: "#dc2626",
  },
];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 max-w-7xl mx-auto">
<div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <div>
    <p className="text-sm font-semibold text-blue-600">
      Personal Expense Management
    </p>

    <h1 className="text-4xl font-bold text-slate-900 mt-1">
      Expense Dashboard
    </h1>

    <p className="mt-2 text-slate-500">
      Track your spending and manage your monthly budget.
    </p>

    <p className="mt-1 text-sm text-slate-400">
      Logged in as: {email}
    </p>
  </div>

  <button
    onClick={handleLogout}
    className="bg-slate-900 text-white px-5 py-3 rounded-xl font-medium hover:bg-slate-700 transition"
  >
    Logout
  </button>
</div>

<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
    <p className="text-sm font-medium text-slate-500">
      Monthly Budget
    </p>

    <p className="text-3xl font-bold text-slate-900 mt-2">
      ${budget.toFixed(2)}
    </p>

    <p className="text-sm text-slate-400 mt-2">
      Your spending limit
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
    <p className="text-sm font-medium text-slate-500">
      Total Spending
    </p>

    <p className="text-3xl font-bold text-blue-600 mt-2">
      ${totalSpending.toFixed(2)}
    </p>

    <p className="text-sm text-slate-400 mt-2">
      Amount spent this period
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
    <p className="text-sm font-medium text-slate-500">
      Remaining
    </p>

    <p
      className={`text-3xl font-bold mt-2 ${
        isOverBudget ? "text-red-600" : "text-green-600"
      }`}
    >
      ${remainingBudget.toFixed(2)}
    </p>

    <p className="text-sm text-slate-400 mt-2">
      Available to spend
    </p>
  </div>

</div>
<div className="mt-6">
  <div className="flex justify-between mb-2">
    <p className="font-semibold">Budget Used</p>
    <p>{budgetPercentage.toFixed(1)}%</p>
  </div>

  <div className="w-full bg-gray-200 rounded-full h-4">
    <div
      className="bg-blue-600 h-4 rounded-full"
      style={{ width: `${budgetPercentage}%` }}
    ></div>
  </div>
</div>
{isOverBudget && (
  <p className="mt-4 text-red-600 font-semibold">
    You are over your monthly budget.
  </p>
)}
<div className="mt-6 flex flex-wrap gap-3">
  <Link
    href="/add-expense"
    className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition"
  >
    <span className="text-lg">+</span>
    Add Expense
  </Link>

  <Link
    href="/set-budget"
    className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-3 rounded-xl font-semibold shadow-sm hover:bg-slate-50 hover:shadow-md transition"
  >
    Set Budget
  </Link>
</div>
      <div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
  <h2 className="text-2xl font-bold mb-4">
    Spending by Category
  </h2>

  {chartData.length === 0 ? (
    <p>No expense data available for chart.</p>
  ) : (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar
          dataKey="amount"
         fill="#2563eb"
         radius={[8, 8, 0, 0]}
              />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )}
</div>
<div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
  <h2 className="text-2xl font-bold mb-4">
    Budget vs Spending
  </h2>

  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={budgetChartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
       dataKey="amount"
       radius={[8, 8, 0, 0]}
    >
     {budgetChartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.fill} />
     ))}
      </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>

        {loading ? (
          <p>Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition"
              >
                <div>
                  <p className="text-lg font-bold text-slate-800">
                  {expense.category}
                  </p>
                  <p className="text-slate-600">
                  {expense.description}
                  </p>
                  <p className="text-sm text-slate-400">
                   {expense.expense_date}
                  </p>
            <div className="text-right">
  <p className="text-2xl font-bold text-blue-600">
  ${Number(expense.amount).toFixed(2)}
</p>

<div className="mt-3 flex justify-end gap-2">
  <Link
    href={`/edit-expense/${expense.id}`}
    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
  >
    Edit
  </Link>

  <button
    onClick={() => handleDelete(expense.id)}
    className="px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition"
  >
    Delete
  </button>
</div>
</div>
</div>
              </div>
            ))}
          </div>
        )}
      </div>
      

      
    </main>
  );
}