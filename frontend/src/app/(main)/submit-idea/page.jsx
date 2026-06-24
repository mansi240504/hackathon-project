"use client";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/utils/api";

const TECH_LIST = ["React", "Next.js", "Node.js", "Python", "MongoDB", "TypeScript", "Docker", "AWS", "Flutter", "Firebase"];
const CATEGORIES = ["Web App", "Mobile App", "AI / ML", "Blockchain", "DevTools", "Game", "IoT"];

// ── Outside component → no cursor bug ──
const Field = ({ label, hint, error, children }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
    <div style={{ display:"flex", justifyContent:"space-between" }}>
      <label style={{ fontSize:13, fontWeight:500, color:"#3d4452" }}>{label}</label>
      {hint && <span style={{ fontSize:11, color:"#8891a4" }}>{hint}</span>}
    </div>
    {children}
    {error && (
      <span style={{ fontSize:12, color:"#ef4444", display:"flex", alignItems:"center", gap:4 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {error}
      </span>
    )}
  </div>
);

// Reusable input style
const iStyle = (err) => ({
  width:"100%", padding:"10px 12px 10px 36px",
  border:`1.5px solid ${err ? "#ef4444" : "#e2e5ec"}`,
  borderRadius:10, fontSize:13.5, fontFamily:"inherit",
  color:"#0f1117", background:"#fafbfd", outline:"none",
});

// Icon inside input
const FIcon = ({ d }) => (
  <svg style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"#8891a4", pointerEvents:"none" }}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d={d}/>
  </svg>
);

export default function SubmitIdea() {
  const [form, setForm] = useState({ title:"", problem:"", description:"", category:"", teamId:"", githubUrl:"", demoUrl:"" });
  const [tags, setTags]       = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const set = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]:"" }));
  };

  const addTag = (v) => {
    const t = v.trim().replace(/,$/,"");
    if (t && !tags.includes(t)) setTags(p => [...p, t]);
    setTagInput("");
  };
  const onTagKey = (e) => {
    if ((e.key==="Enter" || e.key===",") && tagInput.trim()) { e.preventDefault(); addTag(tagInput); }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Required";
    if (!form.problem.trim())     e.problem     = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.category)           e.category    = "Select a category";
    if (!form.teamId.trim())      e.teamId      = "Required";
    if (tags.length === 0)        e.tags        = "Add at least one technology";
    if (form.githubUrl && !/^https?:\/\/.+/.test(form.githubUrl)) e.githubUrl = "Enter a valid URL";
    if (form.demoUrl   && !/^https?:\/\/.+/.test(form.demoUrl))   e.demoUrl   = "Enter a valid URL";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/ideas/add`, { ...form, techStack: tags.join(", ") });
      setDone(true);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Submission failed. Try again." });
    } finally { setLoading(false); }
  };

  const reset = () => {
    setForm({ title:"", problem:"", description:"", category:"", teamId:"", githubUrl:"", demoUrl:"" });
    setTags([]); setErrors({}); setDone(false);
  };

  // ── Shared style tokens ──
  const page   = { minHeight:"100vh", background:"#f7f8fc", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"48px 16px" };
  const card   = { width:"100%", maxWidth:580, background:"#fff", border:"1px solid #e2e5ec", borderRadius:20, overflow:"hidden", boxShadow:"0 4px 24px rgba(15,17,23,.07)" };
  const btn    = { width:"100%", padding:13, background:"linear-gradient(135deg,#6366f1,#4f46e5)", color:"#fff", border:"none", borderRadius:10, fontSize:14.5, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 };
  const secLbl = { fontSize:11, fontWeight:600, color:"#8891a4", letterSpacing:"0.07em", textTransform:"uppercase" };
  const divider= { height:1, background:"#e2e5ec" };

  // ── Success screen ──
  if (done) return (
    <div style={page}>
      <div style={{ ...card, textAlign:"center", padding:"64px 32px", display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(79,70,229,.35)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#0f1117", margin:0 }}>Idea Submitted!</h2>
        <p style={{ fontSize:14, color:"#8891a4", maxWidth:280, lineHeight:1.6, margin:0 }}>Your project has been received. Good luck in the hackathon!</p>
        <button onClick={reset} style={{ ...btn, width:"auto", padding:"10px 28px", marginTop:8 }}>Submit another</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');
        input:focus,textarea:focus,select:focus { border-color:#4f46e5!important; box-shadow:0 0 0 3px rgba(79,70,229,.1)!important; background:#fff!important; outline:none; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div style={page}>
        <div style={card}>

          {/* ── Header ── */}
          <div style={{ padding:"24px 32px 20px", borderBottom:"1px solid #e2e5ec", background:"linear-gradient(135deg,#fafbff,#f5f3ff)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#6366f1,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <div>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:21, color:"#0f1117", margin:0 }}>Submit Idea</h1>
                <p style={{ fontSize:13, color:"#8891a4", margin:0 }}>Pitch your project for the hackathon</p>
              </div>
            </div>
          </div>

          {/* ── Form Body ── */}
          <div style={{ padding:"28px 32px 36px" }}>
            <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:18 }}>

              {/* SECTION 1 — Basics */}
              <p style={secLbl}>Project Basics</p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <Field label="Project Title" error={errors.title}>
                  <div style={{ position:"relative" }}>
                    <FIcon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    <input name="title" placeholder="e.g. AI Study App" value={form.title} onChange={set} style={iStyle(errors.title)}/>
                  </div>
                </Field>

                <Field label="Category" error={errors.category}>
                  <div style={{ position:"relative" }}>
                    <FIcon d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <select name="category" value={form.category} onChange={set}
                      style={{ ...iStyle(errors.category), appearance:"none",
                        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238891a4' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", paddingRight:32 }}>
                      <option value="">Select...</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </Field>
              </div>

              <Field label="Problem Statement" hint={`${form.problem.length} chars`} error={errors.problem}>
                <div style={{ position:"relative" }}>
                  <svg style={{ position:"absolute", left:11, top:13, width:14, height:14, color:"#8891a4", pointerEvents:"none" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <textarea name="problem" placeholder="What problem does your project solve?" value={form.problem} onChange={set}
                    style={{ ...iStyle(errors.problem), resize:"vertical", minHeight:80, lineHeight:1.65, paddingTop:10 }}/>
                </div>
              </Field>

              <Field label="Solution Description" hint={`${form.description.length} chars`} error={errors.description}>
                <div style={{ position:"relative" }}>
                  <svg style={{ position:"absolute", left:11, top:13, width:14, height:14, color:"#8891a4", pointerEvents:"none" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
                  </svg>
                  <textarea name="description" placeholder="How does it work? What makes it unique?" value={form.description} onChange={set}
                    style={{ ...iStyle(errors.description), resize:"vertical", minHeight:96, lineHeight:1.65, paddingTop:10 }}/>
                </div>
              </Field>

              <div style={divider}/>

              {/* SECTION 2 — Tech */}
              <p style={secLbl}>Tech Stack</p>

              <Field label="Technologies Used" hint="Enter or comma to add" error={errors.tags}>
                <div onClick={() => document.getElementById("tag-input").focus()}
                  style={{ minHeight:44, padding:"5px 10px", border:`1.5px solid ${errors.tags?"#ef4444":"#e2e5ec"}`, borderRadius:10, background:"#fafbfd", display:"flex", flexWrap:"wrap", gap:6, alignItems:"center", cursor:"text" }}>
                  {tags.map(t => (
                    <span key={t} style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 10px", background:"#ede9fe", borderRadius:100, fontSize:12, fontWeight:500, color:"#4f46e5" }}>
                      {t}
                      <button type="button" onClick={() => setTags(p => p.filter(x => x!==t))} style={{ background:"none", border:"none", cursor:"pointer", color:"#a78bfa", display:"flex", padding:0 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </span>
                  ))}
                  <input id="tag-input" placeholder={tags.length===0?"React, Node.js...":""} value={tagInput}
                    onChange={e => setTagInput(e.target.value)} onKeyDown={onTagKey}
                    style={{ border:"none", outline:"none", background:"transparent", fontFamily:"inherit", fontSize:13.5, color:"#0f1117", flex:1, minWidth:100 }}/>
                </div>
                {/* Quick-add suggestions */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:6 }}>
                  {TECH_LIST.map(t => (
                    <span key={t} onClick={() => !tags.includes(t) && addTag(t)}
                      style={{ padding:"3px 10px", borderRadius:100, border:"1px solid #e2e5ec", background:"#fff", fontSize:12, cursor: tags.includes(t)?"default":"pointer", color: tags.includes(t)?"#c4cad4":"#8891a4" }}>
                      + {t}
                    </span>
                  ))}
                </div>
              </Field>

              <div style={divider}/>

              {/* SECTION 3 — Links & Team */}
              <p style={secLbl}>Links & Team</p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <Field label="GitHub Repo" hint="optional" error={errors.githubUrl}>
                  <div style={{ position:"relative" }}>
                    <FIcon d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    <input name="githubUrl" placeholder="https://github.com/..." value={form.githubUrl} onChange={set} style={iStyle(errors.githubUrl)}/>
                  </div>
                </Field>

                <Field label="Demo URL" hint="optional" error={errors.demoUrl}>
                  <div style={{ position:"relative" }}>
                    <FIcon d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                    <input name="demoUrl" placeholder="https://..." value={form.demoUrl} onChange={set} style={iStyle(errors.demoUrl)}/>
                  </div>
                </Field>
              </div>

              <Field label="Team ID" error={errors.teamId}>
                <div style={{ position:"relative" }}>
                  <FIcon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  <input name="teamId" placeholder="Enter your team ID" value={form.teamId} onChange={set} style={iStyle(errors.teamId)}/>
                </div>
              </Field>

              {errors.submit && (
                <div style={{ padding:"11px 14px", borderRadius:10, background:"#fef2f2", border:"1px solid #fecaca", fontSize:13, color:"#dc2626" }}>
                  {errors.submit}
                </div>
              )}

              <button type="submit" style={btn} disabled={loading}>
                {loading
                  ? <><div style={{ width:15, height:15, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite" }}/> Submitting...</>
                  : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Submit Idea</>
                }
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}