"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getMatieres, creerMatiere, getCoursRecents, getCoursByMatiere, Matiere, Cours } from "@/lib/firestore";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [coursRecents, setCoursRecents] = useState<Cours[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newNom, setNewNom] = useState("");
  const [newIcon, setNewIcon] = useState("📘");
  const [greeting, setGreeting] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Load data from Firestore
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    
    const loadData = async () => {
      try {
        const m = await getMatieres();
        setMatieres(m);
        const recent = await getCoursRecents(10);
        setCoursRecents(recent);
        
        const h = new Date().getHours();
        setGreeting(h < 12 ? "Bonjour" : h < 18 ? "Bon après-midi" : "Bonsoir");
        
        const c: Record<string, number> = {};
        for (const mat of m) {
          const courses = await getCoursByMatiere(mat.id);
          c[mat.slug] = courses.length;
        }
        setCounts(c);
      } catch (error) {
        console.error("Erreur au chargement des données:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [user, loading]);

  async function handleCreer() {
    if (!newNom.trim()) return;
    try {
      const m = await creerMatiere(newNom.trim(), newIcon);
      setMatieres((prev) => [...prev, m]);
      setShowForm(false);
      setNewNom("");
      setNewIcon("📘");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  }

  // Show loading state
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
    ? coursRecents.filter((c) => c.titre.toLowerCase().includes(search.toLowerCase()) || c.matiere.toLowerCase().includes(search.toLowerCase()))
    : coursRecents;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo" title="MesCours">📚</div>
        <div className="sidebar-section">
          <Link href="/" className="sidebar-item active" title="Accueil">🏠</Link>
          <Link href="/planning" className="sidebar-item" title="Planning">📅</Link>
        </div>
        <div className="sidebar-section">
          {matieres.slice(0, 4).map((m) => (
            <Link href={`/matiere/${m.slug}`} key={m.id} className="sidebar-item" title={m.nom}>{m.icon}</Link>
          ))}
        </div>
        <div className="sidebar-bottom">
          <button
            onClick={async () => {
              await logout();
              router.push("/auth");
            }}
            title="Déconnexion"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              padding: "8px",
              borderRadius: "8px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-alt)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            🚪
          </button>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-title">Dashboard</div>
          <div className="topbar-right">
            <div className="search-wrapper">
              <span className="search-bar-icon">🔍</span>
              <input className="search-bar" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un cours..." />
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="content-area">
          <div className="hero">
            <h1 className="hero-greeting">{greeting} Walid 👋</h1>
            <p className="hero-sub">Voici ton tableau de bord d'"'"'apprentissage</p>
          </div>

          {!search && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">📚 Cours créés</div>
                <div className="stat-value">{coursRecents.length}</div>
                <div className="stat-change positive">↑ En augmentation</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">🏷️ Matières</div>
                <div className="stat-value">{matieres.length}</div>
                <div className="stat-change positive">✓ Bien organisé</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">⚡ Productivité</div>
                <div className="stat-value">97%</div>
                <div className="stat-change positive">✓ Excellent !</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">🎯 Objectif</div>
                <div className="stat-value">85%</div>
                <div className="stat-change positive">↑ Presque là</div>
              </div>
            </div>
          )}

          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <div className="section-title">{search ? "📝 Résultats" : "📖 Cours récents"}</div>
                <div className="section-subtitle">{coursFiltres.length} cours</div>
              </div>
            </div>
            {coursFiltres.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📝</div>
                <div className="empty-title">{search ? "Aucun cours trouvé" : "Aucun cours"}</div>
              </div>
            ) : (
              <div className="cards-grid">
                {coursFiltres.map((c) => (
                  <Link href={`/cours/${c.id}`} key={c.id} className="card">
                    <div className="card-header">
                      <div className="card-title">{c.titre || "Sans titre"}</div>
                      <div className="card-arrow">→</div>
                    </div>
                    <div className="card-meta">
                      <span>📂 {c.matiere}</span><span>•</span>
                      <span>{new Date(c.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {!search && (
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <div className="section-title">🗂️ Matières</div>
                  <div className="section-subtitle">Tes domaines</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Nouvelle</button>
              </div>
              {showForm && (
                <div style={{ background: "var(--bg-alt)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
                    <div className="form-group">
                      <div className="form-label">Emoji</div>
                      <input className="form-input" type="text" value={newIcon} onChange={(e) => setNewIcon(e.target.value)} maxLength={2} style={{ width: "56px", textAlign: "center", fontSize: "24px" }} />
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
                      <div className="form-label">Nom</div>
                      <input className="form-input" type="text" value={newNom} onChange={(e) => setNewNom(e.target.value)} placeholder="Ex: Mathématiques" onKeyDown={(e) => e.key === "Enter" && handleCreer()} autoFocus />
                    </div>
                    <button className="btn btn-primary" onClick={handleCreer}>Créer</button>
                  </div>
                </div>
              )}
              {matieres.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">📂</div>
                  <div className="empty-title">Aucune matière</div>
                </div>
              ) : (
                <div className="cards-grid">
                  {matieres.map((m) => (
                    <Link href={`/matiere/${m.slug}`} key={m.id} className="card">
                      <div className="card-header">
                        <div style={{ flex: 1 }}>
                          <div className="card-title">{m.nom}</div>
                          <div className="card-meta">{counts[m.slug] || 0} cours</div>
                        </div>
                        <div className="card-icon">{m.icon}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}