import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/theme/ThemeContext";
import Chart from "chart.js/auto";
import { getInterest, getQueries } from "@/apis/apiServices";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function dayKey(iso) {
  return iso.slice(0, 10);
}

function getLast(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

// ── KPI Cards ─────────────────────────────────────────────────────────────────
function KPIGrid({ queries, interest, theme }) {
  const t = theme.colors;
  const totalQ = queries.length;
  const totalI = interest.filter((d) => d.interest).length;
  const rate =
    interest.length > 0 ? Math.round((totalI / interest.length) * 100) : 0;
  const locs = new Set(queries.map((q) => q.location)).size;

  const cards = [
    { label: "Total queries", value: totalQ, sub: "All submissions" },
    {
      label: "Interest clicks",
      value: interest.length,
      sub: `${totalI} positive`,
    },
    { label: "Interest rate", value: `${rate}%`, sub: "Positive responses" },
    { label: "Unique cities", value: locs, sub: "Locations tracked" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10,
        marginBottom: "1.5rem",
      }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            background: t.surface,
            borderRadius: theme.radius.md,
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: t.textSecondary,
              marginBottom: 6,
              fontFamily: theme.fonts.mono,
            }}
          >
            {c.label}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: t.text,
              lineHeight: 1,
            }}
          >
            {c.value}
          </div>
          <div
            style={{
              fontSize: 11,
              color: t.textSecondary,
              marginTop: 4,
              fontFamily: theme.fonts.mono,
            }}
          >
            {c.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Filter Buttons ────────────────────────────────────────────────────────────
function FilterButtons({ options, active, onChange, theme }) {
  const t = theme.colors;
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            fontSize: 10,
            padding: "3px 8px",
            borderRadius: theme.radius.full,
            border: `0.5px solid ${
              active === opt.value ? t.text : t.borderStrong
            }`,
            background: active === opt.value ? t.text : "transparent",
            color: active === opt.value ? t.bgCard : t.textSecondary,
            cursor: "pointer",
            fontFamily: theme.fonts.mono,
            transition: theme.transitions.fast,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Card Wrapper ──────────────────────────────────────────────────────────────
function Card({ title, sub, filter, children, theme }) {
  const t = theme.colors;
  return (
    <div
      style={{
        background: t.bgCard,
        border: `1px solid ${t.border}`,
        borderRadius: theme.radius.md,
        padding: "1.25rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 500,
              fontSize: 13,
              color: t.text,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 11,
              color: t.textSecondary,
              marginTop: 2,
              fontFamily: theme.fonts.mono,
            }}
          >
            {sub}
          </div>
        </div>
        {filter}
      </div>
      {children}
    </div>
  );
}

// ── Query Volume Bar Chart ────────────────────────────────────────────────────
function QueryVolumeChart({ queries, theme }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [range, setRange] = useState(7);
  const t = theme.colors;
  const isDark = theme.mode === "dark";

  useEffect(() => {
    const days = getLast(range);
    const counts = {};
    days.forEach((d) => (counts[d] = 0));
    queries.forEach((q) => {
      const k = dayKey(q.createdAt);
      if (counts[k] !== undefined) counts[k]++;
    });
    const labels = days.map((d) =>
      new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
    );
    const data = days.map((d) => counts[d]);

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Queries",
            data,
            backgroundColor: isDark
              ? "rgba(55,138,221,0.7)"
              : "rgba(55,138,221,0.6)",
            borderColor: "#378ADD",
            borderWidth: 1.5,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.parsed.y} queries` },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 10 },
              color: isDark ? "#a0a0a0" : "#888",
              maxRotation: 45,
            },
            border: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 10 },
              color: isDark ? "#a0a0a0" : "#888",
            },
            grid: {
              color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            },
            border: { display: false },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [range, queries, theme.mode]);

  return (
    <Card
      title="Query volume"
      sub="Submissions over time"
      theme={theme}
      filter={
        <FilterButtons
          options={[
            { label: "7d", value: 7 },
            { label: "14d", value: 14 },
            { label: "30d", value: 30 },
          ]}
          active={range}
          onChange={setRange}
          theme={theme}
        />
      }
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 10,
          fontSize: 11,
          color: t.textSecondary,
          fontFamily: theme.fonts.mono,
        }}
      >
        <span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: 2,
              background: "#378ADD",
              marginRight: 4,
            }}
          />
          Queries per day
        </span>
      </div>
      <div style={{ position: "relative", width: "100%", height: 200 }}>
        <canvas ref={canvasRef} />
      </div>
    </Card>
  );
}

// ── Interest Chart ────────────────────────────────────────────────────────────
function InterestChart({ interest, theme }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [period, setPeriod] = useState("daily");
  const t = theme.colors;
  const isDark = theme.mode === "dark";

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();

    if (period === "daily") {
      const days = getLast(7);
      const labels = days.map((d) =>
        new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
      );
      const trueData = days.map(
        (d) =>
          interest.filter((i) => dayKey(i.createdAt) === d && i.interest)
            .length,
      );
      const falseData = days.map(
        (d) =>
          interest.filter((i) => dayKey(i.createdAt) === d && !i.interest)
            .length,
      );

      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Interested",
              data: trueData,
              backgroundColor: isDark
                ? "rgba(99,153,34,0.8)"
                : "rgba(99,153,34,0.7)",
              borderColor: "#639922",
              borderWidth: 1.5,
              borderRadius: 3,
            },
            {
              label: "Not interested",
              data: falseData,
              backgroundColor: isDark
                ? "rgba(136,135,128,0.8)"
                : "rgba(136,135,128,0.5)",
              borderColor: "#888780",
              borderWidth: 1.5,
              borderRadius: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: {
                font: { size: 9 },
                color: isDark ? "#a0a0a0" : "#888",
                maxRotation: 45,
              },
              border: { display: false },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: { size: 10 },
                color: isDark ? "#a0a0a0" : "#888",
              },
              grid: {
                color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              },
              border: { display: false },
            },
          },
        },
      });
    } else {
      const trueCount = interest.filter((d) => d.interest).length;
      const falseCount = interest.filter((d) => !d.interest).length;

      chartRef.current = new Chart(canvasRef.current, {
        type: "doughnut",
        data: {
          labels: ["Interested", "Not interested"],
          datasets: [
            {
              data: [trueCount, falseCount],
              backgroundColor: [
                "rgba(99,153,34,0.85)",
                "rgba(136,135,128,0.6)",
              ],
              borderColor: [
                isDark ? "#27500A" : "#3B6D11",
                isDark ? "#444441" : "#B4B2A9",
              ],
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  `${ctx.label}: ${ctx.parsed} (${Math.round(
                    (ctx.parsed / interest.length) * 100,
                  )}%)`,
              },
            },
          },
        },
      });
    }

    return () => chartRef.current?.destroy();
  }, [period, interest, theme.mode]);

  const trueCount = interest.filter((d) => d.interest).length;
  const falseCount = interest.filter((d) => !d.interest).length;
  const total = interest.length || 1;

  return (
    <Card
      title="Interest rate"
      sub="Button clicks tracked"
      theme={theme}
      filter={
        <FilterButtons
          options={[
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
          ]}
          active={period}
          onChange={setPeriod}
          theme={theme}
        />
      }
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 10,
          fontSize: 11,
          color: t.textSecondary,
          fontFamily: theme.fonts.mono,
        }}
      >
        <span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: 2,
              background: "#639922",
              marginRight: 4,
            }}
          />
          Interested {Math.round((trueCount / total) * 100)}%
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: 2,
              background: "#888780",
              marginRight: 4,
            }}
          />
          Not interested {Math.round((falseCount / total) * 100)}%
        </span>
      </div>
      <div style={{ position: "relative", width: "100%", height: 200 }}>
        <canvas ref={canvasRef} />
      </div>
    </Card>
  );
}

// ── Submissions Table ─────────────────────────────────────────────────────────
const LOC_COLORS = ["badge-blue", "badge-green", "badge-amber"];

function SubmissionsTable({ queries, theme }) {
  const t = theme.colors;
  const [activeLoc, setActiveLoc] = useState("All");

  const locs = ["All", ...new Set(queries.map((q) => q.location))];
  const locColorMap = {};
  [...new Set(queries.map((q) => q.location))].forEach(
    (l, i) => (locColorMap[l] = LOC_COLORS[i % LOC_COLORS.length]),
  );

  const filtered =
    activeLoc === "All"
      ? queries
      : queries.filter((q) => q.location === activeLoc);

  const badgeStyle = (loc) => {
    const palettes = {
      "badge-blue": { bg: "#E6F1FB", color: "#185FA5" },
      "badge-green": { bg: "#EAF3DE", color: "#3B6D11" },
      "badge-amber": { bg: "#FAEEDA", color: "#854F0B" },
    };
    const p = palettes[locColorMap[loc]] || palettes["badge-blue"];
    return {
      display: "inline-block",
      fontSize: 10,
      padding: "2px 7px",
      borderRadius: 999,
      fontWeight: 500,
      background: p.bg,
      color: p.color,
    };
  };

  return (
    <Card
      title="Recent submissions"
      sub="Latest query records"
      theme={theme}
      filter={
        <FilterButtons
          options={locs.map((l) => ({ label: l, value: l }))}
          active={activeLoc}
          onChange={setActiveLoc}
          theme={theme}
        />
      }
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
      >
        <thead>
          <tr>
            {["Email", "Phone", "Location", "Message", "Date"].map((h) => (
              <th
                key={h}
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: t.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "0 8px 8px",
                  textAlign: "left",
                  borderBottom: `0.5px solid ${t.border}`,
                  fontFamily: theme.fonts.mono,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                style={{
                  textAlign: "center",
                  color: t.textSecondary,
                  padding: "2rem",
                  fontSize: 12,
                }}
              >
                No data found
              </td>
            </tr>
          ) : (
            filtered.map((q, i) => (
              <tr key={q._id || i}>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: `0.5px solid ${t.border}`,
                    maxWidth: 160,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: t.text,
                  }}
                >
                  {q.email}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: `0.5px solid ${t.border}`,
                    color: t.textSecondary,
                  }}
                >
                  {q.phone}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: `0.5px solid ${t.border}`,
                  }}
                >
                  <span style={badgeStyle(q.location)}>{q.location}</span>
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: `0.5px solid ${t.border}`,
                    maxWidth: 180,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: t.textSecondary,
                  }}
                >
                  {q.message}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: `0.5px solid ${t.border}`,
                    whiteSpace: "nowrap",
                    color: t.textSecondary,
                  }}
                >
                  {fmtDate(q.createdAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Charts() {
  const { theme } = useTheme();
  const [queries, setQueries] = useState([]);
  const [interest, setInterest] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [queriesData, interestData] = await Promise.all([
          getQueries(),
          getInterest(),
        ]);

        setQueries(queriesData);
        setInterest(interestData);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return (
      <div
        style={{
          color: theme.colors.textSecondary,
          fontFamily: theme.fonts.mono,
          fontSize: 13,
          padding: "2rem",
          textAlign: "center",
        }}
      >
        Loading analytics...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <KPIGrid queries={queries} interest={interest} theme={theme} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1rem",
        }}
      >
        <QueryVolumeChart queries={queries} theme={theme} />
        <InterestChart interest={interest} theme={theme} />
      </div>

      <SubmissionsTable queries={queries} theme={theme} />
    </div>
  );
}
