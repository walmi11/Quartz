# 📌 C'EST SIMPLE - Lis ça en 2 minutes!

Salut! Tu as une erreur 404 sur Vercel. Je sais pourquoi et comment le fixer. C'est super facile!

---

## 🔴 Le Problème

Tu vois: **404 - Not Found**

Cause: Les variables Firebase ne sont PAS dans Vercel

---

## 🟢 La Solution (3 étapes)

### Étape 1: Ouvre Vercel Settings
Va ici (clique le lien):
```
https://vercel.com/walmi11/nsnwpyup/settings/environment-variables
```

### Étape 2: Ajoute 6 variables
Clique "+ Add New" 6 fois et copie-colle ceci:

```
#1
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q

#2
Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: mon-app-cours.firebaseapp.com

#3
Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: mon-app-cours

#4
Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: mon-app-cours.firebasestorage.app

#5
Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 246473751652

#6
Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:246473751652:web:a7b8b465fd6ade31313371
```

Pour chacune:
- Colle le **Name**
- Colle la **Value**
- S'assure "Production" ✓
- Clique "Save"

### Étape 3: Redéploie
Va ici:
```
https://vercel.com/walmi11/nsnwpyup/deployments
```

Clique sur le déploiement ❌ rouge → Clique "Redeploy" → Attends 2-3 min

Quand tu vois ✅ vert, visite:
```
https://nsnwpyup.vercel.app
```

**VOILÀ! Ton app march!** 🎉

---

## 📞 Pas clair?

Lis les fichiers dans ton dossier:
- `ACTION_PLAN.md` ← Résumé complet
- `GUIDE_VISUEL_VERCEL.md` ← Guide détaillé avec screenshots/checkpoints
- `TROUBLESHOOTING_FR.md` ← FAQ si tu es bloqué

---

**Allez! C'est une question de 10 minutes! Tu peux le faire!** 💪
