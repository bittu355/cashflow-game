import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BankModal } from './BankModal';

export const Ledger = () => {
  const { players, currentPlayerIndex, haveChild } = useGameStore();
  const [isBankModalOpen, setBankModalOpen] = useState(false);

  const player = players[currentPlayerIndex];

  if (!player) return <div className="ledger-area glass-panel" style={{ padding: '2rem' }}>No player active.</div>;

  const { statement } = player;

  return (
    <div className="ledger-area glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '1.5rem', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', textShadow: 'var(--shadow-neon-primary)' }}>{player.name}'s Ledger</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>{player.profession?.name}</p>
        
        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn btn-secondary btn-pop" style={{ width: '100%', padding: '0.8rem', fontWeight: 800 }} onClick={() => setBankModalOpen(true)}>
            🏦 Visit Bank (Loans / Bankruptcy)
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', padding: '1.2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Cash</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)', textShadow: 'var(--shadow-neon-success)' }}>${statement.cash.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Payday</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', textShadow: 'var(--shadow-neon-primary)' }}>${statement.monthlyCashFlow.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Income / Expenses Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1.2rem', background: 'rgba(0, 230, 118, 0.05)', borderRadius: '16px', border: '1px solid rgba(0, 230, 118, 0.2)' }}>
          <h4 style={{ color: 'var(--color-success)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Income</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Salary:</span> <span>${statement.salary.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Passive:</span> <span>${statement.passiveIncome.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0, 230, 118, 0.2)' }}>
            <span>Total:</span> <span style={{ color: 'var(--color-success)' }}>${statement.totalIncome.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ padding: '1.2rem', background: 'rgba(255, 23, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(255, 23, 68, 0.2)' }}>
          <h4 style={{ color: 'var(--color-danger)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Expenses</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Taxes:</span> <span>${statement.taxes.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Children ({statement.children}):</span> <span>${statement.childExpenses.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Liabilities:</span> <span>${(statement.totalExpenses - statement.taxes - statement.otherExpenses - statement.childExpenses).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255, 23, 68, 0.2)' }}>
            <span>Total:</span> <span style={{ color: 'var(--color-danger)' }}>${statement.totalExpenses.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Assets & Liabilities Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '0.5rem' }}>
        <div>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--color-secondary)' }}>Liabilities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {statement.liabilities.map(l => (
              <div key={l.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-text-main)' }}>{l.name}</span>
                  <span>${l.amount.toLocaleString()} <span style={{ color: 'var(--color-danger)' }}>(-${l.payment})</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {l.id === 'bank_loan' && player.statement.cash >= 1000 && (
                    <button 
                      className="btn btn-pop" 
                      style={{ backgroundColor: '#17a2b8', color: 'white', padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}
                      onClick={() => useGameStore.getState().payDebt(player.id, l.id, 1000)}
                    >
                      Pay $1k
                    </button>
                  )}
                  {player.statement.cash >= l.amount && (
                    <button 
                      className="btn btn-pop" 
                      style={{ backgroundColor: '#28a745', color: 'white', padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}
                      onClick={() => useGameStore.getState().payDebt(player.id, l.id)}
                    >
                      Pay Off
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--color-success)' }}>Assets</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {statement.assets.length === 0 ? (
               <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '0.5rem 1rem' }}>No assets yet. Time to invest!</p>
            ) : (
              statement.assets.map((a, index) => (
                <div key={`${a.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--color-text-main)' }}>{a.name}</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 800 }}>+${a.cashflow || (a.shares! * a.dividend!) || 0}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Debug / Test Controls */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-bg-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h4 style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Debug Tools</h4>
        <button className="btn btn-primary btn-pop" style={{ padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => useGameStore.getState().payday(player.id)}>
          Simulate Payday
        </button>
        <button className="btn btn-primary btn-pop" style={{ padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => {
          useGameStore.setState(s => ({
            players: s.players.map(p => p.id === player.id ? { ...p, statement: { ...p.statement, cash: p.statement.cash + 50000 } } : p)
          }))
        }}>
          Add $50,000 Cash
        </button>
        <button className="btn btn-success btn-pop" style={{ padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => useGameStore.getState().buyAsset(player.id, { id: 'house1', name: '3Br/2Ba House', type: 'REAL_ESTATE', cost: 50000, downPayment: 5000, cashflow: 250 }, true)}>
          Force Buy 3Br/2Ba (+$250 CF)
        </button>
        <button className="btn btn-primary btn-pop" style={{ padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => haveChild(player.id)}>
          Have Child ({statement.children}/3)
        </button>
        <button className="btn btn-pop" style={{ padding: '0.5rem', fontSize: '0.85rem', backgroundColor: '#dc3545', color: 'white' }} onClick={() => useGameStore.getState().resetGame()}>
          Reset Game
        </button>
      </div>

      {isBankModalOpen && <BankModal onClose={() => setBankModalOpen(false)} />}
    </div>
  );
};
