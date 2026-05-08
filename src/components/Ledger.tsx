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
      <div style={{ borderBottom: '2px solid var(--color-bg-main)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>{player.name}'s Ledger</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Profession: {player.profession?.name}</p>
        
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-secondary btn-pop" style={{ width: '100%', padding: '0.75rem', fontWeight: 600, border: '1px solid #ccc' }} onClick={() => setBankModalOpen(true)}>
            🏦 Visit Bank (Loans / Bankruptcy)
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '1rem', background: 'var(--color-bg-main)', borderRadius: '8px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Cash</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)' }}>${statement.cash.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Payday (Cash Flow)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>${statement.monthlyCashFlow.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Income / Expenses Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e6ffed', borderRadius: '8px', border: '1px solid #b7ebc5' }}>
          <h4 style={{ color: '#1e7e34', marginBottom: '0.5rem' }}>Income</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Salary:</span> <span>${statement.salary.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Passive:</span> <span>${statement.passiveIncome.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #b7ebc5' }}>
            <span>Total:</span> <span>${statement.totalIncome.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ padding: '1rem', background: '#ffe6e6', borderRadius: '8px', border: '1px solid #ffb3b3' }}>
          <h4 style={{ color: '#d73a49', marginBottom: '0.5rem' }}>Expenses</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Taxes:</span> <span>${statement.taxes.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Liabilities:</span> <span>${(statement.totalExpenses - statement.taxes - statement.otherExpenses - statement.childExpenses).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #ffb3b3' }}>
            <span>Total:</span> <span>${statement.totalExpenses.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Assets & Liabilities Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h3 style={{ borderBottom: '2px solid var(--color-bg-main)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Liabilities</h3>
          {statement.liabilities.map(l => (
            <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>{l.name}</span>
              <span>${l.amount.toLocaleString()} <span style={{ color: 'var(--color-danger)' }}>(-${l.payment})</span></span>
            </div>
          ))}
        </div>

        <div>
          <h3 style={{ borderBottom: '2px solid var(--color-bg-main)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Assets</h3>
          {statement.assets.length === 0 ? (
             <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No assets yet.</p>
          ) : (
            statement.assets.map((a, index) => (
              <div key={`${a.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>{a.name}</span>
                <span style={{ color: 'var(--color-success)' }}>+${a.cashflow || (a.shares! * a.dividend!) || 0}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Debug / Test Controls */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-bg-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h4 style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Debug Tools</h4>
        <button className="btn btn-primary btn-pop" style={{ padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => useGameStore.getState().payday(player.id)}>
          Simulate Payday
        </button>
        <button className="btn btn-success btn-pop" style={{ padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => useGameStore.getState().buyAsset(player.id, { id: 'house1', name: '3Br/2Ba House', type: 'REAL_ESTATE', cost: 50000, downPayment: 5000, cashflow: 250 })}>
          Buy 3Br/2Ba (+$250 CF)
        </button>
        <button className="btn btn-primary btn-pop" style={{ padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => useGameStore.getState().sellAsset(player.id, 'house1', 65000)}>
          Sell 3Br/2Ba (Market Boom)
        </button>
        <button className="btn btn-primary btn-pop" style={{ padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => useGameStore.getState().payDebt(player.id, 'school')}>
          Pay School Loan
        </button>
        <button className="btn btn-primary btn-pop" style={{ padding: '0.5rem', fontSize: '0.85rem' }} onClick={() => haveChild(player.id)}>
          Have Child ({statement.children}/3)
        </button>
      </div>

      {isBankModalOpen && <BankModal onClose={() => setBankModalOpen(false)} />}
    </div>
  );
};
