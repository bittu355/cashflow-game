import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const FinancialControls = () => {
  const { players, currentPlayerIndex, borrowMoney, payLoan } = useGameStore();
  const player = players[currentPlayerIndex];
  const [loanAmount, setLoanAmount] = useState(1000);

  if (!player || player.isBot) return null;

  return (
    <div className="financial-controls glass-panel animate-fade-in">
      <div className="section-header">
        <h3>🏦 Bank & Debt</h3>
        <p className="subtitle">Manage your loans and liabilities</p>
      </div>

      <div className="control-grid">
        {/* Borrowing Section */}
        <div className="control-card">
          <label>Borrow from Bank</label>
          <div className="input-group">
            <input 
              type="number" 
              step="1000" 
              min="1000" 
              value={loanAmount} 
              onChange={e => setLoanAmount(Math.max(1000, Math.floor(+e.target.value / 1000) * 1000))} 
            />
            <button 
              className="btn btn-primary small"
              onClick={() => borrowMoney(player.id, loanAmount)}
            >
              Get Loan
            </button>
          </div>
          <p className="hint">10% interest ($${(loanAmount * 0.1).toLocaleString()}/mo)</p>
        </div>

        {/* Repayment Section */}
        <div className="control-card">
          <label>Pay Off Debt</label>
          <div className="liability-list">
            {player.statement.liabilities.length > 0 ? player.statement.liabilities.map(l => (
              <div key={l.id} className="liability-item">
                <div className="info">
                  <span className="name">{l.name}</span>
                  <span className="cost">${l.amount.toLocaleString()}</span>
                </div>
                <button 
                  className="btn btn-danger small"
                  disabled={player.statement.cash < l.amount}
                  onClick={() => payLoan(player.id, l.id)}
                >
                  Pay
                </button>
              </div>
            )) : <p className="empty">No outstanding debt.</p>}
          </div>
        </div>
      </div>

      <style>{`
        .financial-controls {
          padding: 1.5rem;
          margin-top: 1rem;
          background: rgba(20, 20, 25, 0.6);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .section-header h3 { margin: 0; font-size: 1.2rem; color: #fff; }
        .subtitle { font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 1.5rem; }
        
        .control-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        
        .control-card { background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .control-card label { display: block; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.8rem; color: var(--color-primary); }
        
        .input-group { display: flex; gap: 0.5rem; }
        .input-group input { flex: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 0.5rem; border-radius: 8px; }
        
        .hint { font-size: 0.7rem; color: var(--color-danger); margin-top: 0.5rem; font-weight: 600; }
        
        .liability-list { max-height: 150px; overflow-y: auto; }
        .liability-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 0.4rem; }
        .liability-item .info { display: flex; flex-direction: column; }
        .liability-item .name { font-size: 0.8rem; font-weight: 700; color: #fff; }
        .liability-item .cost { font-size: 0.75rem; color: var(--color-danger); }
        
        .empty { font-size: 0.8rem; color: var(--color-text-muted); font-style: italic; }

        @media (max-width: 768px) {
          .control-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
