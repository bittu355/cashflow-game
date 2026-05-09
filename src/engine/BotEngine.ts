import { useGameStore } from '../store/gameStore';
import { RAT_RACE_SPACES } from '../data/board';
import { SMALL_DEALS, DOODADS } from '../data/cards';

/**
 * Automates a bot's turn.
 */
export const playBotTurn = async (playerId: string) => {
  const store = useGameStore.getState();
  const player = store.players.find(p => p.id === playerId);
  if (!player) return;

  console.log(`Bot ${player.name} is playing...`);

  // 1. Roll Dice
  store.rollDice(1);
  
  // Wait a moment for UX purposes (if we want to see the roll)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // The store state has updated, so we need to get fresh state
  const stateAfterRoll = useGameStore.getState();
  const updatedPlayer = stateAfterRoll.players.find(p => p.id === playerId);
  if (!updatedPlayer) return;

  const space = RAT_RACE_SPACES[updatedPlayer.position];
  
  // 2. Evaluate Space Action
  if (space.type === 'OPPORTUNITY') {
    // Bot decides: Always picks Small Deal for now
    const card = SMALL_DEALS[Math.floor(Math.random() * SMALL_DEALS.length)];
    console.log(`Bot drew deal: ${card.title}`);
    
    // Evaluate if they can buy it
    if (card.downPayment !== undefined && updatedPlayer.statement.cash >= card.downPayment) {
      console.log(`Bot buys ${card.title}!`);
      stateAfterRoll.buyAsset(playerId, {
        id: card.id + Date.now(), // unique instance
        name: card.title,
        type: card.assetType || 'BUSINESS',
        cost: card.cost || 0,
        downPayment: card.downPayment,
        cashflow: card.cashflow || 0,
        shares: card.assetType === 'STOCK' ? Math.floor(card.downPayment / (card.cost || 1)) : undefined,
        dividend: card.assetType === 'STOCK' ? card.cashflow : undefined
      });
    } else {
      console.log(`Bot passes on ${card.title}. Not enough cash.`);
    }
  } 
  else if (space.type === 'DOODAD') {
    const card = DOODADS[Math.floor(Math.random() * DOODADS.length)];
    console.log(`Bot drew doodad: ${card.title} - Cost: $${card.cost}`);
    // Pay for it
    if (card.cost) {
      // Create a temporary liability id to pay immediately
      // To simulate this in the current engine, we just deduct cash
      // Note: A true bot might go bankrupt here, but for now we just deduct cash directly.
      // Since it's an internal utility, we can update via the store later, 
      // but for V1 we just log it. (Fully integrating bot doodad payments requires store actions)
    }
  }

  // 3. End Turn
  console.log(`Bot ends turn.`);
  useGameStore.getState().endTurn();
};
