# 📚 MesCours - Setup Instructions

## 🔐 Configurer Firebase

### Étape 1: Créer un projet Firebase
1. Allez sur https://console.firebase.google.com
2. Cliquez sur "Créer un projet"
3. Nommez-le "mes-cours"
4. Suivez les étapes

### Étape 2: Configurer l'authentification
1. Dans le menu gauche: **Authentication**
2. Cliquez sur "**Get Started**"
3. Sélectionnez "Email/Password"
4. Activez "Email/Password"
5. Cliquez "Save"

### Étape 3: Créer Firestore Database
1. Menu gauche: **Firestore Database**
2. Cliquez "Create Database"
3. Choisissez région: `eur3` (Europe)
4. Mode de sécurité: Sélectionnez "Start in test mode"
5. Cliquez "Create"

### Étape 4: Copier les clés Firebase
1. Menu gauche: **Project Settings** (⚙️)
2. Sous "Your apps", cliquez sur l'app Web ou créez-en une
3. Copiez le code de configuration
4. À partir de `const firebaseConfig = { ... }`:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

### Étape 5: Configurer les variables d'environnement
1. Ouvrez le fichier `.env.local` à la racine du projet
2. Remplissez les valeurs Firebase:
```
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
```

### Étape 6: Redémarrer le serveur
```bash
npm run dev
```

---

## 🌐 Déployer sur Vercel

### Étape 1: Pousser sur GitHub
1. Créez un repo GitHub
2. Poussez votre code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-user/mon-app-cours.git
git push -u origin main
```

### Étape 2: Connecter à Vercel
1. Allez sur https://vercel.com
2. Cliquez "New Project"
3. Importez votre repo GitHub
4. Configurez les variables d'environnement:
   - Ajoutez les mêmes valeurs `.env.local`
   - Vérifiez qu'elles commencent par `NEXT_PUBLIC_`
5. Cliquez "Deploy"

### Étape 3: Sécuriser Firestore
Afin que n'importe qui ne puisse pas accéder à votre base de données:

1. Allez sur https://console.firebase.google.com
2. Allez à **Firestore Database** → **Rules**
3. Remplacez par:
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
4. Cliquez "Publish"

---

## ✅ Vérifier que tout fonctionne

1. Rendez-vous sur votre app (http://localhost:3000 localement)
2. Vous devriez être redirigé vers `/auth`
3. Créez un compte
4. Vous devriez être redirigé vers le dashboard
5. Créez une matière et des cours
6. Les données devraient être sauvegardées dans Firestore ✨

---

## 🐛 Troubleshooting

**"Firebase configuration not found"**
- Vérifiez le fichier `.env.local`
- Redémarrez le serveur après avoir modifié les variables

**"Permission denied" sur Firestore**
- Les règles de Firestore ne permettent que les utilisateurs authentifiés
- Vérifiez que vous êtes connecté

**"Module not found: firebase"**
- Lancez `npm install firebase`

---

Vous êtes prêt ! 🚀
