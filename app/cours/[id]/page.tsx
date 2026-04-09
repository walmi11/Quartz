"use client";

import { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCoursByIdLocale, getMatiereByIdLocale, sauvegarderCoursLocal, supprimerCoursLocal, Cours, Matiere } from "@/lib/localDb";
import { ArrowLeft, Save, Clock, ChevronRight, Trash2 } from "lucide-react";
import Editor from "@/components/Editor";
import MatiereIcon from "@/components/MatiereIcon";

export default function CoursPage() {
  const params = useParams();
  const router = useRouter();
  const [id, setId] = useState("");

  const [cours, setCours] = useState<Cours | null>(null);
  const [matiere, setMatiere] = useState<Matiere | null>(null);
  const [titre, setTitre] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Next.js 15
  useEffect(() => {
    if (params?.id) {
      if (params.id instanceof Promise) {
        params.id.then((res: any) => setId(res));
      } else {
        setId(params.id as string);
      }
    }
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const loadCours = async () => {
      try {
        const dataCours = await getCoursByIdLocale(id);
        setCours(dataCours);
        if (dataCours) {
          setTitre(dataCours.titre);
          const dataMatiere = await getMatiereByIdLocale(dataCours.matiereId);
          setMatiere(dataMatiere);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCours();
  }, [id]);

  const handleSave = (html: string) => {
    if (!cours) return;
    sauvegarderCoursLocal(cours.id, html, titre).catch(console.error);
  };

  const updateTitle = (newTitre: string) => {
    setTitre(newTitre);
    if (cours) {
      sauvegarderCoursLocal(cours.id, cours.contenu, newTitre).catch(console.error);
    }
  };

  const handleDelete = () => {
    if (!cours) return;
    if (confirm("Voulez-vous vraiment supprimer ce cours ?")) {
      supprimerCoursLocal(cours.id).then(() => {
        router.push(matiere ? `/matiere/${matiere.slug}` : "/");
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[hsl(var(--background))] p-8 text-white relative items-center justify-center">
         <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cours) {
     return (
      <div className="flex-1 flex flex-col items-center justify-center h-full pt-20">
        <h2 className="text-2xl font-bold text-white mb-4">Cours introuvable</h2>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[hsl(var(--background))] overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-20 px-6 flex items-center justify-between shrink-0 bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center text-sm font-medium text-white/50">
          <Link href="/" className="flex items-center gap-2 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/5 hover:border-white/10">
            <ArrowLeft size={16} /> Accueil
          </Link>
          
          {matiere && (
            <>
              <ChevronRight size={16} className="mx-2 text-white/20" />
              <Link href={`/matiere/${matiere.slug}`} className="flex items-center gap-2 hover:text-violet-300 transition-all bg-white/5 hover:bg-violet-500/10 px-3 py-2 rounded-xl border border-white/5 hover:border-violet-500/20 group">
                <MatiereIcon iconId={matiere.icon} size={18} className="text-violet-400/70 group-hover:text-violet-400 transition-colors" /> 
                <span className="font-semibold text-white/90 group-hover:text-white">{matiere.nom}</span>
              </Link>
            </>
          )}

          <ChevronRight size={16} className="mx-2 text-white/20" />
          <div className="flex items-center gap-2.5 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.1)]">
             <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)] animate-pulse"></span>
             <span className="text-white font-semibold line-clamp-1 max-w-[250px]">{titre || "Sans titre"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={handleDelete}
             className="text-white/40 hover:text-red-400 hover:bg-red-500/10 p-2.5 rounded-xl transition-all border border-transparent hover:border-red-500/20"
             title="Supprimer ce cours"
           >
             <Trash2 size={18} />
           </button>

           <div className="w-px h-8 bg-white/10 mx-1"></div>

           <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-white/40 gap-2 bg-[#0f0f13] px-4 py-2.5 rounded-xl border border-white/5 shadow-inner">
             <Clock size={16} className="text-violet-400/80" /> 
             Modifié le {new Date(cours.updatedAt).toLocaleDateString()}
           </div>
        </div>
      </header>

      {/* Editor Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full p-8 md:p-16">
          <input
             type="text"
             value={titre}
             onChange={(e) => updateTitle(e.target.value)}
             placeholder="Titre du cours..."
             className="w-full bg-transparent text-5xl font-bold text-white placeholder-white/20 outline-none mb-12"
          />
          
          {/* Tiptap Integration - It will autosave every 800ms via handleSave */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-indigo-400">
            <Editor contenu={cours.contenu} onSave={handleSave} />
          </div>
        </div>
      </main>
    </div>
  );
}