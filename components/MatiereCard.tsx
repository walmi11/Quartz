import Link from "next/link";
import MatiereIcon from "./MatiereIcon";

type MatiereCardProps = {
  nom: string;
  slug: string;
  icon: string;
  nbCours: number;
};

export default function MatiereCard({ nom, slug, icon, nbCours }: MatiereCardProps) {
  return (
    <Link href={`/matiere/${slug}`}>
      <div className="liquid-glass rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
        <div className="text-5xl mb-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 opacity-90 group-hover:opacity-100 text-indigo-400">
          <MatiereIcon iconId={icon} className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2 tracking-tight">{nom}</h2>   
        <p className="text-sm text-[hsl(var(--hero-sub))] font-medium">
          {nbCours} {nbCours === 1 ? "cours" : "cours"}
        </p>
      </div>
    </Link>
  );
}

