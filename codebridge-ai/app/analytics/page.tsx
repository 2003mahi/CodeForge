"use client";

import Sidebar from "@/components/layout/Sidebar";
import { mockAnalyticsData } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { BarChart3, TrendingUp, CheckCircle, Award, Target, Calendar } from "lucide-react";

export default function Analytics() {
  const data = mockAnalyticsData;

  const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="glass-dark" style={{ padding: "10px 14px", borderRadius: 10, fontSize: 12 }}>
          <div style={{ color: "#94A3B8", marginBottom: 4 }}>{label}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {payload.map((p: any, i: number) => (
              <div key={i} style={{ color: p.color }}>
                {p.name}: <strong style={{ color: "#fff" }}>{p.value}</strong>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: "flex", background: "#0A0A0F", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, padding: "32px 36px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <BarChart3 size={22} color="#7C3AED" />
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Skill Analytics</h1>
            </div>
            <p style={{ color: "#64748B" }}>Track your growth, topic mastery levels, and company interview readiness.</p>
          </div>
          <span className="badge badge-purple" style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Calendar size={12} /> Last 6 Weeks
          </span>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Growth Chart */}
          <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Weekly Skill Acceleration</h3>
                <p style={{ fontSize: 12, color: "#64748B" }}>Score trajectory and problems completed</p>
              </div>
              <span className="badge badge-green" style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <TrendingUp size={11} /> +18.4%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.growthChart}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area type="monotone" dataKey="score" name="Overall Score" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                <Area type="monotone" dataKey="problems" name="Problems Completed" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorProblems)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Interview Readiness radar */}
          <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Interview Readiness</h3>
            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>Performance across core competencies</p>
            <div style={{ height: 200, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.interviewReadiness}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "#64748B", fontSize: 10 }} />
                  <Radar name="Readiness" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Topic Mastery Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Topic Mastery Bar Chart */}
          <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Topic Mastery Levels</h3>
            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>Mastery percentage by coding area</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.topicMastery} layout="vertical" barSize={12}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="topic" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomAreaTooltip />} />
                <Bar dataKey="mastery" fill="#7C3AED" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendations and Insights */}
          <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16 }}>AI Insights & Recommendations</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "Strengthen System Design", desc: "Your system design competency is currently at 40%. Consider starting the URL Shortener lab.", status: "alert", color: "#EF4444" },
                { title: "Consistency is High", desc: "You have completed 18 problems over W4 to W6. Your coding streak is in top 10%.", status: "success", color: "#10B981" },
                { title: "Data Structures Peak", desc: "Mastery of Arrays & Strings exceeds 78%. Start transitioning to Trees & Graphs.", status: "info", color: "#3B82F6" },
              ].map((rec, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.02)",
                    borderLeft: `4px solid ${rec.color}`,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>{rec.title}</div>
                  <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>{rec.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
