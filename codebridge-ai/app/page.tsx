"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Zap,
  Star,
  Users,
  Code2,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { features, mockProblems } from "@/lib/mockData";

const HeroScene = dynamic(() => import("@/components/landing/HeroScene"), {
  ssr: false,
  loading: () => <div style={{ position: "absolute", inset: 0, background: "#0A0A0F" }} />,
});

const stats = [
  { label: "Students Trained", value: "24,000+", icon: Users },
  { label: "Problems Solved", value: "1.2M+", icon: Code2 },
  { label: "Interview Success Rate", value: "87%", icon: Trophy },
  { label: "Partner Companies", value: "380+", icon: Star },
];

const journey = [
  { step: "01", title: "AI Skill Assessment", desc: "Map your exact gaps in 15 minutes" },
  { step: "02", title: "Personalized Roadmap", desc: "Custom path based on your goals" },
  { step: "03", title: "Daily Coding Practice", desc: "Solve real interview problems" },
  { step: "04", title: "Industry Simulation", desc: "Work like a real junior dev" },
  { step: "05", title: "AI Code Reviews", desc: "Get expert feedback instantly" },
  { step: "06", title: "Mock Interviews", desc: "Practice with company-style rounds" },
];

const companies = ["Google", "Microsoft", "Amazon", "Flipkart", "Swiggy", "Zomato", "CRED", "Razorpay", "Zerodha", "PhonePe"];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = value / 60;
    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + step;
        if (next >= value) { clearInterval(timer); return value; }
        return next;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [value]);
  return <>{Math.floor(count)}{suffix}</>;
}

export default function LandingPage() {
  const [activeProblem, setActiveProblem] = useState(0);

  return (
    <div style={{ background: "#0A0A0F", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Navbar ───────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(10, 10, 20, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 4px 20px rgba(124, 58, 237, 0.4)",
            }}
          >⚡</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.02em" }}>CodeBridge AI</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/roadmap" className="btn-ghost" style={{ padding: "8px 16px", fontSize: 14 }}>
            Roadmaps
          </Link>
          <Link href="/dashboard" className="btn-ghost" style={{ padding: "8px 16px", fontSize: 14 }}>
            Dashboard
          </Link>
          <Link href="/login" className="btn-ghost" style={{ padding: "8px 16px", fontSize: 14 }}>
            Sign In
          </Link>
          <Link href="/playground" className="btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>
            Start Coding <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          paddingTop: 80,
        }}
      >
        {/* 3D Background */}
        <HeroScene />

        {/* Gradient Blobs */}
        <div className="hero-blob" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)", top: "10%", left: "-10%" }} />
        <div className="hero-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)", bottom: "0%", right: "-5%" }} />

        {/* Grid overlay */}
        <div className="bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 900, padding: "0 24px" }}>
          <div className="badge badge-purple" style={{ marginBottom: 24, display: "inline-flex" }}>
            <Zap size={11} /> AI-Powered EdTech Platform
          </div>

          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 80px)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "#fff",
              marginBottom: 24,
            }}
          >
            Bridge the Gap Between
            <br />
            <span className="gradient-text">Academic & Industry</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "#94A3B8",
              maxWidth: 600,
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            The AI platform that transforms CS students into interview-ready engineers through daily coding practice, debugging challenges, and real industry simulation.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/assessment" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
              <Zap size={18} /> Start Free Assessment
            </Link>
            <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 16, padding: "14px 32px" }}>
              <Play size={18} /> View Demo
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex" }}>
              {["👩‍💻", "👨‍💻", "🧑‍💻", "👩‍💻"].map((emoji, i) => (
                <div
                  key={i}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: `hsl(${250 + i * 20}, 70%, 50%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, marginLeft: i > 0 ? -10 : 0,
                    border: "2px solid #0A0A0F",
                  }}
                >{emoji}</div>
              ))}
            </div>
            <span style={{ color: "#94A3B8", fontSize: 14 }}>
              <strong style={{ color: "#fff" }}>24,000+</strong> students already learning
            </span>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────── */}
      <section style={{ padding: "60px 40px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 8 }}>
                  <Icon size={24} color="#7C3AED" style={{ margin: "0 auto" }} />
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ color: "#64748B", fontSize: 14, marginTop: 4 }}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Problem Section ───────────────────────────── */}
      <section style={{ padding: "100px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div className="badge badge-red" style={{ marginBottom: 16, display: "inline-flex" }}>The Problem</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 20 }}>
              87% of graduates fail their first technical interview
            </h2>
            <p style={{ color: "#94A3B8", lineHeight: 1.7, marginBottom: 28 }}>
              Colleges teach theory. Companies want execution. The gap costs students opportunities and companies billions in retraining costs.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "Cannot solve unseen coding problems",
                "Don't know how to debug efficiently",
                "Never worked in a real codebase",
                "No experience with Git, PRs, or tickets",
                "Can't explain time/space complexity",
              ].map((issue, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <span style={{ color: "#EF4444", fontSize: 12 }}>✕</span>
                  </div>
                  <span style={{ color: "#94A3B8", fontSize: 15 }}>{issue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code Demo Card */}
          <div className="glass border-gradient" style={{ padding: 24, borderRadius: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
              </div>
              <span style={{ fontSize: 12, color: "#475569", fontFamily: "JetBrains Mono" }}>solution.py</span>
            </div>
            <div className="code-block" style={{ marginBottom: 16, fontSize: 12 }}>
              <div style={{ color: "#64748B" }}># ❌ Common mistake: Brute force O(n²)</div>
              <div><span style={{ color: "#C084FC" }}>def</span> <span style={{ color: "#60A5FA" }}>two_sum</span>(nums, target):</div>
              <div style={{ paddingLeft: 20 }}><span style={{ color: "#C084FC" }}>for</span> i <span style={{ color: "#C084FC" }}>in</span> <span style={{ color: "#60A5FA" }}>range</span>(len(nums)):</div>
              <div style={{ paddingLeft: 40 }}><span style={{ color: "#C084FC" }}>for</span> j <span style={{ color: "#C084FC" }}>in</span> <span style={{ color: "#60A5FA" }}>range</span>(i+1, len(nums)):</div>
              <div style={{ paddingLeft: 60 }}><span style={{ color: "#C084FC" }}>if</span> nums[i] + nums[j] == target:</div>
              <div style={{ paddingLeft: 80 }}><span style={{ color: "#C084FC" }}>return</span> [i, j]</div>
            </div>
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16 }}>🤖</span>
              <div style={{ fontSize: 12, color: "#FCA5A5" }}>
                <strong>AI Review:</strong> O(n²) complexity. This will TLE on large inputs. Use a HashMap for O(n) solution.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────── */}
      <section style={{ padding: "80px 40px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="badge badge-blue" style={{ marginBottom: 16, display: "inline-flex" }}>Platform Features</div>
            <h2 style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 16 }}>
              Everything you need to get <span className="gradient-text">hired</span>
            </h2>
            <p style={{ color: "#94A3B8", maxWidth: 560, margin: "0 auto" }}>
              One platform. 6 interconnected learning modules. Powered by AI.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass card-hover"
                style={{ padding: 28, borderRadius: 20, cursor: "pointer", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${feature.color}20, transparent)` }} />
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: `${feature.color}18`,
                    border: `1px solid ${feature.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, marginBottom: 18,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{feature.title}</h3>
                <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.6 }}>{feature.description}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 16, color: feature.color, fontSize: 13, fontWeight: 600 }}>
                  Explore <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── User Journey ──────────────────────────────── */}
      <section style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="badge badge-green" style={{ marginBottom: 16, display: "inline-flex" }}>Your Journey</div>
            <h2 style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
              From <span className="gradient-text">student</span> to <span className="gradient-text-gold">hired</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {journey.map((item, i) => (
              <div key={i} className="glass card-hover" style={{ padding: 24, borderRadius: 16, position: "relative" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", letterSpacing: "0.1em", marginBottom: 12 }}>
                  STEP {item.step}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.5 }}>{item.desc}</p>
                <CheckCircle2 size={16} color="#7C3AED" style={{ position: "absolute", top: 20, right: 20, opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Ticker ────────────────────────────── */}
      <section style={{ padding: "40px 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ marginBottom: 12, textAlign: "center", fontSize: 12, color: "#475569", letterSpacing: "0.1em" }}>
          GRADUATES PLACED AT
        </div>
        <div style={{ overflow: "hidden" }}>
          <div className="ticker-track">
            {[...companies, ...companies].map((company, i) => (
              <span key={i} style={{ fontSize: 16, fontWeight: 700, color: "#475569", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────── */}
      <section style={{ padding: "100px 40px" }}>
        <div
          className="border-animated"
          style={{
            maxWidth: 780,
            margin: "0 auto",
            background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(59,130,246,0.1))",
            borderRadius: 28,
            padding: "64px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="hero-blob" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(124,58,237,0.3), transparent)", top: "-20%", left: "20%" }} />
          <h2 style={{ fontSize: 44, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", marginBottom: 16, position: "relative" }}>
            Ready to become <span className="gradient-text">industry-ready?</span>
          </h2>
          <p style={{ color: "#94A3B8", marginBottom: 36, fontSize: 18, position: "relative" }}>
            Join 24,000+ students who transformed their careers with CodeBridge AI
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", position: "relative", flexWrap: "wrap" }}>
            <Link href="/assessment" className="btn-primary" style={{ fontSize: 17, padding: "16px 36px" }}>
              <Zap size={20} /> Start Your Assessment — Free
            </Link>
          </div>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 20, position: "relative" }}>
            No credit card required · Takes 15 minutes · Personalized roadmap instantly
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #7C3AED, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⚡</div>
          <span style={{ fontWeight: 700, color: "#fff" }}>CodeBridge AI</span>
        </div>
        <p style={{ color: "#475569", fontSize: 13 }}>
          © 2025 CodeBridge AI. Bridging the gap between academic learning and industry skills.
        </p>
      </footer>
    </div>
  );
}
