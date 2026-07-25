"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { mockMentorMessages } from "@/lib/mockData";
import { Bot, Send, Code2, Lightbulb, BookOpen, TrendingUp, Sparkles, User } from "lucide-react";

type Message = {
  role: "ai" | "user";
  content: string;
  timestamp: string;
};

const quickPrompts = [
  "Explain Big-O notation simply",
  "Review my Two Sum solution",
  "What should I learn next?",
  "Help me understand recursion",
  "Give me a coding challenge",
];

const aiResponses: Record<string, string> = {
  default: "Great question! Let me help you understand this concept. Based on your recent progress, I can see you're working on algorithm fundamentals. Here's what I recommend...\n\nFocus on **pattern recognition** — most interview problems are variations of ~15 core patterns:\n\n1. Two Pointers\n2. Sliding Window\n3. HashMap / HashSet\n4. Binary Search\n5. BFS / DFS\n\nWhich pattern would you like to drill deeper on? 🚀",
  "Explain Big-O notation simply": "**Big-O Notation** measures how an algorithm's runtime grows with input size.\n\n```python\n# O(1) - Constant: always same speed\ndef get_first(arr):\n    return arr[0]\n\n# O(n) - Linear: grows with input\ndef find_max(arr):\n    return max(arr)\n\n# O(n²) - Quadratic: nested loops\ndef bubble_sort(arr):\n    for i in arr:\n        for j in arr:\n            ...\n```\n\n**Rule of thumb for interviews:**\n- O(1) = perfect\n- O(log n) = great\n- O(n) = good\n- O(n log n) = acceptable for sorting\n- O(n²) = usually too slow → think HashMap! 💡",
  "What should I learn next?": "Based on your profile, here's your personalized next steps:\n\n**Immediate (This Week):**\n1. Sliding Window pattern — you've been solving array problems, this is the natural next step\n2. Two Pointers — pairs perfectly with your existing HashMap knowledge\n\n**Short-term (Next 2 weeks):**\n3. Binary Search variations — not just sorted arrays!\n4. Stack problems — daily coding companies love these\n\n**Medium-term:**\n5. Trees + BFS/DFS — appears in 40% of FAANG interviews\n\nYou're at **65% interview readiness**. With 2 more weeks of consistency, you can hit 80%! 🎯",
};

function formatContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("```")) return null;
    if (line.match(/\*\*(.*?)\*\*/)) {
      const parts = line.split(/\*\*(.*?)\*\*/);
      return (
        <p key={i} style={{ marginBottom: 6, color: "#E2E8F0", lineHeight: 1.6, fontSize: 14 }}>
          {parts.map((part, pi) =>
            pi % 2 === 1 ? <strong key={pi} style={{ color: "#fff", fontWeight: 700 }}>{part}</strong> : part
          )}
        </p>
      );
    }
    if (line.match(/^\d+\./)) {
      return <p key={i} style={{ marginBottom: 4, color: "#94A3B8", fontSize: 14, paddingLeft: 12 }}>{line}</p>;
    }
    if (line === "") return <div key={i} style={{ height: 6 }} />;
    return <p key={i} style={{ marginBottom: 4, color: "#94A3B8", lineHeight: 1.6, fontSize: 14 }}>{line}</p>;
  });
}

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>(mockMentorMessages as Message[]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string = input) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = aiResponses[text] || aiResponses.default;
      const aiMsg: Message = {
        role: "ai",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div style={{ display: "flex", background: "#0A0A0F", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 240, display: "flex" }}>

        {/* Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>

          {/* Header */}
          <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
              <Bot size={22} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>CodeBridge AI Mentor</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748B" }}>
                <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                Online · Knows your profile · Powered by Gemini
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <span className="badge badge-green">Expert Mode</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 24, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "ai" && (
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Bot size={18} color="#fff" />
                  </div>
                )}
                <div className={msg.role === "ai" ? "chat-bubble-ai" : "chat-bubble-user"}>
                  <div>{formatContent(msg.content)}</div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 8, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.timestamp}</div>
                </div>
                {msg.role === "user" && (
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={18} color="#fff" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot size={18} color="#fff" />
                </div>
                <div className="chat-bubble-ai" style={{ display: "flex", gap: 4, alignItems: "center", padding: "14px 20px" }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 7, height: 7, borderRadius: "50%", background: "#7C3AED",
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: "12px 28px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                style={{
                  padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94A3B8", transition: "all 0.2s", whiteSpace: "nowrap",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ padding: "16px 28px 24px" }}>
            <div
              style={{
                display: "flex", gap: 12, alignItems: "flex-end",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: "12px 16px",
                transition: "border-color 0.2s",
              }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask me anything about coding, algorithms, or your learning path..."
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none", resize: "none",
                  color: "#E2E8F0", fontSize: 14, lineHeight: 1.5, fontFamily: "Inter, sans-serif",
                  maxHeight: 120, minHeight: 24,
                }}
                rows={1}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                style={{
                  width: 40, height: 40, borderRadius: 12, border: "none", cursor: "pointer",
                  background: input.trim() ? "linear-gradient(135deg, #7C3AED, #3B82F6)" : "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", flexShrink: 0,
                }}
              >
                <Send size={16} color={input.trim() ? "#fff" : "#475569"} />
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#374151", marginTop: 8, textAlign: "center" }}>
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ width: 280, borderLeft: "1px solid rgba(255,255,255,0.07)", padding: "24px 20px", overflowY: "auto" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>📊 Your Context</h3>

          {[
            { label: "Current Topic", value: "Arrays & HashMaps", icon: Code2, color: "#7C3AED" },
            { label: "Weak Area", value: "Dynamic Programming", icon: TrendingUp, color: "#EF4444" },
            { label: "Next Milestone", value: "Binary Trees", icon: BookOpen, color: "#3B82F6" },
            { label: "Interview Score", value: "65/100", icon: Sparkles, color: "#F59E0B" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="glass-dark" style={{ padding: "12px 14px", borderRadius: 12, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={14} color={item.color} />
                  <span style={{ fontSize: 11, color: "#475569" }}>{item.label}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 4 }}>{item.value}</div>
              </div>
            );
          })}

          <div style={{ marginTop: 20, padding: "16px 14px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#A855F7", marginBottom: 8 }}>🎯 Today's Goal</div>
            <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>Complete 3 sliding window problems and review your Two Sum solution complexity analysis.</p>
          </div>

          <div style={{ marginTop: 16 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", marginBottom: 10 }}>SUGGESTED TOPICS</h4>
            {["Sliding Window Pattern", "Two Pointer Technique", "HashMap Mastery", "Binary Search Variants"].map((t, i) => (
              <button
                key={i}
                onClick={() => sendMessage(`Teach me about ${t}`)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "8px 12px", borderRadius: 10, marginBottom: 6, cursor: "pointer",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  color: "#94A3B8", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                  textAlign: "left",
                }}
              >
                <Lightbulb size={13} color="#F59E0B" style={{ flexShrink: 0 }} />
                {t}
              </button>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
