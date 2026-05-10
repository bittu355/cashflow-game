import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

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
