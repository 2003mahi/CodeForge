"use client";

import React from "react";

// Build the Python Tutor URL. The service supports Python and JavaScript visualizations.
// For Python we use mode=python, for JavaScript mode=js.
export const getTutorUrl = (code: string, language: string): string => {
  const base = "https://pythontutor.com/visualize.html#code=";
  const encoded = encodeURIComponent(code);
  const mode = language === "python" ? "python" : "js";
  // The query parameters match the defaults used by python‑tutor.com UI.
  return `${base}${encoded}&cumulative=false&heapPrimitives=false&mode=${mode}&origin=opt-frontend`;
};

interface CodeVisualizerProps {
  code: string;
  language: string;
}

export default function CodeVisualizer({ code, language }: CodeVisualizerProps) {
  const url = getTutorUrl(code, language);
  return (
    <iframe
      src={url}
      title="Code Visualizer"
      style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
      allowFullScreen
    />
  );
}
