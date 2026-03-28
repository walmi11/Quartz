# 🚀 ULTRA-AUTO SETUP

## Option 1: SCRIPT AUTOMATISÉ (Recommandé)

### Fais ceci:

```powershell
cd c:\Users\walid\mon-app-cours
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
.\setup-vercel.ps1
```

**Ce que le script va faire:**
1. ✅ Ouvrir Vercel Settings automatiquement
2. ✅ Afficher chaque variable à ajouter
3. ✅ **Copier chaque valeur au clipboard automatiquement**
4. ✅ Te demander de coller dans Vercel (juste Ctrl+V)
5. ✅ Ouvrir Deployments quand c'est fini
6. ✅ Ouvrir ton app pour tester

---

## Option 2: HTML Interactive (Si le script ne marche pas)

Double-clique sur:
```
c:\Users\walid\mon-app-cours\vercel-setup.html
```

Copie-colle les variables avec les boutons "Copy"

---

## ⚠️ Si le script dit "not signed"

Exécute juste cette commande UNE FOIS:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

Puis réessaye le script.

---

**ALLEZ! Lance le script! 💪**
