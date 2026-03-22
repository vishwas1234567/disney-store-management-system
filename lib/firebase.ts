import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Avoid exposing secrets here if you commit to public repos. 
// However, Firebase client configs are safe to expose normally.
const firebaseConfig = {
    apiKey: "AIzaSyAZLS8UbkKuPeegDwuZh5SEoh2CKaYomtk",
    authDomain: "disney-store-c4b83.firebaseapp.com",
    projectId: "disney-store-c4b83",
    storageBucket: "disney-store-c4b83.firebasestorage.app",
    messagingSenderId: "651833292812",
    appId: "1:651833292812:web:e803ff6c6416792be49629",
    measurementId: "G-T8YJJW5M8Z"
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