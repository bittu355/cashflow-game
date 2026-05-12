import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Asset, Player } from '../types/game';
import { getEventTip } from '../data/tips';
import { hapticFeedback } from '../utils/haptics';
import { gameAudio } from '../utils/audio';

export const CardModal = () => {
  const { activeCard, players, currentPlayerIndex, resolveCard, buyAsset, sellAsset, handleMarketEvent, transferDeal, payCash, myPlayerId } = useGameStore();
  const [sharesToBuy, setSharesToBuy] = useState(10);
  const [showPeerTrade, setShowPeerTrade] = useState(false);
  const [targetPlayerId, setTargetPlayerId] = useState('');
  const [tradeFee, setTradeFee] = useState(0);

  const player = players[currentPlayerIndex];

  if (!activeCard || !player) return null;

  // No-op - removed unused eligibleAssets logic

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

    const playersWithAssets = players.map((p: any) => ({
      player: p,
      assets: p.statement.assets.filter((a: any) => {
        if (!activeCard.assetType) return false;
        
        const titleLower = activeCard.title.toLowerCase();
        const descLower = activeCard.description.toLowerCase();
        const assetNameLower = a.name.toLowerCase();

        // 1. Match by Asset Type
        if (a.type !== activeCard.assetType) return false;

        // 2. Specific matching for Real Estate (Apartments, Plexes, etc.)
        if (a.type === 'REAL_ESTATE') {
           // Match if the card title or description contains the asset name (or vice versa)
           // Example: "Apartment House" matches "12 Unit Apartment"
           const keywords = ['apartment', 'plex', 'condo', 'house', 'mall', 'plex'];
           for (const word of keywords) {
             if (titleLower.includes(word) && assetNameLower.includes(word)) return true;
             if (descLower.includes(word) && assetNameLower.includes(word)) return true;
           }
           return titleLower.includes(assetNameLower) || assetNameLower.includes(titleLower);
        }

        // 3. Specific matching for Stocks
        if (a.type === 'STOCK') {
           // Match symbols (e.g. "MYT")
           const symbolMatch = activeCard.title.match(/\(([A-Z]+)\)/) || activeCard.title.match(/^([A-Z0-9]+)\s/);
           const symbol = symbolMatch ? symbolMatch[1] : activeCard.title.split(' ')[0];
           return assetNameLower.includes(symbol.toLowerCase()) || titleLower.includes(assetNameLower);
        }

        // 4. Default fuzzy match
        return titleLower.includes(assetNameLower) || assetNameLower.includes(titleLower) || descLower.includes(assetNameLower);
      })
    })).filter((entry: any) => entry.assets.length > 0);

    return (
      <div className="market-resolution">
        <label className="pencil-text">Market Opportunity:</label>
        {playersWithAssets.length > 0 ? playersWithAssets.map((entry: any) => (
          <div key={entry.player.id} className="player-market-group">
            <div className="player-name-small" style={{ color: entry.player.color }}>{entry.player.name}'s Assets:</div>
            {entry.assets.map((a: Asset) => {
              const calculatePrice = () => {
                let price = activeCard.cost || 0;
                if (activeCard.description.toLowerCase().includes('per unit')) {
                  const unitMatch = a.name.match(/(\d+)\s*Unit/i);
                  if (unitMatch) price = price * parseInt(unitMatch[1]);
                } else if (activeCard.title.includes('3x')) {
                  price = a.cost * 3;
                } else if (a.type === 'STOCK') {
                  price = price * (a.shares || 0);
                }
                return price;
              };
              const price = calculatePrice();
              const isOwner = myPlayerId === 'LOCAL' || entry.player.id === myPlayerId;

              return (
                <div key={a.id} className="asset-sell-row">
                  <span>{a.name}</span>
                  <button 
                    className="btn btn-success small" 
                    disabled={!isOwner}
                    onClick={() => {
                      sellAsset(entry.player.id, a.id, price);
                    }}
                  >
                    {isOwner ? `Sell for $${price.toLocaleString()}` : 'Owner Action'}
                  </button>
                </div>
              );
            })}
          </div>
        )) : <p className="pencil-text small">No one has matching assets.</p>}
        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={resolveCard}>Done</button>
        <style>{`
          .player-market-group { margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.5rem; }
          .player-name-small { font-size: 0.75rem; font-weight: 800; margin-bottom: 0.3rem; text-transform: uppercase; }
        `}</style>
      </div>
    );
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="card-container glass-panel animate-card-reveal" data-type={activeCard.type}>
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
              <button 
                className="btn btn-secondary flex-1" 
                disabled={activeCard.type === 'DOODAD' && player.statement.cash < (activeCard.cost || 0)}
                onClick={() => {
                  if (activeCard.type === 'DOODAD') {
                    payCash(player.id, activeCard.cost || 0); 
                    hapticFeedback.error();
                    gameAudio.playSFX('sell');
                  } else {
                    hapticFeedback.light();
                  }
                  resolveCard();
                }}
              >
                {activeCard.type === 'DOODAD' ? `Pay $${(activeCard.cost || 0).toLocaleString()}` : 'Pass'}
              </button>
              
              <div className="action-wrapper flex-1">
                {activeCard.type !== 'DOODAD' && (
                  <div className="ghost-impact-preview animate-float">
                    <span className="impact-badge income">+{activeCard.cashflow?.toLocaleString() || 0} Flow</span>
                    <span className="impact-badge cash">-${(activeCard.assetType === 'STOCK' ? activeCard.cost! * sharesToBuy : activeCard.downPayment || activeCard.cost || 0).toLocaleString()}</span>
                  </div>
                )}
                <button 
                  className="btn btn-primary"
                  style={{ width: '100%' }}
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
                      hapticFeedback.success();
                      gameAudio.playSFX('buy');
                      resolveCard();
                    } else {
                      alert('Not enough cash! Borrow from bank.');
                    }
                  }}
                >
                  {activeCard.actionText || 'Confirm Deal'}
                </button>
              </div>
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
                  {players.filter((p: Player) => p.id !== player.id).map((p: Player) => (
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

      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 2000;
        }
        .card-container {
          background: rgba(15, 15, 20, 0.9);
          width: 90%;
          max-width: 400px;
          padding: 2rem;
          border-radius: 32px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
          position: relative;
          overflow: hidden;
        }

        .action-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ghost-impact-preview {
          position: absolute;
          top: -35px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          pointer-events: none;
        }

        .impact-badge {
          font-size: 0.6rem;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 100px;
          text-transform: uppercase;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .impact-badge.income { background: var(--color-success); color: #fff; }
        .impact-badge.cash { background: var(--color-danger); color: #fff; }

        .card-container[data-type="SMALL_DEAL"] { border-top: 12px solid var(--color-success); }
        .card-container[data-type="BIG_DEAL"] { border-top: 12px solid var(--color-primary); }
        .card-container[data-type="MARKET"] { border-top: 12px solid var(--color-blue); }
        .card-container[data-type="DOODAD"] { border-top: 12px solid var(--color-danger); }

        .card-badge { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 3px; color: var(--color-primary); font-weight: 900; margin-bottom: 0.5rem; }
        .card-title { font-size: 1.8rem; line-height: 1.2; margin-bottom: 1rem; color: #fff; font-family: var(--font-heading); }
        .card-description { font-size: 1rem; line-height: 1.6; color: rgba(255,255,255,0.7); margin-bottom: 1.5rem; }
        
        .stat-row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-weight: 800; font-size: 1.1rem; }
        .stat-row.success { color: var(--color-success); }
        
        .stock-buy-input { background: rgba(255,255,255,0.03); padding: 1.2rem; border-radius: 16px; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.05); }
        .stock-buy-input input { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; width: 80px; margin-left: 0.8rem; padding: 0.4rem; border-radius: 8px; font-weight: 800; }
        .total-cost { margin-top: 0.8rem; font-weight: 900; color: var(--color-primary); font-size: 1.2rem; }

        .card-actions { display: flex; gap: 1rem; margin-top: 2rem; }
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
