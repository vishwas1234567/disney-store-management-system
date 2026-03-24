import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Avoid exposing secrets here if you commit to public repos. 
// However, Firebase client configs are safe to expose normally.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase safely for Next.js SSR
// Ensure there's only one instance of the app created across hot-reloads/SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Authentication 
const auth = getAuth(app);

// Initialize Firestore 
const db = getFirestore(app);

// Initialize Analytics conditionally (must run on client-side only and on supported browsers)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, auth, db, analytics };
