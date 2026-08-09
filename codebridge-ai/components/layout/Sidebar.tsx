"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
import { mockUser } from "@/lib/mockData";

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
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const emailPrefix = user.email?.split("@")[0] || "User";
        const displayName = user.user_metadata?.full_name || emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

        fetch("/api/me")
          .then((r) => r.json())
          .then((res) => {
            if (!res.user) return;
            setUser({
              name: displayName,
              email: user.email,
              avatar: displayName[0].toUpperCase(),
              level: "Beginner",
              streak: res.user.streak,
              weeklyXP: res.user.total_xp,
            });
          })
          .catch(() => {});
      }
    });
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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
            {user ? user.avatar : mockUser.avatar}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user ? user.name : "Loading..."}
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>{user ? user.level : ""}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Flame size={13} color="#F59E0B" />
            <span style={{ fontSize: 12, color: "#F59E0B", fontWeight: 600 }}>{user ? user.streak : 0} day streak</span>
          </div>
          <button onClick={handleSignOut} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
            Sign out
          </button>
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
          <span style={{ fontSize: 11, fontWeight: 700, color: "#A855F7" }}>{(user ? user.weeklyXP : mockUser.weeklyXP)?.toLocaleString()}</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div
            style={{
              width: `${Math.min(100, ((user ? user.weeklyXP : mockUser.weeklyXP) / 1000) * 100)}%`,
              height: "100%",
              background: "linear-gradient(90deg, #7C3AED, #3B82F6)",
              borderRadius: 3,
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>
          {1000 - (user ? user.weeklyXP : mockUser.weeklyXP) > 0 ? `${(1000 - (user ? user.weeklyXP : mockUser.weeklyXP)).toLocaleString()} XP to next level` : "Top level reached 🎉"}
        </div>
      </div>
    </aside>
  );
}
