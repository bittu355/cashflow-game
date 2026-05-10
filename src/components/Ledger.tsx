import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BankModal } from './BankModal';
import { DREAMS } from '../data/fastTrack';
import { AuditLog } from './AuditLog';
import { FinancialControls } from './FinancialControls';

export const Ledger = () => {
  const { players, currentPlayerIndex, haveChild, enterFastTrack, resetGame, myPlayerId } = useGameStore();
  const player = players[currentPlayerIndex];
  const isMyTurn = myPlayerId === 'LOCAL' || player?.id === myPlayerId;
  const [isBankModalOpen, setBankModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'STATEMENT' | 'ASSETS' | 'LOG'>('STATEMENT');

  if (!player) return <div className="ledger-area glass-panel" style={{ padding: '2rem' }}>No player active.</div>;

  const { statement } = player;
  const canEscapeRatRace = player.phase === 'RAT_RACE' && (statement.passiveIncome || 0) >= (statement.totalExpenses || 1);
  const passiveProgress = statement.totalExpenses > 0 
    ? Math.min(100, ((statement.passiveIncome || 0) / (statement.totalExpenses || 1)) * 100)
    : 0;

  // Group Assets by Type
  const realEstate = statement.assets.filter(a => a.type === 'REAL_ESTATE');
  const stocks = statement.assets.filter(a => a.type === 'STOCK');
  const businesses = statement.assets.filter(a => a.type === 'BUSINESS');


  const renderFastTrackLedger = () => {
    const dream = DREAMS.find(d => d.id === player.dreamId);
    return (
      <div className="fast-track-ledger">
        <div className="target-card glass-panel">
          <h3 className="section-title" style={{ textAlign: 'center' }}>Fast Track Target</h3>
          <div className="big-value">${player.fastTrackTarget.toLocaleString()}</div>
          <div className="wealth-track" style={{ height: '12px', margin: '1rem 0' }}>
            <div className="wealth-progress" style={{ width: `${Math.min(100, (((statement.fastTrackStartingIncome || 0) + (player.fastTrackCashflow || 0)) / (player.fastTrackTarget || 1)) * 100)}%` }} />
          </div>
          <p className="small-text" style={{ textAlign: 'center', opacity: 0.7 }}>Current Flow: ${(statement.fastTrackStartingIncome! + player.fastTrackCashflow).toLocaleString()}</p>
        </div>

        {dream && (
          <div className="dream-card quadrant" style={{ marginTop: '1.5rem', border: '1px solid rgba(232, 62, 140, 0.3)' }}>
            <h3 className="section-title" style={{color: '#e83e8c'}}>Target Dream</h3>
            <div style={{fontSize: '1.2rem', fontWeight: 800}}>{dream.name}</div>
            <p style={{fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem'}}>{dream.description}</p>
            <div style={{ fontWeight: 800, color: '#e83e8c', marginTop: '0.8rem' }}>Cost: ${(dream.cost/1000)}k</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`ledger-area glass-panel ${isMobileOpen ? 'expanded' : ''} ${isMyTurn ? 'my-turn-glow' : ''}`}>
      <div className="mobile-handle" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        <div className="handle-bar" />
        <span className="handle-label">{isMobileOpen ? 'TAP TO CLOSE' : 'TAP FOR FINANCIALS'}</span>
      </div>
      
      <div className="ledger-content-inner">
        <div className="ledger-header">
          <div className="header-top">
            <div className="player-brand">
              <div className="avatar-circle" style={{ backgroundColor: player.color, boxShadow: `0 0 15px ${player.color}44` }}>
                {player.profession?.name.includes('Doctor') ? '🩺' : 
                  player.profession?.name.includes('Lawyer') ? '⚖️' : 
                  player.profession?.name.includes('Teacher') ? '📚' : 
                  player.profession?.name.includes('Janitor') ? '🧹' : 
                  player.profession?.name.includes('Pilot') ? '✈️' : 
                  player.profession?.name.includes('Manager') ? '💼' : '👤'}
              </div>
              <div className="player-info">
                <h2 className="player-name-text" style={{ color: player.phase === 'FAST_TRACK' ? '#e83e8c' : 'var(--color-primary)' }}>
                  {player.name} {player.phase === 'FAST_TRACK' && '🚀'}
                </h2>
                <span className="profession-badge">{player.profession?.name}</span>
              </div>
            </div>
          </div>

          <div className="cash-summary">
            <div className="summary-item">
              <label>CASH ON HAND</label>
              <div className="cash-value">${statement.cash.toLocaleString()}</div>
            </div>
            <div className="summary-item right">
              <label>{player.phase === 'FAST_TRACK' ? 'MONTHLY FLOW' : 'MONTHLY CASHFLOW'}</label>
              <div className="cash-value payday-val">
                ${(player.phase === 'FAST_TRACK' 
                  ? ((statement.fastTrackStartingIncome || 0) + (player.fastTrackCashflow || 0)) 
                  : (statement.monthlyCashFlow || 0)
                ).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="wealth-meter-box">
            <div className="wealth-meter-header">
              <span className="label">Wealth Progress</span>
              <span className="percentage">{Math.round((statement.passiveIncome / Math.max(1, statement.totalExpenses)) * 100)}%</span>
            </div>
            <div className="wealth-track">
              <div 
                className="wealth-progress" 
                style={{ 
                  width: `${passiveProgress}%`,
                  backgroundColor: (statement.passiveIncome || 0) >= (statement.totalExpenses || 1) ? 'var(--color-success)' : 'var(--color-primary)'
                }} 
              />
            </div>
            <div className="wealth-stats">
              <span>Passive: ${statement.passiveIncome.toLocaleString()}</span>
              <span>Exp: ${statement.totalExpenses.toLocaleString()}</span>
            </div>
          </div>

          {canEscapeRatRace && (
            <button className="btn btn-primary btn-pop escape-btn animate-pulse" onClick={() => enterFastTrack(player.id)}>
              🚀 ESCAPE THE RAT RACE!
            </button>
          )}

          <div className="header-actions">
            <button className="btn btn-secondary small" onClick={() => setBankModalOpen(true)}>🏦 Bank</button>
            <button className="btn btn-secondary small" onClick={() => haveChild(player.id)}>👶 +1 Child ({statement.children}/3)</button>
          </div>
        </div>

        <div className="ledger-tabs">
          <button className={`tab-btn ${activeTab === 'STATEMENT' ? 'active' : ''}`} onClick={() => setActiveTab('STATEMENT')}>STATEMENT</button>
          <button className={`tab-btn ${activeTab === 'ASSETS' ? 'active' : ''}`} onClick={() => setActiveTab('ASSETS')}>ASSETS</button>
          <button className={`tab-btn ${activeTab === 'LOG' ? 'active' : ''}`} onClick={() => setActiveTab('LOG')}>HISTORY</button>
        </div>

        <div className="ledger-scroll-area">
          {activeTab === 'STATEMENT' && (
            <div className="tab-pane animate-fade-in">
              {player.phase === 'RAT_RACE' ? (
                <div className="quadrants-grid">
                  <div className="quadrant income-quad">
                    <h3 className="section-title">Income</h3>
                    <div className="ledger-row"><span>Salary</span> <span className="value">${statement.salary.toLocaleString()}</span></div>
                    <div className="ledger-row divider"><span>Passive Income</span> <span className="value">${statement.passiveIncome.toLocaleString()}</span></div>
                    <div className="ledger-row total"><span>Total Income</span> <span className="value">${statement.totalIncome.toLocaleString()}</span></div>
                  </div>
                  <div className="quadrant expense-quad">
                    <h3 className="section-title">Expenses</h3>
                    <div className="ledger-row"><span>Taxes</span> <span className="value">${statement.taxes.toLocaleString()}</span></div>
                    <div className="ledger-row"><span>Other</span> <span className="value">${statement.otherExpenses.toLocaleString()}</span></div>
                    <div className="ledger-row"><span>Children ({statement.children})</span> <span className="value">${statement.childExpenses.toLocaleString()}</span></div>
                    <div className="ledger-row total"><span>Total Expenses</span> <span className="value danger">${statement.totalExpenses.toLocaleString()}</span></div>
                  </div>
                  <div className="quadrant liability-quad">
                    <h3 className="section-title">Liabilities</h3>
                    <div className="liability-list">
                      {statement.liabilities.map(l => (
                        <div key={l.id} className="liability-item">
                          <div className="ledger-row small">
                            <span>{l.name}</span>
                            <span>${l.amount.toLocaleString()}</span>
                          </div>
                          {isMyTurn && !player.isBot && statement.cash >= l.amount && (
                            <button className="btn-pay-small" onClick={() => useGameStore.getState().payLoan(player.id, l.id)}>Pay Off</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : renderFastTrackLedger()}
            </div>
          )}

          {activeTab === 'ASSETS' && (
            <div className="tab-pane animate-fade-in">
              <div className="quadrant asset-quad full-width">
                <h3 className="section-title">Investment Portfolio</h3>
                {realEstate.length > 0 && <div className="asset-group">
                  <label>Real Estate</label>
                  {realEstate.map((a, i) => <div key={i} className="ledger-row asset-card">
                    <div className="asset-info">
                      <span className="asset-name">{a.name}</span>
                      <span className="asset-details">Cost: ${a.cost.toLocaleString()} | DP: ${a.downPayment.toLocaleString()}</span>
                    </div>
                    <span className="asset-flow success">+${a.cashflow.toLocaleString()}</span>
                  </div>)}
                </div>}
                {stocks.length > 0 && <div className="asset-group">
                  <label>Stocks & Funds</label>
                  {stocks.map((a, i) => <div key={i} className="ledger-row asset-card">
                    <div className="asset-info">
                      <span className="asset-name">{a.name} ({a.shares})</span>
                      <span className="asset-details">Avg Cost: ${a.cost.toLocaleString()}</span>
                    </div>
                    <span className="asset-flow success">+${(a.cashflow).toLocaleString()}</span>
                  </div>)}
                </div>}
                {businesses.length > 0 && <div className="asset-group">
                  <label>Businesses</label>
                  {businesses.map((a, i) => <div key={i} className="ledger-row asset-card">
                    <div className="asset-info">
                      <span className="asset-name">{a.name}</span>
                    </div>
                    <span className="asset-flow success">+${a.cashflow.toLocaleString()}</span>
                  </div>)}
                </div>}
                {statement.assets.length === 0 && <p className="empty-msg">No assets yet. Time to look for deals!</p>}
              </div>
              <FinancialControls />
            </div>
          )}

          {activeTab === 'LOG' && (
            <div className="tab-pane animate-fade-in">
              <AuditLog />
            </div>
          )}
        </div>

        <div className="ledger-footer">
          <button className="reset-link" onClick={resetGame}>Exit to Lobby</button>
        </div>
      </div>

      {isBankModalOpen && <BankModal onClose={() => setBankModalOpen(false)} />}

      <style>{`
        .ledger-area {
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
        }

        .ledger-area.expanded {
          transform: translateY(0) !important;
          z-index: 1000;
        }

        .ledger-handle-wrapper {
          width: 100%;
          height: 30px;
          display: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .ledger-handle {
          width: 40px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .ledger-content-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem;
          gap: 1.5rem;
          overflow: hidden;
        }

        .ledger-scroll-area {
          flex: 1;
          overflow-y: auto;
          padding-right: 5px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .player-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .player-info h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .profession-badge {
          font-size: 0.75rem;
          opacity: 0.6;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cash-summary {
          display: flex;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.03);
          padding: 1.2rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .summary-item label {
          font-size: 0.65rem;
          font-weight: 800;
          opacity: 0.5;
          display: block;
          margin-bottom: 0.2rem;
        }

        .cash-value {
          font-size: 1.6rem;
          font-weight: 900;
          font-family: var(--font-heading);
        }

        .payday-val { color: var(--color-primary); }

        .wealth-meter-box {
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem;
          border-radius: 16px;
        }

        .wealth-meter-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.6rem;
          font-size: 0.75rem;
          font-weight: 800;
        }

        .wealth-track {
          background: rgba(255, 255, 255, 0.05);
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
        }

        .wealth-progress {
          height: 100%;
          transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .wealth-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          margin-top: 0.4rem;
          opacity: 0.6;
          font-weight: 600;
        }

        .escape-btn {
          padding: 1rem;
          font-size: 1rem;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
        }

        .section-title {
          font-size: 1rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--color-primary);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .ledger-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          padding: 0.3rem 0;
        }

        .ledger-row.total {
          font-weight: 800;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 0.5rem;
          padding-top: 0.5rem;
        }

        .header-actions {
          display: flex;
          gap: 0.6rem;
        }

        .my-turn-glow {
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.05);
        }

        @media (max-width: 1100px) {
          .ledger-handle-wrapper { display: flex; }
          .ledger-content-inner { padding: 1rem 1.5rem 2rem; }
        }

        @keyframes pulse-soft {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        .animate-pulse {
          animation: pulse-soft 2s infinite;
        }

        .ledger-tabs {
          display: flex;
          background: rgba(0,0,0,0.3);
          padding: 4px;
          border-radius: 12px;
          gap: 4px;
        }

        .tab-btn {
          flex: 1;
          padding: 0.6rem;
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: var(--color-primary);
          color: #000;
        }

        .asset-card {
          background: rgba(255,255,255,0.03);
          padding: 0.8rem;
          border-radius: 12px;
          margin-bottom: 0.5rem;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .asset-info { display: flex; flex-direction: column; gap: 2px; }
        .asset-name { font-weight: 800; font-size: 0.9rem; }
        .asset-details { font-size: 0.65rem; opacity: 0.5; }
        .asset-flow { font-weight: 900; font-family: var(--font-heading); }

        .full-width { width: 100%; border: none !important; padding: 0 !important; }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
