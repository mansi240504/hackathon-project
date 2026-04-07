"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "@/utils/api";

const DIFFICULTY_CONFIG = {
  Easy:   { color: "#10b981", bg: "#ecfdf5", border: "#6ee7b7" },
  Medium: { color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d" },
  Hard:   { color: "#ef4444", bg: "#fef2f2", border: "#fca5a5" },
};

const AddHackathon = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "company") router.push("/login");
  }, [router]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    difficulty: Yup.string().required("Difficulty is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date().required("End date is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      difficulty: "Easy",
      startDate: "",
      endDate: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (tags.length === 0) { 
        toast.error("Add at least one tag"); 
        return; 
      }
      setIsLoading(true);

      api.post("/challenges/add", { ...values, tags: tags.join(",") })
        .then(() => {
          toast.success("Challenge published successfully! 🚀");
          resetForm(); 
          setTags([]);
          router.push("/manage-hackathons"); 
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Failed to add challenge");
        })
        .finally(() => setIsLoading(false));
    },
  });

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().replace(/,$/, "");
      if (t && !tags.includes(t)) setTags([...tags, t]);
      setTagInput("");
    }
  };
  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const Field = ({ label, error, touched, children, hint }) => (
    <div className="ah-field">
      <div className="ah-field-header">
        <label className="ah-label">{label}</label>
        {hint && <span className="ah-hint">{hint}</span>}
      </div>
      {children}
      {touched && error && (
        <p className="ah-error">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #0f1117; --slate: #3d4452; --muted: #8891a4;
          --border: #e2e5ec; --surface: #fff; --bg: #f7f8fc;
          --accent: #4f46e5; --accent-dark: #4338ca;
        }
        .ah-root {
          min-height: 100vh; display: flex;
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
        }

        .ah-sidebar {
          display: none; position: sticky; top: 0; height: 100vh;
          width: 300px; flex-shrink: 0;
          background: #080a14; flex-direction: column;
          justify-content: flex-end; padding: 48px 36px;
          overflow: hidden;
        }
        @media (min-width: 1024px) { .ah-sidebar { display: flex; } }

        .ah-sidebar-bg {
          position: absolute; inset: 0;
          background-image: url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=70');
          background-size: cover; background-position: center; opacity: 0.25;
        }
        .ah-sidebar-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(8,10,20,0.4) 0%, rgba(8,10,20,0.95) 100%);
        }
        .ah-sidebar-content { position: relative; z-index: 1; }

        .ah-sidebar-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(99,102,241,0.4);
        }
        .ah-sidebar-icon svg { width: 22px; height: 22px; fill: white; }

        .ah-sidebar-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700; color: #fff;
          line-height: 1.25; margin-bottom: 14px;
        }
        .ah-sidebar-title em { font-style: italic; color: #a5b4fc; }

        .ah-sidebar-sub {
          font-size: 13px; color: rgba(255,255,255,0.45);
          line-height: 1.7; margin-bottom: 36px;
        }

        .ah-sidebar-tips {
          display: flex; flex-direction: column; gap: 12px;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 28px;
        }
        .ah-tip { display: flex; align-items: flex-start; gap: 10px; }
        .ah-tip-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #818cf8; flex-shrink: 0; margin-top: 6px;
        }
        .ah-tip-text { font-size: 12.5px; color: rgba(255,255,255,0.4); line-height: 1.6; }
        .ah-tip-text strong { color: rgba(255,255,255,0.75); font-weight: 500; display: block; }

        .ah-main {
          flex: 1; display: flex; align-items: flex-start;
          justify-content: center; padding: 48px 24px;
          overflow-y: auto;
        }

        .ah-card {
          width: 100%; max-width: 600px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(15,17,23,0.07), 0 1px 2px rgba(15,17,23,0.04);
          animation: fadeUp 0.45s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ah-card-head {
          padding: 28px 36px 24px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, #fafbff 0%, #f5f3ff 100%);
        }
        .ah-card-head-top {
          display: flex; align-items: center; gap: 14px; margin-bottom: 4px;
        }
        .ah-head-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 10px rgba(99,102,241,0.3);
        }
        .ah-head-icon svg { width: 18px; height: 18px; fill: white; }
        .ah-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700; color: var(--ink);
        }
        .ah-card-sub { font-size: 13px; color: var(--muted); margin-top: 6px; }

        .ah-card-body { padding: 28px 36px 36px; display: flex; flex-direction: column; gap: 20px; }

        .ah-field { display: flex; flex-direction: column; gap: 0; }
        .ah-field-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .ah-label { font-size: 13px; font-weight: 500; color: var(--slate); letter-spacing: 0.01em; }
        .ah-hint { font-size: 11.5px; color: var(--muted); }

        .ah-input, .ah-textarea, .ah-select {
          width: 100%; padding: 10px 14px 10px 38px;
          border: 1.5px solid var(--border); border-radius: 10px;
          font-size: 13.5px; font-family: 'DM Sans', sans-serif;
          color: var(--ink); background: #fafbfd;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none; appearance: none;
        }
        .ah-input:focus, .ah-textarea:focus, .ah-select:focus {
          border-color: var(--accent); background: #fff;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
        }
        .ah-input::placeholder, .ah-textarea::placeholder { color: #b0b8c8; }
        .ah-input.invalid { border-color: #ef4444; }
        .ah-input.invalid:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }

        .ah-textarea { padding-left: 38px; resize: vertical; min-height: 96px; line-height: 1.6; }

        .ah-input-wrap { position: relative; }
        .ah-input-wrap .fi {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          width: 14px; height: 14px; color: var(--muted); pointer-events: none;
        }
        .ah-textarea-wrap { position: relative; }
        .ah-textarea-wrap .fi {
          position: absolute; left: 12px; top: 14px;
          width: 14px; height: 14px; color: var(--muted); pointer-events: none;
        }

        .ah-error {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; color: #ef4444; margin-top: 5px;
        }

        .ah-diff-pills { display: flex; gap: 8px; }
        .ah-diff-pill {
          flex: 1; padding: 9px 12px;
          border-radius: 10px; border: 1.5px solid var(--border);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; color: var(--muted);
          background: #fafbfd; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.18s;
        }
        .ah-diff-pill .dot {
          width: 7px; height: 7px; border-radius: 50%;
        }

        .ah-tag-box {
          min-height: 44px; padding: 6px 10px;
          border: 1.5px solid var(--border); border-radius: 10px;
          background: #fafbfd; display: flex; flex-wrap: wrap; gap: 6px; align-items: center;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          cursor: text;
        }
        .ah-tag-box:focus-within {
          border-color: var(--accent); background: #fff;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
        }
        .ah-tag {
          display: flex; align-items: center; gap: 5px;
          padding: 3px 10px;
          background: #ede9fe; border-radius: 100px;
          font-size: 12px; font-weight: 500; color: var(--accent);
        }
        .ah-tag button {
          background: none; border: none; cursor: pointer;
          color: #a78bfa; display: flex; padding: 0;
          transition: color 0.15s;
        }
        .ah-tag button:hover { color: var(--accent-dark); }
        .ah-tag-input {
          border: none; outline: none; background: transparent;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px;
          color: var(--ink); flex: 1; min-width: 120px;
        }

        .ah-date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .ah-date-row { grid-template-columns: 1fr; } }

        .ah-section-divider {
          height: 1px; background: var(--border); margin: 4px 0;
        }

        .ah-submit {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; font-weight: 500;
          border: none; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 2px 12px rgba(79,70,229,0.3);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .ah-submit:hover:not(:disabled) {
          opacity: 0.92; transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(79,70,229,0.4);
        }
        .ah-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ah-root">
        <aside className="ah-sidebar">
          <div className="ah-sidebar-bg" />
          <div className="ah-sidebar-overlay" />
          <div className="ah-sidebar-content">
            <div className="ah-sidebar-icon">
              <svg viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h2 className="ah-sidebar-title">
              Launch a new<br /><em>Challenge</em>
            </h2>
            <p className="ah-sidebar-sub">
              Create a hackathon challenge for developers worldwide. Set the difficulty, timeline, and let the best builders compete.
            </p>
            <div className="ah-sidebar-tips">
              {[
                { title: "Clear title", sub: "Be specific — great titles get 3× more sign-ups" },
                { title: "Tag wisely", sub: "Tags help developers discover your challenge" },
                { title: "Realistic dates", sub: "Allow enough time for quality submissions" },
              ].map((t) => (
                <div className="ah-tip" key={t.title}>
                  <div className="ah-tip-dot" />
                  <div className="ah-tip-text">
                    <strong>{t.title}</strong>
                    {t.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="ah-main">
          <div className="ah-card">
            <div className="ah-card-head">
              <div className="ah-card-head-top">
                <div className="ah-head-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <h1 className="ah-card-title">New Challenge</h1>
              </div>
              <p className="ah-card-sub">Fill in the details below to publish your hackathon challenge</p>
            </div>

            <div className="ah-card-body">
              <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                <Field label="Challenge Title" error={formik.errors.title} touched={formik.touched.title}>
                  <div className="ah-input-wrap">
                    <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    <input
                      className={`ah-input${formik.touched.title && formik.errors.title ? " invalid" : ""}`}
                      type="text" name="title" placeholder="e.g. Build a Real-Time Chat App"
                      value={formik.values.title}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                    />
                  </div>
                </Field>

                <Field label="Description" error={formik.errors.description} touched={formik.touched.description} hint={`${formik.values.description.length} chars`}>
                  <div className="ah-textarea-wrap">
                    <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
                    </svg>
                    <textarea
                      className={`ah-textarea${formik.touched.description && formik.errors.description ? " invalid" : ""}`}
                      name="description" placeholder="Describe the challenge objectives..."
                      value={formik.values.description}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                    />
                  </div>
                </Field>

                <div className="ah-field">
                  <div className="ah-field-header">
                    <label className="ah-label">Difficulty Level</label>
                  </div>
                  <div className="ah-diff-pills">
                    {Object.entries(DIFFICULTY_CONFIG).map(([level, cfg]) => (
                      <div
                        key={level}
                        className="ah-diff-pill"
                        onClick={() => formik.setFieldValue("difficulty", level)}
                        style={formik.values.difficulty === level ? {
                          borderColor: cfg.border, background: cfg.bg, color: cfg.color,
                        } : {}}
                      >
                        <span className="dot" style={{ background: cfg.color }} />
                        {level}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ah-field">
                  <div className="ah-field-header">
                    <label className="ah-label">Tags</label>
                    <span className="ah-hint">Press Enter or comma</span>
                  </div>
                  <div className="ah-tag-box" onClick={() => document.getElementById("tag-input").focus()}>
                    {tags.map((t) => (
                      <span className="ah-tag" key={t}>
                        {t}
                        <button type="button" onClick={() => removeTag(t)}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </span>
                    ))}
                    <input
                      id="tag-input"
                      className="ah-tag-input"
                      placeholder={tags.length === 0 ? "react, api..." : ""}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                    />
                  </div>
                </div>

                <div className="ah-section-divider" />

                <div className="ah-date-row">
                  <Field label="Start Date" error={formik.errors.startDate} touched={formik.touched.startDate}>
                    <div className="ah-input-wrap">
                      <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <input className="ah-input" type="date" name="startDate"
                        value={formik.values.startDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                  </Field>
                  <Field label="End Date" error={formik.errors.endDate} touched={formik.touched.endDate}>
                    <div className="ah-input-wrap">
                      <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <input className="ah-input" type="date" name="endDate"
                        value={formik.values.endDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </div>
                  </Field>
                </div>

                <button type="submit" className="ah-submit" disabled={isLoading}>
                  {isLoading
                    ? <><div className="spinner" /> Publishing...</>
                    : <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        Publish Challenge
                      </>
                  }
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AddHackathon;