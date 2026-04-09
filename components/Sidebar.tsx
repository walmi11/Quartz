import Link from "next/link";
import { Folder, FileText, Settings, Plus, Home } from "lucide-react";
import { getMatieresLocales, getCoursRecentsLocaux, getProfilLocal } from "@/lib/localDb";      
import CreateMatiereButton from "./CreateMatiereButton";
import MatiereIcon from "./MatiereIcon";
export default async function Sidebar() {
  const matieres = await getMatieresLocales();
  const coursRecents = await getCoursRecentsLocaux(5);

  return (
    <>
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="font-semibold tracking-tight text-white flex items-center gap-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-white font-bold">Quartz</span>
        </div>
        <Link href="/profil">
          <Settings size={16} className="text-white/50 hover:text-white cursor-pointer transition-colors" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        
        {/* Home */}
        <div>
          <Link href="/" className="flex items-center text-white/70 hover:bg-white/10 hover:text-white px-3 py-2 rounded-xl transition-all duration-200 liquid-glass">
            <Home size={16} className="mr-3 text-white/50" />
            Accueil
          </Link>
        </div>

        {/* Matières */}
        <div>
          <div className="text-xs font-semibold text-white/40 mb-3 px-3 flex justify-between items-center uppercase tracking-wider">
            Matières
            <CreateMatiereButton />
          </div>
          <div className="space-y-1.5">
            {matieres.length === 0 ? (
              <div className="text-white/30 px-3 py-1 italic">Aucune matière</div>
            ) : (
              matieres.map((m) => (
                <Link key={m.id} href={/matiere/ + m.slug} className="flex items-center text-white/70 hover:bg-white/10 hover:text-white px-3 py-2 rounded-xl transition-all duration-200 group">
                  <span className="mr-3 text-base opacity-70 group-hover:opacity-100 transition-opacity">
                    <MatiereIcon iconId={m.icon} className="w-5 h-5 text-indigo-400" />
                  </span>
                  <span className="truncate font-medium">{m.nom}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Cours Récents */}
        <div>
          <div className="text-xs font-semibold text-white/40 mb-3 px-3 uppercase tracking-wider">
            Récents
          </div>
          <div className="space-y-1.5">
            {coursRecents.length === 0 ? (
              <div className="text-white/30 px-3 py-1 italic">Aucun cours</div> 
            ) : (
              coursRecents.map((c) => (
                <Link key={c.id} href={/cours/ + c.id} className="flex items-center text-white/70 hover:bg-white/10 hover:text-white px-3 py-2 rounded-xl transition-all duration-200">
                  <FileText size={14} className="mr-3 text-white/40 flex-shrink-0" />
                  <span className="truncate font-medium">{c.titre}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
