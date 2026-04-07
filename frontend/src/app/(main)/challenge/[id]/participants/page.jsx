"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/api"; // ✅ Production standard api instance
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ParticipantsPage = () => {
  const { id } = useParams(); // challenge id
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);

  // 1. Fetch available teams
  useEffect(() => {
    const fetchAvailableTeams = async () => {
      try {
        const res = await api.get("/teams/getbyuser");
        // ✅ Only teams with less than 5 members
        const availableTeams = res.data.filter((t) => t.members.length < 5);
        setTeams(availableTeams);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load teams");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTeams();
  }, []);

  // 2. Join team & Register participation
  const handleJoinTeam = async (teamId) => {
    setJoiningId(teamId);
    try {
      // Step A: Join the team
      await api.put(`/teams/join/${teamId}`, {});

      // Step B: Save participation in the hackathon
      await api.post("/participants/add", {
        team: teamId,
        hackathon: id,
      });

      toast.success("Successfully joined and registered! 🚀");

      setTimeout(() => router.push(`/challenge/${id}`), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Join failed. Try again.");
      console.error(err);
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Select Your <span className="text-indigo-400">Team</span>
          </h2>
          <p className="text-slate-400">
            Choose one of your existing teams to participate in this challenge.
            Remember, a team can have maximum 5 members.
          </p>
        </header>

        {teams.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
            <p className="text-slate-500 text-lg mb-6">
              No available teams found (all are full or none created).
            </p>
            <button
              onClick={() => router.push("/manage-teams")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              Create a New Team
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500/50 transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400">
                      {team.name}
                    </h3>
                    <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-2 py-1 rounded uppercase">
                      Active
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                    {team.description || "No team description provided."}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-t border-slate-800 pt-4">
                    <span className="text-slate-400">Members</span>
                    <span className="text-white font-bold">
                      {team.members.length} / 5
                    </span>
                  </div>

                  {/* Progress bar for members */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-500"
                      style={{ width: `${(team.members.length / 5) * 100}%` }}
                    ></div>
                  </div>

                  <button
                    onClick={() => handleJoinTeam(team._id)}
                    disabled={joiningId !== null}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      joiningId === team._id
                        ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                    }`}
                  >
                    {joiningId === team._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        Registering...
                      </>
                    ) : (
                      "Join with this Team"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-white text-sm font-medium transition-colors"
          >
            ← Cancel and go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPage;
