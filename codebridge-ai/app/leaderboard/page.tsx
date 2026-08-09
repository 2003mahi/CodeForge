"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Entry = {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  isCurrentUser: boolean;
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res.data)) setEntries(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#0A0A0F", minHeight: "100vh", color: "#fff", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, textAlign: "center" }}>
        Global Leaderboard
      </h1>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#64748B", fontSize: 14 }}>Loading leaderboard...</p>
        ) : entries.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748B", fontSize: 14 }}>
            No data yet. Solve a problem in the Playground to appear here.
          </p>
        ) : (
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
              {entries.map((u) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    background: u.isCurrentUser ? "rgba(124,58,237,0.08)" : "transparent",
                  }}
                >
                  <td style={cellStyle}>
                    {u.rank <= 3 ? <span style={{ fontSize: 16 }}>{["🥇", "🥈", "🥉"][u.rank - 1]}</span> : `#${u.rank}`}
                  </td>
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
                        flexShrink: 0,
                      }}>
                        {u.avatar}
                      </div>
                      <span>{u.name}</span>
                      {u.isCurrentUser && (
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.4)", color: "#A855F7", fontWeight: 600 }}>
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ ...cellStyle, color: "#A855F7", fontWeight: 700 }}>{u.xp.toLocaleString()}</td>
                  <td style={cellStyle}>{u.streak} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
