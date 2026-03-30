"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [role, setRole] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/view-challenges", label: "Challenges" },
    ...(role === "company"
      ? [
          { href: "/admin/add-hackathon", label: "Add Hackathon" },
          { href: "/company/manage-hackathon", label: "Manage Hackathons" },
        ]
      : []),
    { href: "/user/manage-team", label: "Manage Team" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .nb-root {
          position: sticky; top: 0; z-index: 100;
          font-family: 'Space Grotesk', sans-serif;
          transition: background 0.3s, box-shadow 0.3s, backdrop-filter 0.3s;
        }
        .nb-root.scrolled {
          background: rgba(8, 10, 20, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4);
        }
        .nb-root:not(.scrolled) {
          background: #080a14;
          box-shadow: 0 1px 0 rgba(255,255,255,0.06);
        }

        .nb-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo */
        .nb-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nb-logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nb-logo-icon svg { width: 18px; height: 18px; fill: white; }
        .nb-logo-text {
          font-size: 17px; font-weight: 700;
          letter-spacing: 0.04em;
          background: linear-gradient(90deg, #fff 60%, #818cf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Nav links */
        .nb-links {
          display: flex; align-items: center; gap: 4px;
        }
        @media (max-width: 768px) { .nb-links { display: none; } }

        .nb-link {
          font-size: 13.5px; font-weight: 500;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 8px;
          letter-spacing: 0.01em;
          transition: color 0.2s, background 0.2s;
        }
        .nb-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.07);
        }

        /* Divider */
        .nb-divider {
          width: 1px; height: 20px;
          background: rgba(255,255,255,0.1);
          margin: 0 8px;
        }

        /* Auth buttons */
        .nb-auth { display: flex; align-items: center; gap: 8px; }
        @media (max-width: 768px) { .nb-auth { display: none; } }

        .nb-btn-ghost {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13.5px; font-weight: 500;
          color: rgba(255,255,255,0.6);
          background: none; border: none;
          padding: 7px 14px;
          border-radius: 8px;
          cursor: pointer; text-decoration: none;
          transition: color 0.2s, background 0.2s;
          letter-spacing: 0.01em;
        }
        .nb-btn-ghost:hover { color: #fff; background: rgba(255,255,255,0.07); }

        .nb-btn-primary {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13.5px; font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          border: none;
          padding: 7px 18px;
          border-radius: 8px;
          cursor: pointer; text-decoration: none;
          letter-spacing: 0.01em;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 12px rgba(99,102,241,0.35);
        }
        .nb-btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(99,102,241,0.45);
        }

        /* Hamburger */
        .nb-hamburger {
          display: none;
          background: none; border: none;
          color: rgba(255,255,255,0.7);
          cursor: pointer; padding: 6px;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
        }
        .nb-hamburger:hover { background: rgba(255,255,255,0.08); color: #fff; }
        @media (max-width: 768px) { .nb-hamburger { display: flex; align-items: center; } }

        /* Mobile menu */
        .nb-mobile {
          display: none;
          flex-direction: column;
          padding: 12px 16px 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(8,10,20,0.97);
          backdrop-filter: blur(16px);
          gap: 2px;
        }
        .nb-mobile.open { display: flex; }

        .nb-mobile-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 10px;
          transition: color 0.2s, background 0.2s;
          letter-spacing: 0.01em;
        }
        .nb-mobile-link:hover { color: #fff; background: rgba(255,255,255,0.07); }

        .nb-mobile-divider {
          height: 1px; background: rgba(255,255,255,0.07);
          margin: 8px 0;
        }

        .nb-mobile-auth {
          display: flex; gap: 8px; padding: 4px 14px 0;
        }
        .nb-mobile-auth a {
          flex: 1; text-align: center;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 500;
          text-decoration: none;
          padding: 9px;
          border-radius: 10px;
        }
        .nb-mobile-login {
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.1);
          transition: background 0.2s, color 0.2s;
        }
        .nb-mobile-login:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .nb-mobile-signup {
          color: #fff;
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          box-shadow: 0 2px 12px rgba(99,102,241,0.3);
        }
      `}</style>

      <nav className={`nb-root${scrolled ? " scrolled" : ""}`}>
        <div className="nb-inner">
          {/* Logo */}
          <Link href="/" className="nb-logo">
            <div className="nb-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span className="nb-logo-text">Code Clash</span>
          </Link>

          {/* Desktop Nav */}
          <div className="nb-links">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nb-link">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="nb-auth">
            <div className="nb-divider" />
            <Link href="/login" className="nb-btn-ghost">Log in</Link>
            <Link href="/signup" className="nb-btn-primary">Sign up →</Link>
          </div>

          {/* Hamburger */}
          <button
            className="nb-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`nb-mobile${mobileOpen ? " open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nb-mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="nb-mobile-divider" />
          <div className="nb-mobile-auth">
            <Link href="/login" className="nb-mobile-login" onClick={() => setMobileOpen(false)}>Log in</Link>
            <Link href="/signup" className="nb-mobile-signup" onClick={() => setMobileOpen(false)}>Sign up</Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;