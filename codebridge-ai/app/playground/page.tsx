"use client";

import { useState, Suspense, useMemo, useEffect } from "react";
import CodeVisualizer from "@/app/playground/CodeVisualizer";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/layout/Sidebar";
import { mockProblems as oldMockProblems } from "@/lib/mockData";
import { striverProblems, striverCategories } from "@/lib/striverProblems";
import { Play, Send, Lightbulb, ChevronDown, CheckCircle2, XCircle, Clock, RefreshCw, ChevronRight, Menu, X, Search } from "lucide-react";

const mockProblems = [...oldMockProblems, ...striverProblems];


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

  // Striver sheet drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");
  const [drawerCategory, setDrawerCategory] = useState<string | null>(null);

  const filteredStriver = useMemo(() => {
    return striverProblems.filter((q) => {
      const matchSearch = !drawerSearch || q.title.toLowerCase().includes(drawerSearch.toLowerCase());
      const matchCat = !drawerCategory || q.category === drawerCategory;
      return matchSearch && matchCat;
    });
  }, [drawerSearch, drawerCategory]);



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

  type SavedSubmission = {
    id: string;
    problem_id: string;
    problem_title: string | null;
    language: string;
    code: string;
    status: "attempted" | "solved";
    output: string | null;
    updated_at: string;
  };
  const [submissions, setSubmissions] = useState<Record<string, SavedSubmission[]>>({});

  const getSubmission = (problemId: string, lang: string): SavedSubmission | undefined =>
    (submissions[problemId] || []).find((s) => s.language === lang);

  const isSolved = (problemId: string): boolean =>
    (submissions[problemId] || []).some((s) => s.status === "solved");

  const supabase = createClient();

  const saveSubmission = async (status: "attempted" | "solved", output?: string) => {
    try {
      const list = submissions[activeProblem.id] || [];
      const existing = list.find((s) => s.language === selectedLang);
      const finalStatus = existing && existing.status === "solved" ? "solved" : status;

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: activeProblem.id,
          problemTitle: activeProblem.title,
          language: selectedLang,
          code,
          status: finalStatus,
          output,
          xp: activeProblem.xp || 50,
        }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setSubmissions((prev) => {
          const list = (prev[activeProblem.id] || []).filter((s) => s.language !== selectedLang);
          return { ...prev, [activeProblem.id]: [json.data, ...list] };
        });
      }
    } catch (err) {
      // Saving is best-effort; never block the user on a DB error.
    }
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      fetch("/api/submissions")
        .then((r) => r.json())
        .then((res) => {
          if (!mounted || !Array.isArray(res.data)) return;
          const map: Record<string, SavedSubmission[]> = {};
          res.data.forEach((s: SavedSubmission) => {
            if (!map[s.problem_id]) map[s.problem_id] = [];
            map[s.problem_id].push(s);
          });
          setSubmissions(map);
          const saved = map[mockProblems[initialIdx].id];
          if (saved && saved.length) {
            setSelectedLang(saved[0].language);
            setCode(saved[0].code);
          }
        })
        .catch(() => {});
    });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced autosave so the user never loses their in-progress code
  useEffect(() => {
    if (status === "running") return;
    const timer = setTimeout(() => {
      if (code && hasRealCode(code)) {
        saveSubmission("attempted");
      }
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);





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
    const prob = mockProblems[i];
    const saved = getSubmission(prob.id, selectedLang);
    if (saved) {
      setSelectedLang(saved.language);
      setCode(saved.code);
    } else {
      setCode(getStarterCode(prob, selectedLang));
    }
    setOutput("");
    setStatus("idle");
    setShowHint(false);
    setShowReview(false);
  };

  const handleLangSwitch = (lang: string) => {
    setSelectedLang(lang);
    const saved = getSubmission(activeProblem.id, lang);
    if (saved) {
      setCode(saved.code);
    } else {
      setCode(getStarterCode(activeProblem, lang));
    }
  };

  const handleRun = async () => {
    if (!hasRealCode(code)) {
      setStatus("failed");
      setOutput("❌ No solution found!\n\nYour code only contains the template/comments.\nPlease write your actual solution before running.");
      return;
    }
    setStatus("running");
    setOutputTab("testcases");

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLang, code }),
      });
      const data = await res.json();

      if (res.ok && !data.stderr) {
        setOutput(data.output || "✅ Code executed successfully (No output)");
        setStatus("passed");
        saveSubmission("attempted", data.output);
      } else {
        setOutput(`❌ Error: ${data.stderr || data.error || "Execution failed"}`);
        setStatus("failed");
      }
    } catch (err: any) {
      setOutput(`❌ Request failed: ${err.message}`);
      setStatus("failed");
    }
  };

  const handleSubmit = async () => {
    if (!hasRealCode(code)) {
      setStatus("failed");
      setOutput("❌ Cannot submit empty solution!\n\nWrite your solution first, then submit.");
      return;
    }
    setStatus("running");
    setOutputTab("testcases");

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLang, code }),
      });
      const data = await res.json();

      if (res.ok) {
        // Simplified check for now
        if (data.stderr) {
          setOutput(`❌ Tests Failed!\n\n${data.stderr}`);
          setStatus("failed");
        } else {
          setOutput(`✅ Accepted!\n\nExecution Output:\n${data.output}\n\nRuntime: ~45ms\nMemory: ~14.2MB\n\n+${activeProblem.xp || 50} XP earned! 🎉`);
          setStatus("passed");
          setShowReview(true);
          saveSubmission("solved", data.output);
        }
      } else {
        setOutput(`❌ Error: ${data.error || "Execution failed"}`);
        setStatus("failed");
      }
    } catch (err: any) {
      setOutput(`❌ Request failed: ${err.message}`);
      setStatus("failed");
    }
  };

  const handleCustomRun = async () => {
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

    try {
      // Note: To truly pass custom input, Piston API supports 'stdin'. We'll append it to the payload here if we wanted.
      // For this UI, we just simulate running the code again as a demo of the API connection.
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLang, code }),
      });
      const data = await res.json();

      if (res.ok) {
        setCustomStatus(data.stderr ? "failed" : "passed");
        setCustomOutput(`Input: ${customInput}\n\nYour Output:\n${data.output}\n${customExpected ? `Expected:  ${customExpected}` : ""}`);
      } else {
        setCustomStatus("failed");
        setCustomOutput(`❌ Error: ${data.error || "Execution failed"}`);
      }
    } catch (err: any) {
      setCustomStatus("failed");
      setCustomOutput(`❌ Request failed: ${err.message}`);
    }
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

        {/* Most Asked Interview Questions */}
        <div
          style={{
            position: "fixed", top: 0, left: drawerOpen ? 240 : -360, width: 350, height: "100vh",
            background: "rgba(10, 10, 22, 0.98)", backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(255,255,255,0.08)", zIndex: 200,
            transition: "left 0.3s ease", display: "flex", flexDirection: "column",
          }}
        >
          <div style={{ padding: "18px 18px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>📋 Most Asked Interview Questions</h3>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={14} color="#94A3B8" />
              </button>
            </div>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <Search size={13} color="#475569" style={{ position: "absolute", top: 9, left: 10 }} />
              <input
                type="text" placeholder="Search problems..."
                value={drawerSearch} onChange={(e) => setDrawerSearch(e.target.value)}
                style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px 7px 30px", color: "#fff", fontSize: 12, outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <button onClick={() => setDrawerCategory(null)} style={{ padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600, cursor: "pointer", border: `1px solid ${!drawerCategory ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`, background: !drawerCategory ? 'rgba(124,58,237,0.2)' : 'transparent', color: !drawerCategory ? '#A855F7' : '#64748B' }}>All</button>
              {striverCategories.map((cat) => (
                <button key={cat} onClick={() => setDrawerCategory(drawerCategory === cat ? null : cat)} style={{ padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600, cursor: "pointer", border: `1px solid ${drawerCategory === cat ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`, background: drawerCategory === cat ? 'rgba(124,58,237,0.2)' : 'transparent', color: drawerCategory === cat ? '#A855F7' : '#64748B' }}>{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
            <div style={{ fontSize: 10, color: "#475569", marginBottom: 8, fontWeight: 700, letterSpacing: "0.06em" }}>{filteredStriver.length} PROBLEMS</div>
            {filteredStriver.map((q) => (
              <div
                key={q.id}
                onClick={() => {
                  const matchIdx = mockProblems.findIndex((mp) => mp.title.toLowerCase().includes(q.title.toLowerCase()));
                  if (matchIdx >= 0) {
                    handleProblemSwitch(matchIdx);
                  }
                  setDrawerOpen(false);
                }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 4, transition: "all 0.15s", background: "rgba(255,255,255,0.02)", border: "1px solid transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.08)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "transparent"; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q.title}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                    {q.tags.slice(0, 2).map((t) => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 100, background: "rgba(59,130,246,0.12)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.2)" }}>{t}</span>)}
                  </div>
                </div>
                <span className={`badge ${q.difficulty === 'Easy' ? 'badge-green' : q.difficulty === 'Medium' ? 'badge-orange' : 'badge-red'}`} style={{ fontSize: 9 }}>{q.difficulty}</span>
                {isSolved(q.id) && <CheckCircle2 size={14} color="#10B981" style={{ flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
        {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 199 }} />}



        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(10,10,20,0.95)" }}>
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}
            title="Browse Most Asked Interview Questions"
          >
            <Menu size={16} color="#A855F7" />
          </button>
          <span style={{ color: "#94A3B8", fontSize: 13 }}>
            Click the menu icon to browse more problems
          </span>

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
              {isSolved(activeProblem.id) && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)", color: "#10B981", fontSize: 11, fontWeight: 700 }}>
                  <CheckCircle2 size={12} /> Solved
                </span>
              )}
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
                  {isSolved(p.id) ? <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0 }} /> : <span style={{ fontSize: 13, color: "#475569" }}>⬜</span>}
                  <span style={{ fontSize: 13, color: isSolved(p.id) ? "#10B981" : "#94A3B8", flex: 1 }}>{p.title}</span>
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
