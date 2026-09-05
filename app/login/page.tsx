"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
       router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
  <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
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
          Login
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
  Don&apos;t have an account?{" "}
  <Link
    href="/register"
    className="font-semibold text-blue-600 hover:text-blue-700"
  >
    Register
  </Link>
</p>
      </form>

      {message && <p className="mt-4">{message}</p>}
      </div>
    </main>
  );
}