"use client";

import Sidebar from "@/components/layout/Sidebar";
import { mockUser, mockSkills, mockWeeklyActivity, mockProblems, mockRoadmap } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { Flame, Zap, Trophy, Code2, TrendingUp, ArrowRight, Star, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const today = new Date();

function StreakHeatmap() {
  const activityData: Record<string, number> = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user_weekly_activity") || "{}")
    : {};

  const weeks: string[][] = [];
  const days: string[] = [];
  for (let i = 181; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getColor = (key: string) => {
    const val = activityData[key] || 0;
    if (!val) return "rgba(255,255,255,0.05)";
    if (val === 1) return "rgba(124,58,237,0.25)";
    if (val === 2) return "rgba(124,58,237,0.45)";
    if (val === 3) return "rgba(124,58,237,0.65)";
    return "rgba(124,58,237,0.9)";
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "flex", gap: 3 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {week.map((day, di) => (
              <div
                key={di}
                className="heatmap-cell"
                style={{ background: getColor(day) }}
                title={`${day}: ${activityData[day] || 0} problems`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillRing({ name, score, color }: { name: string; score: number; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (score / 100) * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: 72, height: 72 }}>
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
          <circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="ring-progress"
            style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
          {score}
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#64748B", textAlign: "center", lineHeight: 1.3 }}>{name}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-dark" style={{ padding: "10px 14px", borderRadius: 10, fontSize: 13 }}>
        <div style={{ color: "#94A3B8", marginBottom: 4 }}>{label}</div>
        <div style={{ color: "#A855F7", fontWeight: 700 }}>{payload[0]?.value} problems</div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [dynamicSkills, setDynamicSkills] = useState(mockSkills);
  const [dynamicWeeklyActivity, setDynamicWeeklyActivity] = useState(mockWeeklyActivity);

  const overallScore = Math.round(dynamicSkills.reduce((a, s) => a + s.score, 0) / Math.max(1, dynamicSkills.length));
  const interviewReady = Math.round(overallScore * 0.85);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const emailPrefix = user.email?.split("@")[0] || "User";
        const displayName = user.user_metadata?.full_name || emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
        
        // Read stats from localStorage to sync with dashboard
        const storedStreak = parseInt(localStorage.getItem("user_streak") || "0");
        const storedXP = parseInt(localStorage.getItem("user_xp") || "0");
        const storedProblems = parseInt(localStorage.getItem("user_problems_solved") || "0");
        
        setUserData({
          name: displayName,
          streak: storedStreak,
          totalXP: storedXP,
          problemsSolved: storedProblems,
          college: "CodeBridge AI",
        });
      }
      
      // Load dynamic skills
      const storedSkills = JSON.parse(localStorage.getItem("user_skills") || "{}");
      if (Object.keys(storedSkills).length > 0) {
        setDynamicSkills(mockSkills.map(s => ({
          ...s,
          score: storedSkills[s.name] !== undefined ? storedSkills[s.name] : s.score
        })));
      } else {
        // Init if empty
        const initialSkills: any = {};
        mockSkills.forEach(s => initialSkills[s.name] = 10);
        localStorage.setItem("user_skills", JSON.stringify(initialSkills));
        setDynamicSkills(mockSkills.map(s => ({ ...s, score: 10 })));
      }

      // Load weekly activity
      const storedActivity = JSON.parse(localStorage.getItem("user_weekly_activity") || "{}");
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const newWeekly = [];
      for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          newWeekly.push({
              day: days[d.getDay()],
              problems: storedActivity[dateStr] || 0,
              xp: (storedActivity[dateStr] || 0) * 50
          });
      }
      setDynamicWeeklyActivity(newWeekly);

    });
  }, [supabase]);

  const displayUser = userData || { ...mockUser, name: "Loading...", streak: 0, totalXP: 0, problemsSolved: 0 };

  return (
    <div style={{ display: "flex", background: "#0A0A0F", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, padding: "32px 36px", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Welcome back, {displayUser.name.split(" ")[0]}! 👋
            </h1>
            <p style={{ color: "#64748B", marginTop: 4 }}>
              {displayUser.streak} day streak · {displayUser.totalXP.toLocaleString()} XP earned · {displayUser.college}
            </p>
          </div>
          <Link href="/playground" className="btn-primary" style={{ flexShrink: 0 }}>
            <Zap size={16} /> Solve Today's Problem
          </Link>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Coding Streak", value: `${displayUser.streak}d`, icon: Flame, color: "#F59E0B", sub: `Personal best: ${Math.max(21, displayUser.streak)}d` },
            { label: "Interview Ready", value: `${interviewReady}%`, icon: Trophy, color: "#7C3AED", sub: "+8% this week" },
            { label: "Problems Solved", value: `${displayUser.problemsSolved}`, icon: Code2, color: "#3B82F6", sub: `${displayUser.problemsSolved} this month` },
            { label: "Skill Score", value: `${overallScore}/100`, icon: Star, color: "#10B981", sub: "Top 23% of students" },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="glass card-hover" style={{ padding: "20px 22px", borderRadius: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>{kpi.label}</div>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `${kpi.color}18`, border: `1px solid ${kpi.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={kpi.color} />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 4 }}>{kpi.value}</div>
                <div style={{ fontSize: 12, color: kpi.color }}>{kpi.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginBottom: 20 }}>

          {/* Weekly Activity Chart */}
          <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Weekly Activity</h3>
                <p style={{ fontSize: 12, color: "#64748B" }}>Problems solved per day</p>
              </div>
              <span className="badge badge-purple"><TrendingUp size={10} /> +34% vs last week</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dynamicWeeklyActivity} barSize={24}>
                <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="problems" fill="url(#purpleGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Rings */}
          <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Skill Breakdown</h3>
            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>Based on your last submissions</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {dynamicSkills.map((s, i) => <SkillRing key={i} {...s} />)}
            </div>
          </div>
        </div>

        {/* Streak + Roadmap Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

          {/* Streak Heatmap */}
          <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Flame size={18} color="#F59E0B" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Coding Streak</h3>
              <span className="badge badge-orange" style={{ marginLeft: "auto" }}>🔥 {displayUser.streak} days</span>
            </div>
            <StreakHeatmap />
            <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11, color: "#475569", alignItems: "center" }}>
              <span>Less</span>
              {["rgba(255,255,255,0.05)", "rgba(124,58,237,0.2)", "rgba(124,58,237,0.4)", "rgba(124,58,237,0.65)", "rgba(124,58,237,0.9)"].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
              ))}
              <span>More</span>
            </div>
          </div>

          {/* Learning Roadmap */}
          <div className="glass" style={{ padding: 24, borderRadius: 20, overflowY: "auto", maxHeight: 320 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Learning Roadmap</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(() => {
                const solved = displayUser.problemsSolved || 0;
                // Thresholds: phase completes when user hits cumulative problem count
                const thresholds = [5, 15, 30, 50, 70];
                return mockRoadmap.map((phase, i) => {
                  let status: string;
                  if (solved >= thresholds[i]) {
                    status = "completed";
                  } else if (i === 0 || solved >= thresholds[i - 1]) {
                    status = "active";
                  } else {
                    status = "locked";
                  }
                  const phaseProblems = thresholds[i] - (i > 0 ? thresholds[i - 1] : 0);
                  const phaseSolved = Math.max(0, Math.min(phaseProblems, solved - (i > 0 ? thresholds[i - 1] : 0)));
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: status === "active" ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${status === "active" ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: status === "completed" ? "#10B981" : status === "active" ? "#7C3AED" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {status === "completed" ? <CheckCircle2 size={14} color="#fff" /> : status === "locked" ? <Lock size={12} color="#64748B" /> : <PlayCircle size={14} color="#fff" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: status === "locked" ? "#475569" : "#fff" }}>{phase.title}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{phase.duration} · {status === "active" ? `${phaseSolved}/${phaseProblems} solved` : `${phase.problems} problems`}</div>
                      </div>
                      {status === "active" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                            <div style={{ width: `${(phaseSolved / phaseProblems) * 100}%`, height: "100%", background: "#7C3AED", borderRadius: 2, transition: "width 0.5s ease" }} />
                          </div>
                          <span className="badge badge-purple" style={{ fontSize: 9 }}>Active</span>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Suggested Problems */}
        <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Suggested for You</h3>
            <Link href="/playground" style={{ fontSize: 13, color: "#7C3AED", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {mockProblems.slice(0, 4).map((p, i) => (
              <Link key={i} href={`/playground?id=${p.id}`} style={{ textDecoration: "none" }}>
                <div className="ticket-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{p.title}</span>
                    <span className={`badge ${p.difficulty === "Easy" ? "badge-green" : p.difficulty === "Medium" ? "badge-orange" : "badge-red"}`} style={{ fontSize: 9, flexShrink: 0 }}>
                      {p.difficulty}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {p.tags.map((tag, ti) => (
                      <span key={ti} className="badge badge-blue" style={{ fontSize: 9 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "#475569" }}>
                    <span>{p.solved ? "✅ Solved" : "⬜ Unsolved"}</span>
                    <span style={{ color: "#A855F7" }}>+{p.xp} XP</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
