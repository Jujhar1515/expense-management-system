"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
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
  },
  {
    name: "Spent",
    amount: totalSpending,
  },
];

  return (
    <main className="p-10 max-w-5xl mx-auto">
<div className="mb-8">
  <h1 className="text-4xl font-bold">Expense Dashboard</h1>

  <p className="mt-2 text-gray-600">
    Track your spending and manage your monthly budget.
  </p>

  <p className="mt-1 text-sm text-gray-500">
    Logged in as: {email}
  </p>
</div>

<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="border rounded p-6">
    <h2 className="text-xl font-semibold">Monthly Budget</h2>
    <p className="text-3xl font-bold mt-2">
      ${budget.toFixed(2)}
    </p>
  </div>

  <div className="border rounded p-6">
    <h2 className="text-xl font-semibold">Total Spending</h2>
    <p className="text-3xl font-bold mt-2">
      ${totalSpending.toFixed(2)}
    </p>
  </div>

  <div className="border rounded p-6">
    <h2 className="text-xl font-semibold">Remaining</h2>
    <p className="text-3xl font-bold mt-2">
      ${remainingBudget.toFixed(2)}
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
      <div className="mt-6">
        <Link
          href="/add-expense"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Expense
        </Link>
        <Link
        href="/set-budget"
        className="inline-block ml-3 bg-green-600 text-white px-4 py-2 rounded"
        >
            Set Budget
        </Link>
      </div>
      <div className="mt-10 border rounded p-6">
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
          <Bar dataKey="amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )}
</div>
<div className="mt-10 border rounded p-6">
  <h2 className="text-2xl font-bold mb-4">
    Budget vs Spending
  </h2>

  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={budgetChartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" />
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
                className="border rounded p-4 flex justify-between"
              >
                <div>
                  <p className="font-semibold">{expense.category}</p>
                  <p>{expense.description}</p>
                  <p className="text-sm">
                    {expense.expense_date}
                  </p>
            <div className="text-right">
  <p className="font-bold">
    ${Number(expense.amount).toFixed(2)}
  </p>

  <div className="mt-2 space-x-2">
    <Link
      href={`/edit-expense/${expense.id}`}
      className="bg-yellow-500 text-white px-3 py-1 rounded"
    >
      Edit
    </Link>

    <button
      onClick={() => handleDelete(expense.id)}
      className="bg-red-600 text-white px-3 py-1 rounded"
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
      

      <button
        onClick={handleLogout}
        className="mt-10 bg-black text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </main>
  );
}