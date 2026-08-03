"use client"

import React from "react"

interface FilterBarProps {
  search: string
  setSearch: (value: string) => void
  category: string
  setCategory: (value: string) => void
  difficulty: string
  setDifficulty: (value: string) => void
  categories: string[]
  difficulties: string[]
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  categories,
  difficulties,
}) => {
  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center" }}>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.04)",
          color: "#fff",
        }}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.04)",
          color: "#fff",
        }}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.04)",
          color: "#fff",
        }}
      >
        <option value="">All Difficulties</option>
        {difficulties.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  )
}
