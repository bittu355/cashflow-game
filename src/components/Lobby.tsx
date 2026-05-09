import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { createMultiplayerGame, joinMultiplayerGame, generateGameId } from '../utils/multiplayer';
import { PROFESSIONS } from '../data/professions';

export const Lobby = () => {
  const [mode, setMode] = useState<'SELECT' | 'ONLINE'>('SELECT');
  const [joinCode, setJoinCode] = useState('');
  const [selectedProfIndex, setSelectedProfIndex] = useState(0);
  const { addPlayer } = useGameStore();

  const currentProf = PROFESSIONS[selectedProfIndex];

  const handleStartLocal = () => {
    addPlayer('Player 1', '#FF5A5F', currentProf);
  };

  const handleCreateOnline = async () => {
    const code = generateGameId();
    addPlayer('Host', '#FF5A5F', currentProf);
    await createMultiplayerGame(code);
    alert(`Game created! Your join code is: ${code}`);
  };

  const handleJoinOnline = () => {
    if (!joinCode) return;
    joinMultiplayerGame(joinCode.toUpperCase());
    
    // Add the joining player to the store locally, the multiplayer util will sync it up to the host
    addPlayer('Guest', '#38A169', currentProf);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-main)' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '450px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>CASHFLOW</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Escape the Rat Race.</p>

        <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--color-text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>Choose Profession</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button 
              className="btn btn-pop" 
              style={{ backgroundColor: 'white', color: 'var(--color-primary)', borderRadius: '50%', width: '40px', height: '40px', padding: 0, boxShadow: 'var(--shadow-sm)' }}
              onClick={() => setSelectedProfIndex(prev => prev > 0 ? prev - 1 : PROFESSIONS.length - 1)}
            >
              ◀
            </button>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--color-secondary)' }}>{currentProf.name}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Salary:<br/><span style={{color: 'var(--color-success)', fontWeight: 600}}>${currentProf.salary}</span></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Savings:<br/><span style={{color: 'var(--color-text-main)', fontWeight: 600}}>${currentProf.savings}</span></div>
              </div>
            </div>
            <button 
              className="btn btn-pop" 
              style={{ backgroundColor: 'white', color: 'var(--color-primary)', borderRadius: '50%', width: '40px', height: '40px', padding: 0, boxShadow: 'var(--shadow-sm)' }}
              onClick={() => setSelectedProfIndex(prev => (prev + 1) % PROFESSIONS.length)}
            >
              ▶
            </button>
          </div>
        </div>

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
                style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid #e2e8f0', textTransform: 'uppercase', outline: 'none', fontFamily: 'var(--font-body)' }}
              />
              <button className="btn btn-success btn-pop" onClick={handleJoinOnline}>
                Join
              </button>
            </div>
            
            <button className="btn" style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', backgroundColor: 'transparent' }} onClick={() => setMode('SELECT')}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
