@echo off
REM Auto-trigger Vercel deployment on push

echo Pushing code to GitHub...
echo This will automatically trigger Vercel to rebuild and deploy
echo.

cd /d "%~dp0"

git add .
git commit -m "Automated deploy trigger" 2>nul
git push origin main

echo.
echo NEXT STEP: Go to https://vercel.com/walmi11/nsnwpyup/deployments
echo You should see a new build starting (blue spinner)
echo Wait 2-3 minutes for it to turn GREEN ✅
echo.
echo Then visit: https://nsnwpyup.vercel.app
echo.
pause
