import { useRouter } from "next/router";
import { useTheme } from "../theme/ThemeContext";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: "grid" }],
  },
  {
    label: "Data",
    items: [
      { label: "Queries", href: "/queries", icon: "search" },
      { label: "Interest", href: "/interest", icon: "heart" },
    ],
  },
  {
    label: "System",
    items: [{ label: "Settings", href: "/settings", icon: "settings" }],
  },
];

function Icon({ name }) {
  const icons = {
    grid: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
    search: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="7" cy="7" r="5" />
        <line x1="11" y1="11" x2="15" y2="15" />
      </svg>
    ),
    heart: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M8 13C8 13 2 9.5 2 5.5C2 3.6 3.6 2 5.5 2C6.7 2 7.7 2.6 8 3.4C8.3 2.6 9.3 2 10.5 2C12.4 2 14 3.6 14 5.5C14 9.5 8 13 8 13Z" />
      </svg>
    ),
    settings: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="8" cy="8" r="2.5" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function Sidebar() {
  const { theme } = useTheme();
  const router = useRouter();
  const t = theme.colors;

  return (
    <>
      <style>{`
        .sidebar {
          width: 220px;
          background: ${t.bgSecondary};
          border-right: 1px solid ${t.border};
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex-shrink: 0;
          transition: background ${theme.transitions.base};
        }
        .side-section {
          font-size: 0.65rem;
          font-weight: 600;
          color: ${t.textTertiary};
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-family: ${theme.fonts.mono};
          padding: 0 0.5rem;
          margin: 0.75rem 0 0.35rem;
        }
        .side-item {
          padding: 0.6rem 0.75rem;
          border-radius: ${theme.radius.sm};
          font-size: 0.83rem;
          cursor: pointer;
          color: ${t.textSecondary};
          transition: all ${theme.transitions.fast};
          display: flex;
          align-items: center;
          gap: 0.65rem;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: ${theme.fonts.body};
        }
        .side-item:hover { color: ${t.text}; background: ${t.surface}; }
        .side-item.active {
          color: ${t.accent};
          background: ${isDark(theme) ? "rgba(200,241,53,0.08)" : "rgba(26,26,24,0.06)"};
        }
        .side-item .icon { opacity: 0.7; flex-shrink: 0; }
        .side-item.active .icon { opacity: 1; }
        .side-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: ${t.accent};
          margin-left: auto;
          opacity: 0;
          transition: opacity ${theme.transitions.fast};
        }
        .side-item.active .side-dot { opacity: 1; }
      `}</style>

      <aside className="sidebar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="side-section">{section.label}</div>
            {section.items.map((item) => (
              <button
                key={item.href}
                className={`side-item ${router.pathname === item.href ? "active" : ""}`}
                onClick={() => router.push(item.href)}
              >
                <span className="icon">
                  <Icon name={item.icon} />
                </span>
                {item.label}
                <span className="side-dot" />
              </button>
            ))}
          </div>
        ))}
      </aside>
    </>
  );
}

function isDark(theme) {
  return theme.mode === "dark";
}
