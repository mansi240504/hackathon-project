"use client";
import React, { useState } from "react";
import api from "@/utils/api";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signupForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
    onSubmit: (values, { resetForm }) => {
      if (values.password !== values.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      setIsLoading(true);

      api
        .post("/user/add", {
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        })
        .then(() => {
          toast.success("Account created successfully! 🎉");
          resetForm();
          router.push("/login");
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Signup failed");
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Left Panel - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-end p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80"
            className="w-full h-full object-cover opacity-40"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-6 backdrop-blur-md">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span className="text-xs uppercase tracking-widest text-slate-200">
              Join the Community
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Build. Compete.{" "}
            <span className="text-blue-400 italic">Conquer.</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            The ultimate platform for developers to showcase skills and win
            hackathons.
          </p>

          <div className="space-y-4 border-t border-white/10 pt-8">
            {["Create Account", "Join Hackathons", "Submit & Win"].map(
              (step, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <span className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-sm font-bold">
                    0{i + 1}
                  </span>
                  <span className="text-slate-300 font-medium">{step}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white lg:bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl lg:shadow-2xl border border-slate-100">
          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Create account
            </h2>
            <p className="text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={signupForm.handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 ml-1">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  onChange={signupForm.handleChange}
                  value={signupForm.values.name}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 ml-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="johndoe@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  onChange={signupForm.handleChange}
                  value={signupForm.values.email}
                  required
                />
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Password
              </label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                onChange={signupForm.handleChange}
                value={signupForm.values.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-4 transition-all outline-none ${
                  signupForm.values.confirmPassword &&
                  signupForm.values.password !==
                    signupForm.values.confirmPassword
                    ? "border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                }`}
                onChange={signupForm.handleChange}
                value={signupForm.values.confirmPassword}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1 text-center block">
                I am joining as
              </label>
              <div className="flex space-x-3">
                {["user", "company"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => signupForm.setFieldValue("role", r)}
                    className={`flex-1 py-3 rounded-xl border font-medium capitalize transition-all ${
                      signupForm.values.role === r
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {r === "user" ? "Participant" : "Company"}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
