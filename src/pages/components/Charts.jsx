import { useTheme } from "@/theme/ThemeContext";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, theme }) {
  const t = theme.colors;
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: t.bgCard,
        border: `1px solid ${t.borderStrong}`,
        borderRadius: theme.radius.sm,
        padding: "0.6rem 0.9rem",
        fontFamily: theme.fonts.mono,
        fontSize: "0.75rem",
        color: t.text,
        boxShadow: theme.shadows.md,
      }}
    >
      <div style={{ color: t.textSecondary, marginBottom: 4 }}>{label}</div>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          style={{ color: entry.color, fontWeight: 500 }}
        >
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  );
}

// ── Query Line Chart ──────────────────────────────────────────────────────────
export function QueryLineChart({ queries }) {
  const { theme } = useTheme();
  const t = theme.colors;

  const data = [
    { day: "Mon", count: 4 },
    { day: "Tue", count: 7 },
    { day: "Wed", count: 3 },
    { day: "Thu", count: 9 },
    { day: "Fri", count: 12 },
    { day: "Sat", count: 6 },
    { day: "Sun", count: queries?.length || 8 },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.accent} stopOpacity={0.25} />
            <stop offset="100%" stopColor={t.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          stroke={t.border}
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{
            fontFamily: theme.fonts.mono,
            fontSize: 11,
            fill: t.textSecondary,
          }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{
            fontFamily: theme.fonts.mono,
            fontSize: 11,
            fill: t.textSecondary,
          }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Area
          type="monotone"
          dataKey="count"
          name="Queries"
          stroke={t.accent}
          strokeWidth={2}
          fill="url(#accentGrad)"
          dot={{ fill: t.accent, r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: t.accent }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Interest Pie Chart ────────────────────────────────────────────────────────
export function InterestPieChart({ interest }) {
  const { theme } = useTheme();
  const t = theme.colors;

  const safeInterest = Array.isArray(interest) ? interest : [];

  const counts = safeInterest.reduce((acc, item) => {
    if (!item?.source) return acc; // safety
    acc[item.source] = (acc[item.source] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  const COLORS =
    theme.mode === "dark"
      ? [
          "#C8F135",
          "#4ADE80",
          "rgba(200,241,53,0.6)",
          "rgba(74,222,128,0.6)",
          "rgba(200,241,53,0.3)",
        ]
      : [
          "#1A1A18",
          "#22A06B",
          "rgba(26,26,24,0.6)",
          "rgba(34,160,107,0.6)",
          "rgba(26,26,24,0.3)",
        ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Legend
          wrapperStyle={{
            fontFamily: theme.fonts.mono,
            fontSize: "11px",
            color: t.textSecondary,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Default export (combined) ─────────────────────────────────────────────────
export default function Charts({ queries, interest }) {
  const { theme } = useTheme();
  const t = theme.colors;

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}
    >
      <div
        style={{
          background: t.bgCard,
          border: `1px solid ${t.border}`,
          borderRadius: theme.radius.md,
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          Query Volume
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: "0.75rem",
            color: t.textSecondary,
            marginBottom: "1.25rem",
          }}
        >
          7-day trend
        </div>
        <QueryLineChart queries={queries} />
      </div>

      <div
        style={{
          background: t.bgCard,
          border: `1px solid ${t.border}`,
          borderRadius: theme.radius.md,
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          Interest by Source
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: "0.75rem",
            color: t.textSecondary,
            marginBottom: "1.25rem",
          }}
        >
          distribution
        </div>
        <InterestPieChart interest={interest} />
      </div>
    </div>
  );
}
