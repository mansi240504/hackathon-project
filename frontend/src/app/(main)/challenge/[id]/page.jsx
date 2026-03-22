'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation"; // ✅ import this hook

const ChallengeDetail = () => {
  const { id } = useParams(); // ✅ get dynamic id from URL
  const [challenge, setChallenge] = useState(null);
  const [showTeams, setShowTeams] = useState(false);
  const [teams, setTeams] = useState([]);


  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:4000/challenges/${id}`)
      .then((res) => setChallenge(res.data))
      .catch((err) => console.error("❌ Error fetching challenge:", err));
  }, [id]);
  const fetchTeams = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:4000/teams/getbyuser",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // sirf wahi teams jisme member < 5
    const availableTeams = res.data.filter(
      (team) => team.members.length < 5
    );

    setTeams(availableTeams);
    setShowTeams(true);
  } catch (err) {
    console.log(err);
  }
};

     const joinTeam = async (teamId) => {
      try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:4000/teams/join/${teamId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert("Joined team successfully");
    setShowTeams(false);
  } catch (err) {
    alert(err.response?.data?.message || "Error joining team");
  }
};



  if (!challenge)
    return <div className="text-center text-white mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Link href="/" className="text-blue-400 underline">
        ← Back to all challenges
      </Link>

      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8 mt-6">
        <h1 className="text-4xl font-bold mb-4">{challenge.title}</h1>
        <p className="text-gray-300 mb-4">{challenge.description}</p>

        <p>
          <strong className="text-blue-400">Difficulty:</strong>{" "}
          {challenge.difficulty}
        </p>
        <p>
          <strong className="text-blue-400">Tags:</strong>{" "}
          {challenge.tags?.join(", ")}
        </p>
        <p>
          <strong className="text-blue-400">Timeline:</strong>{" "}
          {new Date(challenge.startDate).toLocaleDateString()} →{" "}
          {new Date(challenge.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong className="text-blue-400">Rules:</strong>{" "}
          {challenge.rules || "No specific rules provided."}
        </p>
         <button
            onClick={() => fetchTeams()}
             className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl mt-4"
             >
            Participate
  </button>
{showTeams && (
  <div className="mt-6 bg-gray-700 p-4 rounded-xl">
    <h3 className="text-xl font-semibold mb-3">
      Available Teams
    </h3>

    {teams.length === 0 ? (
      <p className="text-gray-300">
        No teams available. Create a team first.
      </p>
    ) : (
      teams.map((team) => (
        <div
          key={team._id}
          className="flex justify-between items-center bg-gray-800 p-3 rounded mb-2"
        >
          <div>
            <p className="font-semibold">{team.name}</p>
            <p className="text-sm text-gray-400">
              Members: {team.members.length}/5
            </p>
          </div>

          <button
            onClick={() => joinTeam(team._id)}
            className="bg-green-600 px-3 py-1 rounded"
          >
            Join
          </button>
        </div>
      ))
    )}
  </div>
)}



        
      </div>
    </div>
  );
};

export default ChallengeDetail;
