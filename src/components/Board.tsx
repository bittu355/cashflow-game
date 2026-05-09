import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { RAT_RACE_SPACES } from '../data/board';
import { CardModal } from './CardModal';
import { FastTrackBoard } from './FastTrackBoard';
import { Dice3D } from './Dice3D';
import { gameAudio } from '../utils/audio';

export const Board = () => {
  const { 
    players, turnPhase, rollDice, diceRoll, 
    currentPlayerIndex, endTurn, drawCard, 
    pendingPaydays, collectPayday, runAITurn,
    isRolling, setRolling, lastAIAction,
    turnCount, activeMacroEvent
  } = useGameStore();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) setScale(Math.min(width / 550, 1));
      else if (width < 1100) setScale(Math.min((width - 480) / 550, 1));
      else setScale(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentPlayer = players[currentPlayerIndex];

  // AI Trigger
  useEffect(() => {
    if (currentPlayer?.isBot && turnPhase === 'ROLL') {
      runAITurn();
    }
  }, [currentPlayer?.id, turnPhase, runAITurn]);

  if (currentPlayer?.phase === 'FAST_TRACK') {
    return (
      <>
        <FastTrackBoard />
        <CardModal />
      </>
    );
  }

  return (
    <div className="board-area" style={{ perspective: '1000px' }}>
      {/* Background Ambient Glows */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(0, 229, 255, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(40, 167, 69, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {lastAIAction && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 5000,
          pointerEvents: 'none'
        }}>
          <div className="glass-panel animate-pop-in" style={{
            padding: '2rem 4rem',
            textAlign: 'center',
            background: 'rgba(10, 10, 15, 0.95)',
            border: '2px solid var(--color-primary)',
            boxShadow: '0 0 50px rgba(0, 229, 255, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary)' }}>{lastAIAction.name}</h3>
            <p style={{ margin: '0.5rem 0 0', color: '#fff', fontSize: '1.1rem' }}>{lastAIAction.description}</p>
            <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', marginTop: '1.5rem', borderRadius: '2px', overflow: 'hidden' }}>
              <div className="animate-progress-width" style={{ height: '100%', background: 'var(--color-primary)', width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
        <h2 style={{ 
          fontSize: '3rem', 
          fontWeight: 900, 
          color: 'var(--color-text-main)', 
          opacity: 0.05, 
          textTransform: 'uppercase', 
          letterSpacing: '12px',
          margin: 0,
          userSelect: 'none'
        }}>
          The Rat Race
        </h2>
        <div className="glass-panel" style={{ 
          marginTop: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          padding: '0.8rem 1.8rem', 
          borderRadius: '100px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${currentPlayer.color}22`
        }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            backgroundColor: currentPlayer.color, 
            boxShadow: `0 0 15px ${currentPlayer.color}`,
            border: '2px solid rgba(255,255,255,0.5)'
          }} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{currentPlayer.name}'s Turn</span>
        </div>
        <button 
          className="btn btn-secondary" 
          style={{ marginTop: '0.5rem', padding: '0.4rem 1rem', fontSize: '0.7rem', borderRadius: '50px', opacity: 0.6 }}
          onClick={() => gameAudio.toggleMute()}
        >
          🔊 Audio Toggle
        </button>
      </div>

      <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
        <div className="glass-panel" style={{ padding: '0.8rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '2px' }}>Total Turns: </span>
          <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--color-primary)' }}>{turnCount}</span>
        </div>

        {activeMacroEvent && (
          <div className="glass-panel animate-slide-left" style={{ 
            padding: '1rem 2rem', 
            borderRadius: '16px', 
            border: '1px solid var(--color-danger)', 
            background: 'rgba(220, 53, 69, 0.1)',
            boxShadow: '0 0 30px rgba(220, 53, 69, 0.2)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-danger)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>
              ⚠️ ACTIVE MACRO EVENT
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>{activeMacroEvent.type}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Ends in {activeMacroEvent.turnsRemaining} turns</div>
          </div>
        )}
      </div>

      {/* The Main Board Assembly */}
      <div className="board-scaler-wrapper" style={{ 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'rotateX(10deg)',
        transformStyle: 'preserve-3d'
      }}>
        <div style={{
          position: 'relative', 
          width: '520px', 
          height: '520px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}>
        
        {/* Outer Ring Decoration */}
        <div style={{
          position: 'absolute',
          width: '580px',
          height: '580px',
          borderRadius: '50%',
          border: '2px dashed rgba(255,255,255,0.03)',
          animation: 'spin 120s linear infinite'
        }} />

        {/* The Track Base */}
        <div style={{ 
          position: 'relative', 
          width: '480px', 
          height: '480px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(20, 20, 25, 0.95) 0%, rgba(10, 10, 12, 1) 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: `
            inset 0 0 100px rgba(0,0,0,0.9), 
            0 30px 60px rgba(0,0,0,0.8), 
            0 0 100px rgba(0,0,0,0.4),
            inset 0 0 2px rgba(255,255,255,0.1)
          `,
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          
          {/* Render Spaces */}
          {RAT_RACE_SPACES.map((space, i) => {
            const radius = 240; 
            const angle = (i * 360) / 24;
            
            return (
              <div 
                key={space.id}
                className="board-space-node"
                style={{
                  position: 'absolute',
                  width: '46px',
                  height: '46px',
                  backgroundColor: space.color,
                  borderRadius: '12px',
                  transform: `rotate(${angle}deg) translate(0, -${radius}px) rotate(-${angle}deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 20px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.2)`,
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.15)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  userSelect: 'none'
                }}
                title={space.label}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', marginBottom: '2px' }}>
                    {space.type === 'OPPORTUNITY' ? '💰' :
                     space.type === 'DOODAD' ? '🛒' :
                     space.type === 'MARKET' ? '📈' :
                     space.type === 'BABY' ? '👶' :
                     space.type === 'PAYDAY' ? '🏦' :
                     space.type === 'CHARITY' ? '🤝' : ''}
                  </span>
                  <span style={{ opacity: 0.8, fontSize: '0.6rem' }}>{space.label.substring(0, 3)}</span>
                </div>

                {/* Player Tokens Container */}
                <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', display: 'flex', flexWrap: 'wrap', gap: '2px', maxWidth: '30px', justifyContent: 'flex-end' }}>
                  {players.filter(p => p.position === space.id).map(p => (
                    <div 
                      key={p.id} 
                      className="player-token-pulse"
                      style={{ 
                        width: '16px', 
                        height: '16px', 
                        borderRadius: '50%', 
                        backgroundColor: p.color,
                        border: '2px solid #fff',
                        boxShadow: `0 0 10px ${p.color}, 0 2px 5px rgba(0,0,0,0.5)`,
                        zIndex: 20
                      }} 
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Central Interaction Hub */}
          <div className="glass-panel center-hub" style={{ 
            padding: '2.5rem', 
            textAlign: 'center', 
            width: '280px', 
            height: '280px',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.5)',
            background: 'rgba(15, 15, 20, 0.4)',
            backdropFilter: 'blur(10px)'
          }}>
            {turnPhase === 'ROLL' || isRolling ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {diceRoll.map((v, i) => (
                    <Dice3D key={i} value={v} rolling={isRolling} />
                  ))}
                </div>
                {!currentPlayer.isBot && !isRolling && (
                  <>
                    <button 
                      className="btn btn-success btn-pop main-roll-btn" 
                      style={{ 
                        width: '100%', 
                        padding: '1.2rem', 
                        borderRadius: '100px', 
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        boxShadow: '0 10px 25px rgba(40, 167, 69, 0.3)'
                      }} 
                      onClick={() => {
                        setRolling(true);
                        gameAudio.playSFX('dice');
                        setTimeout(() => {
                          rollDice(1);
                          setRolling(false);
                        }, 1000);
                      }}
                    >
                      ROLL 1 DIE
                    </button>
                    {currentPlayer.charityTurnsRemaining > 0 && (
                      <button 
                        className="btn btn-info btn-pop" 
                        style={{ 
                          width: '100%', 
                          padding: '1rem', 
                          borderRadius: '100px', 
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
                          color: 'white',
                          border: 'none'
                        }} 
                        onClick={() => {
                          setRolling(true);
                          gameAudio.playSFX('dice');
                          setTimeout(() => {
                            rollDice(2);
                            setRolling(false);
                          }, 1000);
                        }}
                      >
                        ROLL 2 DICE
                      </button>
                    )}
                  </>
                )}
                {currentPlayer.isBot && isRolling && (
                   <div style={{ color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>AI is rolling...</div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {diceRoll.map((v, i) => (
                    <Dice3D key={i} value={v} rolling={false} />
                  ))}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Landed On
                </div>
                <div style={{ 
                  color: RAT_RACE_SPACES[currentPlayer.position].color, 
                  fontSize: '1.2rem', 
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textAlign: 'center'
                }}>
                  {RAT_RACE_SPACES[currentPlayer.position].label}
                </div>
                
                <div style={{ width: '100%', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {RAT_RACE_SPACES[currentPlayer.position].type === 'OPPORTUNITY' && (
                    <>
                      <button className="btn btn-success btn-pop" style={{ padding: '0.8rem' }} onClick={() => drawCard('SMALL_DEAL')}>
                        SMALL DEAL
                      </button>
                      <button 
                        className="btn btn-success btn-pop" 
                        style={{ padding: '0.8rem', background: '#1b5e20', opacity: currentPlayer.statement.cash < 6000 ? 0.5 : 1 }} 
                        onClick={() => drawCard('BIG_DEAL')}
                      >
                        BIG DEAL
                      </button>
                    </>
                  )}
                  
                  {RAT_RACE_SPACES[currentPlayer.position].type === 'DOODAD' && (
                    <button className="btn btn-pop" style={{ backgroundColor: '#dc3545', color: 'white', padding: '1rem' }} onClick={() => drawCard('DOODAD')}>
                      DRAW DOODAD
                    </button>
                  )}
                  
                  {RAT_RACE_SPACES[currentPlayer.position].type === 'MARKET' && (
                    <button className="btn btn-pop" style={{ backgroundColor: '#007bff', color: 'white', padding: '1rem' }} onClick={() => drawCard('MARKET')}>
                      DRAW MARKET
                    </button>
                  )}

                  {RAT_RACE_SPACES[currentPlayer.position].type === 'BABY' && (
                    <button className="btn btn-pop" style={{ backgroundColor: '#e83e8c', color: 'white', padding: '1rem' }} onClick={() => { useGameStore.getState().haveChild(currentPlayer.id); endTurn(); }}>
                      ADD FAMILY MEMBER
                    </button>
                  )}

                  {pendingPaydays > 0 && (
                    <button 
                      className="btn btn-pop payday-alert" 
                      style={{ backgroundColor: '#ffd700', color: '#000', fontWeight: 900, padding: '1rem', borderRadius: '100px' }} 
                      onClick={collectPayday}
                    >
                      COLLECT PAYDAY! ({pendingPaydays})
                    </button>
                  )}
                  
                  <button className="btn btn-primary btn-pop" style={{ padding: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }} onClick={() => endTurn()}>
                    END TURN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      <CardModal />
    </div>
  );
};
