"use client";
import React, { useState } from "react";
import api from "@/utils/api";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginform = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      api
        .post("/user/authenticate", values)
        .then((result) => {
          toast.success("Login Successfully! 👋");

          // save token and role
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("role", result.data.user.role);

          resetForm();
          router.push("/");
        })
        .catch((err) => {
          toast.error(
            err.response?.data?.message || "Login Failed. Check credentials.",
          );
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Left Panel - Stats & Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-slate-900 items-end p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80"
            className="w-full h-full object-cover opacity-50"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-6 backdrop-blur-md">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs uppercase tracking-widest text-emerald-100 font-bold">
              Trusted Platform
            </span>
          </div>
          <h1 className="text-6xl font-bold text-white leading-tight mb-6">
            Your journey starts{" "}
            <span className="text-blue-400 italic font-serif">here.</span>
          </h1>
          <p className="text-slate-300 text-lg mb-12 leading-relaxed">
            Access your personalized dashboard, manage your projects, and stay
            connected with the global developer community.
          </p>

          <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
            <div>
              <span className="text-3xl font-bold text-white block">50K+</span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">
                Active Users
              </span>
            </div>
            <div>
              <span className="text-3xl font-bold text-white block">99.9%</span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">
                Uptime
              </span>
            </div>
            <div>
              <span className="text-3xl font-bold text-white block">4.9★</span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">
                Rating
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] bg-white p-8 sm:p-12 rounded-[2rem] shadow-2xl lg:shadow-none border border-slate-100 lg:border-transparent">
          <div className="mb-10 text-center lg:text-left">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0 shadow-xl shadow-indigo-200">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2 font-serif">
              Welcome back
            </h2>
            <p className="text-slate-500">Please enter your credentials</p>
          </div>

          <form onSubmit={loginform.handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-900"
                  onChange={loginform.handleChange}
                  value={loginform.values.email}
                  required
                />
                <svg
                  className="absolute left-4 top-4.5 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-900"
                  onChange={loginform.handleChange}
                  value={loginform.values.password}
                  required
                />
                <svg
                  className="absolute left-4 top-4.5 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4.5 text-slate-400 hover:text-indigo-600 transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <svg
                    className="w-5 h-5"
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
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest before:h-px before:flex-1 before:bg-slate-100 after:h-px after:flex-1 after:bg-slate-100">
            Social Sign In
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition font-medium text-slate-700 text-sm">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition font-medium text-slate-700 text-sm">
              <img
                src="https://www.svgrepo.com/show/448224/github.svg"
                className="w-5 h-5"
                alt="GitHub"
              />
              GitHub
            </button>
          </div>

          <p className="mt-10 text-center text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-indigo-600 font-bold hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
