"use client";
import api from "@/utils/api";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageTeam = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await api.get("/teams/getbyuser");
        setTeams(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Could not load teams");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  // 2. Create Team
  const handleCreateTeam = async () => {
    if (!teamName) return toast.error("Enter team name");
    try {
      const res = await api.post("/teams/add", { name: teamName, description });
      setTeams([...teams, res.data]);
      setTeamName("");
      setDescription("");
      toast.success("Team created successfully! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating team");
    }
  };

  // 3. Add Member
  const handleAddMember = async () => {
    if (!newMemberEmail) return toast.error("Enter email");
    try {
      const res = await api.put(`/teams/add-member/${selectedTeam._id}`, {
        email: newMemberEmail,
      });
      setSelectedTeam(res.data);
      setTeams(teams.map((t) => (t._id === res.data._id ? res.data : t)));
      setNewMemberEmail("");
      toast.success("Member added! ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding member");
    }
  };

  // 4. Remove Member
  const handleRemoveMember = async (memberId) => {
    try {
      const res = await api.put(`/teams/remove-member/${selectedTeam._id}`, {
        memberId,
      });
      setSelectedTeam(res.data);
      setTeams(teams.map((t) => (t._id === res.data._id ? res.data : t)));
      toast.success("Member removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error removing member");
    }
  };

  // 5. Delete Team
  const handleDeleteTeam = async (id) => {
    if (!window.confirm("Delete this team?")) return;
    try {
      await api.delete(`/teams/delete/${id}`);
      setTeams(teams.filter((t) => t._id !== id));
      setSelectedTeam(null);
      toast.success("Team deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">
        Manage Your Teams
      </h2>

      {/* CREATE TEAM SECTION */}
      {!selectedTeam && (
        <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-2xl mb-8 border border-gray-700 shadow-xl">
          <h3 className="text-xl mb-4 font-semibold text-gray-200">
            Start a New Team
          </h3>
          <input
            className="w-full mb-3 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
            placeholder="Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <textarea
            className="w-full mb-3 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
            placeholder="What is this team about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={handleCreateTeam}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold transition-all shadow-lg"
          >
            Create Team
          </button>
        </div>
      )}

      {/* TEAM LISTING */}
      {loading ? (
        <div className="text-center animate-pulse text-gray-400">
          Loading your teams...
        </div>
      ) : (
        !selectedTeam && (
          <div className="grid md:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team._id}
                onClick={() => setSelectedTeam(team)}
                className="bg-gray-800 p-6 rounded-2xl cursor-pointer border border-gray-700 hover:border-blue-500 transition-all hover:scale-105 shadow-md"
              >
                <h3 className="text-2xl font-bold text-blue-400 mb-2">
                  {team.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {team.description || "No description provided."}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="bg-gray-700 px-2 py-1 rounded">
                    Members: {team.members?.length || 0}/5
                  </span>
                  <span className="text-blue-500 font-semibold">
                    Settings →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* SINGLE TEAM MANAGEMENT VIEW */}
      {selectedTeam && (
        <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl relative">
          <button
            onClick={() => setSelectedTeam(null)}
            className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-1 transition"
          >
            ← Back
          </button>

          <div className="text-center mt-4 mb-8">
            <h3 className="text-4xl font-black text-white mb-2">
              {selectedTeam.name}
            </h3>
            <p className="text-gray-400 italic">{selectedTeam.description}</p>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">
              Roster ({selectedTeam.members?.length}/5)
            </h4>
            <div className="space-y-3">
              {selectedTeam.members?.map((m) => (
                <div
                  key={m._id}
                  className="bg-gray-900/50 p-4 rounded-xl flex justify-between items-center border border-gray-700 hover:bg-gray-700 transition"
                >
                  <span className="font-medium text-gray-200">{m.email}</span>
                  <button
                    onClick={() => handleRemoveMember(m._id)}
                    className="text-red-500 hover:text-red-300 text-sm font-bold p-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/80 p-6 rounded-2xl mb-8 border border-blue-900/30">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">
              Invite Member
            </h4>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="member@example.com"
                className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
              <button
                onClick={handleAddMember}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-bold transition-all"
              >
                Add
              </button>
            </div>
          </div>

          <button
            onClick={() => handleDeleteTeam(selectedTeam._id)}
            className="w-full py-3 text-red-500 border border-red-900/50 rounded-xl hover:bg-red-900/20 transition-all font-semibold"
          >
            Dissolve Team
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageTeam;
