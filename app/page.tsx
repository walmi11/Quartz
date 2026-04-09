import { getMatieresLocales, getTachesLocales } from "@/lib/localDb";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const matieres = await getMatieresLocales();
  const tousLesCours = await import("@/lib/localDb").then(m => m.getAllCoursLocaux());
  const taches = await getTachesLocales();

  return (
    <div className="flex flex-col w-full min-h-screen bg-[hsl(var(--background))] relative">
      <Dashboard matieres={matieres} tousLesCours={tousLesCours} initialTaches={taches} />
    </div>
  );
}
