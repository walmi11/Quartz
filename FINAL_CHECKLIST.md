# 🎯 FIREBASE SETUP - CHECKLIST FINALE

## ✅ Statut Actuel

Toutes les pages sont maintenant **connectées à Firestore** ✨

| Page | Firestore | Auth | Statut |
|------|-----------|------|--------|
| `/` (Home) | ✅ | ✅ | Prêt |
| `/auth` (Login/Signup) | - | ✅ | Prêt |
| `/matiere/[slug]` | ✅ | ✅ | Prêt |
| `/cours/[id]` | ✅ | ✅ | Prêt |
| `/planning` | ✅ | ✅ | Prêt |

---

## 🚀 DERNIÈRE ÉTAPE : Activer les Firestore Rules

### ⚠️ IMPORTANT MAINTENANT ⚠️

Sinon l'app aura des erreurs "Permission denied"

1. Allez sur: **https://console.firebase.google.com**
2. Projet → **Firestore Database** → **Rules** (3e onglet)
3. **COPIER-COLLER ceci:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Cliquez **PUBLISH** (en bas à droite)
5. Attendez le message vert ✅

---

## ✅ TESTER L'APP COMPLÈTE

### **Test 1: Créer un compte**
1. Allez sur http://localhost:3000
2. Vous allez à `/auth` (automatique)
3. Cliquez "**Inscrivez-vous**"
4. Entrez:
   - Email: `test@example.com`
   - Password: `password123`
5. Créez le compte 📝

**Résultat attendu:** Redirection au dashboard ✅

### **Test 2: Créer une matière**
1. Dans le dashboard, scrollez jusqu'à "🗂️ Matières"
2. Cliquez "+ Nouvelle"
3. Emoji: `📚`
4. Nom: `Mathématiques`
5. Cliquez "Créer" ✔️

**Résultat attendu:** Matière apparaît dans la liste + Firestore ✅

### **Test 3: Créer un cours**
1. Cliquez sur la matière "Mathématiques"
2. Cliquez "Nouveau cours"
3. Entrez un titre: "Algèbre"
4. Écrivez du contenu
5. Le cours se sauvegarde automatiquement ⏱️

**Résultat attendu:** Données persist dans Firestore ✅

### **Test 4: Créer une tâche**
1. Allez sur `/planning` (lien 📅 dans sidebar)
2. Cliquez "+ Nouvelle tâche"
3. Remplissez:
   - Titre: "Exercice 1"
   - Type: "exercice"
   - Matière: "Mathématiques"
   - Deadline: demain
   - Priorité: "haute"
4. Créez ✔️

**Résultat attendu:** Tâche apparaît avec priorité 🔴 ✅

### **Test 5: Déconnexion & Reconnexion**
1. Cliquez le bouton 🚪 en bas du sidebar
2. Vous êtes redirigé à `/auth`
3. Connectez-vous avec votre email
4. Vos matières/cours/tâches sont **toujours là** ✅

---

## 🔐 Vérifier dans Firestore Console

1. Allez sur https://console.firebase.google.com
2. Sélectionnez "mon-app-cours"
3. **Firestore Database** → **Data**
4. Vous devriez voir les collections:
   - `matieres/` avec vos matières
   - `cours/` avec vos cours
   - `taches/` avec vos tâches

---

## 🌐 DÉPLOYER SUR VERCEL (optionnel maintenant)

### Avant de déployer
1. Vérifiez les règles Firestore (voir plus haut) ✅
2. Testez localement et c'est bon

### Déployer:
```bash
# 1. Créer un repo GitHub
git init
git add .
git commit -m "Firebase + Firestore integration ready"

# 2. Pousser
git branch -M main
git remote add origin https://github.com/VOTRE_USER/mon-app-cours.git
git push -u origin main

# 3. Sur vercel.com
# - "New Project"
# - Sélectionnez le repo GitHub
# - Ajoutez les variables d'environnement (.env.local)
# - Click "Deploy" 🚀
```

---

## 📋 Résumé des fichiers modifiés

### ✨ Nouveaux fichiers
| Fichier | Rôle |
|---------|------|
| `lib/firebase.ts` | Config Firebase |
| `lib/auth.tsx` | AuthContext + hooks |
| `lib/firestore.ts` | Opérations Firestore (CRUD) |
| `lib/withAuth.tsx` | HOC pour protéger routes |
| `app/auth/page.tsx` | Page login/signup |
| `.env.local` | Variables Firebase (⚠️ SECRET) |
| `vercel.json` | Config déploiement |

### 📝 Pages modifiées
| Fichier | Changements |
|---------|------------|
| `app/layout.tsx` | AuthProvider ajouté |
| `app/page.tsx` | Firestore + Auth |
| `app/matiere/[slug]/page.tsx` | Firestore + Auth |
| `app/cours/[id]/page.tsx` | Firestore + Auth |
| `app/planning/page.tsx` | Firestore + Auth |

---

## 🔑 Variables d'environnement ✅

✅ Déjà configurées dans `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mon-app-cours.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mon-app-cours
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mon-app-cours.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=246473751652
NEXT_PUBLIC_FIREBASE_APP_ID=1:246473751652:web:a7b8b465fd6ade31313371
```

⚠️ **NE JAMAIS COMMITTER `.env.local`!**
- `.gitignore` a déjà `.env*`
- Les clés `NEXT_PUBLIC_` sont publiques (Firebase le sait)

---

## 🆘 Erreurs courantes

### "Permission denied for 'create' on resource"
❌ **Cause:** Firestore Rules pas activées
✅ **Solution:** Voir "DERNIÈRE ÉTAPE" plus haut

### "Cannot read property 'uid' of null"
❌ **Cause:** Utilisateur pas authentifié
✅ **Solution:** L'app redirige vers `/auth`, créer un compte

### "Firebase is not defined"
❌ **Cause:** `.env.local` pas chargé
✅ **Solution:** Redémarrer le serveur: Ctrl+C → `npm run dev`

### "Module not found: 'firebase'"
❌ **Cause:** Firebase pas installé
✅ **Solution:** `npm install firebase --legacy-peer-deps`

---

## 📊 Quotas gratuits Firebase

Par jour (gratuit illimité jusqu'à):
- 📖 50,000 lectures
- ✏️ 20,000 écritures
- 🗑️ 20,000 suppressions
- 👤 Auth: illimité

→ **Suffisant pour une app d'apprentissage!** 📚

---

## 🎉 Vous êtes prêts!

Votre app est maintenant:
✅ Authentification multi-utilisateur
✅ Données cloud (Firestore)
✅ Temps réel (Firestore listeners)
✅ Déploiement prêt (Vercel)

### Prochaines étapes optionnelles:
- [ ] Déployer sur Vercel
- [ ] Inviter des amis
- [ ] Ajouter plus de matières/cours
- [ ] Notifications pour les tâches (optionnel)

---

## ✅ Checklist finale

- [ ] Firestore Rules publiées
- [ ] App testée localement
- [ ] Compte crée & connecté
- [ ] Matière créée
- [ ] Cours créé
- [ ] Tâche créée
- [ ] Déconnexion & reconnexion OK
- [ ] Données persist dans Firestore
- [ ] localStorage vide (tout dans Firestore) ✨

**Status: 🚀 READY TO LAUNCH**

Confirmez quand c'est bon! 🎉
