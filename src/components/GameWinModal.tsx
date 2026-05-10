import { useGameStore } from '../store/gameStore';
import { DREAMS } from '../data/fastTrack';

export const GameWinModal = () => {
  const { winner, players, resetGame } = useGameStore();
  
  if (!winner) return null;

  const winningPlayer = players.find(p => p.id === winner);
  if (!winningPlayer) return null;

  const dream = DREAMS.find(d => d.id === winningPlayer.dreamId);

  return (
    <div className="victory-overlay">
      <div className="victory-container glass-panel animate-pop-in">
        <div className="victory-glow" />
        
        <div className="trophy-icon">🏆</div>
        <h2 className="victory-title">Victory!</h2>
        
        <div className="winner-announcement">
          <span className="winner-name" style={{ color: winningPlayer.color }}>{winningPlayer.name}</span>
          <p className="victory-sub">has achieved financial independence!</p>
        </div>

        <div className="victory-details glass-panel">
          {winningPlayer.hasBoughtDream && dream ? (
            <>
              <h4 className="detail-label">Dream Manifested</h4>
              <div className="dream-name">{dream.name}</div>
              <p className="dream-desc">{dream.description}</p>
            </>
          ) : (
            <>
              <h4 className="detail-label">Financial Fortress</h4>
              <div className="freedom-stat">+$50k CASHFLOW</div>
              <p className="freedom-desc">Escaped the rat race and conquered the fast track.</p>
            </>
          )}
        </div>

        <button className="btn btn-primary victory-btn" onClick={resetGame}>
          PLAY AGAIN
        </button>
      </div>

      <style>{`
        .victory-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(5, 5, 10, 0.9);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .victory-container {
          width: 500px;
          max-width: 90vw;
          padding: 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          border-radius: 40px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.8);
        }

        .victory-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
          animation: victory-spin 15s linear infinite;
          z-index: -1;
        }

        @keyframes victory-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .trophy-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.5));
          animation: trophy-bounce 1s ease infinite alternate;
        }

        @keyframes trophy-bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }

        .victory-title {
          font-family: var(--font-heading);
          font-size: 3.5rem;
          font-weight: 900;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 4px;
          margin-bottom: 0.5rem;
          background: linear-gradient(to bottom, #D4AF37, #F9D976);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .winner-announcement {
          margin-bottom: 2rem;
        }

        .winner-name {
          font-size: 1.8rem;
          font-weight: 900;
          display: block;
        }

        .victory-sub {
          font-size: 1rem;
          opacity: 0.7;
          font-weight: 600;
        }

        .victory-details {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 24px;
          margin-bottom: 2.5rem;
        }

        .detail-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--color-success);
          margin-bottom: 0.8rem;
          font-weight: 800;
        }

        .dream-name, .freedom-stat {
          font-size: 1.5rem;
          font-weight: 900;
          color: #fff;
        }

        .dream-desc, .freedom-desc {
          font-size: 0.85rem;
          opacity: 0.6;
          margin-top: 0.5rem;
          line-height: 1.4;
        }

        .victory-btn {
          width: 100%;
          padding: 1.2rem;
          font-size: 1.1rem;
          font-weight: 900;
          letter-spacing: 2px;
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }
      `}</style>
    </div>
  );
};
