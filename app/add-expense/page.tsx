"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AddExpensePage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      amount: Number(amount),
      category,
      description,
      expense_date: expenseDate,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Expense added successfully!");
      setAmount("");
      setCategory("");
      setDescription("");
      setExpenseDate("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
     <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
      <h1 className="text-3xl font-bold mb-6">Add Expense</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          >
            <option value="">Select category</option>
            <option value="Groceries">Groceries</option>
            <option value="Transport">Transport</option>
            <option value="Rent">Rent</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Study">Study</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Description</label>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Expense Date</label>

          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

       <button
         type="submit"
         className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm"
        >
         + Add Expense
      </button>

<Link
  href="/dashboard"
  className="block w-full text-center mt-3 border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
>
  ← Back to Dashboard
</Link>
      </form>

      {message && <p className="mt-4">{message}</p>}
        </div>
    </main>
  );
}