import { ref, onValue, set, update, runTransaction } from "firebase/database";
import { db } from "./firebase";
import { useGameStore } from "../store/gameStore";
import type { GameState, Player } from "../types/game";

let currentGameId: string | null = null;
let unsubscribeFirebase: (() => void) | null = null;
let isSyncingFromFirebase = false;
let pushTimeout: any = null;

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
    activeMacroEvent: state.activeMacroEvent || null,
    gameStarted: state.gameStarted || false,
    lastUpdate: Date.now()
  };
};

export const createMultiplayerGame = async (gameId: string) => {
  const initialState = useGameStore.getState();
  const gameRef = ref(db, `games/${gameId}`);
  
  const cleanState = getCleanState(initialState);
  await set(gameRef, cleanState);
  joinMultiplayerGame(gameId);
};

/**
 * Safely adds a player to an online game using a transaction
 */
export const addPlayerToOnlineGame = async (gameId: string, player: Player) => {
  const playersRef = ref(db, `games/${gameId}/players`);
  
  await runTransaction(playersRef, (currentPlayers) => {
    const list = currentPlayers || [];
    // Check if player already exists
    if (list.some((p: any) => p.id === player.id)) return list;
    return [...list, player];
  });
};

export const joinMultiplayerGame = (gameId: string) => {
  if (unsubscribeFirebase) {
    unsubscribeFirebase();
  }

  currentGameId = gameId;
  const gameRef = ref(db, `games/${gameId}`);

  const unsubscribe = onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // If we have a newer local update, ignore stale Firebase data
      const localState = useGameStore.getState() as any;
      if (data.lastUpdate < (localState.lastUpdate || 0)) return;

      isSyncingFromFirebase = true;
      useGameStore.setState((state) => ({
        ...state,
        ...data,
        players: data.players || state.players,
        currentPlayerIndex: typeof data.currentPlayerIndex === 'number' ? data.currentPlayerIndex : state.currentPlayerIndex,
        history: data.history || state.history,
        gameStarted: data.gameStarted ?? state.gameStarted
      }));
      
      isSyncingFromFirebase = false;
    }
  });

  unsubscribeFirebase = () => unsubscribe();
};

export const pushStateToFirebase = (state: GameState) => {
  if (!currentGameId || isSyncingFromFirebase) return;

  // Debounce pushes to avoid rate limiting and excessive writes
  if (pushTimeout) clearTimeout(pushTimeout);
  
  pushTimeout = setTimeout(() => {
    const gameRef = ref(db, `games/${currentGameId}`);
    const cleanState = getCleanState(state);
    update(gameRef, cleanState);
  }, 100);
};

useGameStore.subscribe((state) => {
  if (currentGameId && !isSyncingFromFirebase) {
    pushStateToFirebase(state);
  }
});
