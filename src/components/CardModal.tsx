import { useGameStore } from '../store/gameStore';

export const CardModal = () => {
  const { activeCard, resolveCard } = useGameStore();

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
      <div className="glass-panel" style={{
        backgroundColor: activeCard.type === 'DOODAD' ? '#fff5f5' : '#f0fff4',
        border: `2px solid ${activeCard.type === 'DOODAD' ? '#fc8181' : '#68d391'}`,
        padding: '2rem',
        borderRadius: '16px',
        width: '350px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem' }}>
          <div style={{ 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            color: activeCard.type === 'DOODAD' ? '#e53e3e' : '#38a169',
            letterSpacing: '1px'
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
        
        {activeCard.downPayment !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>Down Payment:</span>
            <span>${activeCard.downPayment.toLocaleString()}</span>
          </div>
        )}

        {activeCard.cashflow !== undefined && activeCard.cashflow > 0 && (
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
                
                if (activeCard.downPayment !== undefined && player.statement.cash >= activeCard.downPayment) {
                  state.buyAsset(player.id, {
                    id: activeCard.id + Date.now(),
                    name: activeCard.title,
                    type: activeCard.assetType || 'BUSINESS',
                    cost: activeCard.cost || 0,
                    downPayment: activeCard.downPayment,
                    cashflow: activeCard.cashflow || 0,
                    shares: activeCard.assetType === 'STOCK' ? Math.floor(activeCard.downPayment / (activeCard.cost || 1)) : undefined,
                    dividend: activeCard.assetType === 'STOCK' ? activeCard.cashflow : undefined
                  });
                  resolveCard();
                } else {
                  alert('Not enough cash for the down payment!');
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
