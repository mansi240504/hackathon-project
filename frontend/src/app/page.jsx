'use client';
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* ===== Navbar ===== */}
      {/* <nav className="flex justify-between items-center px-10 py-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-blue-500">Code Clash</h1>
        <div className="space-x-6">
          <Link href="/login" className="hover:text-blue-400">Login</Link>
          <Link href="/register" className="hover:text-blue-400">Register</Link>
        </div>
      </nav> */}

      {/* ===== Hero Section ===== */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h2 className="text-5xl font-extrabold mb-4">
          Compete. Collaborate. Code.
        </h2>
        <p className="text-gray-300 max-w-2xl mb-8">
          Code Clash is a team-based hackathon platform where developers
          create teams, join challenges, submit projects, and compete
          to win exciting rewards.
        </p>

        <div className="space-x-4">
          <Link
            href="/view-challenges"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
          >
            View Challenges
          </Link>

          <Link
            href="/user/manage-team"
            className="border border-blue-500 hover:bg-blue-500 px-6 py-3 rounded-xl font-semibold"
          >
            Create Team
          </Link>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="bg-gray-800 py-16 px-10">
        <h3 className="text-3xl font-bold text-center mb-12">
          Platform Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <h4 className="text-xl font-semibold text-blue-400 mb-2">
              Team Management
            </h4>
            <p className="text-gray-300">
              Create teams, invite members, and collaborate with up to
              five participants.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <h4 className="text-xl font-semibold text-blue-400 mb-2">
              Hackathon Challenges
            </h4>
            <p className="text-gray-300">
              Explore live challenges with timelines, rules, and
              difficulty levels.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <h4 className="text-xl font-semibold text-blue-400 mb-2">
              Submission & Evaluation
            </h4>
            <p className="text-gray-300">
              Submit project links and get evaluated based on performance
              and innovation.
            </p>
          </div>

        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-gray-900 text-center py-6 text-gray-400">
        © 2025 Code Clash | Hackathon & Challenge Platform
      </footer>

    </div>
  );
}

