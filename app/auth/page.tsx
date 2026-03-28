"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  if (user) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }} className="flex items-center justify-center">
      <div style={{
        width: "100%",
        maxWidth: "400px",
        padding: "40px",
        background: "var(--bg-alt)",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px", position: "relative" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>MesCours</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            {isSignUp ? "Créez votre compte" : "Connectez-vous"}
          </p>
          <div style={{ position: "absolute", top: "0", right: "0" }}>
            <ThemeToggle />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {error && (
            <div style={{
              padding: "12px",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              borderRadius: "8px",
              fontSize: "14px",
            }}>
              ⚠️ {error}
            </div>
          )}

          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.2s",
            }}
          >
            {loading ? "⏳ Chargement..." : isSignUp ? "Créer un compte" : "Se connecter"}
          </button>
        </form>

        {/* Toggle */}
        <div style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "14px",
          color: "var(--text-secondary)",
        }}>
          {isSignUp ? "Vous avez un compte ? " : "Pas encore de compte ? "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: "600",
              textDecoration: "underline",
            }}
          >
            {isSignUp ? "Connectez-vous" : "Inscrivez-vous"}
          </button>
        </div>
      </div>
    </div>
  );
}
