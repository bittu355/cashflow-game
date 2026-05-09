import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase";
import { useGameStore } from "../store/gameStore";
import type { GameState } from "../types/game";

let currentGameId: string | null = null;
let unsubscribeFirebase: (() => void) | null = null;
let isSyncingFromFirebase = false;

// Generate a random room code
export const generateGameId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

/**
 * Initializes a new multiplayer game in Firebase.
 */
export const createMultiplayerGame = async (gameId: string) => {
  const initialState = useGameStore.getState();
  const gameRef = ref(db, `games/${gameId}`);
  
  // Strip out functions from the state before saving to Firebase
  const cleanState = JSON.parse(JSON.stringify({
    players: initialState.players,
    currentPlayerIndex: initialState.currentPlayerIndex,
    turnPhase: initialState.turnPhase,
    diceRoll: initialState.diceRoll,
    activeCard: initialState.activeCard,
    pendingPaydays: initialState.pendingPaydays
  }));

  await set(gameRef, cleanState);
  joinMultiplayerGame(gameId);
};

/**
 * Connects to an existing multiplayer game and listens for updates.
 */
export const joinMultiplayerGame = (gameId: string) => {
  if (unsubscribeFirebase) {
    unsubscribeFirebase();
  }

  currentGameId = gameId;
  const gameRef = ref(db, `games/${gameId}`);

  const unsubscribe = onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      isSyncingFromFirebase = true;
      useGameStore.setState((state) => ({
        ...state,
        players: data.players || [],
        currentPlayerIndex: data.currentPlayerIndex || 0,
        turnPhase: data.turnPhase || 'ROLL',
        diceRoll: data.diceRoll || [],
        activeCard: data.activeCard || null,
        pendingPaydays: data.pendingPaydays || 0
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
 * This should be called by Zustand whenever the state changes locally (but NOT when syncing FROM Firebase).
 */
export const pushStateToFirebase = (state: GameState) => {
  if (!currentGameId || isSyncingFromFirebase) return;

  const gameRef = ref(db, `games/${currentGameId}`);
  
  const cleanState = {
    players: state.players,
    currentPlayerIndex: state.currentPlayerIndex,
    turnPhase: state.turnPhase,
    diceRoll: state.diceRoll,
    activeCard: state.activeCard,
    pendingPaydays: state.pendingPaydays
  };

  set(gameRef, cleanState);
};

// Subscribe to Zustand store changes to automatically push to Firebase
useGameStore.subscribe((state) => {
  if (currentGameId && !isSyncingFromFirebase) {
    pushStateToFirebase(state);
  }
});
