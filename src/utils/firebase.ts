import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD3otP1d5bVQaZQN3WENXrDPidQFNAf1a0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cashflow-game-dd5b9.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://cashflow-game-dd5b9-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cashflow-game-dd5b9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cashflow-game-dd5b9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "432495665083",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:432495665083:web:3f2d8df4e86900cf4dae9e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-G3MNW5ECLF"
};

const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.databaseURL;

let app;
let db: any;

try {
  if (isConfigValid) {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  } else {
    console.error("Firebase config is missing! Please check your .env file or GitHub Secrets.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { db };
export const hasValidConfig = isConfigValid;
