import { useGameStore } from '../store/gameStore';
import { RAT_RACE_SPACES } from '../data/board';
import { CardModal } from './CardModal';

export const Board = () => {
  const { players, turnPhase, rollDice, diceRoll, addPlayer, currentPlayerIndex, endTurn, drawCard, pendingPaydays, collectPayday } = useGameStore();

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="board-area">
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--color-text-main)', opacity: 0.2, textTransform: 'uppercase', letterSpacing: '4px' }}>The Rat Race</h2>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: currentPlayer.color }} />
          <span style={{ fontWeight: 800 }}>{currentPlayer.name}'s Turn</span>
        </div>
      </div>

      {/* The Circular Track */}
      <div style={{ 
        position: 'relative', 
        width: '450px', 
        height: '450px', 
        borderRadius: '50%', 
        border: '30px solid #cbd5e1', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.1)'
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
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                color: '#fff',
                fontSize: '0.6rem',
                fontWeight: 800,
                textAlign: 'center',
                border: '2px solid rgba(255,255,255,0.5)'
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
            <button className="btn btn-success btn-pop" style={{ width: '100%', padding: '1rem', borderRadius: '50px' }} onClick={() => rollDice(1)}>
              Roll Dice
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{diceRoll[0]}</div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>You landed on <strong style={{ color: RAT_RACE_SPACES[currentPlayer.position].color }}>{RAT_RACE_SPACES[currentPlayer.position].label}</strong></p>
              </div>
              
              {/* Contextual Actions based on space type */}
              {RAT_RACE_SPACES[currentPlayer.position].type === 'OPPORTUNITY' && (
                <button className="btn btn-success btn-pop" onClick={() => drawCard('OPPORTUNITY')}>
                  Draw Deal
                </button>
              )}
              {RAT_RACE_SPACES[currentPlayer.position].type === 'DOODAD' && (
                <button className="btn btn-pop" style={{ backgroundColor: '#dc3545', color: 'white' }} onClick={() => drawCard('DOODAD')}>
                  Draw Doodad
                </button>
              )}
              {RAT_RACE_SPACES[currentPlayer.position].type === 'MARKET' && (
                <button className="btn btn-pop" style={{ backgroundColor: '#007bff', color: 'white' }} onClick={() => drawCard('MARKET')}>
                  Draw Market
                </button>
              )}

              {pendingPaydays > 0 && (
                <button 
                  className="btn btn-pop" 
                  style={{ backgroundColor: '#ffd700', color: '#000', fontWeight: 800, animation: 'pulse 1s infinite' }} 
                  onClick={collectPayday}
                >
                  COLLECT PAYDAY! ({pendingPaydays})
                </button>
              )}
              
              <button className="btn btn-primary btn-pop" onClick={() => endTurn()}>
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
