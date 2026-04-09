"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2, ListTodo, CalendarDays, Clock } from "lucide-react";
import { Tache, creerTacheLocale, toggleTacheLocale, supprimerTacheLocale } from "@/lib/localDb";
import { useRouter } from "next/navigation";

export default function TaskList({ initialTaches }: { initialTaches: Tache[] }) {
  const [taches, setTaches] = useState<Tache[]>(initialTaches);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || isPending) return;

    setIsPending(true);
    try {
      const deadlineTimestamp = newDeadline ? new Date(newDeadline).getTime() : undefined;
      const t = await creerTacheLocale(newTask, deadlineTimestamp);
      setTaches([{...t}, ...taches]);
      setNewTask("");
      setNewDeadline("");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleTacheLocale(id, !currentStatus);
      setTaches(taches.map(t => t.id === id ? { ...t, terminee: !currentStatus } : t));
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supprimerTacheLocale(id);
      setTaches(taches.filter(t => t.id !== id));
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = taches.filter(t => t.terminee).length;
  const progress = taches.length === 0 ? 0 : Math.round((completedCount / taches.length) * 100);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ListTodo size={24} />
          </div>
          Mes Tâches & Objectifs
        </h3>

        {/* Progress Bar (Header) */}
        <div className="flex items-center gap-4 w-full md:max-w-xs">
          <span className="text-sm font-medium text-white/50 whitespace-nowrap">{completedCount} / {taches.length} terminé</span>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="mb-8 relative flex flex-wrap sm:flex-nowrap gap-3">
        <input
          type="text"
          placeholder="Ajouter un nouvel objectif à accomplir (Ex: Réviser un cours spécifique)..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 w-full sm:w-auto bg-black/20 border border-white/10 shadow-inner rounded-xl py-4 pl-6 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all font-medium text-lg liquid-glass"
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          className="w-full sm:w-auto bg-black/20 border border-white/10 shadow-inner rounded-xl py-4 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium text-sm liquid-glass [color-scheme:dark]"
          title="Date limite (optionnelle)"
        />
        <button
          type="submit"
          disabled={!newTask.trim() || isPending}
          className="px-8 flex items-center justify-center bg-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 text-white rounded-xl transition-all border border-white/10 hover:border-emerald-500/30 disabled:opacity-50 disabled:pointer-events-none group"
        >
          <Plus size={24} className={`${isPending ? 'animate-spin' : 'group-hover:scale-110'} transition-transform`} />
          <span className="ml-2 font-bold hidden sm:inline">{isPending ? "Ajout..." : "Ajouter"}</span>
        </button>
      </form>

      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-sm uppercase tracking-wider">
              <th className="pb-4 font-semibold w-24 text-center">Statut</th>
              <th className="pb-4 font-semibold w-1/2">Objectif / Tâche</th>   
              <th className="pb-4 font-semibold px-4 w-32">Création</th>       
              <th className="pb-4 font-semibold px-4 w-32 text-center text-teal-400">Deadline</th>
              <th className="pb-4 font-semibold text-center w-24">Actions</th>  
            </tr>
          </thead>
          <tbody>
            {taches.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <ListTodo size={40} className="text-white/20" />
                    <p className="text-white/40 text-lg italic">Aucun objectif défini, votre emploi du temps est libre.</p>
                  </div>
                </td>
              </tr>
            ) : (
              taches.map(t => (
                <tr 
                  key={t.id} 
                  className={`border-b border-white/5 transition-colors group ${
                    t.terminee ? 'bg-white/[0.02] opacity-60' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <td className="py-4 text-center">
                    <button 
                      onClick={() => handleToggle(t.id, t.terminee)}
                      className={`inline-flex hover:scale-110 transition-transform ${t.terminee ? 'text-emerald-400' : 'text-white/30 hover:text-white/60'}`}
                    >
                      {t.terminee ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                  </td>
                  
                  <td className={`py-4 pr-4 text-lg transition-all ${t.terminee ? 'text-white/40 line-through decoration-white/30' : 'text-white/90 font-medium'}`}>
                    {t.titre}
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <CalendarDays size={14} />
                      {new Date(t.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center text-sm font-medium">
                    {t.deadline ? (
                      <div className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border ${new Date().getTime() > t.deadline && !t.terminee ? 'border-red-500/30 text-red-400 bg-red-500/10' : t.terminee ? 'border-white/10 text-white/30' : 'border-teal-500/30 text-teal-400 bg-teal-500/10'}`}>
                        <Clock size={14} />
                        {new Date(t.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      </div>
                    ) : (
                      <span className="text-white/20 italic text-xs">&mdash;</span>
                    )}
                  </td>

                  <td className="py-4 text-center">
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="inline-flex opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all p-2 rounded-lg hover:bg-white/5"
                      title="Supprimer la tâche"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
