import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

<<<<<<< HEAD
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database service
=======
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

const app = initializeApp(firebaseConfig);
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
export const db = getDatabase(app);
