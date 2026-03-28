# Script PowerShell - Auto Setup Vercel Firebase Variables
# Walid - Mon App Cours

param(
    [switch]$Auto = $false
)

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     MON APP COURS - VERCEL FIREBASE AUTO SETUP         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Variables Firebase
$variables = @(
    @{Key="NEXT_PUBLIC_FIREBASE_API_KEY"; Value="AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q"},
    @{Key="NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"; Value="mon-app-cours.firebaseapp.com"},
    @{Key="NEXT_PUBLIC_FIREBASE_PROJECT_ID"; Value="mon-app-cours"},
    @{Key="NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"; Value="mon-app-cours.firebasestorage.app"},
    @{Key="NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"; Value="246473751652"},
    @{Key="NEXT_PUBLIC_FIREBASE_APP_ID"; Value="1:246473751652:web:a7b8b465fd6ade31313371"}
)

# URLs Vercel
$vercelSettingsUrl = "https://vercel.com/walmi11/nsnwpyup/settings/environment-variables"
$vercelDeploymentsUrl = "https://vercel.com/walmi11/nsnwpyup/deployments"
$appUrl = "https://nsnwpyup.vercel.app"

Write-Host "📍 ÉTAPE 1: Ouverture de Vercel Settings..." -ForegroundColor Yellow
Write-Host "   → Un navigateur va s'ouvrir" -ForegroundColor Gray
Write-Host ""

# Ouvre Vercel Settings
Start-Process $vercelSettingsUrl

Write-Host "⏳ Attends que le navigateur s'ouvre (5 secondes)..." -ForegroundColor Gray
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "📋 ÉTAPE 2: Ajoute les 6 variables" -ForegroundColor Yellow
Write-Host ""

$count = 1
foreach ($var in $variables) {
    Write-Host "$count️⃣  Variable: $($var.Key)" -ForegroundColor Cyan
    Write-Host "   Value: $($var.Value)" -ForegroundColor Green
    
    # Copie la valeur au clipboard
    $var.Value | Set-Clipboard
    Write-Host "   ✓ Copié au clipboard!" -ForegroundColor Green
    
    Write-Host ""
    Read-Host "   Presse ENTER quand tu as collé cette variable dans Vercel et cliqué Save"
    Write-Host ""
    
    $count++
}

Write-Host "✅ Variables complétées!" -ForegroundColor Green
Write-Host ""

Write-Host "📍 ÉTAPE 3: Redéploiement" -ForegroundColor Yellow
Write-Host "   → Ouverture de la page Deployments..." -ForegroundColor Gray
Write-Host ""

Start-Process $vercelDeploymentsUrl

Start-Sleep -Seconds 3

Write-Host "📝 INSTRUCTIONS FINALES:" -ForegroundColor Cyan
Write-Host "   1. Clique sur le dernier déploiement" -ForegroundColor Gray
Write-Host "   2. Clique 'Redeploy'" -ForegroundColor Gray
Write-Host "   3. Attends 2-3 minutes" -ForegroundColor Gray
Write-Host "   4. Quand c'est VERT ✅, visite l'app" -ForegroundColor Gray
Write-Host ""

Read-Host "Presse ENTER quand le Redeploy est VERT ✅"

Write-Host ""
Write-Host "🚀 Ouverture de ton app..." -ForegroundColor Yellow

Start-Process $appUrl

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         ✅ SETUP TERMINÉ!                              ║" -ForegroundColor Green
Write-Host "║                                                        ║" -ForegroundColor Green
Write-Host "║  Si tu vois ton app (pas 404), tu as réussi! 🎉       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Read-Host "Presse ENTER pour fermer"
