// Local storage management for public/offline mode
// No Firebase - data stored locally in browser

export interface Matiere {
  id: string;
  nom: string;
  slug: string;
  icon: string;
  createdAt: number;
}

export interface Cours {
  id: string;
  titre: string;
  matiere: string;
  contenu: string;
  matiereId: string;
  date: number;
}

export interface Tache {
  id: string;
  titre: string;
  type: "revision" | "exercice" | "devoir" | "autre";
  matiere: string;
  matiereId: string;
  deadline: number;
  priorite: "haute" | "moyenne" | "basse";
  complete: boolean;
  createdAt: number;
}

// ===== MATIERES =====
export async function creerMatiere(nom: string, icon: string): Promise<Matiere> {
  const matieres = getMatieresList();
  const slug = nom.toLowerCase().replace(/\s+/g, "-");
  
  const matiere: Matiere = {
    id: Date.now().toString(),
    nom,
    slug,
    icon,
    createdAt: Date.now(),
  };
  
  matieres.push(matiere);
  localStorage.setItem("matieres", JSON.stringify(matieres));
  return matiere;
}

export async function getMatieres(): Promise<Matiere[]> {
  return getMatieresList();
}

function getMatieresList(): Matiere[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("matieres");
  return data ? JSON.parse(data) : [];
}

export async function getMatiereBySlug(slug: string): Promise<Matiere | null> {
  const matieres = getMatieresList();
  return matieres.find((m) => m.slug === slug) || null;
}

// ===== COURS =====
export async function creerCours(titre: string, matiere: string, matiereId: string): Promise<Cours> {
  const cours = getCoursList();
  
  const newCours: Cours = {
    id: Date.now().toString(),
    titre,
    matiere,
    contenu: "",
    matiereId,
    date: Date.now(),
  };
  
  cours.push(newCours);
  localStorage.setItem("cours", JSON.stringify(cours));
  return newCours;
}

export async function getAllCours(): Promise<Cours[]> {
  return getCoursList();
}

export async function getCoursByMatiere(matiereId: string): Promise<Cours[]> {
  const cours = getCoursList();
  return cours.filter((c) => c.matiereId === matiereId);
}

export async function getCoursRecents(limit: number = 10): Promise<Cours[]> {
  const cours = getCoursList();
  return cours.sort((a, b) => b.date - a.date).slice(0, limit);
}

export async function getCoursById(id: string): Promise<Cours | null> {
  const cours = getCoursList();
  return cours.find((c) => c.id === id) || null;
}

export async function sauvegarderCours(id: string, titre: string, contenu: string): Promise<void> {
  const cours = getCoursList();
  const index = cours.findIndex((c) => c.id === id);
  
  if (index !== -1) {
    cours[index].titre = titre;
    cours[index].contenu = contenu;
    localStorage.setItem("cours", JSON.stringify(cours));
  }
}

export async function supprimerCours(id: string): Promise<void> {
  const cours = getCoursList();
  const filtered = cours.filter((c) => c.id !== id);
  localStorage.setItem("cours", JSON.stringify(filtered));
}

function getCoursList(): Cours[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("cours");
  return data ? JSON.parse(data) : [];
}

// ===== TACHES =====
export async function creerTache(
  titre: string,
  type: "revision" | "exercice" | "devoir" | "autre",
  matiereId: string,
  matiere: string,
  deadline: Date,
  priorite: "haute" | "moyenne" | "basse"
): Promise<Tache> {
  const taches = getTachesList();
  
  const tache: Tache = {
    id: Date.now().toString(),
    titre,
    type,
    matiere,
    matiereId,
    deadline: deadline.getTime(),
    priorite,
    complete: false,
    createdAt: Date.now(),
  };
  
  taches.push(tache);
  localStorage.setItem("taches", JSON.stringify(taches));
  return tache;
}

export async function getToutesTaches(): Promise<Tache[]> {
  return getTachesList();
}

export async function getTachesByMatiere(matiereId: string): Promise<Tache[]> {
  const taches = getTachesList();
  return taches.filter((t) => t.matiereId === matiereId);
}

export async function getTacheById(id: string): Promise<Tache | null> {
  const taches = getTachesList();
  return taches.find((t) => t.id === id) || null;
}

export async function toggleTache(id: string): Promise<void> {
  const taches = getTachesList();
  const tache = taches.find((t) => t.id === id);
  
  if (tache) {
    tache.complete = !tache.complete;
    localStorage.setItem("taches", JSON.stringify(taches));
  }
}

export async function sauvegarderTache(
  id: string,
  titre: string,
  deadline: Date,
  priorite: "haute" | "moyenne" | "basse"
): Promise<void> {
  const taches = getTachesList();
  const tache = taches.find((t) => t.id === id);
  
  if (tache) {
    tache.titre = titre;
    tache.deadline = deadline.getTime();
    tache.priorite = priorite;
    localStorage.setItem("taches", JSON.stringify(taches));
  }
}

export async function supprimerTache(id: string): Promise<void> {
  const taches = getTachesList();
  const filtered = taches.filter((t) => t.id !== id);
  localStorage.setItem("taches", JSON.stringify(filtered));
}

function getTachesList(): Tache[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("taches");
  return data ? JSON.parse(data) : [];
}

// ===== USER PROFILE =====
export async function updateUserProfile(userId: string, displayName: string): Promise<void> {
  const profile = { displayName, updatedAt: Date.now() };
  localStorage.setItem("userProfile", JSON.stringify(profile));
}

export async function getUserProfile(userId: string): Promise<any> {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("userProfile");
  return data ? JSON.parse(data) : null;
}

export async function deleteUserAccount(userId: string): Promise<void> {
  // Clear all data
  localStorage.removeItem("matieres");
  localStorage.removeItem("cours");
  localStorage.removeItem("taches");
  localStorage.removeItem("userProfile");
}
