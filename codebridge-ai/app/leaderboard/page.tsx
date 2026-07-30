"use client";

import { mockLeaderboard } from "@/lib/mockData";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Leaderboard() {
  return (
    <div style={{ background: "#0A0A0F", minHeight: "100vh", color: "#fff", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, textAlign: "center" }}>
        Global Leaderboard
      </h1>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.05)" }}>
              <th style={headerCellStyle}>Rank</th>
              <th style={headerCellStyle}>User</th>
              <th style={headerCellStyle}>XP</th>
              <th style={headerCellStyle}>Streak</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((u) => (
              <tr key={u.rank} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <td style={cellStyle}>#{u.rank}</td>
                <td style={cellStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 14,
                    }}>
                      {u.avatar}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td style={cellStyle}>{u.xp}</td>
                <td style={cellStyle}>{u.streak} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Link href="/dashboard" style={{ color: "#A855F7", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4 }}>
          Back to Dashboard <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}

const headerCellStyle = {
  padding: "12px 8px",
  textAlign: "left" as const,
  fontSize: 13,
  fontWeight: 600 as const,
  color: "#94A3B8",
};

const cellStyle = {
  padding: "10px 8px",
  fontSize: 13,
  color: "#E2E8F0",
};
