"use client";

import Sidebar from "@/components/layout/Sidebar";
import { mockUser, mockSkills, mockWeeklyActivity, mockProblems, mockRoadmap } from "@/lib/mockData";
import { striverProblems } from "@/lib/striverProblems";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { Flame, Zap, Trophy, Code2, TrendingUp, ArrowRight, Star, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const getLocalDateString = (d: Date) => {
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - (offset * 60 * 1000));
  return local.toISOString().split("T")[0];
};

function StreakHeatmap({ activityData, createdYear = 2024 }: { activityData: Record<string, number>, createdYear?: number }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const earliestYearInActivity = Object.keys(activityData).reduce((earliest, dateStr) => {
      const year = parseInt(dateStr.split('-')[0]);
      return year < earliest ? year : earliest;
  }, currentYear);
  const startYear = Math.min(createdYear, earliestYearInActivity);
  
  const years = [];
  for (let y = currentYear; y >= startYear; y--) {
      years.push(y.toString());
  }

  const yearNum = parseInt(selectedYear);
  const startDate = new Date(yearNum, 0, 1);
  const endDate = new Date(yearNum, 11, 31);

  let totalSubmissions = 0;
  let totalActiveDays = 0;
  let maxStreak = 0;
  let curr = 0;

  const allDaysForStats = [];
  let statDate = new Date(startDate);
  while(statDate <= endDate) {
      allDaysForStats.push(getLocalDateString(statDate));
      statDate.setDate(statDate.getDate() + 1);
  }

  for (const day of allDaysForStats) {
      const val = activityData[day] || 0;
      totalSubmissions += val;
      if (val > 0) {
          totalActiveDays++;
          curr++;
          if (curr > maxStreak) maxStreak = curr;
      } else {
          curr = 0;
      }
  }

  const startDayOfWeek = startDate.getDay();
  const adjustedStartDate = new Date(startDate);
  adjustedStartDate.setDate(startDate.getDate() - startDayOfWeek);
  
  const allDays: string[] = [];
  const currentDateLoop = new Date(adjustedStartDate);
  while (currentDateLoop <= endDate) {
      allDays.push(getLocalDateString(currentDateLoop));
      currentDateLoop.setDate(currentDateLoop.getDate() + 1);
  }
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const gridWeeks = [];
  let lastMonth = -1;
  
  for (let i = 0; i < allDays.length; i += 7) {
      const weekDays = allDays.slice(i, i + 7);
      const firstDayDate = new Date(weekDays[0]);
      const month = firstDayDate.getMonth();
      let monthLabel = null;
      if (month !== lastMonth) {
          monthLabel = monthNames[month];
          lastMonth = month;
      }
      gridWeeks.push({ days: weekDays, monthLabel });
  }

  const getColor = (key: string) => {
    const val = activityData[key] || 0;
    if (!val) return "rgba(255,255,255,0.05)";
    if (val === 1) return "#0e4429";
    if (val === 2) return "#006d32";
    if (val === 3) return "#26a641";
    return "#39d353";
  };

  return (
    <div className="glass" style={{ padding: "20px 24px", borderRadius: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{totalSubmissions}</span>
          <span style={{ fontSize: 14, color: "#94A3B8" }}>
            submissions in {selectedYear}
          </span>
          <div style={{ width: 14, height: 14, borderRadius: "50%", border: "1px solid #64748B", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontSize: 10, cursor: "help" }}>i</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 13, color: "#94A3B8" }}>
          <div>Total active days: <span style={{ color: "#fff", fontWeight: 600 }}>{totalActiveDays}</span></div>
          <div>Max streak: <span style={{ color: "#fff", fontWeight: 600 }}>{maxStreak}</span></div>
          <div style={{ position: "relative" }}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ padding: "6px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 6, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {selectedYear} <span style={{ fontSize: 10 }}>▼</span>
            </div>
            {isDropdownOpen && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden", zIndex: 10, minWidth: 120 }}>
                {years.map(y => (
                  <div 
                    key={y}
                    onClick={() => { setSelectedYear(y); setIsDropdownOpen(false); }}
                    style={{ padding: "8px 12px", cursor: "pointer", fontSize: 13, color: y === selectedYear ? "#fff" : "#94A3B8", background: y === selectedYear ? "rgba(255,255,255,0.05)" : "transparent" }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseOut={e => e.currentTarget.style.background = y === selectedYear ? "rgba(255,255,255,0.05)" : "transparent"}
                  >
                    {y}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Wrapper */}
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: "max-content" }}>
          
          {/* Heatmap */}
          <div style={{ display: "flex", gap: 4 }}>
            {gridWeeks.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {week.days.map((day, di) => {
                  const dObj = new Date(day);
                  const isFuture = dObj > today;
                  const isWrongYear = dObj.getFullYear().toString() !== selectedYear;
                  return (
                    <div
                      key={di}
                      style={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: 2, 
                          background: getColor(day),
                          opacity: (isFuture || isWrongYear) ? 0 : 1
                      }}
                      title={`${day}: ${activityData[day] || 0} activity`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Month Labels */}
          <div style={{ display: "flex", gap: 4, height: 20, position: "relative", marginTop: 4 }}>
             {gridWeeks.map((week, wi) => (
               <div key={wi} style={{ width: 12, position: "relative" }}>
                 {week.monthLabel && (
                   <span style={{ position: "absolute", left: 0, top: 0, fontSize: 12, color: "#94A3B8" }}>
                     {week.monthLabel}
                   </span>
                 )}
               </div>
             ))}
          </div>
        </div>
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
  const [activityMap, setActivityMap] = useState<Record<string, number>>({});
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());

  const overallScore = Math.round(dynamicSkills.reduce((a, s) => a + s.score, 0) / Math.max(1, dynamicSkills.length));
  const interviewReady = Math.round(overallScore * 0.85);

  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    fetch("/api/me")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled || !res.user) return;
        const submissions = res.submissions || [];
        const solved = submissions.filter((s: any) => s.status === "solved");

        // Real activity heatmap from solved submission dates
        const act: Record<string, number> = {};
        solved.forEach((s: any) => {
          const day = getLocalDateString(new Date(s.updated_at));
          act[day] = (act[day] || 0) + 1;
        });
        setActivityMap(act);

        setSolvedIds(new Set(solved.map((s: any) => s.problem_id)));

        setUserData({
          name: res.user.name,
          streak: res.user.streak,
          totalXP: res.user.total_xp,
          problemsSolved: res.user.problems_solved,
          college: "CodeBridge AI",
          createdYear: new Date(res.user.created_at || Date.now()).getFullYear(),
        });

        // Weekly activity from real data
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const newWeekly = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = getLocalDateString(d);
          newWeekly.push({
            day: days[d.getDay()],
            problems: act[dateStr] || 0,
            xp: (act[dateStr] || 0) * 50,
          });
        }
        setDynamicWeeklyActivity(newWeekly);

        // Skills derived from solved problem tags (real data)
        const allProblems = [...mockProblems, ...striverProblems];
        const tagsByTitle: Record<string, string[]> = {};
        allProblems.forEach((p) => { tagsByTitle[p.title.toLowerCase()] = p.tags || []; });
        const catTags: Record<string, string[]> = {
          "Data Structures": ["Array", "Linked List", "Tree", "Matrix", "Stack", "Queue", "HashMap", "Hash Table", "Binary Tree"],
          "Algorithms": ["DP", "Greedy", "Graph", "Math", "Sorting", "Two Pointers", "Binary Search", "Recursion", "Backtracking", "Sliding Window", "Divide and Conquer"],
          "Debugging": ["Debugging", "Bug", "Conflict"],
          "SQL": ["SQL"],
        };
        const scores: Record<string, number> = {};
        mockSkills.forEach((s) => { scores[s.name] = 10; });
        solved.forEach((s: any) => {
          const tags = tagsByTitle[(s.problem_title || "").toLowerCase()] || [];
          for (const cat of Object.keys(catTags)) {
            if (tags.some((t: string) => catTags[cat].includes(t))) {
              scores[cat] = Math.min(100, (scores[cat] || 10) + 2);
            }
          }
          if (s.language === "sql") scores["SQL"] = Math.min(100, (scores["SQL"] || 10) + 5);
        });
        setDynamicSkills(mockSkills.map((s) => ({ ...s, score: scores[s.name] ?? s.score })));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const displayUser = userData || { ...mockUser, name: "Loading...", streak: 0, totalXP: 0, problemsSolved: 0, createdYear: 2024 };

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
          <StreakHeatmap activityData={activityMap} createdYear={displayUser.createdYear} />

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
                    <span style={{ color: solvedIds.has(p.id) ? "#10B981" : "#475569" }}>{solvedIds.has(p.id) ? "✅ Solved" : "⬜ Unsolved"}</span>
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
