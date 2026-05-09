import { useGameStore } from '../store/gameStore';
import { RAT_RACE_SPACES } from '../data/board';
import { CardModal } from './CardModal';

export const Board = () => {
  const { players, turnPhase, rollDice, diceRoll, currentPlayerIndex, endTurn, drawCard, pendingPaydays, collectPayday } = useGameStore();

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="board-area">
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 5 }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-main)', opacity: 0.1, textTransform: 'uppercase', letterSpacing: '6px' }}>The Rat Race</h2>
        <div className="glass-panel" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1.5rem', borderRadius: '50px' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: currentPlayer.color, boxShadow: `0 0 10px ${currentPlayer.color}` }} />
          <span style={{ fontWeight: 800, letterSpacing: '1px' }}>{currentPlayer.name}'s Turn</span>
        </div>
      </div>

      {/* The Circular Track */}
      <div style={{ 
        position: 'relative', 
        width: '450px', 
        height: '450px', 
        borderRadius: '50%', 
        border: '30px solid rgba(255,255,255,0.05)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: 'inset 0 10px 50px rgba(0,0,0,0.8), 0 20px 50px rgba(0,0,0,0.6), 0 0 50px rgba(0, 229, 255, 0.1)'
      }}>
        
        {/* Render Spaces */}
        {RAT_RACE_SPACES.map((space, i) => {
          const radius = 225; // Half of 450
          const angle = (i * 360) / 24; // 15 degrees per space
          
          return (
            <div 
              key={space.id}
              style={{
                position: 'absolute',
                width: '40px',
                height: '40px',
                backgroundColor: space.color,
                borderRadius: '8px',
                transform: `rotate(${angle}deg) translate(0, -${radius}px) rotate(-${angle}deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 10px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.2)`,
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 800,
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
              title={space.label}
            >
              {space.label.substring(0, 3)}

              {/* Render Players on this space */}
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', display: 'flex', gap: '2px' }}>
                {players.filter(p => p.position === space.id).map(p => (
                  <div 
                    key={p.id} 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: p.color,
                      border: '2px solid white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }} 
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Center Actions */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', width: '220px', borderRadius: '50%' }}>
          {turnPhase === 'ROLL' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <button className="btn btn-success btn-pop" style={{ width: '100%', padding: '1rem', borderRadius: '50px' }} onClick={() => rollDice(1)}>
                Roll 1 Die
              </button>
              {currentPlayer.charityTurnsRemaining > 0 && (
                <button className="btn btn-success btn-pop" style={{ width: '100%', padding: '1rem', borderRadius: '50px', background: 'linear-gradient(45deg, #17a2b8, #28a745)' }} onClick={() => rollDice(2)}>
                  Roll 2 Dice (Charity)
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{diceRoll.reduce((a, b) => a + b, 0)}</div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>You landed on <strong style={{ color: RAT_RACE_SPACES[currentPlayer.position].color }}>{RAT_RACE_SPACES[currentPlayer.position].label}</strong></p>
              </div>
              
              {/* Contextual Actions based on space type */}
              {RAT_RACE_SPACES[currentPlayer.position].type === 'OPPORTUNITY' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <button className="btn btn-success btn-pop" onClick={() => drawCard('SMALL_DEAL')}>
                    Small Deal
                  </button>
                  {currentPlayer.statement.cash >= 6000 && (
                    <button className="btn btn-success btn-pop" style={{ background: '#218838' }} onClick={() => drawCard('BIG_DEAL')}>
                      Big Deal (&gt;$6,000)
                    </button>
                  )}
                </div>
              )}
              {RAT_RACE_SPACES[currentPlayer.position].type === 'DOODAD' && (
                <button className="btn btn-pop" style={{ backgroundColor: '#dc3545', color: 'white', width: '100%' }} onClick={() => drawCard('DOODAD')}>
                  Draw Doodad
                </button>
              )}
              {RAT_RACE_SPACES[currentPlayer.position].type === 'MARKET' && (
                <button className="btn btn-pop" style={{ backgroundColor: '#007bff', color: 'white', width: '100%' }} onClick={() => drawCard('MARKET')}>
                  Draw Market
                </button>
              )}
              {RAT_RACE_SPACES[currentPlayer.position].type === 'BABY' && (
                <button className="btn btn-pop" style={{ backgroundColor: '#e83e8c', color: 'white', width: '100%' }} onClick={() => { useGameStore.getState().haveChild(currentPlayer.id); endTurn(); }}>
                  Have a Baby
                </button>
              )}
              {RAT_RACE_SPACES[currentPlayer.position].type === 'DOWNSIZED' && (
                <button className="btn btn-pop" style={{ backgroundColor: '#6c757d', color: 'white', width: '100%' }} onClick={() => { useGameStore.getState().goDownsized(currentPlayer.id); endTurn(); }}>
                  Pay Downsized Penalty
                </button>
              )}
              {RAT_RACE_SPACES[currentPlayer.position].type === 'CHARITY' && (
                <button className="btn btn-pop" style={{ backgroundColor: '#17a2b8', color: 'white', width: '100%' }} onClick={() => { useGameStore.getState().donateToCharity(currentPlayer.id); endTurn(); }}>
                  Donate 10% Income
                </button>
              )}

              {pendingPaydays > 0 && (
                <button 
                  className="btn btn-pop" 
                  style={{ backgroundColor: '#ffd700', color: '#000', fontWeight: 800, animation: 'pulse 1s infinite', width: '100%' }} 
                  onClick={collectPayday}
                >
                  COLLECT PAYDAY! ({pendingPaydays})
                </button>
              )}
              
              <button className="btn btn-primary btn-pop" style={{ width: '100%' }} onClick={() => endTurn()}>
                End Turn
              </button>
            </div>
          )}
        </div>
      </div>
      <CardModal />
    </div>
  );
};
