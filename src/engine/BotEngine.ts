import { useGameStore } from '../store/gameStore';
import { RAT_RACE_SPACES } from '../data/board';
import { FAST_TRACK_SPACES } from '../data/fastTrack';

/**
 * Automates a bot's turn with full game rule support.
 */
export const playBotTurn = async (playerId: string) => {
  const store = useGameStore.getState();
  const player = store.players.find(p => p.id === playerId);
  if (!player || player.lostTurns > 0) {
    if (player?.lostTurns && player.lostTurns > 0) store.endTurn();
    return;
  }

  console.log(`Bot ${player.name} is playing...`);

  // 1. Roll Dice
  const diceCount = player.phase === 'FAST_TRACK' ? (player.charityTurnsRemaining > 0 ? 3 : 2) : 1;
  store.setRolling(true);
  await new Promise(resolve => setTimeout(resolve, 1000));
  store.rollDice(diceCount);
  store.setRolling(false);
  
  await new Promise(resolve => setTimeout(resolve, 800));

  // Get fresh state
  const state = useGameStore.getState();
  const bot = state.players.find(p => p.id === playerId);
  if (!bot) return;

  // 2. Evaluate Position
  if (bot.phase === 'RAT_RACE') {
    const space = RAT_RACE_SPACES[bot.position];
    
    if (space.type === 'OPPORTUNITY') {
      // Bot prefers Small Deals if low on cash, Big Deals if wealthy
      const dealType = bot.statement.cash > 5000 ? 'BIG_DEAL' : 'SMALL_DEAL';
      state.drawCard(dealType);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const activeCard = useGameStore.getState().activeCard;
      if (activeCard) {
        const cost = activeCard.downPayment || activeCard.cost || 0;
        // Simple AI: Buy if cash > cost + 500 (reserve)
        if (bot.statement.cash >= cost + 500) {
          state.buyAsset(playerId, {
            id: `asset-${Date.now()}`,
            name: activeCard.title,
            type: activeCard.assetType || 'BUSINESS',
            cost: activeCard.cost || 0,
            downPayment: cost,
            cashflow: activeCard.cashflow || 0
          });
        }
        state.resolveCard();
      }
    } else if (space.type === 'DOODAD') {
      state.drawCard('DOODAD');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const activeCard = useGameStore.getState().activeCard;
      if (activeCard) {
        state.payCash(playerId, activeCard.cost || 0);
        state.resolveCard();
      }
    } else if (state.pendingPaydays > 0) {
      state.collectPayday();
    }
  } else {
    // Fast Track Logic
    const space = FAST_TRACK_SPACES[bot.position];
    if (space.type === 'BUSINESS' && space.business) {
      if (bot.statement.cash >= space.business.cost) {
        state.buyFastTrackBusiness(playerId, space.business.name, space.business.cashflow, space.business.cost);
      }
    } else if (space.type === 'DREAM') {
       if (bot.statement.cash >= 100000) {
         state.buyDream(playerId, 100000);
       }
    } else if (space.type === 'TAX_AUDIT' || space.type === 'LAWSUIT' || space.type === 'DIVORCE') {
       state.resolveFastTrackPenalty(playerId, space.type);
    }
    
    if (state.pendingPaydays > 0) {
      state.collectPayday();
    }
  }

  // 3. End Turn
  console.log(`Bot ${player.name} ends turn.`);
  await new Promise(resolve => setTimeout(resolve, 500));
  useGameStore.getState().endTurn();
};
