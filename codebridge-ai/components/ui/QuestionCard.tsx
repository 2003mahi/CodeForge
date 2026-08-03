"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";

export interface QuestionCardProps {
  title: string;
  description?: string;
  tags?: string[];
  difficulty?: "Easy" | "Medium" | "Hard";
  onClick?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  title,
  description,
  tags = [],
  difficulty,
  onClick,
}) => {
  const difficultyColor = {
    Easy: "#10B981",
    Medium: "#F59E0B",
    Hard: "#EF4444",
  }[difficulty ?? "Easy"];

  return (
    <div
      className="glass-card cursor-pointer border-animated"
      style={{
        padding: "20px",
        borderRadius: "16px",
        backdropFilter: "blur(12px) saturate(150%)",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        transition: "transform 0.2s ease",
        marginBottom: "12px",
      }}
      onClick={onClick}
    >
      <h3 style={{ color: "#fff", marginBottom: "8px" }}>{title}</h3>
      {description && (
        <p style={{ color: "#94A3B8", marginBottom: "12px" }}>{description}</p>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
        {tags.map((t, i) => (
          <Badge key={i} variant="outline" className="badge-purple">
            {t}
          </Badge>
        ))}
        {difficulty && (
          <Badge
            variant="default"
            className="badge-outline"
            style={{ background: difficultyColor, color: "#fff" }}
          >
            {difficulty}
          </Badge>
        )}
      </div>
    </div>
  );
};
