"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getToutesTaches, creerTache, toggleTache, supprimerTache, getMatieres, Matiere, Tache } from "@/lib/firestore";
import ThemeToggle from "@/components/ThemeToggle";

export default function PlanningPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [taches, setTaches] = useState<Tache[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitre, setNewTitre] = useState("");
  const [newType, setNewType] = useState<"revision" | "exercice" | "devoir" | "autre">("revision");
  const [newMatiereId, setNewMatiereId] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newPriorite, setNewPriorite] = useState<"haute" | "moyenne" | "basse">("moyenne");
  const [filterMatiere, setFilterMatiere] = useState("");
  const [filterComplete, setFilterComplete] = useState<"tous" | "en-cours" | "complete">("tous");
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Load data from Firestore
  useEffect(() => {
    if (loading || !user) return;

    const loadData = async () => {
      try {
        const t = await getToutesTaches();
        setTaches(t);
        
        const m = await getMatieres();
        setMatieres(m);
        
        if (m.length > 0) {
          setNewMatiereId(m[0].id);
        }
      } catch (error) {
        console.error("Erreur au chargement:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [user, loading]);

  const handleCreer = async () => {
    if (!newTitre.trim() || !newDeadline || !newMatiereId) return;
    
    try {
      const matiere = matieres.find((m) => m.id === newMatiereId);
      if (!matiere) return;
      
      await creerTache(
        newTitre.trim(),
        newType,
        newMatiereId,
        matiere.nom,
        new Date(newDeadline),
        newPriorite
      );
      
      const t = await getToutesTaches();
      setTaches(t);
      setShowForm(false);
      setNewTitre("");
      setNewType("revision");
      setNewDeadline("");
      setNewPriorite("moyenne");
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTache(id);
      const t = await getToutesTaches();
      setTaches(t);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supprimerTache(id);
      const t = await getToutesTaches();
      setTaches(t);
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

  let tachesFiltrees = taches;
  if (filterMatiere) {
    tachesFiltrees = tachesFiltrees.filter((t) => t.matiere === filterMatiere);
  }
  if (filterComplete === "en-cours") {
    tachesFiltrees = tachesFiltrees.filter((t) => !t.complete);
  } else if (filterComplete === "complete") {
    tachesFiltrees = tachesFiltrees.filter((t) => t.complete);
  }

  const tachesToday = tachesFiltrees.filter((t) => new Date(t.deadline).toDateString() === new Date().toDateString());
  const tachesWeek = tachesFiltrees.filter((t) => {
    const d = new Date(t.deadline);
    const today = new Date();
    return d >= today && d <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  });
  const tachesLater = tachesFiltrees.filter((t) => new Date(t.deadline) > new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000));

  const iconeType: Record<string, string> = {
    revision: "📚",
    exercice: "✏️",
    devoir: "📋",
    autre: "✓",
  };

  const iconepriorite: Record<string, string> = {
    haute: "🔴",
    moyenne: "🟡",
    basse: "🟢",
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo" title="Planning">📅</div>

        <div className="sidebar-section">
          <Link href="/" className="sidebar-item" title="Accueil">
            🏠
          </Link>
          <div className="sidebar-item active" title="Planning">
            📅
          </div>
        </div>

        <div className="sidebar-section">
          {matieres.slice(0, 3).map((m) => (
            <Link key={m.id} href={`/matiere/${m.slug}`} className="sidebar-item" title={m.nom}>
              {m.icon}
            </Link>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-avatar" title="Profil">👤</div>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-title">📅 Planning</div>
          <div className="topbar-right">
            <ThemeToggle />
          </div>
        </div>

        <div className="content-area">
          <div className="hero">
            <h1 className="hero-greeting">Ton Planning 📋</h1>
            <p className="hero-sub">Organize tes révisions et exercices</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">📝 Total</div>
              <div className="stat-value">{tachesFiltrees.length}</div>
              <div className="stat-change positive">Tâches à faire</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">✅ Complétées</div>
              <div className="stat-value">{tachesFiltrees.filter((t) => t.complete).length}</div>
              <div className="stat-change positive">Bien joué !</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">⏰ En cours</div>
              <div className="stat-value">{tachesFiltrees.filter((t) => !t.complete).length}</div>
              <div className="stat-change positive">À faire</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">⚠️ Urgentes</div>
              <div className="stat-value">{tachesFiltrees.filter((t) => t.priorite === "haute" && !t.complete).length}</div>
              <div className="stat-change negative">Priorité !</div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <div className="section-title">🎯 Filtres</div>
              </div>
              <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                + Nouvelle tâche
              </button>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <select
                className="form-input"
                value={filterComplete}
                onChange={(e) => setFilterComplete(e.target.value as any)}
                style={{ flex: 1, minWidth: "140px" }}
              >
                <option value="tous">Toutes les tâches</option>
                <option value="en-cours">En cours</option>
                <option value="complete">Complétées</option>
              </select>

              <select
                className="form-input"
                value={filterMatiere}
                onChange={(e) => setFilterMatiere(e.target.value)}
                style={{ flex: 1, minWidth: "140px" }}
              >
                <option value="">Toutes les matières</option>
                {matieres.map((m) => (
                  <option key={m.id} value={m.slug}>
                    {m.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showForm && (
            <div className="dashboard-section">
              <div className="section-title">Créer une nouvelle tâche</div>
              <div style={{ background: "var(--bg-alt)", borderRadius: "12px", padding: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                  <div className="form-group">
                    <div className="form-label">Titre *</div>
                    <input
                      className="form-input"
                      type="text"
                      value={newTitre}
                      onChange={(e) => setNewTitre(e.target.value)}
                      placeholder="Ex: Réviser les dérivées"
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label">Type *</div>
                    <select className="form-input" value={newType} onChange={(e) => setNewType(e.target.value as any)}>
                      <option value="revision">📚 Révision</option>
                      <option value="exercice">✏️ Exercice</option>
                      <option value="devoir">📋 Devoir</option>
                      <option value="autre">✓ Autre</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <div className="form-label">Matière *</div>
                    <select className="form-input" value={newMatiereId} onChange={(e) => setNewMatiereId(e.target.value)}>
                      {matieres.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.icon} {m.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <div className="form-label">Deadline *</div>
                    <input
                      className="form-input"
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label">Priorité</div>
                    <select className="form-input" value={newPriorite} onChange={(e) => setNewPriorite(e.target.value as any)}>
                      <option value="basse">🟢 Basse</option>
                      <option value="moyenne">🟡 Moyenne</option>
                      <option value="haute">🔴 Haute</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button className="btn btn-primary" onClick={handleCreer}>
                    Créer la tâche
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {tachesToday.length > 0 && (
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <div className="section-title">📆 Aujourd'hui</div>
                  <div className="section-subtitle">{tachesToday.length} tâche(s)</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {tachesToday.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      textDecoration: t.complete ? "line-through" : "none",
                      opacity: t.complete ? 0.6 : 1,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onClick={() => handleToggle(t.id)}
                  >
                    <input
                      type="checkbox"
                      checked={t.complete}
                      onChange={() => {}}
                      style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>
                        {iconeType[t.type]} {t.titre}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {t.matiere} • Deadline: {new Date(t.deadline).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <div style={{ fontSize: "18px" }}>{iconepriorite[t.priorite]}</div>
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(t.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tachesWeek.length > 0 && (
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <div className="section-title">📅 Cette semaine</div>
                  <div className="section-subtitle">{tachesWeek.length} tâche(s)</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {tachesWeek.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      textDecoration: t.complete ? "line-through" : "none",
                      opacity: t.complete ? 0.6 : 1,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onClick={() => handleToggle(t.id)}
                  >
                    <input
                      type="checkbox"
                      checked={t.complete}
                      onChange={() => {}}
                      style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>
                        {iconeType[t.type]} {t.titre}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {t.matiere} • Deadline: {new Date(t.deadline).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <div style={{ fontSize: "18px" }}>{iconepriorite[t.priorite]}</div>
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(t.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tachesLater.length > 0 && (
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <div className="section-title">📊 Plus tard</div>
                  <div className="section-subtitle">{tachesLater.length} tâche(s)</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {tachesLater.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      textDecoration: t.complete ? "line-through" : "none",
                      opacity: t.complete ? 0.6 : 1,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onClick={() => handleToggle(t.id)}
                  >
                    <input
                      type="checkbox"
                      checked={t.complete}
                      onChange={() => {}}
                      style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>
                        {iconeType[t.type]} {t.titre}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {t.matiere} • Deadline: {new Date(t.deadline).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <div style={{ fontSize: "18px" }}>{iconepriorite[t.priorite]}</div>
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(t.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tachesFiltrees.length === 0 && (
            <div className="empty">
              <div className="empty-icon">📅</div>
              <div className="empty-title">Aucune tâche</div>
              <div className="empty-text">Crée ta première tâche pour organiser tes révisions</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
