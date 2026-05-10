import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase";
import { useGameStore } from "../store/gameStore";
import type { GameState } from "../types/game";

let currentGameId: string | null = null;
let unsubscribeFirebase: (() => void) | null = null;
let isSyncingFromFirebase = false;

<<<<<<< HEAD
// Generate a random room code
export const generateGameId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

/**
 * Cleans the state for Firebase storage (removing non-serializable parts)
 */
=======
export const generateGameId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
const getCleanState = (state: any) => {
  return {
    players: state.players || [],
    currentPlayerIndex: state.currentPlayerIndex || 0,
    turnPhase: state.turnPhase || 'ROLL',
    diceRoll: state.diceRoll || [],
    activeCard: state.activeCard || null,
    pendingPaydays: state.pendingPaydays || 0,
    winner: state.winner || null,
    history: state.history || [],
    turnCount: state.turnCount || 0,
    activeMacroEvent: state.activeMacroEvent || null
  };
};

<<<<<<< HEAD
/**
 * Initializes a new multiplayer game in Firebase.
 */
export const createMultiplayerGame = async (gameId: string) => {
  const initialState = useGameStore.getState();
  const gameRef = ref(db, `games/${gameId}`);
  
=======
export const createMultiplayerGame = async (gameId: string) => {
  const initialState = useGameStore.getState();
  const gameRef = ref(db, `games/${gameId}`);
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
  const cleanState = getCleanState(initialState);
  await set(gameRef, cleanState);
  joinMultiplayerGame(gameId);
};

<<<<<<< HEAD
/**
 * Connects to an existing multiplayer game and listens for updates.
 */
export const joinMultiplayerGame = (gameId: string) => {
  if (unsubscribeFirebase) {
    unsubscribeFirebase();
  }

  currentGameId = gameId;
  const gameRef = ref(db, `games/${gameId}`);

=======
export const joinMultiplayerGame = (gameId: string) => {
  if (unsubscribeFirebase) unsubscribeFirebase();
  currentGameId = gameId;
  const gameRef = ref(db, `games/${gameId}`);
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
  const unsubscribe = onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      isSyncingFromFirebase = true;
<<<<<<< HEAD
      useGameStore.setState((state) => ({
        ...state,
        ...data,
        // Ensure we don't accidentally wipe out local-only state if it's missing from Firebase
        players: data.players || state.players,
        currentPlayerIndex: typeof data.currentPlayerIndex === 'number' ? data.currentPlayerIndex : state.currentPlayerIndex,
        history: data.history || state.history,
      }));
      // Reset the flag on the next tick
      setTimeout(() => {
        isSyncingFromFirebase = false;
      }, 0);
    }
  });

  unsubscribeFirebase = () => unsubscribe();
};

/**
 * Pushes local state changes to Firebase.
 */
export const pushStateToFirebase = (state: GameState) => {
  if (!currentGameId || isSyncingFromFirebase) return;

  const gameRef = ref(db, `games/${currentGameId}`);
  const cleanState = getCleanState(state);
  set(gameRef, cleanState);
};

// Subscribe to Zustand store changes to automatically push to Firebase
useGameStore.subscribe((state) => {
  if (currentGameId && !isSyncingFromFirebase) {
    pushStateToFirebase(state);
=======
      useGameStore.setState((state) => ({ ...state, ...data }));
      setTimeout(() => { isSyncingFromFirebase = false; }, 0);
    }
  });
  unsubscribeFirebase = () => unsubscribe();
};

useGameStore.subscribe((state) => {
  if (currentGameId && !isSyncingFromFirebase) {
    const gameRef = ref(db, `games/${currentGameId}`);
    set(gameRef, getCleanState(state));
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
  }
});
