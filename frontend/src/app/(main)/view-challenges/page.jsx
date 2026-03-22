'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const ViewChallenges = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/challenges/getall")
      .then((res) => setChallenges(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">All Challenges</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((ch) => (
          <Link 
            key={ch._id} 
            href={`/challenge/${ch._id}`}
            className="bg-gray-800 shadow-lg rounded-xl p-6 hover:shadow-blue-500/20  border border-gray-700 hover:border-blue-500 transition-all duration-300 block"
          >
            <h3 className="text-2xl font-semibold text-blue-300 mb-2">{ch.title}</h3>
            <p className="text-gray-400 mb-3">{ch.description.slice(0, 80)}...</p>
            <p className="text-sm text-gray-300 mb-2">Difficulty: {ch.difficulty}</p>
            <p className="text-sm text-gray-300">
              {new Date(ch.startDate).toLocaleDateString()} → {new Date(ch.endDate).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ViewChallenges;
