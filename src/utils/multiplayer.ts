import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase";
import { useGameStore } from "../store/gameStore";
import type { GameState } from "../types/game";

let currentGameId: string | null = null;
let unsubscribeFirebase: (() => void) | null = null;
let isSyncingFromFirebase = false;

export const generateGameId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

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

export const createMultiplayerGame = async (gameId: string) => {
  const initialState = useGameStore.getState();
  const gameRef = ref(db, `games/${gameId}`);
  const cleanState = getCleanState(initialState);
  await set(gameRef, cleanState);
  joinMultiplayerGame(gameId);
};

export const joinMultiplayerGame = (gameId: string) => {
  if (unsubscribeFirebase) unsubscribeFirebase();
  currentGameId = gameId;
  const gameRef = ref(db, `games/${gameId}`);
  const unsubscribe = onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      isSyncingFromFirebase = true;
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
  }
});
