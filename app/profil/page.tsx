"use client";

import { useEffect, useState } from "react";
import { deleteUserAccount } from "@/lib/firestore-local";
import { setProfilLocal, getProfilLocal, resetDatabaseLocal } from "@/lib/localDb";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const router = useRouter();

  useEffect(() => {
    getProfilLocal().then((p) => {
      if (p && p.nom) setDisplayName(p.nom);
      else setDisplayName("Quartz");
    });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!displayName.trim()) {
      setError("Veuillez entrer un nom");
      return;
    }

    if (displayName.trim().length > 50) {
      setError("Le nom doit contenir maximum 50 caractères");
      return;
    }

    setSaving(true);
    try {
      await setProfilLocal(displayName.trim());
      setSuccess("✅ Profil mis à jour!");
      router.refresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "SUPPRIMER") {
      setError("Veuillez taper 'SUPPRIMER' pour confirmer");
      return;
    }

    setSaving(true);
    try {
      await deleteUserAccount("local-user"); // Clean client side legacy
      await resetDatabaseLocal();            // Clean server side DB
      window.location.href = "/welcome";
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  };

  const email = "utilisateur@local";

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-6 md:px-12 py-10 pb-24">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-white tracking-tight">Mon Profil 👤</h1>
          <p className="text-[hsl(var(--hero-sub))] text-lg">Gère tes informations personnelles</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-2xl text-sm font-medium">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white/90">📋 Informations Personnelles</h2>
          
          <div className="liquid-glass p-8 rounded-3xl">
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/70 block">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={50}
                  disabled={saving}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
                <div className="text-xs text-white/40 font-medium">
                  {displayName.length}/50 caractères
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/70 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-3 text-white/40 cursor-not-allowed"
                />
                <div className="text-xs text-white/40 font-medium">
                  Données sauvegardées localement
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving || !displayName.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8 py-3 font-semibold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                >
                  {saving ? "⏳ Sauvegarde..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6 pt-6">
          <h2 className="text-xl font-semibold text-red-400">⚠️ Zone de Danger</h2>
          
          <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10">
            <div className="space-y-6">
              <p className="text-sm text-red-200/70 leading-relaxed max-w-xl">
                La suppression de vos données est <strong className="text-red-400">définitive</strong>. Tout sera perdu de ce navigateur.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl px-6 py-3 font-medium transition-colors"
              >
                🗑️ Supprimer mes données
              </button>
            </div>
          </div>
        </div>

        {/* Modal de suppression */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border border-red-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">⚠️ Confirmer</h2>
              <p className="text-sm text-white/60 mb-6">
                Tapez <strong className="text-white">SUPPRIMER</strong> pour confirmer la suppression définitive.
              </p>
              
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="SUPPRIMER"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-6 focus:outline-none focus:border-red-500/50 transition-colors"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation("");
                    setError("");
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={saving || deleteConfirmation !== "SUPPRIMER"}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50 disabled:hover:bg-red-500"
                >
                  {saving ? "⏳..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}