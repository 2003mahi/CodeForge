"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Bot, ChevronRight, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        // Mock successful sign up for smooth experience
        alert("Sign up successful! You can now log in.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0F" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "420px", padding: "40px", background: "rgba(255,255,255,0.03)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: "32px" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #7C3AED, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 30px rgba(124, 58, 237, 0.4)" }}>
              <Bot size={24} color="#fff" />
            </div>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 8 }}>
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p style={{ color: "#94A3B8", textAlign: "center", marginBottom: 32, fontSize: 14 }}>
            {isSignUp ? "Start your journey to become industry-ready" : "Sign in to continue your progress"}
          </p>

          <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 6 }}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "#fff", outline: "none", fontSize: 14 }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 6 }}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "#fff", outline: "none", fontSize: 14 }}
                placeholder="••••••••"
              />
            </div>
            
            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, color: "#FCA5A5", fontSize: 13 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8, width: "100%", padding: "14px", background: "linear-gradient(135deg, #7C3AED, #3B82F6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s"
              }}
            >
              {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Sign In")}
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ background: "transparent", border: "none", color: "#A855F7", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
