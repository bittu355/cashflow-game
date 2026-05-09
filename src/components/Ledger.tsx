import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BankModal } from './BankModal';
import { DREAMS } from '../data/fastTrack';
import { AuditLog } from './AuditLog';
import { FinancialControls } from './FinancialControls';

export const Ledger = () => {
  const { players, currentPlayerIndex, haveChild, enterFastTrack, resetGame, myPlayerId } = useGameStore();
  const isMyTurn = myPlayerId === 'LOCAL' || players[currentPlayerIndex]?.id === myPlayerId;
  const [isBankModalOpen, setBankModalOpen] = useState(false);

  const player = players[currentPlayerIndex];

  if (!player) return <div className="ledger-area glass-panel" style={{ padding: '2rem' }}>No player active.</div>;

  const { statement } = player;
  const canEscapeRatRace = player.phase === 'RAT_RACE' && statement.passiveIncome >= statement.totalExpenses;

  // Group Assets by Type
  const realEstate = statement.assets.filter(a => a.type === 'REAL_ESTATE');
  const stocks = statement.assets.filter(a => a.type === 'STOCK');
  const businesses = statement.assets.filter(a => a.type === 'BUSINESS');

  const renderRatRaceLedger = () => (
    <div className="ledger-grid">
      {/* 1. INCOME */}
      <div className="quadrant income-quad">
        <h3 className="pencil-text section-title">Income</h3>
        <div className="ledger-row"><span>Salary</span> <span className="value">${statement.salary.toLocaleString()}</span></div>
        <div className="ledger-row divider"><span>Passive Income</span> <span className="value">${statement.passiveIncome.toLocaleString()}</span></div>
        <div className="ledger-row total"><span>Total Income</span> <span className="value">${statement.totalIncome.toLocaleString()}</span></div>
      </div>

      {/* 2. EXPENSES */}
      <div className="quadrant expense-quad">
        <h3 className="pencil-text section-title">Expenses</h3>
        <div className="ledger-row"><span>Taxes</span> <span className="value">${statement.taxes.toLocaleString()}</span></div>
        <div className="ledger-row"><span>Other Expenses</span> <span className="value">${statement.otherExpenses.toLocaleString()}</span></div>
        <div className="ledger-row"><span>Children ({statement.children})</span> <span className="value">${statement.childExpenses.toLocaleString()}</span></div>
        <div className="ledger-row divider"><span>Liabilities Pmt</span> <span className="value">${(statement.totalExpenses - statement.taxes - statement.otherExpenses - statement.childExpenses).toLocaleString()}</span></div>
        <div className="ledger-row total"><span>Total Expenses</span> <span className="value danger">${statement.totalExpenses.toLocaleString()}</span></div>
      </div>

      {/* 3. ASSETS */}
      <div className="quadrant asset-quad">
        <h3 className="pencil-text section-title">Assets</h3>
        {realEstate.length > 0 && <div className="asset-group">
          <label>Real Estate</label>
          {realEstate.map((a, i) => <div key={i} className="ledger-row small"><span>{a.name}</span> <span>+${a.cashflow}</span></div>)}
        </div>}
        {stocks.length > 0 && <div className="asset-group">
          <label>Stocks/Mutual Funds</label>
          {stocks.map((a, i) => <div key={i} className="ledger-row small"><span>{a.name} ({a.shares})</span> <span>+${(a.cashflow).toLocaleString()}</span></div>)}
        </div>}
        {businesses.length > 0 && <div className="asset-group">
          <label>Businesses</label>
          {businesses.map((a, i) => <div key={i} className="ledger-row small"><span>{a.name}</span> <span>+${a.cashflow}</span></div>)}
        </div>}
        {statement.assets.length === 0 && <p className="pencil-text empty-msg">No assets yet...</p>}
      </div>

      {/* 4. LIABILITIES */}
      <div className="quadrant liability-quad">
        <h3 className="pencil-text section-title">Liabilities</h3>
        <div className="liability-list">
          {statement.liabilities.map(l => (
            <div key={l.id} className="liability-item">
              <div className="ledger-row small">
                <span>{l.name}</span>
                <span>${l.amount.toLocaleString()}</span>
              </div>
              <div className="item-actions">
                {statement.cash >= l.amount && (
                  <button className="btn-pay-small" onClick={() => useGameStore.getState().payLoan(player.id, l.id)}>Pay Off</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ledger-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 1.5rem;
          margin-top: 1rem;
        }
        @media (max-width: 600px) {
          .ledger-grid { grid-template-columns: 1fr; }
        }
        .quadrant {
          padding: 1rem;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .section-title {
          font-size: 1.2rem;
          color: var(--color-primary);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          margin-bottom: 0.8rem;
          padding-bottom: 0.2rem;
        }
        .ledger-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          margin-bottom: 0.4rem;
        }
        .ledger-row.small { font-size: 0.8rem; opacity: 0.8; }
        .ledger-row.divider { border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 0.8rem; padding-top: 0.8rem; }
        .ledger-row.total { font-weight: 800; font-size: 1rem; }
        .value { color: var(--color-text-main); }
        .value.danger { color: var(--color-danger); }
        .asset-group label { display: block; font-size: 0.7rem; text-transform: uppercase; color: var(--color-text-muted); margin-top: 0.8rem; }
        .empty-msg { font-size: 0.8rem; opacity: 0.5; text-align: center; padding: 1rem; }
        .liability-item { background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 8px; margin-bottom: 0.5rem; }
        .item-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.2rem; }
        .btn-pay-small { 
          background: var(--color-danger) !important; 
          color: white !important; 
          border: none; 
          padding: 0.3rem 0.6rem; 
          font-size: 0.7rem; 
          border-radius: 6px; 
          cursor: pointer; 
          font-weight: 800;
          transition: transform 0.1s;
        }
        .btn-pay-small:hover { transform: scale(1.05); filter: brightness(1.2); }
      `}</style>
    </div>
  );

  const renderFastTrackLedger = () => {
    const dream = DREAMS.find(d => d.id === player.dreamId);
    return (
      <div className="fast-track-ledger">
        <div className="target-card glass-panel">
          <h3 className="pencil-text">Fast Track Target</h3>
          <div className="big-value">${player.fastTrackTarget.toLocaleString()}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(100, ((statement.fastTrackStartingIncome! + player.fastTrackCashflow) / player.fastTrackTarget) * 100)}%` }} />
          </div>
          <p className="pencil-text">Current: ${(statement.fastTrackStartingIncome! + player.fastTrackCashflow).toLocaleString()}</p>
        </div>

        {dream && (
          <div className="dream-card quadrant" style={{ marginTop: '1.5rem' }}>
            <h3 className="pencil-text" style={{color: '#e83e8c'}}>Your Dream</h3>
            <div style={{fontSize: '1.2rem', fontWeight: 800}}>{dream.name}</div>
            <p className="pencil-text" style={{fontSize: '0.9rem'}}>{dream.description}</p>
            <div className="cost">Cost: ${(dream.cost/1000)}k</div>
          </div>
        )}

        {player.fastTrackBusinesses.length > 0 && (
          <div className="portfolio-card glass-panel" style={{ marginTop: '1.5rem', textAlign: 'left' }}>
            <h3 className="pencil-text" style={{ fontSize: '0.9rem', opacity: 0.7 }}>Business Portfolio</h3>
            <div className="portfolio-list">
              {player.fastTrackBusinesses.map((b, i) => (
                <div key={i} className="portfolio-item">
                  <span>{b.name}</span>
                  <span className="success">+${b.cashflow.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <style>{`
          .fast-track-ledger { display: flex; flexDirection: column; gap: 1rem; }
          .target-card { padding: 1.5rem; text-align: center; }
          .big-value { font-size: 2.5rem; font-weight: 800; color: var(--color-primary); }
          .progress-bar { background: rgba(0,0,0,0.3); height: 12px; border-radius: 6px; margin: 1rem 0; overflow: hidden; }
          .progress-fill { background: var(--color-primary); height: 100%; transition: width 0.5s ease; }
          .dream-card .cost { font-weight: 800; color: #e83e8c; margin-top: 0.5rem; }
          .portfolio-item { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .portfolio-item .success { color: var(--color-success); font-weight: 800; }
        `}</style>
      </div>
    );
  };

  return (
    <div className={`ledger-area glass-panel animate-slide-up ${isMyTurn ? 'turn-pulse' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '1.5rem', gap: '1.5rem' }}>
      
      <div className="ledger-header">
        <div className="header-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div className="avatar-circle" style={{ backgroundColor: player.color }}>
               {player.profession?.name.includes('Doctor') ? '🩺' : 
                player.profession?.name.includes('Lawyer') ? '⚖️' : 
                player.profession?.name.includes('Teacher') ? '📚' : 
                player.profession?.name.includes('Janitor') ? '🧹' : 
                player.profession?.name.includes('Pilot') ? '✈️' : 
                player.profession?.name.includes('Manager') ? '💼' : '👤'}
            </div>
            <div>
              <h2 style={{ margin: 0, color: player.phase === 'FAST_TRACK' ? '#e83e8c' : 'var(--color-primary)' }}>
                {player.name} {player.phase === 'FAST_TRACK' && '🚀'}
              </h2>
              <span className="pencil-text" style={{ fontSize: '0.8rem' }}>{player.profession?.name}</span>
            </div>
          </div>
        </div>

        <div className="cash-summary">
          <div className="summary-item">
            <label className="pencil-text">Cash</label>
            <div className="value success">${statement.cash.toLocaleString()}</div>
          </div>
          <div className="summary-item right">
            <label className="pencil-text">{player.phase === 'FAST_TRACK' ? 'Cashflow Day' : 'Payday'}</label>
            <div className="value">${(player.phase === 'FAST_TRACK' ? (statement.fastTrackStartingIncome! + player.fastTrackCashflow) : statement.monthlyCashFlow).toLocaleString()}</div>
          </div>
        </div>

        <div className="wealth-meter-container">
          <div className="pencil-text label">Wealth Progress (Passive Income vs Expenses)</div>
          <div className="wealth-track">
            <div 
              className="wealth-progress" 
              style={{ 
                width: `${Math.min(100, (statement.passiveIncome / statement.totalExpenses) * 100)}%`,
                backgroundColor: statement.passiveIncome >= statement.totalExpenses ? 'var(--color-success)' : 'var(--color-primary)'
              }} 
            />
          </div>
          <div className="wealth-stats">
            <span>${statement.passiveIncome.toLocaleString()}</span>
            <span>/</span>
            <span>${statement.totalExpenses.toLocaleString()}</span>
          </div>
        </div>

        {canEscapeRatRace && (
          <button className="btn btn-primary btn-pop escape-btn" onClick={() => enterFastTrack(player.id)}>
            🚀 ESCAPE THE RAT RACE!
          </button>
        )}

        <div className="header-actions">
           <button className="btn btn-secondary small" onClick={() => setBankModalOpen(true)}>🏦 Bank</button>
           <button className="btn btn-secondary small" onClick={() => haveChild(player.id)}>👶 +1 Child ({statement.children}/3)</button>
        </div>
      </div>

      {player.phase === 'RAT_RACE' ? renderRatRaceLedger() : renderFastTrackLedger()}

      {/* Financial Actions (Borrowing/Repayment) */}
      <FinancialControls />

      {/* Footer / Debug */}
      <div className="ledger-footer">
        <button className="reset-link" onClick={resetGame}>Reset Game Data</button>
      </div>

      {/* Audit Log / History */}
      <AuditLog />

      {isBankModalOpen && <BankModal onClose={() => setBankModalOpen(false)} />}

      <style>{`
        .ledger-header { border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem; }
        .header-top { display: flex; justify-content: space-between; align-items: baseline; }
        .cash-summary { display: flex; justify-content: space-between; margin-top: 1rem; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 16px; }
        .summary-item label { font-size: 0.8rem; display: block; }
        .summary-item .value { font-size: 1.5rem; font-weight: 800; }
        .value.success { color: var(--color-success); }
        .escape-btn { width: 100%; margin-top: 1rem; font-size: 1.1rem; }
        .wealth-meter-container { margin-top: 1rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 12px; }
        .wealth-meter-container .label { font-size: 0.7rem; margin-bottom: 0.5rem; text-align: center; }
        .wealth-track { background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
        .wealth-progress { height: 100%; transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .wealth-stats { display: flex; justify-content: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 800; opacity: 0.8; }
        .avatar-circle { width: 44px; height: 44px; border-radius: 50%; display: flex; alignItems: center; justifyContent: center; font-size: 1.5rem; border: 2px solid rgba(255,255,255,0.2); box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .header-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
        .btn.small { padding: 0.4rem 0.8rem; font-size: 0.75rem; border-radius: 8px; flex: 1; }
        .ledger-footer { margin-top: auto; padding-top: 1rem; opacity: 0.3; text-align: center; }
        .reset-link { background: none; border: none; color: white; cursor: pointer; font-size: 0.7rem; text-decoration: underline; }
      `}</style>
    </div>
  );
};
