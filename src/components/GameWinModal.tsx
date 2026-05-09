import { useGameStore } from '../store/gameStore';
import { DREAMS } from '../data/fastTrack';

export const GameWinModal = () => {
  const { winner, players, resetGame } = useGameStore();
  
  if (!winner) return null;

  const winningPlayer = players.find(p => p.id === winner);
  if (!winningPlayer) return null;

  const dream = DREAMS.find(d => d.id === winningPlayer.dreamId);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div className="glass-panel" style={{ width: '500px', maxWidth: '90vw', padding: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Confetti or glow effect background */}
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(232, 62, 140, 0.2) 0%, transparent 70%)', animation: 'spin 10s linear infinite', zIndex: -1 }} />

        <h2 style={{ fontSize: '3rem', color: '#e83e8c', textTransform: 'uppercase', letterSpacing: '4px', textShadow: '0 0 20px rgba(232, 62, 140, 0.5)', marginBottom: '1rem' }}>
          Victory!
        </h2>
        
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '2rem' }}>
          <span style={{ color: winningPlayer.color }}>{winningPlayer.name}</span> has won the game!
        </div>

        {winningPlayer.hasBoughtDream && dream ? (
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
            <h4 style={{ color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Dream Achieved</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{dream.name}</div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{dream.description}</p>
          </div>
        ) : (
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
            <h4 style={{ color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Financial Freedom</h4>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Reached +$50k Fast Track Cashflow</div>
            <p style={{ color: 'var(--color-success)', fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem' }}>
              ${winningPlayer.fastTrackCashflow.toLocaleString()} / month
            </p>
          </div>
        )}

        <button className="btn btn-pop" style={{ width: '100%', padding: '1rem', backgroundColor: '#e83e8c', color: 'white', fontWeight: 800, fontSize: '1.2rem' }} onClick={resetGame}>
          Play Again
        </button>
      </div>
    </div>
  );
};
