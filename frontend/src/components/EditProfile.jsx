import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/utils/api";
import toast from "react-hot-toast";

const EditProfile = ({ user, onSaveSuccess, onCancel }) => {
  const [isSaving, setIsSaving] = useState(false);

  // Validation Schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Full Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
    collegeOrCompany: Yup.string()
      .max(100, "College or Company name cannot exceed 100 characters")
      .nullable(),
    bio: Yup.string()
      .max(300, "Bio cannot exceed 300 characters")
      .nullable(),
    skills: Yup.string()
      .nullable(),
    github: Yup.string()
      .transform((value) => (value === "" ? undefined : value))
      .url("Enter a valid GitHub URL (e.g. https://github.com/username)")
      .matches(/github\.com/, "Must be a valid github.com domain URL"),
    linkedin: Yup.string()
      .transform((value) => (value === "" ? undefined : value))
      .url("Enter a valid LinkedIn URL (e.g. https://linkedin.com/in/username)")
      .matches(/linkedin\.com/, "Must be a valid linkedin.com domain URL"),
    portfolio: Yup.string()
      .transform((value) => (value === "" ? undefined : value))
      .url("Enter a valid portfolio URL (e.g. https://portfolio.com)"),
    mobile: Yup.string()
      .transform((value) => (value === "" ? undefined : value))
      .matches(/^[0-9+\-\s()]*$/, "Enter a valid mobile number")
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number cannot exceed 15 digits"),
    location: Yup.string()
      .max(100, "Location details are too long")
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: user.name || "",
      collegeOrCompany: user.collegeOrCompany || "",
      bio: user.bio || "",
      skills: user.skills ? user.skills.join(", ") : "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      portfolio: user.portfolio || "",
      mobile: user.mobile || "",
      location: user.location || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSaving(true);
      try {
        const response = await api.put("/profile/update", values);
        toast.success("Profile updated successfully! ✨");
        if (onSaveSuccess) {
          onSaveSuccess(response.data.user);
        }
      } catch (error) {
        console.error("Update profile error:", error);
        toast.error(
          error.response?.data?.message || "Failed to update profile. Please try again."
        );
      } finally {
        setIsSaving(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8 text-left">
      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Personal Details */}
        <div className="space-y-6 bg-gray-800/40 p-6 rounded-2xl border border-gray-700/60 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl bg-gray-900 border text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="mobile" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="text"
                placeholder="+1 (555) 019-2834"
                className={`w-full px-4 py-3 rounded-xl bg-gray-900 border text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                  formik.touched.mobile && formik.errors.mobile
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobile}
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.mobile}</p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="San Francisco, CA"
                className={`w-full px-4 py-3 rounded-xl bg-gray-900 border text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                  formik.touched.location && formik.errors.location
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.location}
              />
              {formik.touched.location && formik.errors.location && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.location}</p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                placeholder="Passionate full stack developer loving hackathons..."
                className={`w-full px-4 py-3 rounded-xl bg-gray-900 border text-gray-100 placeholder-gray-500 focus:outline-none transition-colors resize-none ${
                  formik.touched.bio && formik.errors.bio
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bio}
              />
              <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                <span>Max 300 characters</span>
                <span>{formik.values.bio ? formik.values.bio.length : 0}/300</span>
              </div>
              {formik.touched.bio && formik.errors.bio && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: College, Skills & Links */}
        <div className="space-y-6 bg-gray-800/40 p-6 rounded-2xl border border-gray-700/60 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-indigo-400 border-b border-gray-700 pb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Professional Info & Skills
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="collegeOrCompany" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                College or Company Name
              </label>
              <input
                id="collegeOrCompany"
                name="collegeOrCompany"
                type="text"
                placeholder="Stanford University / Google"
                className={`w-full px-4 py-3 rounded-xl bg-gray-900 border text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                  formik.touched.collegeOrCompany && formik.errors.collegeOrCompany
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.collegeOrCompany}
              />
              {formik.touched.collegeOrCompany && formik.errors.collegeOrCompany && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.collegeOrCompany}</p>
              )}
            </div>

            <div>
              <label htmlFor="skills" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Skills
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="React, Node.js, Express, MongoDB"
                className={`w-full px-4 py-3 rounded-xl bg-gray-900 border text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                  formik.touched.skills && formik.errors.skills
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.skills}
              />
              <span className="block mt-1 text-[10px] text-gray-500">Provide skills separated by commas</span>
              {formik.touched.skills && formik.errors.skills && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.skills}</p>
              )}
            </div>
          </div>

          <h3 className="text-lg font-bold text-indigo-400 border-b border-gray-700 pb-2 pt-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Socials & Links
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="github" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                GitHub Profile URL
              </label>
              <input
                id="github"
                name="github"
                type="text"
                placeholder="https://github.com/username"
                className={`w-full px-4 py-3 rounded-xl bg-gray-900 border text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                  formik.touched.github && formik.errors.github
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.github}
              />
              {formik.touched.github && formik.errors.github && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.github}</p>
              )}
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                LinkedIn Profile URL
              </label>
              <input
                id="linkedin"
                name="linkedin"
                type="text"
                placeholder="https://linkedin.com/in/username"
                className={`w-full px-4 py-3 rounded-xl bg-gray-900 border text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                  formik.touched.linkedin && formik.errors.linkedin
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.linkedin}
              />
              {formik.touched.linkedin && formik.errors.linkedin && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.linkedin}</p>
              )}
            </div>

            <div>
              <label htmlFor="portfolio" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Portfolio Website URL
              </label>
              <input
                id="portfolio"
                name="portfolio"
                type="text"
                placeholder="https://myportfolio.com"
                className={`w-full px-4 py-3 rounded-xl bg-gray-900 border text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                  formik.touched.portfolio && formik.errors.portfolio
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.portfolio}
              />
              {formik.touched.portfolio && formik.errors.portfolio && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.portfolio}</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Button controls */}
      <div className="flex items-center justify-end gap-4 border-t border-gray-800 pt-6">
        <button
          type="button"
          disabled={isSaving}
          onClick={onCancel}
          className="px-6 py-3 border border-gray-700 hover:border-gray-600 hover:bg-gray-800 text-gray-300 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || !formik.isValid}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
