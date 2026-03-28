import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";

export interface Matiere {
  id: string;
  nom: string;
  slug: string;
  icon: string;
  userId: string;
  createdAt: Timestamp;
}

export interface Cours {
  id: string;
  titre: string;
  matiere: string;
  contenu: string;
  matiereId: string;
  userId: string;
  date: Timestamp;
}

export interface Tache {
  id: string;
  titre: string;
  type: "revision" | "exercice" | "devoir" | "autre";
  matiere: string;
  matiereId: string;
  deadline: Timestamp;
  priorite: "haute" | "moyenne" | "basse";
  complete: boolean;
  userId: string;
  createdAt: Timestamp;
}

// ===== MATIERES =====
export async function creerMatiere(nom: string, icon: string): Promise<Matiere> {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const slug = nom.toLowerCase().replace(/\s+/g, "-");
  
  const docRef = await addDoc(collection(db, "matieres"), {
    nom,
    slug,
    icon,
    userId: auth.currentUser.uid,
    createdAt: Timestamp.now(),
  });

  return {
    id: docRef.id,
    nom,
    slug,
    icon,
    userId: auth.currentUser.uid,
    createdAt: Timestamp.now(),
  };
}

export async function getMatieres(): Promise<Matiere[]> {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "matieres"),
    where("userId", "==", auth.currentUser.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Matiere));
}

export async function getMatiereBySlug(slug: string): Promise<Matiere | null> {
  if (!auth.currentUser) return null;

  const q = query(
    collection(db, "matieres"),
    where("userId", "==", auth.currentUser.uid),
    where("slug", "==", slug)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as Matiere;
}

// ===== COURS =====
export async function creerCours(
  titre: string,
  matiere: string,
  matiereId: string,
  contenu: string = ""
): Promise<Cours> {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const docRef = await addDoc(collection(db, "cours"), {
    titre,
    matiere,
    matiereId,
    contenu,
    userId: auth.currentUser.uid,
    date: Timestamp.now(),
  });

  return {
    id: docRef.id,
    titre,
    matiere,
    matiereId,
    contenu,
    userId: auth.currentUser.uid,
    date: Timestamp.now(),
  };
}

export async function getAllCours(): Promise<Cours[]> {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "cours"),
    where("userId", "==", auth.currentUser.uid),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Cours));
}

export async function getCoursByMatiere(matiereId: string): Promise<Cours[]> {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "cours"),
    where("userId", "==", auth.currentUser.uid),
    where("matiereId", "==", matiereId),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Cours));
}

export async function getCoursRecents(limit: number = 10): Promise<Cours[]> {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "cours"),
    where("userId", "==", auth.currentUser.uid),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.slice(0, limit).map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Cours));
}

export async function getCoursById(id: string): Promise<Cours | null> {
  if (!auth.currentUser) return null;

  const docRef = doc(db, "cours", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Cours;
}

export async function sauvegarderCours(
  id: string,
  titre: string,
  contenu: string
): Promise<void> {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const docRef = doc(db, "cours", id);
  await updateDoc(docRef, {
    titre,
    contenu,
  });
}

export async function supprimerCours(id: string): Promise<void> {
  if (!auth.currentUser) throw new Error("User not authenticated");

  await deleteDoc(doc(db, "cours", id));
}

// ===== TACHES =====
export async function creerTache(
  titre: string,
  type: "revision" | "exercice" | "devoir" | "autre",
  matiereId: string,
  matiere: string,
  deadline: Date,
  priorite: "haute" | "moyenne" | "basse" = "moyenne"
): Promise<Tache> {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const docRef = await addDoc(collection(db, "taches"), {
    titre,
    type,
    matiereId,
    matiere,
    deadline: Timestamp.fromDate(deadline),
    priorite,
    complete: false,
    userId: auth.currentUser.uid,
    createdAt: Timestamp.now(),
  });

  return {
    id: docRef.id,
    titre,
    type,
    matiereId,
    matiere,
    deadline: Timestamp.fromDate(deadline),
    priorite,
    complete: false,
    userId: auth.currentUser.uid,
    createdAt: Timestamp.now(),
  };
}

export async function getToutesTaches(): Promise<Tache[]> {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "taches"),
    where("userId", "==", auth.currentUser.uid),
    orderBy("deadline", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Tache));
}

export async function getTachesByMatiere(matiereId: string): Promise<Tache[]> {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "taches"),
    where("userId", "==", auth.currentUser.uid),
    where("matiereId", "==", matiereId),
    orderBy("deadline", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Tache));
}

export async function getTacheById(id: string): Promise<Tache | null> {
  if (!auth.currentUser) return null;

  const docRef = doc(db, "taches", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Tache;
}

export async function toggleTache(id: string): Promise<void> {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const tache = await getTacheById(id);
  if (!tache) return;

  const docRef = doc(db, "taches", id);
  await updateDoc(docRef, {
    complete: !tache.complete,
  });
}

export async function sauvegarderTache(
  id: string,
  titre: string,
  deadline: Date,
  priorite: "haute" | "moyenne" | "basse"
): Promise<void> {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const docRef = doc(db, "taches", id);
  await updateDoc(docRef, {
    titre,
    deadline: Timestamp.fromDate(deadline),
    priorite,
  });
}

export async function supprimerTache(id: string): Promise<void> {
  if (!auth.currentUser) throw new Error("User not authenticated");

  await deleteDoc(doc(db, "taches", id));
}
