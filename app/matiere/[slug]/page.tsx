"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";
import { getCoursByMatiere, creerCours, getMatieres, getMatiereBySlug, Cours, Matiere } from "@/lib/firestore";

export default function MatierePage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const slug = params.slug as string;
  const [cours, setCours] = useState<Cours[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [matiereName, setMatiereName] = useState("");
  const [matiereIcon, setMatiereIcon] = useState("📂");
  const [search, setSearch] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Load data
  useEffect(() => {
    if (loading || !user) return;

    const loadData = async () => {
      try {
        const allM = await getMatieres();
        setMatieres(allM);
        
        const m = allM.find((m) => m.slug === slug);
        if (m) {
          setMatiereName(m.nom);
          setMatiereIcon(m.icon);
          const c = await getCoursByMatiere(m.id);
          setCours(c);
        }

        const counts: Record<string, number> = {};
        for (const mat of allM) {
          const c = await getCoursByMatiere(mat.id);
          counts[mat.slug] = c.length;
        }
        setCounts(counts);
      } catch (error) {
        console.error("Erreur au chargement:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [slug, user, loading]);

  const handleNouveauCours = async () => {
    try {
      const matiere = matieres.find((m) => m.slug === slug);
      if (!matiere) return;
      const newCours = await creerCours("Nouveau cours", matiere.nom, matiere.id);
      router.push(`/cours/${newCours.id}`);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

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

  const coursFiltres = search
    ? cours.filter((c) =>
        c.titre.toLowerCase().includes(search.toLowerCase())
      )
    : cours;

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

        <div className="sidebar-section">
          {matieres.map((m) => (
            <Link
              href={`/matiere/${m.slug}`}
              key={m.id}
              className={`sidebar-item ${m.slug === slug ? "active" : ""}`}
              title={m.nom}
            >
              {m.icon}
            </Link>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-avatar" title="Profil">
            👤
          </div>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-title">
            {matiereIcon} {matiereName}
          </div>
          <div className="topbar-right">
            {cours.length > 3 && (
              <div className="search-wrapper">
                <span className="search-bar-icon">🔍</span>
                <input
                  className="search-bar"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un cours..."
                />
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>

        <div className="content-area">
          <div className="hero">
            <h1 className="hero-greeting">{matiereIcon} {matiereName}</h1>
            <p className="hero-sub">{cours.length} cours • Organise tes leçons</p>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <div className="section-title">
                  {search ? "🔍 Résultats" : "📝 Tous les cours"}
                </div>
                <div className="section-subtitle">
                  {coursFiltres.length} cours
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleNouveauCours}
              >
                + Nouveau cours
              </button>
            </div>
            {coursFiltres.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">✍️</div>
                <div className="empty-title">
                  {search ? "Aucun cours trouvé" : "Aucun cours"}
                </div>
                <div className="empty-text">
                  {search
                    ? "Essaie une autre recherche"
                    : "Crée ton premier cours pour cette matière"}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {coursFiltres.map((c, i) => (
                  <Link
                    href={`/cours/${c.id}`}
                    key={c.id}
                    className="card"
                    style={{ marginBottom: 0 }}
                  >
                    <div className="card-header">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          background: "rgba(99, 102, 241, 0.1)",
                          color: "var(--primary)",
                          flexShrink: 0,
                          fontWeight: "700",
                        }}
                      >
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, marginLeft: "12px" }}>
                        <div className="card-title">{c.titre || "Sans titre"}</div>
                        <div className="card-meta">
                          {new Date(c.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </div>
                      </div>
                      <div className="card-arrow">→</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}