# Script pour finir le push vers GitHub
# Exécute: .\push-to-github.ps1 dans PowerShell

Write-Host "=== Finalisation Push GitHub ===" -ForegroundColor Green
Write-Host ""

# Change to project directory
cd "C:\Users\walid\mon-app-cours"

Write-Host "🔄 Tentative de push vers GitHub..."
Write-Host "Si une fenêtre navigateur apparaît, clique sur 'Authorize' pour confirmer"
Write-Host ""

# Configure git credentials and attempt push
git config --global credential.helper wincred
git push -u origin main

# Check result
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ SUCCÈS! Code pushé vers GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:"
    Write-Host "1. Va sur https://github.com/walmi11/mon-app-cours pour vérifier"
    Write-Host "2. Vercel devrait auto-déployer (attendre 2-3 minutes)"
    Write-Host "3. Test l'app sur: https://nsnwpyup.vercel.app"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Le push a échoué. Essaie:" -ForegroundColor Red
    Write-Host "   git push -u origin main"
    Write-Host ""
}

# Keep window open
Read-Host "Appuie sur Entrée pour fermer"
