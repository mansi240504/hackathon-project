"use client";
import React, { useEffect, useState, useRef } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import EditProfile from "@/components/EditProfile";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view your profile.");
          router.push("/login");
          return;
        }

        const res = await api.get("/profile");
        setUser(res.data);
      } catch (err) {
        console.error("Fetch profile error:", err);
        toast.error("Failed to load profile details.");
        // If token is invalid or expired
        if (err.response?.status === 400 || err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSaveSuccess = (updatedUser) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validations
    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files are allowed!");
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File size cannot exceed 5MB!");
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    const toastId = toast.loading("Uploading your profile photo...");
    
    try {
      const res = await api.post("/profile/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data.user);
      toast.success("Profile photo updated successfully! 📸", { id: toastId });
    } catch (err) {
      console.error("Upload image error:", err);
      toast.error(
        err.response?.data?.message || "Failed to upload image. Please try again.",
        { id: toastId }
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-slate-100">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium animate-pulse">Loading profile details...</p>
      </div>
    );
  }

  if (!user) return null;

  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-[#0b0f19] py-8 text-slate-100 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb / Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              User Profile
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your personal credentials, skills, and portfolio pages.
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Glassmorphic Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="relative overflow-hidden bg-gray-900/60 border border-gray-800/80 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl">
              
              {/* Decorative background glow */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Avatar Uploader */}
              <div className="relative group mx-auto w-32 h-32 rounded-full cursor-pointer overflow-hidden border-2 border-indigo-500/30 hover:border-indigo-500 transition-colors shadow-inner" onClick={handleImageClick}>
                <img
                  src={user.profilePicture || defaultAvatar}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change Photo</span>
                    </>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
              />

              <h2 className="text-xl font-bold text-white mt-5 truncate">{user.name}</h2>
              <p className="text-slate-400 text-sm mt-0.5 truncate">{user.email}</p>
              
              {/* Role Badge */}
              <div className="mt-3.5 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {user.role}
              </div>

              {/* Social Links Section */}
              <div className="mt-8 pt-6 border-t border-gray-800/80 flex items-center justify-center gap-5">
                {/* GitHub */}
                <a
                  href={user.github || "#"}
                  target={user.github ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`p-2.5 rounded-xl border transition-all ${
                    user.github
                      ? "border-gray-800 bg-gray-900/40 text-slate-300 hover:text-white hover:border-gray-700 hover:scale-110 shadow-lg"
                      : "border-gray-800/40 text-slate-600 cursor-not-allowed"
                  }`}
                  title={user.github ? "View GitHub Profile" : "GitHub profile not added"}
                  onClick={(e) => !user.github && e.preventDefault()}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={user.linkedin || "#"}
                  target={user.linkedin ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`p-2.5 rounded-xl border transition-all ${
                    user.linkedin
                      ? "border-gray-800 bg-gray-900/40 text-slate-300 hover:text-white hover:border-gray-700 hover:scale-110 shadow-lg"
                      : "border-gray-800/40 text-slate-600 cursor-not-allowed"
                  }`}
                  title={user.linkedin ? "View LinkedIn Profile" : "LinkedIn profile not added"}
                  onClick={(e) => !user.linkedin && e.preventDefault()}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* Portfolio */}
                <a
                  href={user.portfolio || "#"}
                  target={user.portfolio ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`p-2.5 rounded-xl border transition-all ${
                    user.portfolio
                      ? "border-gray-800 bg-gray-900/40 text-slate-300 hover:text-white hover:border-gray-700 hover:scale-110 shadow-lg"
                      : "border-gray-800/40 text-slate-600 cursor-not-allowed"
                  }`}
                  title={user.portfolio ? "View Portfolio Website" : "Portfolio link not added"}
                  onClick={(e) => !user.portfolio && e.preventDefault()}
                >
                  <svg className="w-5 h-5 fill-none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Details or Edit Form Container */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/60 border border-gray-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl min-h-[400px]">
              
              {isEditing ? (
                <div>
                  <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-white">Edit Profile Details</h2>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-400 hover:text-white transition"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <EditProfile
                    user={user}
                    onSaveSuccess={handleSaveSuccess}
                    onCancel={() => setIsEditing(false)}
                  />
                </div>
              ) : (
                <div className="space-y-8">
                  
                  {/* Bio block */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">About Me</h3>
                    {user.bio ? (
                      <blockquote className="border-l-2 border-indigo-500 pl-4 py-1 text-slate-300 italic leading-relaxed">
                        "{user.bio}"
                      </blockquote>
                    ) : (
                      <p className="text-slate-500 italic">No bio provided yet. Click "Edit Profile" to tell us about yourself!</p>
                    )}
                  </div>

                  {/* Core Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 pt-4 border-t border-gray-800/80">
                    
                    {/* College or Company */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/40 text-indigo-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">College / Company</span>
                        <span className="text-sm font-semibold text-slate-200 mt-1 block">
                          {user.collegeOrCompany || <span className="text-slate-600 font-normal">Not specified</span>}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/40 text-indigo-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</span>
                        <span className="text-sm font-semibold text-slate-200 mt-1 block">
                          {user.location || <span className="text-slate-600 font-normal">Not specified</span>}
                        </span>
                      </div>
                    </div>

                    {/* Email Contact */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/40 text-indigo-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</span>
                        <span className="text-sm font-semibold text-slate-200 mt-1 block truncate max-w-[240px] sm:max-w-xs">{user.email}</span>
                      </div>
                    </div>

                    {/* Mobile Contact */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/40 text-indigo-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile Number</span>
                        <span className="text-sm font-semibold text-slate-200 mt-1 block">
                          {user.mobile || <span className="text-slate-600 font-normal">Not specified</span>}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Skills badge container */}
                  <div className="space-y-4 pt-6 border-t border-gray-800/80">
                    <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3.5 py-1.5 text-xs font-medium rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 shadow-sm transition hover:border-indigo-500/50 hover:bg-slate-800 duration-200"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-500 italic">No skills listed yet. Add some skills to showcase your expertise!</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
