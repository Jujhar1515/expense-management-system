import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center bg-white border border-slate-200 rounded-2xl shadow-sm p-12 max-w-2xl w-full">
        <p className="text-sm font-semibold text-blue-600 mb-3">
  SMARTER SPENDING STARTS HERE
</p>

<h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
  Personal Expense
  <br />
  Management System
</h1>

        <p className="mt-5 text-lg text-slate-500 max-w-lg mx-auto">
  Track your expenses, manage your monthly budget,
  and understand your spending in one simple place.
</p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
  <Link
    href="/login"
    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition"
  >
    Login
  </Link>

  <Link
    href="/register"
    className="bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
  >
    Create Account
  </Link>
</div>
      </div>
    </main>
  );
}