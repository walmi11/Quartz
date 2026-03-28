import Link from "next/link";

type MatiereCardProps = {
  nom: string;
  slug: string;
  icon: string;
  nbCours: number;
};

export default function MatiereCard({ nom, slug, icon, nbCours }: MatiereCardProps) {
  return (
    <Link href={`/matiere/${slug}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group">
        <div className="text-5xl mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">{icon}</div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">{nom}</h2>
        <p className="text-sm text-gray-500 font-medium">{nbCours} {nbCours === 1 ? "cours" : "cours"}</p>
      </div>
    </Link>
  );
}