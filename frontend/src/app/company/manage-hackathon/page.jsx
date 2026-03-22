'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ManageHackathon = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get('http://localhost:4000/challenges/getall', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setHackathons(res.data);
      setLoading(false);
    })
    .catch(() => {
      toast.error("Failed to load hackathons");
      setLoading(false);
    });
  }, []);

  


  if (loading)
    return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">
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
              className="bg-gray-800 p-5 rounded-xl shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{h.title}</h3>
              <p className="text-gray-400 mb-2">
                {h.description || "No description"}
              </p>
              <p className="text-sm mb-4">
                Status:{" "}
                <span className="text-blue-400">
                  {new Date() < new Date(h.startDate)
                    ? "Upcoming"
                    : new Date() > new Date(h.endDate)
                    ? "Completed"
                    : "Ongoing"}
                </span>
              </p>

              <button
                onClick={() => 
                {
                    setShowConfirm(true);
                    setDeleteId(h._id);
                }
                }
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-full"
              >
                Delete Hackathon
              </button>
            </div>
          ))}
        </div>
      )}
      {showConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
    <div className="bg-gray-800 p-6 rounded-xl w-80">
      <h3 className="text-xl font-bold mb-3 text-white">
        Confirm Deletion
      </h3>

      <p className="text-gray-300 mb-3">
        Enter your password to delete this challenge
      </p>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white mb-4"
      />

      <div className="flex justify-between">
        <button
          onClick={() => {
            setShowConfirm(false);
            setPassword("");
          }}
          className="bg-gray-600 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
         if (!password) {
           toast.error("Password required");
          return;
          }

    try {
      await axios.post(
        `http://localhost:4000/challenges/delete/${deleteId}`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setHackathons(hackathons.filter(h => h._id !== deleteId));
      setShowConfirm(false);
      setPassword("");
      toast.success("Deleted successfully");

      } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
       }
  }}
       className="bg-red-600 px-4 py-2 rounded"
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
