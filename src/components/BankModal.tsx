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
        backgroundColor: 'var(--color-bg-card)',
        padding: '2rem',
        borderRadius: '20px',
        width: '400px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 229, 255, 0.05)',
      }}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
          <button 
            style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderBottom: tab === 'LOAN' ? '3px solid var(--color-secondary)' : '3px solid transparent', fontWeight: tab === 'LOAN' ? 800 : 500, color: tab === 'LOAN' ? 'var(--color-secondary)' : 'var(--color-text-muted)' }}
            onClick={() => setTab('LOAN')}
          >
            Bank Loan
          </button>
          <button 
            style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', borderBottom: tab === 'BANKRUPTCY' ? '3px solid var(--color-danger)' : '3px solid transparent', fontWeight: tab === 'BANKRUPTCY' ? 800 : 500, color: tab === 'BANKRUPTCY' ? 'var(--color-danger)' : 'var(--color-text-muted)' }}
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Loan Amount</label>
              <input 
                type="number" 
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                step={1000}
                min={1000}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}
              />
            </div>

            <div style={{ padding: '1.2rem', backgroundColor: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-main)' }}>Cash Received:</span>
                <span style={{ fontWeight: 800, color: 'var(--color-success)' }}>+${loanAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-main)' }}>Monthly Interest:</span>
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
            <h3 style={{ color: 'var(--color-danger)', margin: 0, textShadow: 'var(--shadow-neon-danger)' }}>Declare Bankruptcy</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              If your expenses exceed your income and you cannot pay your debts, you must declare bankruptcy.
            </p>
            <ul style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--color-text-main)', backgroundColor: 'rgba(255, 23, 68, 0.1)', border: '1px solid rgba(255, 23, 68, 0.3)', padding: '1.5rem', borderRadius: '12px' }}>
              <li style={{ marginBottom: '0.8rem' }}>You must sell all assets at 1/2 their original down payment or cost.</li>
              <li style={{ marginBottom: '0.8rem' }}>The bank takes the cash to pay off your debts (Bank Loans first, then others).</li>
              <li>You lose your next 3 turns.</li>
            </ul>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }} onClick={onClose}>Cancel</button>
              <button className="btn btn-pop" style={{ flex: 2, background: 'linear-gradient(135deg, #FF1744, #D50000)', color: '#fff', boxShadow: '0 0 15px rgba(255, 23, 68, 0.5)' }} onClick={handleDeclareBankruptcy}>
                Declare Bankruptcy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
