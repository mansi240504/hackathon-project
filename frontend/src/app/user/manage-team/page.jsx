'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ManageTeam = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [token, setToken] = useState(null);

    
    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }
    }, []);

    // Fetch teams
    useEffect(() => {
        if (!token) return;

        axios.get('http://localhost:4000/teams/getbyuser', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setTeams(res.data))
        .catch(err => console.log(err));
    }, [token]);

    //  Create team
    const handleCreateTeam = async () => {
        if (!teamName) return toast.error("Enter team name");

        try {
            const res = await axios.post(
                "http://localhost:4000/teams/add",
                { name: teamName, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTeams([...teams, res.data]);
            setTeamName("");
            setDescription("");
            toast.success("Team created");
        } catch {
            toast.error("Error creating team");
        }
    };

    //  Add member
    const handleAddMember = async () => {
        if (!newMemberEmail) return toast.error("Enter email");

        try {
            const res = await axios.put(
                `http://localhost:4000/teams/add-member/${selectedTeam._id}`,
                { email: newMemberEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSelectedTeam(res.data);
            setTeams(teams.map(t => t._id === res.data._id ? res.data : t));
            setNewMemberEmail("");
            toast.success("Member added");
        } catch {
            toast.error("Error adding member");
        }
    };

    //  Remove member
    const handleRemoveMember = async (memberId) => {
        try {
            const res = await axios.put(
                `http://localhost:4000/teams/remove-member/${selectedTeam._id}`,
                { memberId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSelectedTeam(res.data);
            setTeams(teams.map(t => t._id === res.data._id ? res.data : t));
            toast.success("Member removed");
        } catch {
            toast.error("Error removing member");
        }
    };

    //  Delete team
    const handleDeleteTeam = async (id) => {
        try {
            await axios.delete(
                `http://localhost:4000/teams/delete/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTeams(teams.filter(t => t._id !== id));
            setSelectedTeam(null);
            toast.success("Team deleted");
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6 text-white">
            <h2 className="text-3xl font-bold text-center mb-6">My Teams</h2>

            {/*  CREATE TEAM */}
            {!selectedTeam && (
                <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-xl mb-8">
                    <input
                        className="w-full mb-2 p-2 rounded bg-gray-700"
                        placeholder="Team name"
                        value={teamName}
                        onChange={e => setTeamName(e.target.value)}
                    />
                    <textarea
                        className="w-full mb-2 p-2 rounded bg-gray-700"
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <button
                        onClick={handleCreateTeam}
                        className="bg-blue-600 px-4 py-2 rounded"
                    >
                        Create Team
                    </button>
                </div>
            )}

            {/* TEAM CARDS */}
            {!selectedTeam && (
                <div className="grid md:grid-cols-3 gap-4">
                    {teams.map(team => (
                        <div
                            key={team._id}
                            onClick={() => setSelectedTeam(team)}
                            className="bg-gray-800 p-4 rounded-xl cursor-pointer hover:bg-gray-700"
                        >
                            <h3 className="text-xl font-semibold">{team.name}</h3>
                            <p className="text-gray-400">{team.description || "No description"}</p>
                            <p className="mt-2 text-sm">Members: {team.members.length}</p>
                        </div>
                    ))}
                </div>
            )}

            {/*  MANAGE TEAM */}
            {selectedTeam && (
                <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-xl">
                    <button
                        onClick={() => setSelectedTeam(null)}
                        className="text-sm text-blue-400 mb-3"
                    >
                        ← Back to Teams
                    </button>

                    <h3 className="text-2xl mb-3">{selectedTeam.name}</h3>

                    <ul className="mb-4">
                        {selectedTeam.members.map((m) => (
                            <li key={m._id} className="bg-gray-700 p-2 rounded mb-1 flex justify-between">
                                {m.email}
                                <button
                                    onClick={() => handleRemoveMember(m._id)}
                                    className="text-red-400 text-sm"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="email"
                            placeholder="Add member email"
                            className="flex-1 p-2 rounded bg-gray-700"
                            value={newMemberEmail}
                            onChange={e => setNewMemberEmail(e.target.value)}
                        />
                        <button
                            onClick={handleAddMember}
                            className="bg-blue-600 px-4 py-2 rounded"
                        >
                            Add
                        </button>
                    </div>

                    <button
                        onClick={() => handleDeleteTeam(selectedTeam._id)}
                        className="bg-red-600 px-4 py-2 rounded"
                    >
                        Delete Team
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManageTeam;
