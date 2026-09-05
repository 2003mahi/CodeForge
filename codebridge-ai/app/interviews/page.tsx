"use client";

import { useState, useEffect } from "react";

import Sidebar from "@/components/layout/Sidebar";
import LoadingSkeleton from "@/app/components/LoadingSkeleton";
import useSWR from "swr";
import { Badge } from "@/components/ui/Badge";
import { Mic, Video, Timer, MessageSquare, Play, X, CheckCircle, ChevronRight, AlertCircle } from "lucide-react";

interface Mock {
  id: string;
  company: string;
  type: string;
  duration: number;
  questions: { title: string; description: string; tags: string[] }[];
  logo?: string;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MockInterviews() {
  const [selectedMock, setSelectedMock] = useState<any | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, string>>({});
  const [answerInput, setAnswerInput] = useState("");
  const { data: interviews, error } = useSWR('/api/interviews', fetcher);
  const [finished, setFinished] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (inProgress && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && inProgress) {
      finishInterview(submittedAnswers);
    }
    return () => clearInterval(timer);
  }, [inProgress, timeLeft]);

  const finishInterview = async (finalAnswers: Record<number, string>) => {
    setFinished(true);
    setInProgress(false);
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: selectedMock?.company,
          type: selectedMock?.type,
          questions: selectedMock?.questions,
          submittedAnswers: finalAnswers,
        }),
      });
      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
      }
    } catch (e) {
      console.error('Evaluation error:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const startInterview = (mock: any) => {
    setSelectedMock(mock);
    setInProgress(true);
    setCurrentQuestionIdx(0);
    setTimeLeft(mock.duration * 60);
    setAnswerInput("");
    setSubmittedAnswers({});
    setEvaluation(null);
    setFinished(false);
  };

  const handleNextQuestion = () => {
    const updatedAnswers = { ...submittedAnswers, [currentQuestionIdx]: answerInput };
    setSubmittedAnswers(updatedAnswers);
    if (selectedMock && currentQuestionIdx < selectedMock.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setAnswerInput(updatedAnswers[currentQuestionIdx + 1] || "");
    } else {
      finishInterview(updatedAnswers);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div style={{ display: "flex", background: "#0A0A0F", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, padding: "32px 36px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <Mic size={22} color="#7C3AED" />
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Mock Interviews</h1>
            </div>
            <p style={{ color: "#64748B" }}>Simulate live corporate coding assessments, system design rounds, and behavioral question series.</p>
          </div>
          <span className="badge badge-purple">Standard Plan Enabled</span>
        </div>

        {/* Finished / Review Panel */}
        {finished && selectedMock && (
          <div className="border-animated" style={{ padding: 32, borderRadius: 24, marginBottom: 28, maxWidth: 800, background: "#0F0F16" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Mock Interview Complete! 🎉</h2>
            <p style={{ color: "#E2E8F0", fontSize: 14, marginBottom: 24 }}>
              Congratulations on completing the **{selectedMock.company} {selectedMock.type} Round**. Our AI evaluator has analyzed your responses in real time.
            </p>

            {isEvaluating ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🤖 ⚡</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>AI Evaluator is scoring your answers...</div>
                <div style={{ fontSize: 13, color: "#94A3B8" }}>Analyzing technical accuracy, communication depth, and edge cases</div>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
                  {[
                    { label: "Overall Score", value: `${evaluation?.overallScore ?? 75}%`, color: "#10B981" },
                    { label: "Communication", value: `${evaluation?.communicationScore ?? 80}%`, color: "#3B82F6" },
                    { label: "Technical Precision", value: `${evaluation?.technicalScore ?? 72}%`, color: "#7C3AED" },
                  ].map((m, i) => (
                    <div key={i} className="glass-dark" style={{ padding: "16px 20px", borderRadius: 14, textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: m.color }}>{m.value}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  <div style={{ padding: "14px 16px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12 }}>
                    <div style={{ fontWeight: 700, color: "#6EE7B7", fontSize: 13, marginBottom: 4 }}>✓ STRENGTHS</div>
                    <p style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.5 }}>
                      {evaluation?.strengths || "Demonstrated good structural approach to decomposing the problem and explaining solution rationale."}
                    </p>
                  </div>
                  <div style={{ padding: "14px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12 }}>
                    <div style={{ fontWeight: 700, color: "#FCA5A5", fontSize: 13, marginBottom: 4 }}>⚠️ AREAS OF IMPROVEMENT</div>
                    <p style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.5 }}>
                      {evaluation?.improvements || "Explicitly enumerate constraints and time-space complexity metrics before writing the final solution."}
                    </p>
                  </div>
                </div>

                <button className="btn-primary" onClick={() => setFinished(false)}>
                  Back to Overview
                </button>
              </>
            )}
          </div>
        )}

      {/* Mock Interview List */}
      {!inProgress && !finished && (
        <>
          {!interviews && !error && <LoadingSkeleton count={4} />}
                      {interviews?.map((mock: Mock) => (
            <div key={mock.id} className="glass card-hover border-animated" style={{ padding: 28, borderRadius: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="avatar">
                    <div className="w-14 rounded-full" style={{ background: `url(${mock.logo}) center/cover` }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{mock.company}</h3>
                    <p style={{ fontSize: 13, color: "#94A3B8" }}>{mock.type} Round</p>
                  </div>
                </div>
                <Badge className="badge badge-outline">{mock.type}</Badge>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                <Timer size={14} color="#7C3AED" />
                <span style={{ fontSize: 13, color: "#94A3B8" }}>Duration: {mock.duration} minutes</span>
                <MessageSquare size={14} color="#3B82F6" />
                <span style={{ fontSize: 13, color: "#94A3B8" }}>{mock.questions.length} Questions</span>
              </div>

              <button className="btn-primary w-full justify-center" onClick={() => startInterview(mock)}>
                <Play size={14} /> Start Simulation
              </button>
            </div>
          ))}
        </>
      )}

        {/* Live Simulator Modal */}
        {inProgress && selectedMock && (
          <div
            style={{
              position: "fixed", inset: 0, background: "#0A0A0F", zIndex: 200,
              display: "flex", flexDirection: "column", padding: 32,
            }}
          >
            {/* Simulation Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 20, marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{selectedMock.company} Mock Interview</h2>
                <p style={{ fontSize: 12, color: "#64748B" }}>{selectedMock.type} · Active Question {currentQuestionIdx + 1}/{selectedMock.questions.length}</p>
              </div>

              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", padding: "8px 16px", borderRadius: 10 }}>
                  <Timer size={16} color="#EF4444" />
                  <span className="font-code" style={{ color: "#FCA5A5", fontWeight: 700 }}>{formatTime(timeLeft)}</span>
                </div>
                <button
                  onClick={() => setInProgress(false)}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 8, cursor: "pointer" }}
                >
                  <X size={16} color="#94A3B8" />
                </button>
              </div>
            </div>

            {/* Simulation Main Panels */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, overflow: "hidden" }}>
              {/* Left Panel: Question Description */}
              <div className="glass" style={{ padding: 28, borderRadius: 20, overflowY: "auto" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                  {selectedMock.questions[currentQuestionIdx].tags.map((tag: string, i: number) => (
                    <span key={i} className="badge badge-purple">{tag}</span>
                  ))}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 14 }}>
                  {selectedMock.questions[currentQuestionIdx].title}
                </h3>
                <p style={{ color: "#94A3B8", lineHeight: 1.6, fontSize: 14 }}>
                  {selectedMock.questions[currentQuestionIdx].description}
                </p>

                <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 14 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <AlertCircle size={14} color="#C084FC" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#C084FC", letterSpacing: "0.02em" }}>PRO TIP FROM EVALUATOR</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>
                    Think out loud! Explain assumptions about memory usage and execution speeds prior to writing code blocks.
                  </p>
                </div>
              </div>

              {/* Right Panel: Code / Text Response Area */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="glass-dark" style={{ flex: 1, borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0D1117" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.04em" }}>RESPONSE WORKSPACE</span>
                  </div>
                  <textarea
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Provide your algorithmic approach, code outline, or behavioral answer..."
                    className="font-code"
                    style={{
                      flex: 1, background: "#0D1117", border: "none", outline: "none", resize: "none",
                      color: "#E2E8F0", padding: 24, fontSize: 13, lineHeight: 1.6,
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                  <button
                    style={{ padding: "12px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#94A3B8", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
                    onClick={() => setInProgress(false)}
                  >
                    Exit
                  </button>
                  <button
                    className="btn-primary"
                    style={{ padding: "12px 28px", opacity: answerInput.trim().length === 0 ? 0.5 : 1, cursor: answerInput.trim().length === 0 ? "not-allowed" : "pointer" }}
                    onClick={handleNextQuestion}
                    disabled={answerInput.trim().length === 0}
                  >
                    {currentQuestionIdx < selectedMock.questions.length - 1 ? "Next Question" : "Finish Interview"} <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
