"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import Editor from "@/components/Editor";
import ThemeToggle from "@/components/ThemeToggle";
import { getCoursById, sauvegarderCours, getCoursByMatiere, Cours } from "@/lib/firestore";

export default function CoursPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const id = params.id as string;
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState<string | null>(null);
  const [matiere, setMatiere] = useState("");
  const [matiereId, setMatiereId] = useState("");
  const [saved, setSaved] = useState(true);
  const [showSaved, setShowSaved] = useState(false);
  const [autresCours, setAutresCours] = useState<Cours[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const titreRef = useRef(titre);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Load course data
  useEffect(() => {
    if (loading || !user) return;

    const loadData = async () => {
      try {
        const cours = await getCoursById(id);
        if (cours) {
          setTitre(cours.titre || "");
          setContenu(cours.contenu || "");
          setMatiere(cours.matiere || "");
          setMatiereId(cours.matiereId || "");
          
          const autres = await getCoursByMatiere(cours.matiereId);
          setAutresCours(
            autres
              .filter((c) => c.id !== id)
              .slice(0, 5)
          );
        }
      } catch (error) {
        console.error("Erreur au chargement:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [id, user, loading]);

  useEffect(() => {
    titreRef.current = titre;
  }, [titre]);

  function handleTitreChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitre(e.target.value);
    setSaved(false);
  }

  async function handleSave(html: string) {
    try {
      await sauvegarderCours(id, titreRef.current, html);
      setContenu(html);
      setSaved(true);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
    }
  }

  if (loading || dataLoading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="app">
      {/* Sidebar Collapse */}
      <aside className="sidebar">
        <div className="sidebar-logo" title="MesCours">
          📚
        </div>

        <div className="sidebar-section">
          <Link href="/" className="sidebar-item" title="Accueil">
            🏠
          </Link>
          <Link href="/planning" className="sidebar-item" title="Planning">
            📅
          </Link>
        </div>

        <div className="sidebar-bottom">
          <button
            onClick={() => router.back()}
            className="sidebar-avatar"
            title="Retour"
          >
            ←
          </button>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-title">✏️ Éditeur de cours</div>
          <div className="topbar-right">
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                background: "rgba(99, 102, 241, 0.1)",
                color: "var(--primary)",
                padding: "4px 12px",
                borderRadius: "6px",
                textTransform: "uppercase",
              }}
            >
              {matiere}
            </div>
            <div
              className={`save-pill ${
                showSaved ? "ok" : saved ? "idle" : "pending"
              }`}
            >
              {showSaved ? "✅ Sauvegardé" : saved ? "Prêt" : "💾 En attente..."}
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="content-area">
          <div className="hero">
            <input
              type="text"
              value={titre}
              onChange={handleTitreChange}
              onBlur={() => handleSave(contenu || "")}
              placeholder="Sans titre"
              className="hero-greeting"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "0",
                margin: "0 0 8px 0",
              }}
            />
            <div className="hero-sub">
              📅{" "}
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              • 📂 {matiere}
            </div>
          </div>

          {contenu !== null && (
            <Editor contenu={contenu} onSave={handleSave} />
          )}

          {autresCours.length > 0 && (
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <div className="section-title">🗂️ Autres cours</div>
                  <div className="section-subtitle">
                    Dans {matiere}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {autresCours.map((c) => (
                  <Link
                    href={`/cours/${c.id}`}
                    key={c.id}
                    className="card"
                    style={{ marginBottom: 0 }}
                  >
                    <div className="card-header">
                      <div className="card-title">{c.titre || "Sans titre"}</div>
                      <div className="card-arrow">→</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}