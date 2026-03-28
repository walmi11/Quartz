# Script PowerShell - Auto Setup Vercel Firebase Variables
# Walid - Mon App Cours

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

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "MON APP COURS - VERCEL FIREBASE SETUP" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "STEP 1: Opening Vercel Settings..." -ForegroundColor Yellow
Write-Host ""

Start-Process $vercelSettingsUrl

Write-Host "Waiting for browser (5 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "STEP 2: Adding 6 variables" -ForegroundColor Yellow
Write-Host ""

$count = 1
foreach ($var in $variables) {
    Write-Host "Variable $count of 6: $($var.Key)" -ForegroundColor Cyan
    Write-Host "Value: $($var.Value)" -ForegroundColor Green
    
    $var.Value | Set-Clipboard
    Write-Host ">> Copied to clipboard!" -ForegroundColor Green
    
    Write-Host ""
    Read-Host "Press ENTER after you paste this in Vercel and click Save"
    Write-Host ""
    
    $count++
}

Write-Host "All variables added!" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 3: Redeploy" -ForegroundColor Yellow
Write-Host ""

Start-Process $vercelDeploymentsUrl

Start-Sleep -Seconds 3

Write-Host "FINAL INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "   1. Click on the latest deployment" -ForegroundColor Gray
Write-Host "   2. Click 'Redeploy'" -ForegroundColor Gray
Write-Host "   3. Wait 2-3 minutes (blue spinner)" -ForegroundColor Gray
Write-Host "   4. When you see GREEN checkmark, press ENTER" -ForegroundColor Gray
Write-Host ""

Read-Host "Press ENTER when Redeploy is GREEN and complete"

Write-Host ""
Write-Host "Opening your app..." -ForegroundColor Yellow

Start-Process $appUrl

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "If you see your app (not 404): SUCCESS!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

Read-Host "Press ENTER to finish"
