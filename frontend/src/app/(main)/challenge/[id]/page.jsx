'use client';
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

const ChallengeDetail = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [showTeams, setShowTeams] = useState(false);
  const [teams, setTeams] = useState([]);
  const [isJoining, setIsJoining] = useState(null);

  // 1. Fetch Challenge Details
  useEffect(() => {
    if (!id) return;
    api.get(`/challenges/${id}`)
      .then((res) => setChallenge(res.data))
      .catch((err) => {
        console.error("❌ Error:", err);
        toast.error("Failed to load challenge details");
      });
  }, [id]);

  // 2. Fetch Available Teams
  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams/getbyuser");
      const availableTeams = res.data.filter((team) => team.members.length < 5);
      setTeams(availableTeams);
      setShowTeams(true);
      if (availableTeams.length === 0) {
        toast.error("No teams available with open slots!");
      }
    } catch (err) {
      toast.error("Error fetching teams");
    }
  };

  // 3. Join Team Logic
  const joinTeam = async (teamId) => {
    setIsJoining(teamId);
    try {
      await api.put(`/teams/join/${teamId}`, {});
      toast.success("Successfully joined the team! 🚀");
      setShowTeams(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error joining team");
    } finally {
      setIsJoining(null);
    }
  };

  if (!challenge)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-8 group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to all challenges
        </Link>

        {/* Challenge Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {challenge.title}
              </h1>
              <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest ${
                challenge.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                challenge.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {challenge.difficulty}
              </span>
            </div>

            <p className="text-lg text-slate-400 leading-relaxed mb-8 border-l-4 border-indigo-500 pl-6">
              {challenge.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <div className="flex items-center text-slate-300">
                  <span className="w-24 font-bold text-indigo-400 uppercase text-xs tracking-wider">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {challenge.tags?.map(tag => (
                      <span key={tag} className="bg-slate-800 px-3 py-1 rounded-md text-sm">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-slate-300">
                  <span className="w-24 font-bold text-indigo-400 uppercase text-xs tracking-wider">Timeline</span>
                  <span className="text-sm font-medium">
                    {new Date(challenge.startDate).toLocaleDateString()} — {new Date(challenge.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Rules & Guidelines</h3>
                <p className="text-sm text-slate-400 italic">
                  {challenge.rules || "Standard hackathon rules apply. Respect the community and build something awesome!"}
                </p>
              </div>
            </div>

            <button
              onClick={fetchTeams}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-2xl transition-all transform hover:-translate-y-1 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
              Participate Now
            </button>
          </div>

          {/* Teams Selection Section */}
          {showTeams && (
            <div className="border-t border-slate-800 bg-slate-900/50 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Select a Team to Join</h3>
                <button onClick={() => setShowTeams(false)} className="text-slate-500 hover:text-white">Close</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teams.length === 0 ? (
                  <div className="col-span-full p-8 text-center bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
                    <p className="text-slate-400 mb-4">No teams are currently looking for members.</p>
                    <Link href="/manage-teams" className="text-indigo-400 font-bold hover:underline">Create your own team +</Link>
                  </div>
                ) : (
                  teams.map((team) => (
                    <div
                      key={team._id}
                      className="flex justify-between items-center bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-all group"
                    >
                      <div>
                        <p className="font-bold text-white text-lg group-hover:text-indigo-400 transition-colors">{team.name}</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">
                          Spots: <span className="text-slate-300 font-bold">{team.members.length} / 5</span>
                        </p>
                      </div>

                      <button
                        onClick={() => joinTeam(team._id)}
                        disabled={isJoining === team._id}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold px-6 py-2 rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                      >
                        {isJoining === team._id ? "Joining..." : "Join Team"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;