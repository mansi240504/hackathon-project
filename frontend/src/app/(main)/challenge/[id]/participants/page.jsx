'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

const ParticipantsPage = () => {
  const { id } = useParams(); // challenge id
  const [teams, setTeams] = useState([]);
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  // 🔹 fetch user's teams
  useEffect(() => {
    if (!token) return;

    axios.get("http://localhost:4000/teams/getbyuser", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // ✅ only teams with less than 5 members
      const availableTeams = res.data.filter(t => t.members.length < 5);
      setTeams(availableTeams);
    })
    .catch(err => console.log(err));
  }, []);

  // 🔹 join team
  const handleJoinTeam = async (teamId) => {
    try {
      await axios.put(
        `http://localhost:4000/teams/join/${teamId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // save participation
      await axios.post("http://localhost:4000/participants/add", {
        team: teamId,
        hackathon: id
      });

      toast.success("Successfully joined team!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Join failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Choose a Team to Participate
      </h2>

      {teams.length === 0 && (
        <p className="text-center text-gray-400">
          No available teams (all teams are full)
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {teams.map(team => (
          <div key={team._id} className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-xl font-semibold">{team.name}</h3>
            <p className="text-gray-400 mb-2">
              Members: {team.members.length}/5
            </p>

            <button
              onClick={() => handleJoinTeam(team._id)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full"
            >
              Join Team
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsPage;
