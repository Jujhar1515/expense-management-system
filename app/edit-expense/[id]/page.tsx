"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadExpense = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("expenses")
        .select("amount, category, description, expense_date")
        .eq("id", id)
        .single();

      if (error) {
        setMessage(error.message);
        return;
      }

      setAmount(String(data.amount));
      setCategory(data.category);
      setDescription(data.description);
      setExpenseDate(data.expense_date);
    };

    if (id) {
      loadExpense();
    }
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("expenses")
      .update({
        amount: Number(amount),
        category,
        description,
        expense_date: expenseDate,
      })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="p-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Expense</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 w-full"
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
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Expense Date</label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}