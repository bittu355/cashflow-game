import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const BankModal = ({ onClose }: { onClose: () => void }) => {
  const { players, currentPlayerIndex, takeLoan } = useGameStore();
  const player = players[currentPlayerIndex];
  
  const [loanAmount, setLoanAmount] = useState<number>(1000);
  const [tab, setTab] = useState<'LOAN' | 'BANKRUPTCY'>('LOAN');

  const handleTakeLoan = () => {
    if (loanAmount % 1000 !== 0 || loanAmount <= 0) {
      alert("Loans must be in increments of $1,000.");
      return;
    }
    takeLoan(player.id, loanAmount);
    onClose();
  };

  const handleDeclareBankruptcy = () => {
    // Basic bankruptcy logic: sell assets, pay off debts.
    // Full logic would require picking which assets to sell, but for a simple implementation:
    const confirm = window.confirm("Are you sure you want to declare bankruptcy? You will lose all assets and skip 3 turns.");
    if (!confirm) return;

    // Use a custom store action to process bankruptcy (we'll need to add it to gameStore)
    useGameStore.getState().declareBankruptcy(player.id);
    onClose();
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="glass-panel animate-slide-up" style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '16px',
        width: '400px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '1.5rem' }}>
          <button 
            style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderBottom: tab === 'LOAN' ? '3px solid #007bff' : '3px solid transparent', fontWeight: tab === 'LOAN' ? 800 : 500 }}
            onClick={() => setTab('LOAN')}
          >
            Bank Loan
          </button>
          <button 
            style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderBottom: tab === 'BANKRUPTCY' ? '3px solid #dc3545' : '3px solid transparent', fontWeight: tab === 'BANKRUPTCY' ? 800 : 500, color: tab === 'BANKRUPTCY' ? '#dc3545' : 'inherit' }}
            onClick={() => setTab('BANKRUPTCY')}
          >
            Bankruptcy
          </button>
        </div>

        {tab === 'LOAN' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Bank loans must be taken in <strong>$1,000</strong> increments. 
              The interest is 10% per month, meaning every $1,000 adds <strong>$100</strong> to your expenses.
            </p>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Loan Amount</label>
              <input 
                type="number" 
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                step={1000}
                min={1000}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1.2rem' }}
              />
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Cash Received:</span>
                <span style={{ fontWeight: 800, color: 'var(--color-success)' }}>+${loanAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Monthly Interest:</span>
                <span style={{ fontWeight: 800, color: 'var(--color-danger)' }}>-${(loanAmount * 0.1).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button className="btn btn-primary btn-pop" style={{ flex: 2 }} onClick={handleTakeLoan}>Take Loan</button>
            </div>
          </div>
        )}

        {tab === 'BANKRUPTCY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
            <h3 style={{ color: '#dc3545', margin: 0 }}>Declare Bankruptcy</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              If your expenses exceed your income and you cannot pay your debts, you must declare bankruptcy.
            </p>
            <ul style={{ textAlign: 'left', fontSize: '0.85rem', color: '#555', backgroundColor: '#fff5f5', padding: '1rem', borderRadius: '8px' }}>
              <li style={{ marginBottom: '0.5rem' }}>You must sell all assets at 1/2 their original down payment or cost.</li>
              <li style={{ marginBottom: '0.5rem' }}>The bank takes the cash to pay off your debts (Bank Loans first, then others).</li>
              <li>You lose your next 3 turns.</li>
            </ul>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button className="btn btn-pop" style={{ flex: 2, backgroundColor: '#dc3545', color: '#fff' }} onClick={handleDeclareBankruptcy}>
                Declare Bankruptcy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
