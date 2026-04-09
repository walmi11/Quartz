"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { creerMatiereLocale } from "@/lib/localDb";
import MatiereIcon, { ICON_OPTIONS } from "./MatiereIcon";

export default function CreateMatiereButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [icon, setIcon] = useState("book");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;
    
    setIsPending(true);
    try {
      const matiere = await creerMatiereLocale(nom, icon);
      setIsOpen(false);
      setNom("");
      setIcon("book");
      router.refresh();
      router.push(`/matiere/${matiere.slug}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="hover:text-white text-white/40 transition-colors"
      >
        <Plus size={14} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold text-white mb-6">Nouvelle matière</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Nom de la matière</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50"
                  placeholder="Ex: Mathématiques, Histoire..."
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Choisir une icône</label>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setIcon(opt.id)}
                      className={`aspect-square w-full rounded-xl flex items-center justify-center transition-all ${
                        icon === opt.id
                          ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/50"
                          : "bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white/80"
                      }`}
                      title={opt.label}
                    >
                      <MatiereIcon iconId={opt.id} className="w-1/2 h-1/2" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending || !nom.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-2 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

