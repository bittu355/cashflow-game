import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Bulletproof Firebase configuration with hardcoded production fallbacks
const firebaseConfig = {
  apiKey: "AIzaSyD3otP1d5bVQaZQN3WENXrDPidQFNAf1a0",
  authDomain: "cashflow-game-dd5b9.firebaseapp.com",
  databaseURL: "https://cashflow-game-dd5b9-default-rtdb.firebaseio.com",
  projectId: "cashflow-game-dd5b9",
  storageBucket: "cashflow-game-dd5b9.firebasestorage.app",
  messagingSenderId: "432495665083",
  appId: "1:432495665083:web:3f2d8df4e86900cf4dae9e",
  measurementId: "G-G3MNW5ECLF"
};

// Log for debugging (will be visible in browser console)
console.log("Initializing Firebase with project:", firebaseConfig.projectId);

let app;
let db: any = null;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { db };
export const hasValidConfig = true; // Always true because it's hardcoded now
