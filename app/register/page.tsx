"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");

  try {
    const checkResponse = await fetch("/api/check-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const checkData = await checkResponse.json();

    if (!checkResponse.ok) {
      setMessage("Unable to check email. Please try again.");
      return;
    }

    if (checkData.exists) {
      setMessage("This email is already in use. Please login instead.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Registration successful. Please check your email.");
    }
  } catch (error) {
    console.error(error);
    setMessage("Something went wrong. Please try again.");
  }
};
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
  <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
      <h1 className="text-3xl font-bold mb-6">Create Account</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
           className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          Create Account
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
  Already have an account?{" "}
  <Link
    href="/login"
    className="font-semibold text-blue-600 hover:text-blue-700"
  >
    Login
  </Link>
</p>
      </form>

      {message && <p className="mt-4">{message}</p>}
      </div>
    </main>
  );
}