'use client';
import api from '@/utils/api';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ManageHackathon = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [password, setPassword] = useState('');

  // 1. Fetch all hackathons
  useEffect(() => {
    api.get('/challenges/getall')
      .then(res => {
        setHackathons(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load hackathons");
        setLoading(false);
      });
  }, []);

  // 2. Delete Hackathon Function
  const handleDelete = async () => {
    if (!password) {
      toast.error("Password required");
      return;
    }

    try {
      await api.post(`/challenges/delete/${deleteId}`, { password });

      setHackathons(hackathons.filter(h => h._id !== deleteId));
      setShowConfirm(false);
      setPassword("");
      toast.success("Deleted successfully ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading)
    return <p className="text-center text-white mt-10 animate-pulse">Loading Hackathons...</p>;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">
        Manage Hackathons
      </h2>

      {hackathons.length === 0 ? (
        <p className="text-center text-gray-400">
          No hackathons created yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {hackathons.map(h => (
            <div
              key={h._id}
              className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-blue-500 transition shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2 text-white">{h.title}</h3>
              <p className="text-gray-400 mb-4 text-sm line-clamp-3">
                {h.description || "No description provided."}
              </p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Status</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  new Date() < new Date(h.startDate) ? "bg-blue-900/30 text-blue-400" :
                  new Date() > new Date(h.endDate) ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
                }`}>
                  {new Date() < new Date(h.startDate) ? "Upcoming" : 
                   new Date() > new Date(h.endDate) ? "Completed" : "Ongoing"}
                </span>
              </div>

              <button
                onClick={() => {
                  setShowConfirm(true);
                  setDeleteId(h._id);
                }}
                className="bg-red-600/20 text-red-500 border border-red-600/50 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg w-full transition-all font-medium"
              >
                Delete Hackathon
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2 text-white">Security Check</h3>
            <p className="text-gray-400 mb-6 text-sm">
              This action cannot be undone. Please enter your password to confirm deletion.
            </p>

            <input
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white mb-6 focus:border-blue-500 outline-none transition"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setPassword("");
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-xl font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-bold transition shadow-lg shadow-red-900/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHackathon;