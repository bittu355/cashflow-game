import { useGameStore } from '../store/gameStore';
import { gameAudio } from '../utils/audio';
import { useState } from 'react';

export const TopNav = () => {
  const { 
    players, currentPlayerIndex, turnCount, resetGame 
  } = useGameStore();
  const [isMuted, setIsMuted] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  if (!currentPlayer) return null;

  const handleToggleMute = () => {
    gameAudio.toggleMute();
    setIsMuted(!isMuted);
  };

  return (
    <nav className="top-nav glass-panel">
      <div className="nav-left">
        <button className="nav-icon-btn" onClick={resetGame} title="Back to Lobby">
          🏠
        </button>
        <div className="v-divider" />
        <div className="player-status">
          <div className="status-dot-wrapper">
            <div className="status-dot pulse" style={{ backgroundColor: currentPlayer.color, boxShadow: `0 0 15px ${currentPlayer.color}` }} />
          </div>
          <span className="player-name">{currentPlayer.name}'s Turn</span>
        </div>
      </div>

      <div className="nav-center">
        <div className="game-stat">
          <span className="stat-label">DAY</span>
          <span className="stat-value">{Math.floor(turnCount / players.length) + 1}</span>
        </div>
      </div>

      <div className="nav-right">
        <button className="nav-icon-btn audio-toggle" onClick={handleToggleMute}>
          {isMuted ? '🔇' : '🔊'}
        </button>
        <div className="v-divider" />
        <div className="game-phase-badge">
          {currentPlayer.phase === 'RAT_RACE' ? '🐀 RAT RACE' : '🏎️ FAST TRACK'}
        </div>
      </div>

      <style>{`
        .top-nav {
          position: fixed;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          width: 95%;
          max-width: 1200px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          z-index: 2000;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(10, 10, 15, 0.8);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .nav-left, .nav-right, .nav-center {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .nav-icon-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s;
        }

        .nav-icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .v-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
        }

        .player-status {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .pulse {
          animation: nav-dot-pulse 2s infinite;
        }

        @keyframes nav-dot-pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        .player-name {
          font-weight: 800;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 1px;
          color: var(--color-primary);
        }

        .game-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 0.6rem;
          opacity: 0.5;
          font-weight: 800;
        }

        .stat-value {
          font-weight: 900;
          font-size: 1.1rem;
          color: #fff;
        }

        .game-phase-badge {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .top-nav {
            padding: 0 0.8rem;
            height: 50px;
            top: 10px;
          }
          .nav-left, .nav-right { gap: 0.6rem; }
          .player-name, .game-phase-badge { display: none; }
          .v-divider { display: none; }
        }
      `}</style>
    </nav>
  );
};
