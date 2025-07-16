import type { Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: any = null;
let authInstance: Auth | null = null;

export const getFirebaseAuth = async (): Promise<Auth> => {
  if (authInstance) {
    return authInstance;
  }

  const { initializeApp } = await import("firebase/app");
  const { getAuth } = await import("firebase/auth");

  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  
  authInstance = getAuth(app);
  return authInstance;
};

// Mantener compatibilidad pero con lazy loading
export const auth = {
  get currentUser() {
    return authInstance?.currentUser || null;
  }
};
