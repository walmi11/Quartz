// === STOCKAGE LOCAL ===

export type Cours = {
  id: string;
  titre: string;
  matiere: string;
  contenu: string;
  date: string;
};

export type Matiere = {
  id: string;
  nom: string;
  slug: string;
  icon: string;
};

// === MATIERES ===

export function getMatieres(): Matiere[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("matieres");
  return data ? JSON.parse(data) : [];
}

export function creerMatiere(nom: string, icon: string): Matiere {
  const slug = nom.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
  const id = Date.now().toString();
  const matiere: Matiere = { id, nom, slug, icon };
  const matieres = getMatieres();
  matieres.push(matiere);
  localStorage.setItem("matieres", JSON.stringify(matieres));
  return matiere;
}

// === COURS ===

function getAllCours(): Cours[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("cours");
  return data ? JSON.parse(data) : [];
}

function saveAllCours(cours: Cours[]) {
  localStorage.setItem("cours", JSON.stringify(cours));
}

export function creerCours(matiere: string): string {
  const id = Date.now().toString();
  const cours: Cours = {
    id,
    titre: "Sans titre",
    matiere,
    contenu: "",
    date: new Date().toISOString(),
  };
  const all = getAllCours();
  all.push(cours);
  saveAllCours(all);
  return id;
}

export function getCoursByMatiere(matiere: string): Cours[] {
  return getAllCours()
    .filter((c) => c.matiere === matiere)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCoursRecents(nb: number = 10): Cours[] {
  return getAllCours()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, nb);
}

export function getCoursById(id: string): Cours | null {
  return getAllCours().find((c) => c.id === id) || null;
}

export function sauvegarderCours(id: string, titre: string, contenu: string) {
  const all = getAllCours();
  const index = all.findIndex((c) => c.id === id);
  if (index !== -1) {
    all[index].titre = titre;
    all[index].contenu = contenu;
    all[index].date = new Date().toISOString();
    saveAllCours(all);
  }
}

// === PLANNING / TÂCHES ===

export type Tache = {
  id: string;
  titre: string;
  description: string;
  type: "revision" | "exercice" | "devoir" | "autre";
  matiere: string;
  date: string;
  deadline: string;
  complete: boolean;
  priorite: "haute" | "moyenne" | "basse";
};

function getAllTaches(): Tache[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("taches");
  return data ? JSON.parse(data) : [];
}

function saveAllTaches(taches: Tache[]) {
  localStorage.setItem("taches", JSON.stringify(taches));
}

export function creerTache(titre: string, type: "revision" | "exercice" | "devoir" | "autre", matiere: string, deadline: string, priorite: "haute" | "moyenne" | "basse" = "moyenne"): Tache {
  const id = Date.now().toString();
  const tache: Tache = {
    id,
    titre,
    description: "",
    type,
    matiere,
    date: new Date().toISOString(),
    deadline,
    complete: false,
    priorite,
  };
  const all = getAllTaches();
  all.push(tache);
  saveAllTaches(all);
  return tache;
}

export function getToutesTaches(): Tache[] {
  return getAllTaches().sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
}

export function getTachesByMatiere(matiere: string): Tache[] {
  return getAllTaches()
    .filter((t) => t.matiere === matiere)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
}

export function getTacheById(id: string): Tache | null {
  return getAllTaches().find((t) => t.id === id) || null;
}

export function sauvegarderTache(id: string, titre: string, description: string, deadline: string, priorite: "haute" | "moyenne" | "basse", complete: boolean) {
  const all = getAllTaches();
  const index = all.findIndex((t) => t.id === id);
  if (index !== -1) {
    all[index].titre = titre;
    all[index].description = description;
    all[index].deadline = deadline;
    all[index].priorite = priorite;
    all[index].complete = complete;
    saveAllTaches(all);
  }
}

export function toggleTache(id: string) {
  const all = getAllTaches();
  const index = all.findIndex((t) => t.id === id);
  if (index !== -1) {
    all[index].complete = !all[index].complete;
    saveAllTaches(all);
  }
}

export function supprimerTache(id: string) {
  const all = getAllTaches();
  const filtered = all.filter((t) => t.id !== id);
  saveAllTaches(filtered);
}