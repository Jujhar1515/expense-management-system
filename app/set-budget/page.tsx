"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SetBudgetPage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
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

    const { error } = await supabase.from("budget").insert({
      user_id: user.id,
      amount: Number(amount),
      month,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Budget saved successfully!");
    setAmount("");
    setMonth("");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
  <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
      <h1 className="text-3xl font-bold mb-6">Set Monthly Budget</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Budget Amount ($)</label>
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
          <label className="block mb-1">Month</label>
          <input
            type="date"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          Save Budget
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