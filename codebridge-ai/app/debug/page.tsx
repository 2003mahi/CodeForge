"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { mockDebugChallenges } from "@/lib/mockData";
import { Bug, ChevronRight, CheckCircle2, XCircle, AlertTriangle, Lightbulb, Trophy, RefreshCw } from "lucide-react";

type BugLocation = { line: number; description: string };

export default function DebugLab() {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showFix, setShowFix] = useState(false);

  const challenge = mockDebugChallenges[challengeIdx];
  const codeLines = challenge.buggyCode.split("\n");
  const bugLines = challenge.bugs.map((b) => b.line);

  const toggleLine = (lineNum: number) => {
    if (submitted) return;
    setSelectedLines((prev) =>
      prev.includes(lineNum) ? prev.filter((l) => l !== lineNum) : [...prev, lineNum]
    );
  };

  const handleSubmit = () => {
    const correct = selectedLines.filter((l) => bugLines.includes(l)).length;
    const total = bugLines.length;
    const pct = Math.round((correct / total) * 100);
    setScore(pct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedLines([]);
    setSubmitted(false);
    setScore(null);
    setShowFix(false);
  };

  const getLineStyle = (lineNum: number) => {
    if (!submitted) {
      return selectedLines.includes(lineNum)
        ? { background: "rgba(245,158,11,0.15)", borderLeft: "3px solid #F59E0B" }
        : { background: "transparent", borderLeft: "3px solid transparent" };
    }
    if (bugLines.includes(lineNum) && selectedLines.includes(lineNum))
      return { background: "rgba(16,185,129,0.1)", borderLeft: "3px solid #10B981" };
    if (bugLines.includes(lineNum))
      return { background: "rgba(239,68,68,0.1)", borderLeft: "3px solid #EF4444" };
    if (selectedLines.includes(lineNum))
      return { background: "rgba(245,158,11,0.08)", borderLeft: "3px solid #F59E0B" };
    return { background: "transparent", borderLeft: "3px solid transparent" };
  };

  return (
    <div style={{ display: "flex", background: "#0A0A0F", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, padding: "32px 36px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <Bug size={22} color="#EF4444" />
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Debug Lab</h1>
            </div>
            <p style={{ color: "#64748B" }}>Find the bugs in the code. Click on buggy lines to mark them.</p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {mockDebugChallenges.map((c, i) => (
              <button
                key={i}
                onClick={() => { setChallengeIdx(i); handleReset(); }}
                style={{
                  padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  background: challengeIdx === i ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${challengeIdx === i ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
                  color: challengeIdx === i ? "#FCA5A5" : "#64748B",
                  transition: "all 0.2s",
                }}
              >
                Challenge {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

          {/* Left: Code Panel */}
          <div>
            {/* Challenge Info */}
            <div className="glass" style={{ padding: "18px 22px", borderRadius: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{challenge.title}</h2>
                  <span className={`badge ${challenge.difficulty === "Easy" ? "badge-green" : "badge-orange"}`}>{challenge.difficulty}</span>
                </div>
                <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#64748B" }}>
                  <span>Language: <strong style={{ color: "#94A3B8" }}>{challenge.language}</strong></span>
                  <span>Bugs: <strong style={{ color: "#EF4444" }}>{challenge.bugs.length}</strong></span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span className="badge badge-orange">
                  <AlertTriangle size={10} /> {challenge.bugs.length} Bugs
                </span>
                <span className="badge badge-purple">+200 XP</span>
              </div>
            </div>

            {/* Instructions Banner */}
            <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <Lightbulb size={16} color="#60A5FA" />
              <p style={{ fontSize: 13, color: "#93C5FD" }}>
                Click on the line numbers to mark them as buggy. You can select multiple lines. Look carefully at logic, bounds, and security issues.
              </p>
            </div>

            {/* Code Editor */}
            <div className="glass-dark" style={{ borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "flex", gap: 6, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
                <span className="font-code" style={{ fontSize: 12, color: "#475569", marginLeft: 8 }}>
                  buggy_code.{challenge.language === "Python" ? "py" : "js"}
                </span>
                {!submitted && selectedLines.length > 0 && (
                  <span className="badge badge-orange" style={{ marginLeft: "auto" }}>
                    {selectedLines.length} line{selectedLines.length > 1 ? "s" : ""} selected
                  </span>
                )}
              </div>

              <div style={{ padding: "12px 0" }}>
                {codeLines.map((line, i) => {
                  const lineNum = i + 1;
                  const lineStyle = getLineStyle(lineNum);
                  const isBugLine = submitted && bugLines.includes(lineNum);

                  return (
                    <div
                      key={i}
                      onClick={() => toggleLine(lineNum)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 0,
                        cursor: submitted ? "default" : "pointer",
                        transition: "background 0.15s",
                        ...lineStyle,
                      }}
                    >
                      <span
                        className="font-code"
                        style={{
                          width: 44,
                          paddingLeft: 16,
                          paddingRight: 8,
                          color: selectedLines.includes(lineNum) ? "#F59E0B" : "#374151",
                          fontSize: 12,
                          userSelect: "none",
                          flexShrink: 0,
                          paddingTop: 2,
                          paddingBottom: 2,
                        }}
                      >
                        {lineNum}
                      </span>
                      <pre
                        className="font-code"
                        style={{
                          fontSize: 13,
                          color: "#E2E8F0",
                          whiteSpace: "pre",
                          flex: 1,
                          paddingTop: 2,
                          paddingBottom: 2,
                          paddingRight: 16,
                          lineHeight: 1.6,
                        }}
                      >
                        {line}
                      </pre>
                      {isBugLine && (
                        <div style={{ paddingRight: 16, paddingTop: 4, flexShrink: 0 }}>
                          <Bug size={14} color="#EF4444" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit / Reset */}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedLines.length === 0}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center", opacity: selectedLines.length === 0 ? 0.5 : 1 }}
                >
                  <Bug size={16} /> Submit Bug Locations
                </button>
              ) : (
                <button onClick={handleReset} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
                  <RefreshCw size={16} /> Try Again
                </button>
              )}
            </div>
          </div>

          {/* Right: Results Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Score Card */}
            {submitted && score !== null && (
              <div
                className="glass border-animated"
                style={{ padding: "28px 24px", borderRadius: 20, textAlign: "center" }}
              >
                <div
                  style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: score >= 80 ? "rgba(16,185,129,0.15)" : score >= 50 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                    border: `3px solid ${score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: 28, fontWeight: 900, color: "#fff",
                  }}
                >
                  {score}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  {score === 100 ? "Perfect Debug! 🎉" : score >= 50 ? "Good Catch! 🔍" : "Keep Practicing 💪"}
                </h3>
                <p style={{ color: "#64748B", fontSize: 13 }}>Debugging score</p>
                {score === 100 && <div style={{ marginTop: 12, color: "#A855F7", fontSize: 14, fontWeight: 700 }}>+200 XP Earned! 🚀</div>}
              </div>
            )}

            {/* Bug Explanations */}
            <div className="glass" style={{ padding: "20px 18px", borderRadius: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <Bug size={15} color="#EF4444" /> Bug Explanations
              </h4>
              {submitted ? (
                challenge.bugs.map((bug, i) => (
                  <div key={i} style={{ marginBottom: 12, padding: "12px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#FCA5A5", marginBottom: 4 }}>Line {bug.line}</div>
                    <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>{bug.description}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: "#475569", fontSize: 13 }}>Submit your answer to see bug explanations.</p>
              )}
            </div>

            {/* Fixed Code */}
            {submitted && (
              <div className="glass" style={{ padding: "20px 18px", borderRadius: 16 }}>
                <button
                  onClick={() => setShowFix(!showFix)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={15} color="#10B981" /> View Fixed Code
                  </h4>
                  <ChevronRight size={16} color="#64748B" style={{ transform: showFix ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {showFix && (
                  <pre className="font-code" style={{ marginTop: 14, fontSize: 11, color: "#10B981", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8, padding: 14, overflowX: "auto", whiteSpace: "pre-wrap" }}>
                    {challenge.fixedCode}
                  </pre>
                )}
              </div>
            )}

            {/* Key Lesson */}
            {submitted && (
              <div style={{ padding: "16px 18px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#A855F7", marginBottom: 6 }}>🧠 Key Lesson</div>
                <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{challenge.explanation}</p>
              </div>
            )}

            {/* Stats Card */}
            {!submitted && (
              <div className="glass" style={{ padding: "20px 18px", borderRadius: 16 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Your Debug Stats</h4>
                {[
                  { label: "Bugs Found", value: "47", color: "#10B981" },
                  { label: "Debug Score", value: "82/100", color: "#7C3AED" },
                  { label: "Challenges Done", value: "12", color: "#3B82F6" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>{s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
