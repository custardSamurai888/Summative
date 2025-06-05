// src/firebase/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 Your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ics4uzain.firebaseapp.com",
  projectId: "ics4uzain",
  storageBucket: "ics4uzain.appspot.com", // ✅ FIXED typo
  messagingSenderId: "1039373276405",
  appId: "1:1039373276405:web:1ab7fea0e958cd93ade1bc"
};

// ✅ Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, firebaseConfig }; // ✅ Export it here
