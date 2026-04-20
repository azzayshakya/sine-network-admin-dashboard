import { useTheme } from "@/theme/ThemeContext";
import { useEffect, useState } from "react";
import { FiUsers, FiMessageSquare, FiTrendingUp } from "react-icons/fi";

export default function AdminPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const styles = {
    container: {
      background: theme.colors.bg,
      color: theme.colors.text,
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: theme.fonts.body,
      transition: theme.transitions.base,
    },
    header: {
      fontSize: "2rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
    },
    subtext: {
      color: theme.colors.textSecondary,
      marginBottom: "2rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "1.5rem",
    },
    card: {
      background: theme.colors.bgCard,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.md,
      padding: "1.5rem",
      boxShadow: theme.shadows.md,
      transform: mounted ? "translateY(0px)" : "translateY(20px)",
      opacity: mounted ? 1 : 0,
      transition: theme.transitions.spring,
      cursor: "pointer",
    },
    icon: {
      fontSize: "1.8rem",
      marginBottom: "0.8rem",
      color: theme.colors.accent,
    },
    title: {
      fontSize: "1.2rem",
      fontWeight: "500",
    },
    value: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginTop: "0.5rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Admin Dashboard</div>
      <div style={styles.subtext}>
        This is the admin page. Here you can see user interests and queries.
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <FiUsers style={styles.icon} />
          <div style={styles.title}>Total Interests</div>
          <div style={styles.value}>124</div>
        </div>

        <div style={styles.card}>
          <FiMessageSquare style={styles.icon} />
          <div style={styles.title}>User Queries</div>
          <div style={styles.value}>89</div>
        </div>

        <div style={styles.card}>
          <FiTrendingUp style={styles.icon} />
          <div style={styles.title}>Trending Topics</div>
          <div style={styles.value}>12</div>
        </div>
      </div>
    </div>
  );
}
