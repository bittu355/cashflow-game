import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const CardModal = () => {
  const { activeCard, resolveCard } = useGameStore();
  const [sharesToBuy, setSharesToBuy] = useState(10);

  if (!activeCard) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-panel animate-slide-up" style={{
        backgroundColor: 'var(--color-bg-card)',
        border: `1px solid ${activeCard.type === 'DOODAD' ? 'rgba(255, 23, 68, 0.5)' : activeCard.type === 'MARKET' ? 'rgba(41, 121, 255, 0.5)' : 'rgba(0, 230, 118, 0.5)'}`,
        padding: '2rem',
        borderRadius: '20px',
        width: '350px',
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px ${activeCard.type === 'DOODAD' ? 'rgba(255, 23, 68, 0.1)' : activeCard.type === 'MARKET' ? 'rgba(41, 121, 255, 0.1)' : 'rgba(0, 230, 118, 0.1)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <div style={{ 
            fontSize: '0.85rem', 
            fontWeight: 800, 
            color: activeCard.type === 'DOODAD' ? 'var(--color-danger)' : activeCard.type === 'MARKET' ? 'var(--color-blue)' : 'var(--color-success)',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            {activeCard.type.replace('_', ' ')}
          </div>
          <h2 style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: 'var(--color-text-main)' }}>{activeCard.title}</h2>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {activeCard.description}
        </p>

        {activeCard.cost && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>Cost:</span>
            <span>${activeCard.cost.toLocaleString()}</span>
          </div>
        )}
        
        {activeCard.downPayment !== undefined && activeCard.assetType !== 'STOCK' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>Down Payment:</span>
            <span>${activeCard.downPayment.toLocaleString()}</span>
          </div>
        )}

        {activeCard.assetType === 'STOCK' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Shares to Buy:</span>
              <input 
                type="number" 
                value={sharesToBuy} 
                onChange={e => setSharesToBuy(Math.max(0, parseInt(e.target.value) || 0))}
                style={{ width: '80px', textAlign: 'right', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '2px 5px' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--color-primary)' }}>
              <span>Total Cost:</span>
              <span>${((activeCard.cost || 0) * sharesToBuy).toLocaleString()}</span>
            </div>
          </div>
        )}

        {activeCard.cashflow !== undefined && activeCard.cashflow > 0 && activeCard.assetType !== 'STOCK' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--color-success)' }}>
            <span>Cashflow:</span>
            <span>+${activeCard.cashflow.toLocaleString()}</span>
          </div>
        )}

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-secondary btn-pop" 
            style={{ flex: 1 }}
            onClick={() => {
              if (activeCard.type === 'DOODAD' && activeCard.cost) {
                // For a doodad, we need to deduct cash directly or go bankrupt.
                // Since Doodads aren't tracked as permanent liabilities unless we take a loan,
                // we just pay it off directly from cash for now.
                const state = useGameStore.getState();
                const player = state.players[state.currentPlayerIndex];
                if (player.statement.cash >= activeCard.cost) {
                  // Direct cash deduction for doodads (using a hacky empty liability pay for now)
                  // Actually, it's better to just do a custom store action, but for V1 we can 
                  // simulate a direct state update.
                  useGameStore.setState((s) => ({
                    players: s.players.map((p, idx) => idx === s.currentPlayerIndex ? {
                      ...p,
                      statement: { ...p.statement, cash: p.statement.cash - activeCard.cost! }
                    } : p)
                  }));
                  resolveCard();
                } else {
                  alert('Not enough cash! You must take a loan.');
                  // Keep modal open so they can take a loan from ledger
                }
              } else {
                // Pass on an opportunity
                resolveCard();
              }
            }}
          >
            {activeCard.type === 'DOODAD' ? 'Pay' : 'Pass'}
          </button>
          
          {activeCard.type !== 'DOODAD' && (
            <button 
              className="btn btn-primary btn-pop" 
              style={{ flex: 1 }}
              onClick={() => {
                const state = useGameStore.getState();
                const player = state.players[state.currentPlayerIndex];
                
                let totalCost = activeCard.downPayment;
                if (activeCard.assetType === 'STOCK') {
                  totalCost = (activeCard.cost || 0) * sharesToBuy;
                }

                if (totalCost !== undefined && player.statement.cash >= totalCost) {
                  state.buyAsset(player.id, {
                    id: activeCard.id + Date.now(),
                    name: activeCard.assetType === 'STOCK' ? `${activeCard.title} (${sharesToBuy} sh)` : activeCard.title,
                    type: activeCard.assetType || 'BUSINESS',
                    cost: activeCard.assetType === 'STOCK' ? (activeCard.cost || 0) : (activeCard.cost || 0),
                    downPayment: totalCost,
                    cashflow: activeCard.cashflow || 0,
                    shares: activeCard.assetType === 'STOCK' ? sharesToBuy : undefined,
                    dividend: activeCard.assetType === 'STOCK' ? activeCard.cashflow : undefined
                  });
                  resolveCard();
                } else {
                  alert('Not enough cash!');
                }
              }}
            >
              {activeCard.actionText || 'Buy'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
