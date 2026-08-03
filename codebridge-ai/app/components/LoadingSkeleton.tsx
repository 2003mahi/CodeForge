// app/components/LoadingSkeleton.tsx
"use client";
import React from "react";

interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({ count = 4 }: LoadingSkeletonProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass card-hover shimmer" style={{ height: 200, borderRadius: 20 }} />
      ))}
    </div>
  );
}
