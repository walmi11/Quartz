"use client";

import { useState } from "react";
import { Search, BookOpen, FileText } from "lucide-react"; 
import MatiereCard from "./MatiereCard";
import Link from "next/link";
import { Matiere, Cours, Tache } from "@/lib/localDb";
import TaskList from "./TaskList";

export default function Dashboard({ matieres, tousLesCours, initialTaches }: { matieres: Matiere[], tousLesCours: Cours[], initialTaches: Tache[] }) {
  const [search, setSearch] = useState("");

  const filteredCours = tousLesCours.filter(c =>
    c.titre.toLowerCase().includes(search.toLowerCase()) ||
    c.contenu.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative z-10 max-w-6xl mx-auto w-full px-8 py-10 flex flex-col gap-12">
      
      {/* Header */}
      <div className="relative p-8 md:p-10 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-violet-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-violet-300 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
              Espace de travail
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
              Aperçu Général
            </h2>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              Bienvenue dans <span className="text-violet-400 font-semibold">Quartz</span>. Organise tes connaissances, valide tes tâches, et garde toujours une longueur d'avance.
            </p>
          </div>
          
          {/* Stats rapides */}
          <div className="flex items-center gap-2 bg-black/40 p-2 rounded-3xl border border-white/5 backdrop-blur-xl shadow-inner">
            <div className="flex flex-col items-center justify-center px-6 py-4 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl cursor-default">
              <span className="block text-3xl font-black text-violet-400 mb-1">{tousLesCours.length}</span>
              <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Cours</span>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-4 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl cursor-default">
              <span className="block text-3xl font-black text-amber-400 mb-1">{matieres.length}</span>
              <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Matières</span>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-4 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl cursor-default">
              <span className="block text-3xl font-black text-emerald-400 mb-1">{initialTaches.filter(rem => !rem.terminee).length}</span>
              <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Tâches</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="relative">
        <label className="block text-white/60 mb-2 font-medium">Recherche Globale de Cours</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Rechercher par titre, contenu, mots-clés..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors liquid-glass shadow-inner"
          />
        </div>
      </div>

      {/* Main Content (Matières or Search Results) */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">
          {search ? `Résultats de recherche (${filteredCours.length})` : "Vos Matières"}
        </h3>

        {search ? (
          <div className="space-y-4">
            {filteredCours.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center border border-white/10 rounded-2xl bg-white/5 liquid-glass">
                <Search className="w-10 h-10 text-white/20 mb-3" />
                <p className="text-white/50 text-center">Aucun cours ne correspond à "{search}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCours.map(c => {
                  const matiere = matieres.find(m => m.id === c.matiereId);     
                  return (
                    <Link key={c.id} href={`/cours/${c.id}`}>
                      <div className="liquid-glass rounded-2xl p-5 hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300 border border-white/5 flex flex-col gap-2 h-full"> 
                        <div className="flex items-center justify-between mb-2">     
                          <h4 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">{c.titre}</h4>
                          {matiere && <span className="text-xs px-2 py-1 bg-white/10 rounded-md text-white/60 shrink-0">{matiere.icon} {matiere.nom}</span>}
                        </div>
                        <p className="text-white/40 text-sm line-clamp-3 font-mono bg-black/20 p-2 rounded-lg" dangerouslySetInnerHTML={{ __html: c.contenu.substring(0, 150) + "..." }}></p>        
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matieres.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center border border-white/10 rounded-2xl bg-white/5 liquid-glass">      
                <BookOpen className="w-12 h-12 text-white/40 mb-4" />
                <p className="text-white/60">Vous n'avez pas encore ajouté de matières.</p>
              </div>
            ) : (
              matieres.map((m) => (
                <MatiereCard
                  key={m.id}
                  nom={m.nom}
                  slug={m.slug}
                  icon={m.icon}
                  nbCours={tousLesCours.filter(c => c.matiereId === m.id).length}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Task List Optionnel */}
      <div className="liquid-glass border border-white/10 rounded-3xl p-8 mb-20">
        <TaskList initialTaches={initialTaches} />
      </div>

    </div>
  );
}