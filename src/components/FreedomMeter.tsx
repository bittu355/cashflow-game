import React from 'react';
import { useGameStore } from '../store/gameStore';

export const FreedomMeter: React.FC = () => {
  const { players, currentPlayerIndex } = useGameStore();
  const player = players[currentPlayerIndex];

  if (!player || player.phase === 'FAST_TRACK') return null;

  const { statement } = player;
  const passiveIncome = statement.passiveIncome || 0;
  const totalExpenses = statement.totalExpenses || 1;
  const progress = Math.min(100, (passiveIncome / totalExpenses) * 100);

  return (
    <div className="freedom-meter-container glass-premium animate-slide-up">
      <div className="meter-header">
        <span className="meter-label">PROGRESS TO FREEDOM</span>
        <span key={Math.round(progress)} className="meter-percentage animate-freedom-surge">{Math.round(progress)}%</span>
      </div>
      
      <div className="meter-track">
        <div 
          className="meter-fill animate-gold-glow" 
          style={{ width: `${progress}%` }}
        >
          <div className="progress-shimmer" />
        </div>
      </div>

      <div className="meter-footer">
        <div className="meter-stat">
          <label>PASSIVE</label>
          <span>${passiveIncome.toLocaleString()}</span>
        </div>
        <div className="meter-divider" />
        <div className="meter-stat">
          <label>EXPENSES</label>
          <span>${totalExpenses.toLocaleString()}</span>
        </div>
      </div>

      <style>{`
        .freedom-meter-container {
          position: fixed;
          top: 85px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 600px;
          padding: 1rem;
          border-radius: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .meter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .meter-label {
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 1.5px;
          color: var(--color-primary);
        }

        .meter-percentage {
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: 1.2rem;
          color: #fff;
        }

        .meter-track {
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 100px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .meter-fill {
          height: 100%;
          background: var(--premium-gold);
          border-radius: 100px;
          transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .progress-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .meter-footer {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-top: 0.2rem;
        }

        .meter-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .meter-stat label {
          font-size: 0.55rem;
          font-weight: 800;
          opacity: 0.5;
          margin-bottom: 2px;
        }

        .meter-stat span {
          font-size: 0.85rem;
          font-weight: 900;
          color: #fff;
        }

        .meter-divider {
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .freedom-meter-container {
            top: 70px;
            padding: 0.8rem;
          }
          .meter-percentage { font-size: 1rem; }
          .meter-stat span { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
};
