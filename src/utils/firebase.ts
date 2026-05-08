import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database service
export const db = getDatabase(app);
