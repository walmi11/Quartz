# ✅ Complete Guide: Fix Vercel Deployment

## Current Issue
Your deployment on Vercel is failing because Firebase environment variables are NOT set in the Vercel project.

## ✅ Solution - 3 Simple Steps (5 minutes)

### STEP 1: Open Vercel Settings
1. Go to: https://vercel.com/walmi11/nsnwpyup/settings/environment-variables
2. Login with your Vercel account (if needed)

### STEP 2: Add 6 Firebase Variables
Copy and paste these 6 variables into Vercel:

| Variable Name | Value |
|---|---|
| NEXT_PUBLIC_FIREBASE_API_KEY | AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | mon-app-cours.firebaseapp.com |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | mon-app-cours |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | mon-app-cours.firebasestorage.app |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | 246473751652 |
| NEXT_PUBLIC_FIREBASE_APP_ID | 1:246473751652:web:a7b8b465fd6ade31313371 |

**For each variable:**
- Paste the Name (left column)
- Paste the Value (right column)
- Make sure "Production" is selected
- Click "Save"

### STEP 3: Redeploy
1. Go to: https://vercel.com/walmi11/nsnwpyup/deployments
2. Find the latest failed deployment (red ❌)
3. Click "Redeploy" button
4. Wait 2-3 minutes for green checkmark ✅

### STEP 4: Test
Once deployment is green ✅, visit:
**https://nsnwpyup.vercel.app**

Your app should now work! 🎉

---

## Troubleshooting

### If Still Showing 404
1. Hard refresh: Ctrl+Shift+Del (or Cmd+Shift+Delete on Mac)
2. Clear browser cache
3. Try incognito window

### If Build Still Fails
1. Check Vercel Build Logs (click deployment)
2. Scroll down to see error messages
3. Share the error with support

### If You Need Help
Contact Vercel support at: support@vercel.com
