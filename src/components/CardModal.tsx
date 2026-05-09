import type { Asset } from '../types/game';
import { getEventTip } from '../data/tips';
import { gameAudio } from '../utils/audio';

export const CardModal = () => {
  const { activeCard, players, currentPlayerIndex, resolveCard, buyAsset, sellAsset, handleMarketEvent, transferDeal } = useGameStore();
  const [sharesToBuy, setSharesToBuy] = useState(10);
  const [showPeerTrade, setShowPeerTrade] = useState(false);
  const [targetPlayerId, setTargetPlayerId] = useState('');
  const [tradeFee, setTradeFee] = useState(0);

  const player = players[currentPlayerIndex];

  if (!activeCard || !player) return null;

  const eligibleAssets = player.statement.assets.filter(a => {
    if (!activeCard.assetType) return false;
    if (activeCard.assetType === 'REAL_ESTATE') {
      // Logic for matching specific RE types (e.g. 3Br/2Ba)
      return a.type === 'REAL_ESTATE' && activeCard.description.includes(a.name.split(' ')[0]); 
    }
    return a.type === activeCard.assetType;
  });

  const handleTrade = () => {
    if (!targetPlayerId) return;
    transferDeal(player.id, targetPlayerId, activeCard, tradeFee);
    resolveCard();
  };

  const renderMarketAction = () => {
    if (activeCard.marketEvent) {
      return (
        <button className="btn btn-primary btn-pop" style={{ width: '100%' }} onClick={() => {
          handleMarketEvent(activeCard.marketEvent);
          resolveCard();
        }}>
          {activeCard.actionText || 'Apply Event'}
        </button>
      );
    }

    // Find ALL players with eligible assets (for Global Market Events)
    const playersWithAssets = players.map(p => ({
      player: p,
      assets: p.statement.assets.filter(a => {
        if (!activeCard.assetType) return false;
        if (activeCard.assetType === 'REAL_ESTATE') {
          return a.type === 'REAL_ESTATE' && activeCard.description.toLowerCase().includes(a.name.split(' ')[0].toLowerCase());
        }
        return a.type === activeCard.assetType && (activeCard.title.includes(a.name) || a.name.includes(activeCard.title.split(' ')[0]));
      })
    })).filter(entry => entry.assets.length > 0);

    return (
      <div className="market-resolution">
        <label className="pencil-text">Market Opportunity:</label>
        {playersWithAssets.length > 0 ? playersWithAssets.map(entry => (
          <div key={entry.player.id} className="player-market-group">
            <div className="player-name-small" style={{ color: entry.player.color }}>{entry.player.name}'s Assets:</div>
            {entry.assets.map(a => (
              <div key={a.id} className="asset-sell-row">
                <span>{a.name}</span>
                <button className="btn btn-success small" onClick={() => {
                  const price = activeCard.title.includes('3x') ? a.cost * 3 : activeCard.cost!;
                  sellAsset(entry.player.id, a.id, price);
                  // Don't resolve card yet, others might want to sell
                }}>
                  Sell for ${ (activeCard.title.includes('3x') ? a.cost * 3 : activeCard.cost!).toLocaleString() }
                </button>
              </div>
            ))}
          </div>
        )) : <p className="pencil-text small">No one has matching assets.</p>}
        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={resolveCard}>Done</button>
        <style jsx>{`
          .player-market-group { margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.5rem; }
          .player-name-small { font-size: 0.75rem; font-weight: 800; margin-bottom: 0.3rem; text-transform: uppercase; }
        `}</style>
      </div>
    );
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="card-container glass-panel animate-slide-up" data-type={activeCard.type}>
        <div className="card-header">
          <div className="card-badge">{activeCard.type.replace('_', ' ')}</div>
          <h2 className="card-title">{activeCard.title}</h2>
        </div>

        <div className="card-content">
          <p className="card-description">{activeCard.description}</p>
          
          {activeCard.cost !== undefined && activeCard.type !== 'MARKET' && (
            <div className="stat-row">
              <span className="label">Cost:</span>
              <span className="value">${activeCard.cost.toLocaleString()}</span>
            </div>
          )}

          {activeCard.assetType === 'STOCK' && activeCard.type !== 'MARKET' && (
             <div className="stock-buy-input">
                <label>Shares to Buy:</label>
                <input type="number" value={sharesToBuy} onChange={e => setSharesToBuy(Math.max(1, +e.target.value))} />
                <div className="total-cost">Total: ${(activeCard.cost! * sharesToBuy).toLocaleString()}</div>
             </div>
          )}

          {activeCard.cashflow !== undefined && activeCard.type !== 'MARKET' && (
            <div className="stat-row success">
              <span className="label">Cashflow:</span>
              <span className="value">+${activeCard.cashflow.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="card-actions">
          {activeCard.type === 'MARKET' ? renderMarketAction() : (
            <>
              <button className="btn btn-secondary flex-1" onClick={resolveCard}>
                {activeCard.type === 'DOODAD' ? 'Pay' : 'Pass'}
              </button>
              
              <button 
                className="btn btn-primary flex-1"
                onClick={() => {
                  const cost = activeCard.assetType === 'STOCK' ? (activeCard.cost! * sharesToBuy) : (activeCard.downPayment || activeCard.cost || 0);
                  if (player.statement.cash >= cost) {
                    buyAsset(player.id, {
                      id: `asset-${Date.now()}`,
                      name: activeCard.assetType === 'STOCK' ? `${activeCard.title.split(':')[1]?.trim() || activeCard.title} (${sharesToBuy})` : activeCard.title,
                      type: activeCard.assetType || 'BUSINESS',
                      cost: activeCard.cost || 0,
                      downPayment: activeCard.downPayment || activeCard.cost || 0,
                      cashflow: activeCard.cashflow || 0,
                      shares: activeCard.assetType === 'STOCK' ? sharesToBuy : undefined,
                      dividend: activeCard.assetType === 'STOCK' ? activeCard.cashflow : undefined
                    });
                    resolveCard();
                  } else {
                    alert('Not enough cash! Borrow from bank.');
                  }
                }}
              >
                {activeCard.actionText || 'Buy'}
              </button>
            </>
          )}
        </div>

        {(activeCard.type === 'SMALL_DEAL' || activeCard.type === 'BIG_DEAL') && (
          <div className="peer-trade-section">
            <button className="btn-link" onClick={() => setShowPeerTrade(!showPeerTrade)}>
              {showPeerTrade ? '✕ Cancel Trade' : '🤝 Sell Deal to Peer'}
            </button>
            {showPeerTrade && (
              <div className="trade-controls animate-fade-in">
                <select value={targetPlayerId} onChange={e => setTargetPlayerId(e.target.value)}>
                  <option value="">Select Player...</option>
                  {players.filter(p => p.id !== player.id).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input type="number" placeholder="Fee ($)" onChange={e => setTradeFee(+e.target.value)} />
                <button className="btn btn-success small" onClick={handleTrade} disabled={!targetPlayerId}>Transfer</button>
                <button 
                  className="btn btn-info small" 
                  onClick={() => {
                    if (!targetPlayerId) return;
                    transferDeal(player.id, targetPlayerId, activeCard, 0, true);
                    resolveCard();
                  }} 
                  disabled={!targetPlayerId}
                >
                  🤝 Partnership (50/50)
                </button>
              </div>
            )}
          </div>
        )}

        <div className="wealth-tip" style={{ 
          marginTop: '1.5rem', 
          padding: '0.8rem', 
          backgroundColor: 'rgba(255,215,0,0.05)', 
          borderRadius: '12px',
          border: '1px solid rgba(255,215,0,0.2)',
          fontSize: '0.8rem',
          color: '#ffd700',
          lineHeight: '1.4'
        }}>
          <span style={{ fontWeight: 800, textTransform: 'uppercase', marginRight: '0.5rem' }}>Wealth Tip:</span>
          {getEventTip(activeCard.type)}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 2000;
        }
        .card-container {
          background: var(--color-bg-card); width: 380px; padding: 2rem; border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
        .card-container[data-type="SMALL_DEAL"] { border-top: 8px solid var(--color-success); }
        .card-container[data-type="BIG_DEAL"] { border-top: 8px solid var(--color-primary); }
        .card-container[data-type="MARKET"] { border-top: 8px solid var(--color-blue); }
        .card-container[data-type="DOODAD"] { border-top: 8px solid var(--color-danger); }

        .card-badge { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; color: var(--color-text-muted); font-weight: 800; }
        .card-title { font-size: 1.6rem; margin-top: 0.2rem; margin-bottom: 1rem; color: var(--color-text-main); }
        .card-description { font-size: 0.95rem; line-height: 1.6; color: var(--color-text-muted); margin-bottom: 1.5rem; }
        
        .stat-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 600; }
        .stat-row.success { color: var(--color-success); }
        
        .stock-buy-input { background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 12px; margin-bottom: 1rem; }
        .stock-buy-input input { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: white; width: 60px; margin-left: 0.5rem; padding: 0.2rem; border-radius: 4px; }
        .total-cost { margin-top: 0.5rem; font-weight: 800; color: var(--color-primary); font-size: 1.1rem; }

        .card-actions { display: flex; gap: 1rem; margin-top: 1rem; }
        .flex-1 { flex: 1; }

        .asset-sell-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 8px; margin-bottom: 0.5rem; font-size: 0.85rem; }
        .eligible-assets { margin-top: 1rem; }
        
        .peer-trade-section { margin-top: 1.5rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem; }
        .btn-link { background: none; border: none; color: var(--color-secondary); text-decoration: underline; cursor: pointer; font-size: 0.85rem; }
        .trade-controls { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
        .trade-controls select, .trade-controls input { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.5rem; border-radius: 8px; }
      `}</style>
    </div>
  );
};
