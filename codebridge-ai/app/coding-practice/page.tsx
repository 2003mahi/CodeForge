"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Menu, X } from "lucide-react";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { Badge } from "@/components/ui/Badge";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Question = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
  source_url?: string;
};

export default function CodingPractice() {
  const [open, setOpen] = useState(false);
  const { data, error, isLoading } = useSWR<{ data: Question[] }>("/api/coding-questions", fetcher);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0A0A0F", color: "#fff" }}>
      {/* Hamburger button */}
      <button
        onClick={toggle}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          background: "rgba(255,255,255,0.08)",
          border: "none",
          borderRadius: "8px",
          padding: "8px",
          cursor: "pointer",
          zIndex: 1000,
        }}
        aria-label={open ? "Close panel" : "Open questions panel"}
      >
        {open ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
      </button>

      {/* Sliding panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : "-320px",
          width: 320,
          height: "100%",
          background: "rgba(15,15,22,0.95)",
          backdropFilter: "blur(8px)",
          transition: "left 0.3s ease",
          overflowY: "auto",
          padding: "24px",
          zIndex: 999,
        }}
      >
        <h2 style={{ marginBottom: "16px", color: "#fff" }}>Coding Interview Questions</h2>
        {isLoading && <p>Loading…</p>}
        {error && <p style={{ color: "#EF4444" }}>Failed to load questions.</p>}
        {data?.data?.map((q) => (
          <QuestionCard
            key={q.id}
            title={q.title}
            description={q.description}
            tags={q.tags}
            difficulty={q.difficulty}
            onClick={() => {
              if (q.source_url) window.open(q.source_url, "_blank");
            }}
          />
        ))}
      </div>

      {/* Main content placeholder – keep existing design untouched */}
      <main style={{ padding: "64px 32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>Practice Coding Questions</h1>
        <p style={{ color: "#94A3B8", marginTop: "8px" }}>
          Click the menu icon (three horizontal lines) at the top‑left to browse a curated list of trending interview problems.
        </p>
        <Badge variant="outline" className="badge-purple" style={{ marginTop: "12px" }}>
          New Feature
        </Badge>
      </main>
    </div>
  );
}
