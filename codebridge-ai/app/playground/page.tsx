"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { mockProblems } from "@/lib/mockData";
import { Play, Send, Lightbulb, ChevronDown, CheckCircle2, XCircle, Clock, RefreshCw, ChevronRight } from "lucide-react";

const languages = ["python", "javascript", "java", "c++", "sql"];

const languageColors: Record<string, string> = {
  python: "#3B82F6",
  javascript: "#F59E0B",
  java: "#EF4444",
  "c++": "#8B5CF6",
  sql: "#10B981",
};

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const problemId = searchParams.get("id") || "1";
  const problem = mockProblems.find((p) => p.id === problemId) || mockProblems[2];

  const [selectedLang, setSelectedLang] = useState("python");
  const [code, setCode] = useState(problem.starterCode.python || problem.starterCode[Object.keys(problem.starterCode)[0] as keyof typeof problem.starterCode]);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [showHint, setShowHint] = useState(false);
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const handleRun = () => {
    setStatus("running");
    setTimeout(() => {
      setOutput(`Test Case 1: ✅ Passed (0.43ms)\nTest Case 2: ✅ Passed (0.31ms)\nTest Case 3: ✅ Passed (0.28ms)\n\nAll 3 test cases passed!\nRuntime: 45ms | Memory: 14.2 MB`);
      setStatus("passed");
    }, 1400);
  };

  const handleSubmit = () => {
    setStatus("running");
    setTimeout(() => {
      setOutput(`✅ Accepted!\n\n72/72 test cases passed\nRuntime: 45ms (beats 92% of Python solutions)\nMemory: 14.2MB (beats 78% of Python solutions)\n\n+100 XP earned! 🎉`);
      setStatus("passed");
      setShowReview(true);
    }, 2000);
  };

  const aiReview = [
    { type: "good", text: "Good variable naming and clean structure" },
    { type: "tip", text: "Consider using enumerate() for cleaner indexing" },
    { type: "warn", text: "Add type hints for production readiness" },
    { type: "good", text: "Optimal O(n) time complexity achieved ✓" },
  ];

  return (
    <div style={{ display: "flex", background: "#0A0A0F", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, display: "flex", flexDirection: "column", height: "100vh" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(10,10,20,0.95)" }}>
          <div style={{ display: "flex", gap: 8, overflow: "auto" }}>
            {mockProblems.slice(0, 5).map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveProblemIdx(i)}
                style={{
                  padding: "6px 14px", borderRadius: 8,
                  background: activeProblemIdx === i ? "rgba(124,58,237,0.2)" : "transparent",
                  border: `1px solid ${activeProblemIdx === i ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)"}`,
                  color: activeProblemIdx === i ? "#A855F7" : "#64748B",
                  fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Language selector */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  style={{
                    padding: "5px 12px", borderRadius: 8,
                    background: selectedLang === lang ? `${languageColors[lang]}20` : "transparent",
                    border: `1px solid ${selectedLang === lang ? `${languageColors[lang]}50` : "rgba(255,255,255,0.08)"}`,
                    color: selectedLang === lang ? languageColors[lang] : "#475569",
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.2s", textTransform: "capitalize",
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main 3-panel layout */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "360px 1fr 320px", overflow: "hidden" }}>

          {/* Problem Panel */}
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.07)", overflowY: "auto", padding: "24px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span className={`badge ${problem.difficulty === "Easy" ? "badge-green" : problem.difficulty === "Medium" ? "badge-orange" : "badge-red"}`}>
                {problem.difficulty}
              </span>
              <span className="badge badge-purple">+{problem.xp} XP</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 12 }}>{problem.title}</h2>
            <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{problem.description}</p>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
              {problem.tags.map((tag, i) => (
                <span key={i} className="badge badge-blue">{tag}</span>
              ))}
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 10, letterSpacing: "0.05em" }}>TEST CASES</h4>
            {problem.testCases.map((tc, i) => (
              <div key={i} className="glass-dark" style={{ padding: "12px 14px", borderRadius: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>Input: <span className="font-code" style={{ color: "#94A3B8" }}>{tc.input}</span></div>
                <div style={{ fontSize: 12, color: "#64748B" }}>Expected: <span className="font-code" style={{ color: "#10B981" }}>{tc.expected}</span></div>
              </div>
            ))}

            {/* Hint */}
            <button
              onClick={() => setShowHint(!showHint)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 16, width: "100%" }}
            >
              <Lightbulb size={15} /> {showHint ? "Hide Hint" : "💡 Show AI Hint"}
            </button>
            {showHint && (
              <div style={{ marginTop: 10, padding: "14px 16px", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 10 }}>
                <p style={{ color: "#FCD34D", fontSize: 13, lineHeight: 1.6 }}>
                  💡 Think about the complement approach. For each number, what value do you <em>need</em> to reach the target? Store what you've seen in a dictionary for O(1) lookup.
                </p>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ flex: 1, position: "relative" }}>
              {/* Editor Header */}
              <div style={{ display: "flex", gap: 6, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0D1117" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
                <span className="font-code" style={{ fontSize: 12, color: "#475569", marginLeft: 8 }}>
                  solution.{selectedLang === "javascript" ? "js" : selectedLang === "python" ? "py" : selectedLang === "java" ? "java" : "cpp"}
                </span>
              </div>

              {/* Simulated Code Editor */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-code"
                spellCheck={false}
                style={{
                  width: "100%",
                  height: "calc(100% - 44px)",
                  background: "#0D1117",
                  color: "#E2E8F0",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  padding: "20px 24px",
                  fontSize: 14,
                  lineHeight: 1.7,
                  tabSize: 4,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              />
            </div>

            {/* Output Panel */}
            <div style={{ height: 180, borderTop: "1px solid rgba(255,255,255,0.07)", background: "#0A0D14" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B", letterSpacing: "0.05em" }}>OUTPUT</span>
                {status === "running" && <RefreshCw size={13} color="#7C3AED" style={{ animation: "spin 1s linear infinite" }} />}
                {status === "passed" && <CheckCircle2 size={13} color="#10B981" />}
                {status === "failed" && <XCircle size={13} color="#EF4444" />}
              </div>
              <pre className="font-code" style={{ padding: "12px 16px", fontSize: 12, color: status === "failed" ? "#FCA5A5" : "#94A3B8", lineHeight: 1.6, overflowY: "auto", height: "calc(100% - 38px)", whiteSpace: "pre-wrap" }}>
                {status === "idle" ? "// Click Run to execute your code..." : output}
              </pre>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 12, padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(10,10,20,0.9)" }}>
              <button onClick={handleRun} className="btn-ghost" style={{ flex: 1, justifyContent: "center", padding: "10px 20px", fontSize: 14 }}>
                <Play size={16} /> Run Code
              </button>
              <button onClick={handleSubmit} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "10px 20px", fontSize: 14 }}>
                <Send size={16} /> Submit
              </button>
            </div>
          </div>

          {/* AI Review Panel */}
          <div style={{ overflowY: "auto", padding: "24px 20px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>🤖 AI Code Review</h3>
            <p style={{ fontSize: 12, color: "#475569", marginBottom: 16 }}>Submit your code to get instant feedback</p>

            {showReview ? (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "Readability", score: 88, color: "#10B981" },
                    { label: "Complexity", score: 95, color: "#7C3AED" },
                    { label: "Naming", score: 80, color: "#3B82F6" },
                    { label: "Edge Cases", score: 72, color: "#F59E0B" },
                  ].map((m, i) => (
                    <div key={i} className="glass-dark" style={{ padding: "12px 14px", borderRadius: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.score}</div>
                      <div style={{ fontSize: 10, color: "#475569" }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                <h4 style={{ fontSize: 12, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", marginBottom: 10 }}>FEEDBACK</h4>
                {aiReview.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ fontSize: 14, flexShrink: 0, marginTop: 2 }}>
                      {item.type === "good" ? "✅" : item.type === "tip" ? "💡" : "⚠️"}
                    </span>
                    <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🤖</div>
                <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.6 }}>Submit your solution to get AI-powered feedback on readability, complexity, and code quality.</p>
              </div>
            )}

            {/* Problem List */}
            <div style={{ marginTop: 24 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", marginBottom: 10 }}>MORE PROBLEMS</h4>
              {mockProblems.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}>
                  <span style={{ fontSize: 13, color: p.solved ? "#10B981" : "#64748B" }}>{p.solved ? "✅" : "⬜"}</span>
                  <span style={{ fontSize: 13, color: "#94A3B8", flex: 1 }}>{p.title}</span>
                  <span className={`badge ${p.difficulty === "Easy" ? "badge-green" : p.difficulty === "Medium" ? "badge-orange" : "badge-red"}`} style={{ fontSize: 9 }}>{p.difficulty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function Playground() {
  return (
    <Suspense fallback={<div style={{ background: "#0A0A0F", minHeight: "100vh" }} />}>
      <PlaygroundContent />
    </Suspense>
  );
}
