import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { createMultiplayerGame, joinMultiplayerGame, generateGameId } from '../utils/multiplayer';

export const Lobby = () => {
  const [mode, setMode] = useState<'SELECT' | 'ONLINE'>('SELECT');
  const [joinCode, setJoinCode] = useState('');
  const { addPlayer } = useGameStore();

  const handleStartLocal = () => {
    addPlayer('Player 1', '#FF5A5F', {
      name: 'Engineer',
      salary: 4900,
      taxes: 1050,
      mortgage: 75000,
      mortgagePayment: 700,
      schoolLoan: 12000,
      schoolLoanPayment: 60,
      carLoan: 7000,
      carLoanPayment: 140,
      creditCard: 4000,
      creditCardPayment: 120,
      retailDebt: 1000,
      retailDebtPayment: 50,
      otherExpenses: 1090,
      perChildExpense: 250,
      savings: 400
    });
  };

  const handleCreateOnline = async () => {
    const code = generateGameId();
    // In a real app we'd let them pick their profession
    addPlayer('Host', '#FF5A5F', {
      name: 'Engineer',
      salary: 4900,
      taxes: 1050,
      mortgage: 75000,
      mortgagePayment: 700,
      schoolLoan: 12000,
      schoolLoanPayment: 60,
      carLoan: 7000,
      carLoanPayment: 140,
      creditCard: 4000,
      creditCardPayment: 120,
      retailDebt: 1000,
      retailDebtPayment: 50,
      otherExpenses: 1090,
      perChildExpense: 250,
      savings: 400
    });
    await createMultiplayerGame(code);
    alert(`Game created! Your join code is: ${code}`);
  };

  const handleJoinOnline = () => {
    if (!joinCode) return;
    joinMultiplayerGame(joinCode.toUpperCase());
    
    // Add the joining player to the store locally, the multiplayer util will sync it up to the host
    addPlayer('Guest', '#38A169', {
      name: 'Teacher',
      salary: 3300,
      taxes: 600,
      mortgage: 50000,
      mortgagePayment: 500,
      schoolLoan: 12000,
      schoolLoanPayment: 60,
      carLoan: 5000,
      carLoanPayment: 100,
      creditCard: 3000,
      creditCardPayment: 90,
      retailDebt: 1000,
      retailDebtPayment: 50,
      otherExpenses: 760,
      perChildExpense: 180,
      savings: 400
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '400px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>CASHFLOW</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Escape the Rat Race.</p>

        {mode === 'SELECT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-primary btn-pop" style={{ padding: '1rem' }} onClick={handleStartLocal}>
              Play Local (Pass & Play)
            </button>
            <button className="btn btn-secondary btn-pop" style={{ padding: '1rem' }} onClick={() => setMode('ONLINE')}>
              Play Online (Firebase)
            </button>
          </div>
        )}

        {mode === 'ONLINE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <button className="btn btn-primary btn-pop" style={{ padding: '1rem' }} onClick={handleCreateOnline}>
              Create New Room
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Enter Room Code" 
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', textTransform: 'uppercase' }}
              />
              <button className="btn btn-success btn-pop" onClick={handleJoinOnline}>
                Join
              </button>
            </div>
            
            <button className="btn" style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }} onClick={() => setMode('SELECT')}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
