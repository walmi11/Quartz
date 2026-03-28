# Vercel Firebase Configuration Guide - PowerShell Version
# This script provides interactive instructions for configuring Vercel

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Vercel Firebase Configuration" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "IMPORTANT: This requires manual setup in Vercel Dashboard" -ForegroundColor Yellow
Write-Host "You must click and enter each variable manually" -ForegroundColor Yellow
Write-Host ""

Write-Host "FOLLOW THESE STEPS:" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Open Vercel Settings" -ForegroundColor White
Write-Host "  URL: https://vercel.com/walmi11/nsnwpyup/settings/environment-variables" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 2: Click 'Add New Environment Variable'" -ForegroundColor White
Write-Host ""

Write-Host "Step 3: Add These 6 Variables (one at a time):" -ForegroundColor White
Write-Host ""

$variables = @(
    @{Name="NEXT_PUBLIC_FIREBASE_API_KEY"; Value="AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q"},
    @{Name="NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"; Value="mon-app-cours.firebaseapp.com"},
    @{Name="NEXT_PUBLIC_FIREBASE_PROJECT_ID"; Value="mon-app-cours"},
    @{Name="NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"; Value="mon-app-cours.firebasestorage.app"},
    @{Name="NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"; Value="246473751652"},
    @{Name="NEXT_PUBLIC_FIREBASE_APP_ID"; Value="1:246473751652:web:a7b8b465fd6ade31313371"}
)

$i = 1
foreach ($var in $variables) {
    Write-Host "Variable $i:" -ForegroundColor Yellow
    Write-Host "  Name:  $($var.Name)" -ForegroundColor White
    Write-Host "  Value: $($var.Value)" -ForegroundColor White
    Write-Host ""
    $i++
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "After Adding All Variables:" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 4: Go to Deployments" -ForegroundColor White
Write-Host "  URL: https://vercel.com/walmi11/nsnwpyup/deployments" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 5: Find Latest Failed Deployment" -ForegroundColor White
Write-Host "  Look for red X or 'Failed' status" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 6: Click 'Redeploy'" -ForegroundColor White
Write-Host ""

Write-Host "Step 7: Wait 2-3 Minutes" -ForegroundColor White
Write-Host "  Watch the build progress" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 8: Check Status" -ForegroundColor White
Write-Host "  When checkmark turns green ✓ = SUCCESS" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 9: Visit Your App" -ForegroundColor White
Write-Host "  URL: https://nsnwpyup.vercel.app" -ForegroundColor Gray
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Success Indicators:" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ App loads without 404" -ForegroundColor Green
Write-Host "✓ You see login page" -ForegroundColor Green
Write-Host "✓ Can enter email/password" -ForegroundColor Green
Write-Host "✓ Dashboard shows 'Select a subject'" -ForegroundColor Green
Write-Host ""

Write-Host "❌ Problem Indicators:" -ForegroundColor Red
Write-Host "❌ Still shows 404" -ForegroundColor Red
Write-Host "❌ Build marked as failed" -ForegroundColor Red
Write-Host "❌ Firebase errors in console" -ForegroundColor Red
Write-Host ""

Write-Host "If problems occur:" -ForegroundColor Yellow
Write-Host "1. Check all 6 variables were entered correctly" -ForegroundColor Yellow
Write-Host "2. Check Vercel build logs for detailed errors" -ForegroundColor Yellow
Write-Host "3. Verify variables are set for PRODUCTION environment" -ForegroundColor Yellow
Write-Host "4. Try 'Redeploy' again" -ForegroundColor Yellow
Write-Host ""
