"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Code2,
  Bug,
  Building2,
  Bot,
  BarChart3,
  Mic,
  Zap,
  BookOpen,
  Trophy,
  ChevronRight,
  Flame,
} from "lucide-react";
import { getUserState, UserState } from "@/lib/store";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Playground", icon: Code2, href: "/playground" },
  { label: "Debug Lab", icon: Bug, href: "/debug" },
  { label: "Industry Sim", icon: Building2, href: "/simulation" },
  { label: "AI Mentor", icon: Bot, href: "/mentor" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Mock Interviews", icon: Mic, href: "/interviews" },
];

const quickActions = [
  { label: "Assessment", icon: Zap, href: "/assessment" },
  { label: "Roadmap", icon: BookOpen, href: "/roadmap" },
  { label: "Leaderboard", icon: Trophy, href: "/leaderboard" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userState, setUserState] = useState<UserState | null>(null);

  useEffect(() => {
    setUserState(getUserState());

    const handleStateChange = (e: Event) => {
      const custom = e as CustomEvent<UserState>;
      if (custom.detail) {
        setUserState(custom.detail);
      }
    };

    window.addEventListener("codebridge_state_change", handleStateChange);
    return () => window.removeEventListener("codebridge_state_change", handleStateChange);
  }, []);

  const name = userState?.name || "Aryan Sharma";
  const level = userState?.level || "Mid-Level Engineer";
  const streak = userState?.streak || 14;
  const xp = userState?.xp || 4280;

  return (
    <aside
      className="sidebar-desktop flex-col"
      style={{
        width: 240,
        minHeight: "100vh",
        background: "rgba(10, 10, 20, 0.95)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        padding: "20px 12px",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "block", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              boxShadow: "0 4px 20px rgba(124, 58, 237, 0.4)",
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#fff", letterSpacing: "-0.02em" }}>
              CodeBridge
            </div>
            <div style={{ fontSize: 10, color: "rgba(168, 85, 247, 0.8)", fontWeight: 600, letterSpacing: "0.08em" }}>
              AI PLATFORM
            </div>
          </div>
        </div>
      </Link>

      {/* User Card */}
      <div
        className="glass"
        style={{
          padding: "12px 14px",
          marginBottom: 24,
          borderRadius: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            AS
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {name}
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>{level}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <Flame size={13} color="#F59E0B" />
          <span style={{ fontSize: 12, color: "#F59E0B", fontWeight: 600 }}>{streak} day streak</span>
        </div>
      </div>

      {/* Main Nav */}
      <nav style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#475569", marginBottom: 8, paddingLeft: 8 }}>
          LEARN
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 24 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? "active" : ""}`}>
                <Icon size={16} />
                {item.label}
                {isActive && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}
              </Link>
            );
          })}
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#475569", marginBottom: 8, paddingLeft: 8 }}>
          TOOLS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {quickActions.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? "active" : ""}`}>
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* XP Bar */}
      <div
        className="glass"
        style={{ padding: "12px 14px", borderRadius: 12, marginTop: 16 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#94A3B8" }}>Total XP</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#A855F7" }}>{xp} XP</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div
            style={{
              width: `${Math.min(100, (xp / 10000) * 100)}%`,
              height: "100%",
              background: "linear-gradient(90deg, #7C3AED, #3B82F6)",
              borderRadius: 3,
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>
          {Math.max(0, 10000 - xp)} XP to next tier
        </div>
      </div>
    </aside>
  );
}
