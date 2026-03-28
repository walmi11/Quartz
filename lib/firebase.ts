import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ⚠️ REMPLACEZ CES VALEURS par vos clés Firebase depuis https://console.firebase.google.com
// 1. Créez un projet Firebase
// 2. Créez une app Web
// 3. Copiez la config ici

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Vérifier que la config est présente
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('❌ ERREUR: Configuration Firebase incomplète!', {
    apiKey: firebaseConfig.apiKey ? '✓' : '✗',
    authDomain: firebaseConfig.authDomain ? '✓' : '✗',
    projectId: firebaseConfig.projectId ? '✓' : '✗',
    storageBucket: firebaseConfig.storageBucket ? '✓' : '✗',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✓' : '✗',
    appId: firebaseConfig.appId ? '✓' : '✗',
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
