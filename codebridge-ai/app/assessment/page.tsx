"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { Zap, Brain, Bug, Target, ChevronRight, CheckCircle2, Award, Clock, ArrowRight, RefreshCw } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

const steps = [
  { id: "intro", title: "Assessment Overview", icon: Zap },
  { id: "logical", title: "Logical & Algorithmic", icon: Brain },
  { id: "debug", title: "Debugging Simulation", icon: Bug },
  { id: "career", title: "Career Goals", icon: Target },
  { id: "results", title: "Personalized Roadmap", icon: Award },
];

export default function Assessment() {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedLang, setSelectedLang] = useState("python");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Simple error boundary logic (catch render errors)
  const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    if (hasError) {
      return (
        <div style={{ color: "#F87171", padding: "40px", textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }
    return <>{children}</>;
  };

  // Responsive handling for sidebar
  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBegin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveStep(1);
    }, 1200); // simulate async payload fetch
  };

  const handleSelectOption = (key: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const logicalQuestions = [
    {
      id: "q1",
      question: "Which data structure is best suited for implementing a LIFO (Last-In-First-Out) behavior?",
      options: ["Queue", "Stack", "Singly Linked List", "Binary Search Tree"],
      answer: "Stack",
    },
    {
      id: "q2",
      question: "What is the worst-case time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: "O(log n)",
    },
  ];

  const debugQuestions = [
    {
      id: "q3",
      question: "Identify the issue in this Python code: \n\ndef average(nums):\n    return sum(nums) / len(nums)",
      options: [
        "It doesn't handle floats correctly",
        "It crashes with ZeroDivisionError if nums is empty",
        "It requires importing the statistics library",
        "Syntax error: division sign is incorrect",
      ],
      answer: "It crashes with ZeroDivisionError if nums is empty",
    },
  ];



  const getResultsData = () => {
    return [
      { subject: "Problem Solving", A: 75, fullMark: 100 },
      { subject: "Debugging", A: 85, fullMark: 100 },
      { subject: "Language Proficiency", A: 70, fullMark: 100 },
      { subject: "Theoretical Basics", A: 90, fullMark: 100 },
      { subject: "Production Readiness", A: 45, fullMark: 100 },
    ];
  };

  return (
    <div style={{ display: "flex", background: "#0A0A0F", minHeight: "100vh" }}>
      {/* Sidebar toggle for mobile */}
      {showSidebar ? (
        <Sidebar />
      ) : (
        <button
          onClick={() => setShowSidebar(true)}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "rgba(124,58,237,0.2)",
            border: "none",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#A855F7",
            cursor: "pointer",
          }}
        >
          ☰ Menu
        </button>
      )}
      <main style={{ flex: 1, marginLeft: showSidebar ? 240 : 0, padding: "32px 36px" }}>
          <ErrorBoundary>
            <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
              {steps.map((step, idx) => {
                const isCompleted = idx < activeStep;
                const isActive = idx === activeStep;
                return (
                  <div
                    key={step.id}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: isActive ? "rgba(124, 58, 237, 0.12)" : "rgba(255, 255, 255, 0.02)",
                      border: `1px solid ${isActive ? "rgba(124, 58, 237, 0.3)" : "rgba(255, 255, 255, 0.05)"}`,
                      opacity: isCompleted || isActive ? 1 : 0.4,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: isCompleted ? "#10B981" : isActive ? "#7C3AED" : "rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={14} color="#fff" /> : idx + 1}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Step {idx + 1}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#fff" : "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{step.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ErrorBoundary>

        {/* Content Box */}
        <div className="glass" style={{ padding: "40px 36px", borderRadius: 24, position: "relative" }}>
          {activeStep === 0 && (
            <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16, color: "#fff" }}>⚡</div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginBottom: 12, letterSpacing: "-0.03em" }}>
                Evaluate Your Industry Readiness
              </h1>
              <p style={{ color: "#D1D5DB", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
                This adaptive 15-minute assessment measures your logical capabilities, coding speed, debugging reflexes, and language expertise. We will construct an optimized learning roadmap targeting your weaknesses.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 36,
                  textAlign: "left",
                }}
              >
                <div className="glass-dark" style={{ padding: "16px 20px", borderRadius: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>📌 Adaptive Questions</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>Adapts difficulty dynamically based on your correctness.</div>
                </div>
                <div className="glass-dark" style={{ padding: "16px 20px", borderRadius: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>📈 Visual Gap Analysis</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>Generates a radar diagram detailing system strengths.</div>
                </div>
              </div>
              <button className="btn-primary" style={{ padding: "14px 32px" }} onClick={handleBegin} disabled={isLoading}>
                {isLoading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} /> Loading...
                  </span>
                ) : (
                  <>Begin Assessment <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          )}

          {activeStep === 1 && (
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Algorithmic Fundamentals</h2>
              {logicalQuestions.map((q, idx) => (
                <div key={q.id} style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 12 }}>
                    {idx + 1}. {q.question}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {q.options.map((opt) => {
                      const isSelected = answers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectOption(q.id, opt)}
                          style={{
                            padding: "14px 18px",
                            borderRadius: 12,
                            background: isSelected ? "rgba(124, 58, 237, 0.15)" : "rgba(255,255,255,0.02)",
                            border: `1px solid ${isSelected ? "#7C3AED" : "rgba(255,255,255,0.08)"}`,
                            color: isSelected ? "#fff" : "#94A3B8",
                            fontSize: 13,
                            fontWeight: 500,
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                <button className="btn-primary" onClick={() => setActiveStep(2)}>
                  Next Step <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Debugging Refinement</h2>
              {debugQuestions.map((q, idx) => (
                <div key={q.id} style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 12, whiteSpace: "pre-line" }}>
                    {q.question}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {q.options.map((opt) => {
                      const isSelected = answers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectOption(q.id, opt)}
                          style={{
                            padding: "14px 18px",
                            borderRadius: 12,
                            background: isSelected ? "rgba(124, 58, 237, 0.15)" : "rgba(255,255,255,0.02)",
                            border: `1px solid ${isSelected ? "#7C3AED" : "rgba(255,255,255,0.08)"}`,
                            color: isSelected ? "#fff" : "#94A3B8",
                            fontSize: 13,
                            fontWeight: 500,
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                <button className="btn-ghost" onClick={() => setActiveStep(1)}>
                  Back
                </button>
                <button className="btn-primary" onClick={() => setActiveStep(3)}>
                  Next Step <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Career & Framework Strategy</h2>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94A3B8", marginBottom: 10 }}>
                  PREFERRED PROGRAMMING LANGUAGE
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["python", "javascript", "java", "c++", "sql"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        cursor: "pointer",
                        background: selectedLang === lang ? "rgba(124, 58, 237, 0.15)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selectedLang === lang ? "#7C3AED" : "rgba(255,255,255,0.08)"}`,
                        color: selectedLang === lang ? "#C084FC" : "#64748B",
                        transition: "all 0.2s",
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94A3B8", marginBottom: 10 }}>
                  WHAT IS YOUR IDEAL CAREER GOAL?
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Frontend Software Engineer (React / Next.js)",
                    "Backend / System Design Engineer (Node.js / Python)",
                    "Full Stack Generalist Engineer",
                    "Data Structures & Algorithm Specialist (Competitive Programming)",
                  ].map((goal) => {
                    const isSelected = answers["careerGoal"] === goal;
                    return (
                      <button
                        key={goal}
                        onClick={() => handleSelectOption("careerGoal", goal)}
                        style={{
                          padding: "14px 18px",
                          borderRadius: 12,
                          background: isSelected ? "rgba(124, 58, 237, 0.15)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${isSelected ? "#7C3AED" : "rgba(255,255,255,0.08)"}`,
                          color: isSelected ? "#fff" : "#94A3B8",
                          fontSize: 13,
                          fontWeight: 500,
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                <button className="btn-ghost" onClick={() => setActiveStep(2)}>
                  Back
                </button>
                <button className="btn-primary" onClick={() => setActiveStep(4)}>
                  Complete Assessment <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div style={{ maxWidth: 840, margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "center" }}>
                <div>
                  <span className="badge badge-purple" style={{ marginBottom: 12 }}>Assessment Finalized</span>
                  <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 12, letterSpacing: "-0.02em" }}>
                    Your Industry Readiness Blueprint
                  </h2>
                  <p style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
                    Excellent theoretical knowledge. Your structural debugging proficiency is in the top 15% range. However, system design and framework integration concepts represent key blockers.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {[
                      { title: "Target Focus", value: "Production API Design, Express middleware patterns, database query latency." },
                      { title: "Suggested Lab", value: "Jira ticket CB-101 (Payment API Failure recovery)" },
                      { title: "Goal Position", value: "Full Stack Engineer" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, fontSize: 13 }}>
                        <span style={{ color: "#7C3AED", fontWeight: 700, minWidth: 100 }}>{item.title}:</span>
                        <span style={{ color: "#94A3B8" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/dashboard" className="btn-primary" style={{ display: "inline-flex", background: "#7C3AED", borderColor: "#7C3AED", color: "#fff" }}>
                    Go to Dashboard <ArrowRight size={16} />
                  </Link>
                </div>

                <div style={{ height: 280, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getResultsData()}>
                      <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748B", fontSize: 11 }} />
                      <Radar name="Aryan" dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
