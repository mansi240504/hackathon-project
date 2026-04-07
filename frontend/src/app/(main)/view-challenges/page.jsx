"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import Link from "next/link";
import toast from "react-hot-toast";

const ViewChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/challenges/getall")
      .then((res) => {
        setChallenges(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load challenges");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-slate-400 font-medium animate-pulse">
          Fetching latest challenges...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
              Challenges
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Choose a hackathon challenge, build your team, and show the world
            what you can create.
          </p>
        </header>

        {challenges.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
            <p className="text-slate-500 text-xl font-medium">
              No challenges found at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((ch) => (
              <Link
                key={ch._id}
                href={`/challenge/${ch._id}`}
                className="group relative bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:bg-slate-800/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 block overflow-hidden"
              >
                {/* Difficulty Indicator Top Right */}
                <div className="absolute top-6 right-6">
                  <span
                    className={`text-[10px] uppercase font-black px-2 py-1 rounded-md tracking-tighter ${
                      ch.difficulty === "Easy"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : ch.difficulty === "Medium"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {ch.difficulty}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {ch.title}
                </h3>

                <p className="text-slate-400 mb-6 line-clamp-2 text-sm leading-relaxed">
                  {ch.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Timeline
                  </div>
                  <p className="text-slate-300 text-sm font-medium">
                    {new Date(ch.startDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    —{" "}
                    {new Date(ch.endDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-indigo-400 font-bold text-sm group-hover:translate-x-2 transition-transform inline-flex items-center">
                    View Details
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewChallenges;
