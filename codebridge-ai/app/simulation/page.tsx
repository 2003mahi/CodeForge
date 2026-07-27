"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { mockSimulationTickets } from "@/lib/mockData";
import { Building2, AlertTriangle, Zap, BarChart3, GitMerge, Clock, ArrowRight, X, Code2, ChevronRight, Play } from "lucide-react";

type Ticket = typeof mockSimulationTickets[0];

const columns = [
  { id: "todo", label: "To Do", color: "#64748B" },
  { id: "in-progress", label: "In Progress", color: "#3B82F6" },
  { id: "review", label: "In Review", color: "#F59E0B" },
  { id: "done", label: "Done", color: "#10B981" },
];

const priorityColors: Record<string, string> = {
  Critical: "#EF4444",
  High: "#F59E0B",
  Medium: "#3B82F6",
  Low: "#64748B",
};

const typeIcons: Record<string, typeof Bug> = {
  Bug: AlertTriangle as any,
  Feature: Zap as any,
  Performance: BarChart3 as any,
};

export default function IndustrySimulation() {
  const [tickets, setTickets] = useState(mockSimulationTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const moveTicket = (id: string, newStatus: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const scenarios = [
    {
      id: "api-failure",
      icon: "🔥",
      title: "Fix Production API Failure",
      desc: "Payment endpoint returning 500. 23% checkout failure rate.",
      severity: "Critical",
      company: "FinTech Corp",
      duration: "2h",
    },
    {
      id: "merge-conflict",
      icon: "⚔️",
      title: "Resolve Merge Conflict",
      desc: "Two branches modified auth middleware. Preserve both features.",
      severity: "High",
      company: "StartupXYZ",
      duration: "45min",
    },
    {
      id: "sql-optimize",
      icon: "🐌",
      title: "Optimize Slow SQL Query",
      desc: "Dashboard query taking 8s on 2M row table. Add indexes.",
      severity: "High",
      company: "DataCo",
      duration: "1.5h",
    },
    {
      id: "frontend-screen",
      icon: "🎨",
      title: "Build Missing UI Screen",
      desc: "Design spec delivered. Build checkout summary page.",
      severity: "Medium",
      company: "E-Commerce Inc",
      duration: "3h",
    },
  ];

  return (
    <div style={{ display: "flex", background: "#0A0A0F", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, padding: "32px 36px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Building2 size={22} color="#7C3AED" />
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Industry Simulation</h1>
            <span className="badge badge-purple">Junior Dev Mode</span>
          </div>
          <p style={{ color: "#64748B" }}>Work on real company scenarios. Complete Jira tickets, fix production bugs, and resolve conflicts.</p>
        </div>

        {/* Scenario Cards */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#94A3B8", marginBottom: 16, letterSpacing: "0.02em" }}>🎯 TODAY'S SCENARIOS</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {scenarios.map((s) => (
              <div
                key={s.id}
                className="glass card-hover"
                style={{
                  padding: "20px 18px", borderRadius: 16, cursor: "pointer",
                  border: `1px solid ${activeScenario === s.id ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.07)"}`,
                  background: activeScenario === s.id ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.03)",
                }}
                onClick={() => setActiveScenario(activeScenario === s.id ? null : s.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ fontSize: 28 }}>{s.icon}</div>
                  <span
                    className="badge"
                    style={{
                      background: `${priorityColors[s.severity]}18`,
                      color: priorityColors[s.severity],
                      border: `1px solid ${priorityColors[s.severity]}30`,
                    }}
                  >
                    {s.severity}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, marginBottom: 12 }}>{s.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: "#475569" }}>
                    <span>🏢 {s.company}</span>
                    <span style={{ marginLeft: 10 }}><Clock size={10} style={{ display: "inline" }} /> {s.duration}</span>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ padding: "6px 14px", fontSize: 12 }}
                    onClick={(e) => { e.stopPropagation(); setActiveScenario(s.id); }}
                  >
                    <Play size={12} /> Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jira Board */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.02em" }}>📋 SPRINT BOARD</h2>
            <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#475569" }}>
              <span>Sprint 14</span>
              <span style={{ color: "#64748B" }}>·</span>
              <span>{tickets.filter((t) => t.status === "done").length}/{tickets.length} completed</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {columns.map((col) => {
              const colTickets = tickets.filter((t) => t.status === col.id);
              return (
                <div key={col.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.04em" }}>{col.label.toUpperCase()}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "#475569", background: "rgba(255,255,255,0.07)", padding: "2px 8px", borderRadius: 100 }}>{colTickets.length}</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 100 }}>
                    {colTickets.map((ticket) => {
                      const TypeIcon = (typeIcons[ticket.type] || AlertTriangle) as any;
                      return (
                        <div
                          key={ticket.id}
                          className="ticket-card"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <span style={{ fontSize: 10, color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>{ticket.id}</span>
                            <span
                              style={{
                                fontSize: 10, padding: "2px 7px", borderRadius: 100, fontWeight: 700,
                                background: `${priorityColors[ticket.priority]}18`,
                                color: priorityColors[ticket.priority],
                              }}
                            >
                              {ticket.priority}
                            </span>
                          </div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 10, lineHeight: 1.4 }}>{ticket.title}</p>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                            {ticket.tags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="badge badge-blue" style={{ fontSize: 9 }}>{tag}</span>
                            ))}
                          </div>
                          <div style={{ display: "flex", justify: "space-between", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                              <Clock size={10} /> {ticket.estimatedTime}
                            </span>
                            <span style={{ fontSize: 11, color: "#A855F7", marginLeft: "auto" }}>+{ticket.xp} XP</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200,
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(8px)", padding: 24,
            }}
            onClick={() => setSelectedTicket(null)}
          >
            <div
              className="glass-strong"
              style={{ maxWidth: 600, width: "100%", borderRadius: 24, padding: 32, position: "relative" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedTicket(null)}
                style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} color="#94A3B8" />
              </button>

              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
                <span className="font-code" style={{ fontSize: 12, color: "#7C3AED" }}>{selectedTicket.id}</span>
                <span className={`badge ${selectedTicket.type === "Bug" ? "badge-red" : selectedTicket.type === "Feature" ? "badge-blue" : "badge-orange"}`}>{selectedTicket.type}</span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: priorityColors[selectedTicket.priority], fontWeight: 700 }}>{selectedTicket.priority} Priority</span>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 14 }}>{selectedTicket.title}</h2>
              <p style={{ color: "#94A3B8", lineHeight: 1.6, marginBottom: 20 }}>{selectedTicket.description}</p>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
                {selectedTicket.tags.map((tag, i) => (
                  <span key={i} className="badge badge-purple">{tag}</span>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
                {[
                  { label: "Estimate", value: selectedTicket.estimatedTime },
                  { label: "XP Reward", value: `+${selectedTicket.xp} XP` },
                  { label: "Status", value: columns.find((c) => c.id === selectedTicket.status)?.label || selectedTicket.status },
                ].map((m, i) => (
                  <div key={i} className="glass-dark" style={{ padding: "10px 14px", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{m.value}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{m.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                {columns.filter((c) => c.id !== selectedTicket.status).slice(0, 2).map((col) => (
                  <button
                    key={col.id}
                    className="btn-ghost"
                    style={{ flex: 1, justifyContent: "center", fontSize: 13 }}
                    onClick={() => { moveTicket(selectedTicket.id, col.id); setSelectedTicket(null); }}
                  >
                    Move to {col.label}
                  </button>
                ))}
                <button className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>
                  <Code2 size={15} /> Start Coding
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
