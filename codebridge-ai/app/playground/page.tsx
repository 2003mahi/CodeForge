"use client";

import { useState, Suspense } from "react";
import CodeVisualizer from "@/app/playground/CodeVisualizer";
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
  const initialIdx = Math.max(0, mockProblems.findIndex((p) => p.id === problemId));

  const [selectedLang, setSelectedLang] = useState("python");
  const [activeProblemIdx, setActiveProblemIdx] = useState(initialIdx);
  const activeProblem = mockProblems[activeProblemIdx];

  const getStarterCode = (prob: (typeof mockProblems)[0], lang: string): string => {
    const sc = prob.starterCode as Record<string, string>;
    return sc[lang] || `// No starter code for ${lang}\n// Problem: ${prob.title}\n// Write your solution here`;
  };

  const [code, setCode] = useState(() => getStarterCode(mockProblems[initialIdx], "python"));
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [showHint, setShowHint] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [outputTab, setOutputTab] = useState<"testcases" | "custom">("testcases");
  const [customInput, setCustomInput] = useState("");
  const [customExpected, setCustomExpected] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [customStatus, setCustomStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Check if user has written actual code beyond the template
  const hasRealCode = (c: string): boolean => {
    const stripped = c
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => {
        if (!l) return false;
        if (l.startsWith("#") || l.startsWith("//") || l.startsWith("*") || l.startsWith("/*") || l.startsWith("--")) return false;
        if (l === "pass" || l === "}" || l === "};" || l === "{") return false;
        return true;
      });
    // Lines that are just signature/boilerplate
    const logic = stripped.filter((l) =>
      !l.startsWith("def ") &&
      !l.startsWith("function ") &&
      !l.startsWith("class ") &&
      !l.startsWith("public ") &&
      !l.startsWith("public:") &&
      !l.includes("Your solution here")
    );
    return logic.length >= 2;
  };

  const handleProblemSwitch = (i: number) => {
    setActiveProblemIdx(i);
    setCode(getStarterCode(mockProblems[i], selectedLang));
    setOutput("");
    setStatus("idle");
    setShowHint(false);
    setShowReview(false);
  };

  const handleLangSwitch = (lang: string) => {
    setSelectedLang(lang);
    setCode(getStarterCode(activeProblem, lang));
  };

  const handleRun = () => {
    if (!hasRealCode(code)) {
      setStatus("failed");
      setOutput("❌ No solution found!\n\nYour code only contains the template/comments.\nPlease write your actual solution before running.");
      return;
    }
    setStatus("running");
    setOutputTab("testcases");
    setTimeout(() => {
      const tc = activeProblem.testCases;
      const lines = tc.map((_, i) => `Test Case ${i + 1}: ✅ Passed (${(Math.random() * 0.4 + 0.1).toFixed(2)}ms)`);
      setOutput(`${lines.join("\n")}\n\nAll ${tc.length} test cases passed!\nRuntime: ${Math.floor(Math.random() * 60 + 20)}ms | Memory: ${(Math.random() * 5 + 12).toFixed(1)} MB`);
      setStatus("passed");
    }, 1400);
  };

  const handleSubmit = () => {
    if (!hasRealCode(code)) {
      setStatus("failed");
      setOutput("❌ Cannot submit empty solution!\n\nWrite your solution first, then submit.");
      return;
    }
    setStatus("running");
    setTimeout(() => {
      setOutput(`✅ Accepted!\n\n${activeProblem.testCases.length * 24}/${activeProblem.testCases.length * 24} test cases passed\nRuntime: 45ms (beats 92% of ${selectedLang} solutions)\nMemory: 14.2MB (beats 78% of ${selectedLang} solutions)\n\n+${activeProblem.xp} XP earned! 🎉`);
      setStatus("passed");
      setShowReview(true);
    }, 2000);
  };

  const handleCustomRun = () => {
    if (!customInput.trim()) {
      setCustomStatus("failed");
      setCustomOutput("⚠️ Please enter a custom input to test.");
      return;
    }
    if (!hasRealCode(code)) {
      setCustomStatus("failed");
      setCustomOutput("❌ Write your solution first before testing custom input.");
      return;
    }
    setCustomStatus("running");
    setCustomOutput("");
    setTimeout(() => {
      const runtime = (Math.random() * 0.5 + 0.1).toFixed(2);
      const matched = customExpected.trim() !== "";
      // Simulate: if expected provided, randomly pass/fail; if no expected, just show "ran"
      const passed = matched ? Math.random() > 0.3 : true;
      if (passed) {
        setCustomStatus("passed");
        setCustomOutput(`Input: ${customInput}\n\nYour Output: [simulated result]\n${customExpected ? `Expected:  ${customExpected}\n\n✅ Matched! (${runtime}ms)` : `\n✅ Code ran successfully (${runtime}ms)`}`);
      } else {
        setCustomStatus("failed");
        setCustomOutput(`Input: ${customInput}\n\nYour Output: [simulated wrong result]\nExpected:  ${customExpected}\n\n❌ Wrong Answer (${runtime}ms)\nHint: Check edge cases and boundary conditions.`);
      }
    }, 1000);
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
                onClick={() => handleProblemSwitch(i)}
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
                  onClick={() => handleLangSwitch(lang)}
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
              <span className={`badge ${activeProblem.difficulty === "Easy" ? "badge-green" : activeProblem.difficulty === "Medium" ? "badge-orange" : "badge-red"}`}>
                {activeProblem.difficulty}
              </span>
              <span className="badge badge-purple">+{activeProblem.xp} XP</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 12 }}>{activeProblem.title}</h2>
            <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{activeProblem.description}</p>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
              {activeProblem.tags.map((tag, i) => (
                <span key={i} className="badge badge-blue">{tag}</span>
              ))}
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 10, letterSpacing: "0.05em" }}>TEST CASES</h4>
            {activeProblem.testCases.map((tc, i) => (
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
                  💡 {activeProblem.hint || "Think carefully about the data structure that gives you O(1) lookup. Consider trading space for time to reduce complexity."}
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

            {/* Output Panel — Tabbed */}
            <div style={{ height: 220, borderTop: "1px solid rgba(255,255,255,0.07)", background: "#0A0D14", display: "flex", flexDirection: "column" }}>
              {/* Tab row */}
              <div style={{ display: "flex", alignItems: "center", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0 16px" }}>
                {(["testcases", "custom"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setOutputTab(tab)}
                    style={{
                      padding: "9px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer",
                      background: "transparent", border: "none",
                      borderBottom: outputTab === tab ? "2px solid #7C3AED" : "2px solid transparent",
                      color: outputTab === tab ? "#A855F7" : "#475569",
                      letterSpacing: "0.05em", textTransform: "uppercase", transition: "all 0.15s",
                    }}
                  >
                    {tab === "testcases" ? "Test Cases" : "Custom Input"}
                  </button>
                ))}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, paddingRight: 4 }}>
                  {status === "running" && outputTab === "testcases" && <RefreshCw size={13} color="#7C3AED" style={{ animation: "spin 1s linear infinite" }} />}
                  {status === "passed" && outputTab === "testcases" && <CheckCircle2 size={13} color="#10B981" />}
                  {status === "failed" && outputTab === "testcases" && <XCircle size={13} color="#EF4444" />}
                  {customStatus === "running" && outputTab === "custom" && <RefreshCw size={13} color="#7C3AED" style={{ animation: "spin 1s linear infinite" }} />}
                  {customStatus === "passed" && outputTab === "custom" && <CheckCircle2 size={13} color="#10B981" />}
                  {customStatus === "failed" && outputTab === "custom" && <XCircle size={13} color="#EF4444" />}
                </div>
              </div>

              {/* Test Cases tab */}
              {outputTab === "testcases" && (
                <pre className="font-code" style={{ padding: "10px 16px", fontSize: 12, color: status === "failed" ? "#FCA5A5" : "#94A3B8", lineHeight: 1.6, overflowY: "auto", flex: 1, whiteSpace: "pre-wrap" }}>
                  {status === "idle" ? "// Click ▶ Run Code to execute against test cases..." : output}
                </pre>
              )}

              {/* Custom Input tab */}
              {outputTab === "custom" && (
                <div style={{ display: "flex", flex: 1, overflow: "hidden", gap: 0 }}>
                  {/* Left: inputs */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, padding: "10px 12px", borderRight: "1px solid rgba(255,255,255,0.05)", overflowY: "auto" }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.06em" }}>INPUT</label>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder={activeProblem.testCases[0]?.input || "Enter your test input..."}
                      className="font-code"
                      spellCheck={false}
                      style={{ flex: 1, background: "#0D1117", color: "#E2E8F0", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "8px 10px", fontSize: 12, resize: "none", outline: "none", fontFamily: "JetBrains Mono, monospace" }}
                    />
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.06em" }}>EXPECTED OUTPUT <span style={{ color: "#334155", fontWeight: 400 }}>(optional)</span></label>
                    <input
                      value={customExpected}
                      onChange={(e) => setCustomExpected(e.target.value)}
                      placeholder={activeProblem.testCases[0]?.expected || "e.g. [0,1]"}
                      className="font-code"
                      style={{ background: "#0D1117", color: "#E2E8F0", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 10px", fontSize: 12, outline: "none", fontFamily: "JetBrains Mono, monospace" }}
                    />
                    <button
                      onClick={handleCustomRun}
                      disabled={customStatus === "running"}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "6px 12px", borderRadius: 7, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)", color: "#A855F7", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      {customStatus === "running" ? <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={12} />}
                      Run Custom
                    </button>
                  </div>
                  {/* Right: output */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "10px 12px", overflowY: "auto" }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.06em", marginBottom: 6 }}>OUTPUT</label>
                    <pre className="font-code" style={{ flex: 1, fontSize: 12, color: customStatus === "failed" ? "#FCA5A5" : customStatus === "passed" ? "#86EFAC" : "#64748B", lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>
                      {customStatus === "idle" ? "// Your custom output will appear here..." : customOutput}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 12, padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(10,10,20,0.9)" }}>
              <button onClick={handleRun} className="btn-ghost" style={{ flex: 1, justifyContent: "center", padding: "10px 20px", fontSize: 14 }}>
                <Play size={16} /> Run Code
              </button>
              <button onClick={() => setShowVisualizer(true)} className="btn-ghost" style={{ flex: 1, justifyContent: "center", padding: "10px 20px", fontSize: 14 }}>
                <Play size={16} /> Visualize
              </button>
              <button onClick={handleSubmit} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "10px 20px", fontSize: 14 }}>
                <Send size={16} /> Submit
              </button>
            </div>
            {/* Visualizer Modal */}
            {showVisualizer && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                <div style={{ width: "90%", height: "80%", background: "#0A0A0F", borderRadius: 12, position: "relative", padding: "12px" }}>
                  <button onClick={() => setShowVisualizer(false)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", padding: "4px 8px" }}>
                    Close
                  </button>
                  <CodeVisualizer code={code} language={selectedLang} />
                </div>
              </div>
            )}
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
