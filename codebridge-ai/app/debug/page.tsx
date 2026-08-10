"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import {
  Bug, ChevronRight, CheckCircle2, RefreshCw, Lightbulb,
  Clock, Zap, TrendingUp, Code2, ChevronDown, Upload,
} from "lucide-react";

/* ─────────────── Challenge Data ─────────────── */
const INITIAL_CHALLENGES = [
  {
    id: "d1",
    title: "Off-by-One in Binary Search",
    difficulty: "Easy" as const,
    language: "Python",
    category: "Logic",
    xp: 150,
    timeLimit: 120,
    description: "A classic off-by-one error lurks in this binary search. The boundaries are slightly wrong.",
    hints: [
      "Look at how `right` is initialized — what is the valid last index of an array?",
      "Check the `while` condition — should it be `<` or `<=`?",
    ],
    buggyCode: `def binary_search(arr, target):
    left, right = 0, len(arr)  # Bug here

    while left < right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1  # Bug here

    return -1

# Test
arr = [1, 3, 5, 7, 9, 11]
print(binary_search(arr, 7))  # Should return 3`,
    bugs: [
      { line: 2, description: "`right = len(arr)` is out of bounds. Should be `len(arr) - 1`." },
      { line: 10, description: "With `while left < right`, `right = mid - 1` can skip elements. Use `left <= right`." },
    ],
    fixedCode: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`,
    explanation: "The right boundary must be `len-1` (last valid index), and the condition must be `<=` so the single-element case is checked.",
    color: "#10B981",
  },
  {
    id: "d2",
    title: "SQL Injection Vulnerability",
    difficulty: "Medium" as const,
    language: "JavaScript",
    category: "Security",
    xp: 250,
    timeLimit: 180,
    description: "A critical security flaw exposing the entire database. Spot the dangerous interpolation.",
    hints: [
      "User input from `req.query` should never be concatenated into SQL.",
      "What MySQL feature safely substitutes values using placeholders?",
    ],
    buggyCode: `const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'users_db'
});

app.get('/user', (req, res) => {
  const userId = req.query.id;
  // Critical: direct interpolation
  const query = \`SELECT * FROM users WHERE id = \${userId}\`;

  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});`,
    bugs: [
      { line: 14, description: "Interpolating `userId` directly allows SQL injection. Use parameterized queries: `'SELECT * FROM users WHERE id = ?'` with `[userId]` as second arg." },
    ],
    fixedCode: `app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM users WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});`,
    explanation: "Never interpolate user input into SQL. Parameterized queries let the driver safely escape values, preventing injection.",
    color: "#EF4444",
  },
  {
    id: "d3",
    title: "Async Race Condition",
    difficulty: "Hard" as const,
    language: "JavaScript",
    category: "Concurrency",
    xp: 400,
    timeLimit: 240,
    description: "Sequential awaits, swallowed errors, and a race condition — find all three.",
    hints: [
      "Are `fetchPosts` and `fetchStats` independent? Could they run in parallel?",
      "What happens when `err` is only logged but not re-thrown?",
    ],
    buggyCode: `async function loadDashboard(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(userId);   // Bug: sequential
    const stats = await fetchStats(userId);   // Bug: sequential

    return { user, posts, stats };
  } catch (err) {
    console.log("Error:", err);  // Bug: swallows error
  }
}

async function updateBalance(userId, amount) {
  const balance = await getBalance(userId);
  // Bug: race condition
  const newBalance = balance + amount;
  await setBalance(userId, newBalance);
  return newBalance;
}`,
    bugs: [
      { line: 4, description: "`fetchPosts` and `fetchStats` are independent — use `Promise.all` for parallel execution." },
      { line: 8, description: "Swallowing errors with only `console.log` hides failures from callers. Re-throw." },
      { line: 15, description: "Read-modify-write without a transaction is a race: concurrent calls read the same balance and one update is lost." },
    ],
    fixedCode: `async function loadDashboard(userId) {
  try {
    const user = await fetchUser(userId);
    const [posts, stats] = await Promise.all([
      fetchPosts(userId),
      fetchStats(userId),
    ]);
    return { user, posts, stats };
  } catch (err) {
    console.error("Dashboard load failed:", err);
    throw err;
  }
}

async function updateBalance(userId, amount) {
  return await db.incrementBalance(userId, amount); // atomic
}`,
    explanation: "Three bugs: sequential awaits that could be parallel, swallowed errors, and a non-atomic read-modify-write race condition.",
    color: "#F59E0B",
  },
];

const diffColor: Record<string, string> = { Easy: "#10B981", Medium: "#F59E0B", Hard: "#EF4444" };
const diffBg: Record<string, string> = {
  Easy: "rgba(16,185,129,0.12)",
  Medium: "rgba(245,158,11,0.12)",
  Hard: "rgba(239,68,68,0.12)",
};

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* Lightweight syntax highlighter */
function highlight(line: string, lang: string): React.ReactNode[] {
  const pyKw = /\b(def|return|while|if|elif|else|import|from|for|in|class|and|or|not|True|False|None|print|len|await|async)\b/g;
  const jsKw = /\b(const|let|var|function|return|if|else|async|await|new|require|throw|try|catch|typeof)\b/g;
  const strRe = lang === "Python"
    ? /("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g
    : /(`[^`]*`|"[^"]*"|'[^']*')/g;
  const numRe = /\b(\d+)\b/g;
  const cmtRe = lang === "Python" ? /(#.*)$/ : /(\/\/.*)$/;
  const cmtMatch = line.match(cmtRe);
  const cmtStart = cmtMatch ? line.indexOf(cmtMatch[1]) : Infinity;
  const tokens: { start: number; end: number; color: string }[] = [];
  const kwRe = lang === "Python" ? pyKw : jsKw;
  [strRe, kwRe, numRe].forEach((re) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(line)) !== null) {
      if (m.index >= cmtStart) continue;
      tokens.push({ start: m.index, end: m.index + m[0].length, color: re === strRe ? "#34D399" : re === numRe ? "#FCA5A5" : "#93C5FD" });
    }
  });
  tokens.sort((a, b) => a.start - b.start);
  const merged: typeof tokens = [];
  for (const t of tokens) {
    if (merged.length && t.start < merged[merged.length - 1].end) continue;
    merged.push(t);
  }
  const parts: React.ReactNode[] = [];
  let i = 0;
  for (const t of merged) {
    if (t.start > i) parts.push(<span key={`t${i}`} style={{ color: "#CBD5E1" }}>{line.slice(i, t.start)}</span>);
    parts.push(<span key={`k${t.start}`} style={{ color: t.color }}>{line.slice(t.start, t.end)}</span>);
    i = t.end;
  }
  if (i < line.length) {
    const rest = line.slice(i);
    const isComment = i >= cmtStart || rest.trimStart().startsWith("#") || rest.trimStart().startsWith("//");
    parts.push(<span key="rest" style={{ color: isComment ? "#6B7280" : "#CBD5E1", fontStyle: isComment ? "italic" : "normal" }}>{rest}</span>);
  }
  return parts.length ? parts : [<span key="0" style={{ color: "#CBD5E1" }}>{line}</span>];
}

/* Confetti */
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {Array.from({ length: 36 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", top: "-12px",
          left: `${(i / 36) * 100}%`,
          width: 7, height: 7,
          borderRadius: i % 3 === 0 ? "50%" : 2,
          background: ["#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899"][i % 6],
          animation: `fall ${1.2 + (i % 4) * 0.3}s ease-in forwards`,
          animationDelay: `${(i % 8) * 0.1}s`,
        }} />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(105vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}

/* Custom Debug Modal */
function CustomDebugModal({
  open,
  onClose,
  onLoad,
}: {
  open: boolean;
  onClose: () => void;
  onLoad: (code: string, lang: string) => void;
}) {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("Python");

  if (!open) return null;
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{
        width: 560, background: "#0F0F1A",
        border: "1px solid rgba(124,58,237,0.3)",
        borderRadius: 18, padding: "26px 28px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.1)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ padding: "7px 9px", borderRadius: 10, background: "rgba(124,58,237,0.14)", border: "1px solid rgba(124,58,237,0.22)" }}>
            <Upload size={16} color="#A78BFA" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>Paste Your Code</h2>
            <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>Load your own code into the Debug Lab and start spotting bugs</p>
          </div>
        </div>

        {/* Language picker */}
        <label style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>LANGUAGE</label>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16 }}>
          {["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust"].map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: lang === l ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${lang === l ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.07)"}`,
              color: lang === l ? "#A78BFA" : "#64748B",
              transition: "all 0.15s",
            }}>{l}</button>
          ))}
        </div>

        {/* Code textarea */}
        <label style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>YOUR CODE</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`# Paste your ${lang} code here...\n# Click lines to flag potential bugs after loading`}
          rows={11}
          spellCheck={false}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "#0A0A12", color: "#CBD5E1",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, padding: "11px 13px",
            fontFamily: "JetBrains Mono, 'Fira Code', monospace",
            fontSize: 12, lineHeight: 1.7, resize: "vertical",
            outline: "none",
          }}
        />
        <p style={{ fontSize: 10, color: "#374151", marginTop: 5, marginBottom: 18 }}>
          Tip: After loading, click on any line number to flag it as a suspected bug, then submit.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: 9, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "9px 16px", borderRadius: 9, fontSize: 12, fontWeight: 700,
            cursor: "pointer", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)", color: "#6B7280",
          }}>Cancel</button>
          <button
            disabled={!code.trim()}
            onClick={() => { if (code.trim()) { onLoad(code, lang); setCode(""); } }}
            style={{
              padding: "9px 20px", borderRadius: 9, fontSize: 12, fontWeight: 700,
              cursor: code.trim() ? "pointer" : "not-allowed",
              background: code.trim() ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "rgba(255,255,255,0.04)",
              border: "none", color: code.trim() ? "#fff" : "#374151",
              boxShadow: code.trim() ? "0 4px 16px rgba(124,58,237,0.35)" : "none",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
            }}
          >
            <Upload size={13} /> Load into Lab
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Main Component ─────────────── */
export default function DebugLab() {
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [cidx, setCidx] = useState(0);
  const [sel, setSel] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showFix, setShowFix] = useState(false);
  const [hintIdx, setHintIdx] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(INITIAL_CHALLENGES[0].timeLimit);
  const [running, setRunning] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const [done, setDone] = useState<Record<string, number>>({});
  const [hover, setHover] = useState<number | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitRef = useRef<(() => void) | null>(null);

  const ch = challenges[cidx];
  const lines = ch.buggyCode.split("\n");
  const bugLines = ch.bugs.map((b) => b.line);

  /* Timer */
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!submitted && running) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(timerRef.current!); submitRef.current?.(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [cidx, submitted, running]);

  const handleSubmit = useCallback(() => {
    if (submitted || isAnalyzing) return;
    const correct = sel.filter((l) => bugLines.includes(l)).length;
    const fp = sel.filter((l) => !bugLines.includes(l)).length;
    const raw = bugLines.length === 0 ? 100 : Math.round((correct / bugLines.length) * 100);
    const final = Math.max(0, raw - fp * 15);
    setScore(final);
    setSubmitted(true);
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (final === 100) { setConfetti(true); setTimeout(() => setConfetti(false), 3200); }
    setDone((p) => ({ ...p, [ch.id]: final }));
  }, [sel, bugLines, ch.id, submitted, isAnalyzing]);

  useEffect(() => { submitRef.current = handleSubmit; }, [handleSubmit]);

  const handleAutoDebug = async () => {
    if (isAnalyzing || submitted) return;
    setIsAnalyzing(true);
    
    try {
      const res = await fetch('/api/debug-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: ch.buggyCode, language: ch.language })
      });
      
      let data;
      try {
        data = await res.json();
      } catch (err) {
        alert("Authentication or Server Error. The API might have redirected you to login.");
        setIsAnalyzing(false);
        return;
      }
      
      if (data.error) {
        alert("AI Error: " + data.error);
        setIsAnalyzing(false);
        return;
      }
      
      if (data.bugs) {
        setChallenges(prev => {
          const newChalls = [...prev];
          newChalls[cidx] = {
            ...newChalls[cidx],
            bugs: data.bugs,
            fixedCode: data.fixedCode || newChalls[cidx].buggyCode,
            explanation: data.explanation || "AI Analysis completed.",
          };
          return newChalls;
        });
        
        // Auto-select the bugs the AI found
        const aiLines = data.bugs.map((b: any) => b.line);
        setSel(aiLines);
        
        // Submit instantly with the new lines
        setTimeout(() => {
          setScore(100);
          setSubmitted(true);
          setRunning(false);
          if (timerRef.current) clearInterval(timerRef.current);
          setDone((p) => ({ ...p, [ch.id]: 100 }));
          setConfetti(true); setTimeout(() => setConfetti(false), 3200);
        }, 100);
      } else {
        alert("AI did not return any bugs.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to analyze code with AI.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSel([]); setSubmitted(false); setScore(null);
    setShowFix(false); setHintIdx(-1);
    setTimeLeft(ch.timeLimit); setRunning(true);
  };

  const switchCh = (i: number) => {
    setCidx(i); setSel([]); setSubmitted(false); setScore(null);
    setShowFix(false); setHintIdx(-1);
    setTimeLeft(challenges[i].timeLimit); setRunning(true);
  };

  const toggle = (n: number) => {
    if (submitted) return;
    setSel((p) => p.includes(n) ? p.filter((l) => l !== n) : [...p, n]);
  };

  const handleLoadCustom = (code: string, lang: string) => {
    const newChallenge = {
      id: `custom-${Date.now()}`,
      title: "Custom Debug Session",
      difficulty: "Medium" as const,
      language: lang,
      category: "Custom",
      xp: 200,
      timeLimit: 300,
      description: `Your ${lang} code is loaded. Click "Auto-Debug AI" to have the AI find the bugs for you instantly!`,
      hints: [
        "Click the Auto-Debug button below to let the AI analyze this code.",
      ],
      buggyCode: code,
      bugs: [],
      fixedCode: "",
      explanation: "Pending AI analysis...",
      color: "#7C3AED",
    };
    setChallenges((prev) => [newChallenge, ...prev]);
    setCidx(0);
    setSel([]); setSubmitted(false); setScore(null);
    setShowFix(false); setHintIdx(-1);
    setTimeLeft(300); setRunning(true);
    setShowCustomModal(false);
  };

  const timerPct = (timeLeft / ch.timeLimit) * 100;
  const timerColor = timerPct > 50 ? "#10B981" : timerPct > 25 ? "#F59E0B" : "#EF4444";

  const lineStyle = (n: number) => {
    const isHov = hover === n && !submitted;
    if (!submitted) {
      if (sel.includes(n)) return { background: "rgba(245,158,11,0.1)", borderLeft: "3px solid #F59E0B" };
      return { background: isHov ? "rgba(255,255,255,0.025)" : "transparent", borderLeft: "3px solid transparent" };
    }
    const isBug = bugLines.includes(n), isSel = sel.includes(n);
    if (isBug && isSel) return { background: "rgba(16,185,129,0.09)", borderLeft: "3px solid #10B981" };
    if (isBug) return { background: "rgba(239,68,68,0.09)", borderLeft: "3px solid #EF4444" };
    if (isSel) return { background: "rgba(245,158,11,0.05)", borderLeft: "3px solid rgba(245,158,11,0.35)" };
    return { background: "transparent", borderLeft: "3px solid transparent" };
  };

  const sessionXP = Object.entries(done).reduce((s, [id, sc]) => {
    const c = challenges.find((c) => c.id === id);
    return s + Math.round((sc / 100) * (c?.xp ?? 0));
  }, 0);

  const totalBugsFound = Object.keys(done).reduce((sum, id) => {
    const c = challenges.find((ch) => ch.id === id);
    return sum + (c?.bugs.length || 0);
  }, 0);

  const completedCount = Object.keys(done).length;
  const avgScore = completedCount > 0 ? Math.round(Object.values(done).reduce((a,b)=>a+b,0) / completedCount) : 0;

  return (
    <div style={{ display: "flex", background: "#0A0A0F", minHeight: "100vh" }}>
      <Sidebar />
      <Confetti active={confetti} />

      <CustomDebugModal
        open={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onLoad={handleLoadCustom}
      />

      <main style={{ flex: 1, marginLeft: 240, padding: "26px 30px", maxWidth: "calc(100vw - 240px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ padding: "6px 8px", borderRadius: 10, background: "rgba(239,68,68,0.14)", border: "1px solid rgba(239,68,68,0.22)" }}>
                <Bug size={18} color="#EF4444" />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Debug Lab</h1>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(239,68,68,0.1)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.18)" }}>LIVE</span>
            </div>
            <p style={{ color: "#475569", fontSize: 12 }}>Click line numbers to flag bugs · Submit to reveal explanations · False positives cost XP!</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {challenges.map((c, i) => {
              const d = done[c.id];
              return (
                <button key={i} onClick={() => switchCh(i)} style={{
                  position: "relative", padding: "8px 13px", borderRadius: 11, fontSize: 12, fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s",
                  background: cidx === i ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.035)",
                  border: `1px solid ${cidx === i ? "rgba(124,58,237,0.45)" : "rgba(255,255,255,0.07)"}`,
                  color: cidx === i ? "#A78BFA" : "#64748B",
                  boxShadow: cidx === i ? "0 0 14px rgba(124,58,237,0.18)" : "none",
                }}>
                  {d !== undefined && (
                    <span style={{
                      position: "absolute", top: -5, right: -5, width: 13, height: 13, borderRadius: "50%",
                      background: d === 100 ? "#10B981" : d > 0 ? "#F59E0B" : "#EF4444",
                      border: "2px solid #0A0A0F",
                    }} />
                  )}
                  {c.category === "Custom" ? "🔧" : `Ch.${i + 1}`} <span style={{ color: diffColor[c.difficulty] }}>{c.difficulty[0]}</span>
                </button>
              );
            })}
            {/* + Custom Debug button */}
            <button
              onClick={() => setShowCustomModal(true)}
              style={{
                padding: "8px 13px", borderRadius: 11, fontSize: 12, fontWeight: 700,
                cursor: "pointer", transition: "all 0.2s",
                background: "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.25)",
                color: "#A78BFA",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <Upload size={12} /> Debug My Code
            </button>
          </div>
        </div>

        {/* Progress bars */}
        <div style={{ display: "flex", gap: 5, marginBottom: 18 }}>
          {challenges.map((c, i) => {
            const d = done[c.id];
            return (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3, transition: "width 0.7s ease",
                  background: d === 100 ? "#10B981" : d !== undefined ? "#F59E0B" : cidx === i ? "rgba(124,58,237,0.45)" : "transparent",
                  width: d !== undefined ? `${d}%` : cidx === i ? "25%" : "0%",
                }} />
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 308px", gap: 16 }}>

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Challenge info */}
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.065)", borderRadius: 13, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{ch.title}</h2>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20, background: diffBg[ch.difficulty], color: diffColor[ch.difficulty], border: `1px solid ${diffColor[ch.difficulty]}28` }}>{ch.difficulty.toUpperCase()}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.07)" }}>{ch.category}</span>
                </div>
                <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>{ch.description}</p>
              </div>
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#A855F7", display: "flex", alignItems: "center", gap: 3 }}><Zap size={11} />+{ch.xp} XP</span>
                <span style={{ fontSize: 11, color: "#EF4444", display: "flex", alignItems: "center", gap: 3 }}>
                  <Bug size={10} />{ch.bugs.length > 0 ? `${ch.bugs.length} bug${ch.bugs.length > 1 ? "s" : ""}` : "Free explore"}
                </span>
              </div>
            </div>

            {/* Timer + tip row */}
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${timerColor}28`, borderRadius: 11, padding: "9px 13px", display: "flex", alignItems: "center", gap: 9, minWidth: 130 }}>
                <Clock size={13} color={timerColor} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: timerColor, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{fmtTime(submitted ? 0 : timeLeft)}</div>
                  <div style={{ height: 2, borderRadius: 2, background: "rgba(255,255,255,0.05)", marginTop: 4 }}>
                    <div style={{ height: "100%", borderRadius: 2, background: timerColor, width: `${submitted ? 0 : timerPct}%`, transition: "width 1s linear, background 0.5s" }} />
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.13)", borderRadius: 11, padding: "9px 13px", display: "flex", alignItems: "center", gap: 7 }}>
                <Lightbulb size={13} color="#60A5FA" />
                <p style={{ fontSize: 11.5, color: "#93C5FD", lineHeight: 1.4 }}>
                  Click line numbers to flag bugs. False positives deduct 15 pts each!
                  {sel.length > 0 && !submitted && <strong style={{ color: "#F59E0B" }}> {sel.length} flagged.</strong>}
                </p>
              </div>
            </div>

            {/* Code editor */}
            <div style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.065)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "flex", gap: 6, padding: "9px 13px", borderBottom: "1px solid rgba(255,255,255,0.045)", alignItems: "center", background: "rgba(255,255,255,0.018)" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
                <Code2 size={11} color="#374151" style={{ marginLeft: 7 }} />
                <span style={{ fontSize: 11, color: "#374151", fontFamily: "JetBrains Mono, monospace" }}>
                  {ch.category === "Custom" ? `custom.${ch.language.toLowerCase().replace("++", "pp")}` : `buggy.${ch.language === "Python" ? "py" : "js"}`}
                </span>
                {ch.category === "Custom" && (
                  <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: "rgba(124,58,237,0.12)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.22)" }}>
                    YOUR CODE
                  </span>
                )}
                {!submitted && sel.length > 0 && (
                  <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.22)", animation: "pulse 1.8s ease-in-out infinite" }}>
                    {sel.length} flagged
                  </span>
                )}
              </div>
              <div style={{ padding: "6px 0" }}>
                {lines.map((line, i) => {
                  const n = i + 1;
                  const ls = lineStyle(n);
                  const isBugMissed = submitted && bugLines.includes(n) && !sel.includes(n);
                  const isFP = submitted && !bugLines.includes(n) && sel.includes(n);
                  const isCorrect = submitted && bugLines.includes(n) && sel.includes(n);
                  return (
                    <div key={i} onClick={() => toggle(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(null)}
                      style={{ display: "flex", alignItems: "stretch", cursor: submitted ? "default" : "pointer", transition: "background 0.1s", ...ls }}>
                      <span style={{
                        width: 42, paddingLeft: 11, paddingRight: 7, paddingTop: 2, paddingBottom: 2,
                        fontFamily: "JetBrains Mono, monospace", fontSize: 11, userSelect: "none", flexShrink: 0,
                        color: sel.includes(n) ? "#F59E0B" : bugLines.includes(n) && submitted ? "#EF4444" : "#374151",
                        transition: "color 0.18s", display: "flex", alignItems: "center",
                      }}>{n}</span>
                      <pre style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, flex: 1, paddingTop: 2, paddingBottom: 2, paddingRight: 14, lineHeight: 1.7, margin: 0, whiteSpace: "pre" }}>
                        {highlight(line, ch.language)}
                      </pre>
                      <div style={{ paddingRight: 11, paddingTop: 2, flexShrink: 0, display: "flex", alignItems: "center", gap: 3 }}>
                        {isCorrect && <span style={{ fontSize: 11, color: "#10B981" }}>✓</span>}
                        {isBugMissed && <Bug size={11} color="#EF4444" />}
                        {isFP && <span style={{ fontSize: 10, color: "#F59E0B" }}>⚠</span>}
                        {!submitted && sel.includes(n) && <span style={{ fontSize: 9, color: "#F59E0B" }}>●</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 9 }}>
              {!submitted ? (
                ch.category === "Custom" ? (
                  <button onClick={handleAutoDebug} disabled={isAnalyzing} style={{
                    flex: 1, padding: "12px 18px", borderRadius: 11, fontSize: 13, fontWeight: 700,
                    cursor: isAnalyzing ? "wait" : "pointer", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    background: "linear-gradient(135deg,#7C3AED,#A855F7)",
                    color: "#fff",
                    boxShadow: "0 4px 18px rgba(124,58,237,0.3)",
                    opacity: isAnalyzing ? 0.7 : 1, transition: "all 0.2s",
                  }}>
                    <Zap size={14} /> {isAnalyzing ? "AI is Analyzing..." : "Auto-Debug AI"}
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={sel.length === 0} style={{
                    flex: 1, padding: "12px 18px", borderRadius: 11, fontSize: 13, fontWeight: 700,
                    cursor: sel.length === 0 ? "not-allowed" : "pointer", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    background: sel.length === 0 ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg,#7C3AED,#A855F7)",
                    color: sel.length === 0 ? "#374151" : "#fff",
                    boxShadow: sel.length > 0 ? "0 4px 18px rgba(124,58,237,0.3)" : "none",
                    opacity: sel.length === 0 ? 0.55 : 1, transition: "all 0.2s",
                  }}>
                    <Bug size={14} /> Submit Bug Locations
                  </button>
                )
              ) : (
                <>
                  <button onClick={reset} style={{
                    flex: 1, padding: "12px 16px", borderRadius: 11, fontSize: 12, fontWeight: 700,
                    cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.035)",
                    color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s",
                  }}>
                    <RefreshCw size={13} /> Retry
                  </button>
                  {cidx < challenges.length - 1 && (
                    <button onClick={() => switchCh(cidx + 1)} style={{
                      flex: 2, padding: "12px 16px", borderRadius: 11, fontSize: 13, fontWeight: 700,
                      cursor: "pointer", border: "none", background: "linear-gradient(135deg,#1D4ED8,#3B82F6)",
                      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      boxShadow: "0 4px 14px rgba(59,130,246,0.28)", transition: "all 0.2s",
                    }}>
                      Next Challenge <ChevronRight size={14} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Score */}
            {submitted && score !== null && (
              <div style={{
                background: "rgba(255,255,255,0.025)", borderRadius: 14, padding: "20px 16px", textAlign: "center",
                border: `1px solid ${score >= 80 ? "rgba(16,185,129,0.28)" : score >= 50 ? "rgba(245,158,11,0.28)" : "rgba(239,68,68,0.28)"}`,
                boxShadow: `0 0 28px ${score >= 80 ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)"}`,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", margin: "0 auto 12px",
                  background: score >= 80 ? "rgba(16,185,129,0.1)" : score >= 50 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                  border: `3px solid ${score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444"}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 18px ${score >= 80 ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.14)"}`,
                }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{score}</span>
                  <span style={{ fontSize: 8, color: "#6B7280", letterSpacing: "0.1em" }}>SCORE</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 3 }}>
                  {score === 100 ? "🎉 Perfect Debug!" : score >= 80 ? "🔍 Sharp Eye!" : score >= 50 ? "💪 Good Catch!" : "📚 Keep Practicing"}
                </div>
                <div style={{ fontSize: 11, color: "#64748B", marginBottom: 10 }}>
                  {sel.filter(l => bugLines.includes(l)).length}/{bugLines.length} bugs found
                  {sel.filter(l => !bugLines.includes(l)).length > 0 && (
                    <span style={{ color: "#F59E0B" }}> · {sel.filter(l => !bugLines.includes(l)).length} false positive{sel.filter(l => !bugLines.includes(l)).length > 1 ? "s" : ""}</span>
                  )}
                </div>
                {score > 0 && (
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#A855F7", padding: "5px 11px", borderRadius: 7, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.18)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Zap size={11} /> +{Math.round((score / 100) * ch.xp)} XP Earned
                  </div>
                )}
              </div>
            )}

            {/* Hints */}
            {!submitted && (
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.065)", borderRadius: 13, padding: "14px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 5 }}>
                    <Lightbulb size={12} color="#F59E0B" /> Hints ({Math.max(0, hintIdx + 1)}/{ch.hints.length})
                  </h4>
                  {hintIdx < ch.hints.length - 1 ? (
                    <button onClick={() => setHintIdx((h) => h + 1)} style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 7, cursor: "pointer",
                      background: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.22)",
                    }}>Reveal</button>
                  ) : <span style={{ fontSize: 10, color: "#374151" }}>All hints used</span>}
                </div>
                {hintIdx < 0 && <p style={{ fontSize: 11, color: "#374151" }}>Stuck? Reveal hints one at a time — but each hint used reduces your XP.</p>}
                {ch.hints.slice(0, hintIdx + 1).map((h, i) => (
                  <div key={i} style={{ fontSize: 11.5, color: "#FCD34D", lineHeight: 1.5, padding: "7px 9px", borderRadius: 8, marginBottom: 5, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.13)" }}>
                    <strong style={{ color: "#F59E0B" }}>#{i + 1}</strong> {h}
                  </div>
                ))}
              </div>
            )}

            {/* Bug Explanations */}
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.065)", borderRadius: 13, padding: "14px 14px" }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                <Bug size={12} color="#EF4444" /> Bug Explanations
              </h4>
              {submitted ? (
                ch.bugs.length > 0 ? ch.bugs.map((bug, i) => (
                  <div key={i} style={{
                    marginBottom: 8, padding: "9px 11px",
                    background: sel.includes(bug.line) ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)",
                    border: `1px solid ${sel.includes(bug.line) ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)"}`,
                    borderRadius: 9,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                      {sel.includes(bug.line) ? <CheckCircle2 size={11} color="#10B981" /> : <Bug size={11} color="#EF4444" />}
                      <span style={{ fontSize: 10, fontWeight: 700, color: sel.includes(bug.line) ? "#6EE7B7" : "#FCA5A5" }}>
                        Line {bug.line} {sel.includes(bug.line) ? "· Found ✓" : "· Missed"}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>{bug.description}</p>
                  </div>
                )) : (
                  <div style={{ padding: "10px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 9 }}>
                    <p style={{ fontSize: 11.5, color: "#A78BFA" }}>This was a custom code session — no predefined bugs. Review the lines you flagged and assess if they were correct.</p>
                    {sel.length > 0 && <p style={{ fontSize: 11, color: "#64748B", marginTop: 5 }}>You flagged lines: {sel.join(", ")}</p>}
                  </div>
                )
              ) : <p style={{ fontSize: 11.5, color: "#374151" }}>Submit to see detailed bug explanations.</p>}
            </div>

            {/* Fixed Code */}
            {submitted && ch.fixedCode && (
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.065)", borderRadius: 13, overflow: "hidden" }}>
                <button onClick={() => setShowFix(!showFix)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: "12px 14px" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 5 }}>
                    <CheckCircle2 size={12} color="#10B981" /> View Fixed Code
                  </span>
                  <ChevronDown size={14} color="#64748B" style={{ transform: showFix ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {showFix && (
                  <pre style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#6EE7B7", background: "rgba(16,185,129,0.04)", borderTop: "1px solid rgba(16,185,129,0.1)", padding: "11px 13px", overflowX: "auto", whiteSpace: "pre-wrap", margin: 0 }}>
                    {ch.fixedCode}
                  </pre>
                )}
              </div>
            )}

            {/* Key Lesson */}
            {submitted && ch.explanation && (
              <div style={{ padding: "12px 14px", background: "rgba(124,58,237,0.065)", border: "1px solid rgba(124,58,237,0.16)", borderRadius: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#A855F7", marginBottom: 5 }}>🧠 Key Lesson</div>
                <p style={{ fontSize: 11.5, color: "#94A3B8", lineHeight: 1.6 }}>{ch.explanation}</p>
              </div>
            )}

            {/* Stats */}
            {!submitted && (
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.065)", borderRadius: 13, padding: "14px 14px" }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                  <TrendingUp size={12} color="#3B82F6" /> Debug Stats
                </h4>
                {[
                  { label: "Bugs Found", value: totalBugsFound.toString(), color: "#10B981" },
                  { label: "Debug Score", value: completedCount > 0 ? `${avgScore}/100` : "-", color: "#7C3AED" },
                  { label: "Challenges Done", value: completedCount.toString(), color: "#3B82F6" },
                  { label: "Session XP", value: `+${sessionXP}`, color: "#A855F7" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <span style={{ fontSize: 12, color: "#64748B" }}>{s.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }
      `}</style>
    </div>
  );
}
