"use server";

import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'db.json');

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
  contenu: string;
  matiereId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Tache {
  id: string;
  titre: string;
  terminee: boolean;
  createdAt: number;
  deadline?: number;
}

export interface Profil {
  nom: string;
}

interface DatabaseStructure {
  matieres: Matiere[];
  cours: Cours[];
  taches?: Tache[];
  profil?: Profil;
}

async function readDB(): Promise<DatabaseStructure> {
  try {
    const fileData = await fs.readFile(dataFilePath, 'utf8');
    const db = JSON.parse(fileData) as DatabaseStructure;
    if (!db.taches) db.taches = [];
    return db;
  } catch (error) {
    return { matieres: [], cours: [], taches: [] };
  }
}

async function writeDB(data: DatabaseStructure): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');      
}

export async function getProfilLocal(): Promise<Profil | null> {
  const db = await readDB();
  return db.profil || null;
}

export async function setProfilLocal(nom: string): Promise<void> {
  const db = await readDB();
  db.profil = { nom };
  await writeDB(db);
}

export async function getMatieresLocales(): Promise<Matiere[]> {
  const db = await readDB();
  return db.matieres.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getAllCoursLocaux(): Promise<Cours[]> {
  const db = await readDB();
  return db.cours || [];
}

export async function getMatiereByIdLocale(id: string): Promise<Matiere | null> {
  const db = await readDB();
  return db.matieres.find((m) => m.id === id) || null;
}

export async function creerMatiereLocale(nom: string, icon: string): Promise<Matiere> {
  const db = await readDB();

  const slug = nom.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const nouvelleMatiere: Matiere = {
    id: crypto.randomUUID(),
    nom,
    slug,
    icon,
    createdAt: Date.now(),
  };

  db.matieres.push(nouvelleMatiere);
  await writeDB(db);

  return nouvelleMatiere;
}

export async function getCoursByMatiereLocale(matiereId: string): Promise<Cours[]> {
  const db = await readDB();
  return db.cours
    .filter((c) => c.matiereId === matiereId)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getCoursByIdLocale(id: string): Promise<Cours | null> {
  const db = await readDB();
  return db.cours.find((c) => c.id === id) || null;
}

export async function creerCoursLocal(matiereId: string, titre: string): Promise<Cours> {
  const db = await readDB();

  const nouveauCours: Cours = {
    id: crypto.randomUUID(),
    titre,
    contenu: "<h1>Nouveau document</h1><p>Commencez a taper vos notes ici...</p>",
    matiereId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  if(!db.cours) db.cours = [];
  db.cours.push(nouveauCours);
  await writeDB(db);

  return nouveauCours;
}

export async function sauvegarderCoursLocal(id: string, contenu: string, titre?: string): Promise<void> {
  const db = await readDB();
  if(!db.cours) return;
  const index = db.cours.findIndex((c) => c.id === id);

  if (index !== -1) {
    db.cours[index].contenu = contenu;
    db.cours[index].updatedAt = Date.now();
    if (titre) {
      db.cours[index].titre = titre;
    }
    await writeDB(db);
  }
}

export async function getCoursRecentsLocaux(limit: number = 5): Promise<Cours[]> {
  const db = await readDB();
  if(!db.cours) return [];
  return db.cours
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
}

export async function supprimerMatiereLocale(id: string): Promise<void> {
  const db = await readDB();
  db.matieres = db.matieres.filter((m) => m.id !== id);
  db.cours = db.cours.filter((c) => c.matiereId !== id);
  await writeDB(db);
}

export async function supprimerCoursLocal(id: string): Promise<void> {
  const db = await readDB();
  db.cours = db.cours.filter((c) => c.id !== id);
  await writeDB(db);
}

export async function getTachesLocales(): Promise<Tache[]> {
  const db = await readDB();
  return db.taches ? db.taches.sort((a, b) => b.createdAt - a.createdAt) : [];
}

export async function creerTacheLocale(titre: string, deadline?: number): Promise<Tache> {
  const db = await readDB();
  if (!db.taches) db.taches = [];

  const nouvelleTache: Tache = {
    id: crypto.randomUUID(),
    titre,
    terminee: false,
    createdAt: Date.now(),
    deadline,
  };

  db.taches.push(nouvelleTache);
  await writeDB(db);
  return nouvelleTache;
}

export async function toggleTacheLocale(id: string, terminee: boolean): Promise<void> {
  const db = await readDB();
  if (!db.taches) return;
  const index = db.taches.findIndex(t => t.id === id);
  if (index !== -1) {
    db.taches[index].terminee = terminee;
    await writeDB(db);
  }
}

export async function supprimerTacheLocale(id: string): Promise<void> {
  const db = await readDB();
  if (!db.taches) return;
  db.taches = db.taches.filter(t => t.id !== id);
  await writeDB(db);
}
export async function resetDatabaseLocal(): Promise<void> {
  const db = { matieres: [], cours: [], taches: [], profil: null };
  await fs.writeFile(path.join(process.cwd(), 'data', 'db.json'), JSON.stringify(db, null, 2), 'utf8');
}
