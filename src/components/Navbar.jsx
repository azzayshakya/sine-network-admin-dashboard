import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "../theme/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { theme, isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Queries", href: "/queries" },
    { label: "Interest", href: "/interest" },
    { label: "Settings", href: "/settings" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const t = theme.colors;

  return (
    <>
      <style>{`
        .navbar {
          background: ${t.bgCard};
          border-bottom: 1px solid ${t.border};
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: background ${theme.transitions.base};
        }
        .nav-logo {
          font-family: ${theme.fonts.display};
          font-size: 1.1rem;
          font-weight: 700;
          color: ${t.accent};
          letter-spacing: -0.02em;
          margin-right: 0.5rem;
          white-space: nowrap;
          cursor: pointer;
        }
        .nav-logo em { color: ${t.text}; font-style: normal; }
        .nav-items { display: flex; align-items: center; gap: 0.25rem; flex: 1; }
        .nav-item {
          padding: 0.45rem 0.85rem;
          border-radius: ${theme.radius.sm};
          font-size: 0.83rem;
          font-weight: 500;
          cursor: pointer;
          color: ${t.textSecondary};
          border: none;
          background: none;
          font-family: ${theme.fonts.body};
          transition: all ${theme.transitions.fast};
        }
        .nav-item:hover { color: ${t.text}; background: ${t.surface}; }
        .nav-item.active {
          color: ${t.accentText};
          background: ${t.accent};
        }
        .nav-right { display: flex; align-items: center; gap: 0.75rem; margin-left: auto; }
        .theme-toggle {
          background: ${t.surface};
          border: 1px solid ${t.border};
          border-radius: ${theme.radius.full};
          width: 48px; height: 26px;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
          transition: all ${theme.transitions.base};
        }
        .theme-toggle::after {
          content: '';
          position: absolute;
          top: 3px; left: 3px;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: ${t.accent};
          transition: transform ${theme.transitions.spring};
          transform: ${isDark ? "translateX(0)" : "translateX(22px)"};
        }
        .avatar-badge {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: ${t.accent};
          color: ${t.accentText};
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700;
          font-family: ${theme.fonts.display};
          cursor: pointer;
          flex-shrink: 0;
        }
        .user-menu { position: relative; }
        .dropdown {
          position: absolute;
          top: calc(100% + 8px); right: 0;
          background: ${t.bgCard};
          border: 1px solid ${t.borderStrong};
          border-radius: ${theme.radius.md};
          padding: 0.5rem;
          min-width: 190px;
          z-index: 200;
          box-shadow: ${theme.shadows.lg};
          animation: dropIn 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: none; }
        }
        .drop-header {
          padding: 0.5rem 0.75rem 0.75rem;
          border-bottom: 1px solid ${t.border};
          margin-bottom: 0.5rem;
        }
        .drop-name { font-weight: 600; font-size: 0.85rem; font-family: ${theme.fonts.display}; color: ${t.text}; }
        .drop-email { font-size: 0.75rem; color: ${t.textSecondary}; font-family: ${theme.fonts.mono}; }
        .drop-item {
          padding: 0.55rem 0.75rem;
          border-radius: ${theme.radius.sm};
          font-size: 0.83rem;
          cursor: pointer;
          color: ${t.textSecondary};
          transition: all ${theme.transitions.fast};
          display: flex; align-items: center; gap: 0.5rem;
        }
        .drop-item:hover { background: ${t.surface}; color: ${t.text}; }
        .drop-item.danger:hover { background: rgba(255,107,107,0.1); color: ${t.danger}; }
      `}</style>

      <nav className="navbar">
        <div className="nav-logo" onClick={() => router.push("/dashboard")}>
          DASH<em>X</em>
        </div>

        <div className="nav-items">
          {navItems.map((item) => (
            <button
              key={item.href}
              className={`nav-item ${router.pathname === item.href ? "active" : ""}`}
              onClick={() => router.push(item.href)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="nav-right">
          <button
            className="theme-toggle"
            onClick={toggle}
            title="Toggle theme"
          />

          <div className="user-menu" ref={dropRef}>
            <div
              className="avatar-badge"
              onClick={() => setDropOpen((p) => !p)}
            >
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>

            {dropOpen && (
              <div className="dropdown">
                <div className="drop-header">
                  <div className="drop-name">{user?.name}</div>
                  <div className="drop-email">{user?.email}</div>
                </div>
                <div
                  className="drop-item"
                  onClick={() => {
                    router.push("/settings");
                    setDropOpen(false);
                  }}
                >
                  ⚙ Settings
                </div>
                <div
                  className="drop-item danger"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  ↩ Sign out
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
