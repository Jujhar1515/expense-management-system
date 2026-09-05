import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center border rounded-lg p-10 max-w-lg w-full">
        <h1 className="text-4xl font-bold">
          Personal Expense Management System
        </h1>

        <p className="mt-4 text-gray-600">
          Track your expenses, manage your monthly budget,
          and understand your spending.
        </p>

        <div className="mt-8 space-x-3">
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="inline-block bg-gray-800 text-white px-6 py-2 rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}