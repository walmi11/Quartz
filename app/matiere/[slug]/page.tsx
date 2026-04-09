"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getMatieresLocales, getCoursByMatiereLocale, creerCoursLocal, supprimerMatiereLocale, supprimerCoursLocal, Matiere, Cours } from "@/lib/localDb";
import { Plus, ArrowLeft, FileText, Search, Clock, Trash2 } from "lucide-react";        
import MatiereIcon from "@/components/MatiereIcon";

export default function MatierePage() {
  const params = useParams();
  const router = useRouter();
  const [slug, setSlug] = useState<string>("");

  const [matiere, setMatiere] = useState<Matiere | null>(null);
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [coursToDelete, setCoursToDelete] = useState<string | null>(null);
  const [showDeleteMatiereModal, setShowDeleteMatiereModal] = useState(false);

  useEffect(() => {
    // Handling Next.js 15+ params.slug which might be a promise
    if (params) {
      if (params.slug instanceof Promise) {
        params.slug.then((res: any) => setSlug(res));
      } else {
        setSlug(params.slug as string);
      }
    }
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    const loadData = async () => {
      try {
        const allMatieres = await getMatieresLocales();
        const matchedMatiere = allMatieres.find(m => m.slug === slug);
        if (matchedMatiere) {
          setMatiere(matchedMatiere);
          const matCours = await getCoursByMatiereLocale(matchedMatiere.id);
          setCours(matCours);
        }
      } catch (err) {
        console.error("Erreur de chargement:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const handleCreateCours = async () => {
    if (!matiere || isPending) return;
    
    startTransition(async () => {
      try {
        const titre = "Nouveau cours";
        const nouveauCours = await creerCoursLocal(matiere.id, titre);
        router.refresh();
        router.push(`/cours/${nouveauCours.id}`);
      } catch (err) {
        console.error("Erreur lors de la création:", err);
      }
    });
  };

  const handleDeleteMatiere = async () => {
    if(!matiere) return;
    if(!confirm("Voulez-vous vraiment supprimer cette matière et tous ses cours ?")) return;
    
    startTransition(async () => {
      await supprimerMatiereLocale(matiere.id);
      router.refresh();
      router.push("/");
    });
  };

  const handleDeleteCours = async (e: React.MouseEvent, coursId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if(!confirm("Voulez-vous supprimer ce cours ?")) return;
    
    startTransition(async () => {
      await supprimerCoursLocal(coursId);
      setCours(prev => prev.filter(c => c.id !== coursId));
      router.refresh();
    });
  };

  const filteredCours = cours.filter(c => c.titre.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!matiere) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full pt-20">
        <h2 className="text-2xl font-bold text-white mb-4">Matière introuvable</h2>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full p-8 max-w-6xl mx-auto custom-scrollbar">
      
      {/* Hero Header Matière */}
      <div className="relative mb-10 p-8 rounded-[2rem] overflow-hidden border border-white/10 bg-[#0f0f13] shadow-2xl shrink-0 group">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-transparent opacity-70" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-violet-500/30 transition-colors duration-700" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white border border-white/10 backdrop-blur-md shadow-sm">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-500/20 rounded-2xl border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <MatiereIcon iconId={matiere.icon} size={36} className="text-violet-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
                  {matiere.nom}
                </h1>
                <button 
                  onClick={handleDeleteMatiere}
                  className="mt-2 text-white/20 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/10"
                  title="Supprimer la matière"
                >
                  <Trash2 size={22} />
                </button>
              </div>
              <p className="text-white/50 mt-3 flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
                {cours.length} cours {cours.length > 1 ? "disponibles" : "disponible"} dans cette matière
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateCours}
            disabled={isPending}
            className="group/btn relative overflow-hidden bg-violet-600 hover:bg-violet-500 text-white rounded-2xl px-6 py-4 transition-all font-semibold flex items-center gap-3 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            <Plus size={20} className="relative z-10" />
            <span className="relative z-10">{isPending ? 'Création...' : 'Nouveau cours'}</span>
          </button>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center mb-8 relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="text-violet-400/50 group-focus-within:text-violet-400 transition-colors" size={20} />
        </div>
        <input
          type="text"
          placeholder="Rechercher un cours de ${matiere.nom}..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0a0a0c]/80 border border-white/5 hover:border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all backdrop-blur-xl shadow-lg"
        />
      </div>

      {/* List of courses */}
      {cours.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#0f0f13]/50 border border-white/5 border-dashed rounded-[2rem] mt-4 shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-violet-500/5 to-transparent absolute"></div>
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/20 mb-6 group-hover:scale-110 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-all duration-500 rotate-3 group-hover:rotate-0 shadow-xl">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Dossier vide</h3>
          <p className="text-white/50 text-base mb-8 max-w-md text-center">Commencez dès maintenant en créant votre premier cours dans cette matière.</p>
          <button onClick={handleCreateCours} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium flex items-center gap-2 hover:border-white/20 transition-all">
            Créer mon premier cours <ArrowLeft size={16} className="rotate-180" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
          {filteredCours.map(c => (
            <Link key={c.id} href={`/cours/${c.id}`} className="group outline-none">
              <div className="bg-[#0f0f13] rounded-2xl p-6 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(139,92,246,0.15)] transition-all duration-300 cursor-pointer flex flex-col h-full border border-white/5 relative overflow-hidden group-focus-visible:ring-2 focus-visible:ring-violet-500">
                
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-violet-500/0 via-violet-500/0 to-violet-500/0 group-hover:from-violet-500/10 group-hover:via-transparent group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-[1rem] bg-[#1a1a24] border border-white/5 shadow-inner flex items-center justify-center text-white/50 group-hover:text-violet-400 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all">
                    <FileText size={22} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <button 
                    onClick={(e) => handleDeleteCours(e, c.id)}
                    className="p-2 -mr-2 -mt-2 text-white/0 group-hover:text-white/30 hover:!text-red-400 hover:bg-red-500/10 transition-all rounded-xl"
                    title="Supprimer ce cours"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <h3 className="relative z-10 text-[1.1rem] font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-violet-300 transition-colors drop-shadow-sm">
                  {c.titre}
                </h3>
                
                <div className="relative z-10 mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 rounded-lg border border-white/5">
                    <Clock size={12} className="text-violet-400/70" />
                    <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="text-violet-400/0 flex items-center gap-1 group-hover:text-violet-400 font-medium text-sm transition-all -translate-x-2 group-hover:translate-x-0">
                    Ouvrir <ArrowLeft size={14} className="rotate-180" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}