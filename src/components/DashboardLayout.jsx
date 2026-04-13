import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useTheme } from "../theme/ThemeContext";

export default function DashboardLayout({ children }) {
  const { theme } = useTheme();
  const t = theme.colors;

  return (
    <>
      <style>{`
        .layout-root {
          min-height: 100vh;
          background: ${t.bg};
          color: ${t.text};
          font-family: ${theme.fonts.body};
          transition: background ${theme.transitions.base}, color ${theme.transitions.base};
        }
        .layout-body {
          display: flex;
          min-height: calc(100vh - 60px);
        }
        .layout-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background: ${t.bg};
        }
      `}</style>
      <div className="layout-root">
        <Navbar />
        <div className="layout-body">
          <Sidebar />
          <main className="layout-content">{children}</main>
        </div>
      </div>
    </>
  );
}
