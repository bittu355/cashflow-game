import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { FAST_TRACK_SPACES } from '../data/fastTrack';
import { WEALTH_TIPS } from '../data/tips';

export const FastTrackBoard = () => {
  const { players, turnPhase, rollDice, diceRoll, currentPlayerIndex, endTurn, buyDream, buyFastTrackBusiness, resolveFastTrackPenalty, lastAIAction, myPlayerId } = useGameStore();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) setScale(Math.min(width / 720, 1));
      else if (width < 1100) setScale(Math.min((width - 480) / 720, 1));
      else setScale(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentPlayer = players[currentPlayerIndex];
  const isMyTurn = myPlayerId === 'LOCAL' || currentPlayer?.id === myPlayerId;

  if (!currentPlayer || currentPlayer.phase !== 'FAST_TRACK') return null;

  const currentSpace = FAST_TRACK_SPACES[currentPlayer.position];

  return (
    <div className="board-area" style={{ perspective: '1200px' }}>
      {/* Background Ambient Glows */}
      <div style={{ position: 'absolute', top: '0%', right: '0%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(232, 62, 140, 0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      
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
            border: '2px solid #e83e8c',
            boxShadow: '0 0 50px rgba(232, 62, 140, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#e83e8c' }}>{lastAIAction.name}</h3>
            <p style={{ margin: '0.5rem 0 0', color: '#fff', fontSize: '1.1rem' }}>{lastAIAction.description}</p>
            <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', marginTop: '1.5rem', borderRadius: '2px', overflow: 'hidden' }}>
              <div className="animate-progress-width" style={{ height: '100%', background: '#e83e8c', width: '100%' }} />
            </div>
          </div>
        </div>
      )}
      
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
        <h2 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 900, 
          color: '#e83e8c', 
          opacity: 0.1, 
          textTransform: 'uppercase', 
          letterSpacing: '16px',
          margin: 0,
          userSelect: 'none'
        }}>
          Fast Track
        </h2>
        <div className="glass-panel" style={{ 
          marginTop: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          padding: '0.8rem 2rem', 
          borderRadius: '100px',
          border: '1px solid rgba(232, 62, 140, 0.2)',
          boxShadow: `0 15px 40px rgba(0,0,0,0.6), 0 0 30px rgba(232, 62, 140, 0.15)`
        }}>
          <div style={{ 
            width: '22px', 
            height: '22px', 
            borderRadius: '50%', 
            backgroundColor: currentPlayer.color, 
            boxShadow: `0 0 20px ${currentPlayer.color}`,
            border: '2px solid rgba(255,255,255,0.8)'
          }} />
          <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff', letterSpacing: '2px', textTransform: 'uppercase' }}>{currentPlayer.name}</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.6, marginLeft: 'auto' }}>High Stakes Player</span>
        </div>
      </div>

      {/* The Fast Track Circle Assembly */}
      <div className="board-scaler-wrapper" style={{ 
        position: 'relative',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transform: 'rotateX(15deg)',
        transformStyle: 'preserve-3d'
      }}>
        <div style={{
          position: 'relative', 
          width: '680px', 
          height: '680px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}>
        
        {/* Decorative Inner Glow */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          boxShadow: '0 0 100px rgba(232, 62, 140, 0.1), inset 0 0 50px rgba(232, 62, 140, 0.05)',
          border: '1px solid rgba(232, 62, 140, 0.1)'
        }} />

        {/* The Track Base */}
        <div style={{ 
          position: 'relative', 
          width: '620px', 
          height: '620px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, #1a1a2e 0%, #0f0f1b 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: `
            inset 0 0 120px rgba(0,0,0,0.95), 
            0 40px 80px rgba(0,0,0,0.9), 
            0 0 150px rgba(232, 62, 140, 0.1)
          `,
          border: '1px solid rgba(255,255,255,0.03)'
        }}>
          
          {/* Render Spaces */}
          {FAST_TRACK_SPACES.map((space, i) => {
            const radius = 310; 
            const angle = (i * 360) / 38; 
            
            return (
              <div 
                key={space.id}
                style={{
                  position: 'absolute',
                  width: '54px',
                  height: '54px',
                  backgroundColor: space.color,
                  borderRadius: '10px',
                  transform: `rotate(${angle}deg) translate(0, -${radius}px) rotate(-${angle}deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  boxShadow: `0 10px 25px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,0.15)`,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {space.type === 'BUSINESS' ? '🏢' :
                     space.type === 'DREAM' ? '🌟' :
                     space.type === 'CASHFLOW_DAY' ? '💸' :
                     space.type === 'CHARITY' ? '🤝' :
                     space.type === 'TAX_AUDIT' ? '🕵️' :
                     space.type === 'LAWSUIT' ? '⚖️' :
                     space.type === 'DIVORCE' ? '💔' : ''}
                  </span>
                  <span style={{ transform: 'scale(0.8)', opacity: 0.7, fontSize: '0.6rem' }}>{space.label.slice(0, 3)}</span>
                </div>
              </div>
            );
          })}

          {/* Player Token (Large & Glowing for Fast Track) */}
          {(() => {
            const radius = 310;
            const angle = (currentPlayer.position * 360) / 38;
            return (
              <div 
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '32px',
                  backgroundColor: currentPlayer.color,
                  borderRadius: '50%',
                  transform: `rotate(${angle}deg) translate(0, -${radius}px) rotate(-${angle}deg)`,
                  boxShadow: `0 0 30px ${currentPlayer.color}, 0 0 60px ${currentPlayer.color}66, inset 0 0 10px rgba(255,255,255,0.8)`,
                  border: '3px solid white',
                  zIndex: 100,
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              />
            );
          })()}

          {/* Central Command Hub */}
          <div className="glass-panel center-hub" style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            width: '380px', 
            height: '380px',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.2rem',
            background: 'rgba(232, 62, 140, 0.03)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(232, 62, 140, 0.1)',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.4)'
          }}>
            {turnPhase === 'ROLL' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                <div style={{ fontSize: '0.85rem', color: '#e83e8c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px' }}>
                  Ready to Move
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
                  <div className="wealth-tip animate-fade-in" style={{ 
                    fontSize: '0.75rem', 
                    color: 'rgba(255,255,255,0.4)', 
                    fontStyle: 'italic',
                    padding: '0.5rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px'
                  }}>
                    "{WEALTH_TIPS[Math.floor(Date.now() / 3600000) % WEALTH_TIPS.length]}"
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
                    {!isMyTurn ? (
                      <div className="glass-panel" style={{ padding: '1.5rem', color: '#e83e8c', fontSize: '1rem', fontWeight: 600, textAlign: 'center' }}>
                        ⏳ {currentPlayer?.name} is on the move...
                      </div>
                    ) : (
                      <>
                        <button 
                          className="btn btn-pop" 
                          style={{ 
                            width: '100%', 
                            padding: '1rem', 
                            borderRadius: '100px', 
                            backgroundColor: '#e83e8c', 
                            color: 'white', 
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            letterSpacing: '2px',
                            boxShadow: '0 10px 20px rgba(232, 62, 140, 0.3)',
                            border: 'none'
                          }} 
                          onClick={() => rollDice(2)}
                        >
                          ROLL 2 DICE
                        </button>
                        {currentPlayer.charityTurnsRemaining > 0 && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="btn btn-pop" 
                              style={{ flex: 1, padding: '0.8rem', borderRadius: '50px', backgroundColor: 'rgba(232, 62, 140, 0.2)', border: '1px solid #e83e8c', color: '#fff' }}
                              onClick={() => rollDice(1)}
                            >
                              1 DIE
                            </button>
                            <button 
                              className="btn btn-pop" 
                              style={{ flex: 1, padding: '0.8rem', borderRadius: '50px', backgroundColor: '#e83e8c', color: '#fff', border: 'none', fontWeight: 900 }}
                              onClick={() => rollDice(3)}
                            >
                              3 DICE
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
                <div style={{ 
                  fontSize: '5rem', 
                  fontWeight: 900, 
                  lineHeight: 1, 
                  color: '#e83e8c',
                  filter: 'drop-shadow(0 0 20px rgba(232, 62, 140, 0.5))'
                }}>
                  {diceRoll.reduce((a, b) => a + b, 0)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '4px' }}>
                  Landed On
                </div>
                <div style={{ 
                  color: currentSpace.color, 
                  fontSize: '1.5rem', 
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  {currentSpace.label}
                </div>
                
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {!isMyTurn ? (
                    <div className="glass-panel" style={{ padding: '1.5rem', color: '#e83e8c', fontSize: '1rem', fontWeight: 600, textAlign: 'center' }}>
                      ⏳ {currentPlayer?.name} is thinking big...
                    </div>
                  ) : (
                    <>
                      {currentSpace.type === 'BUSINESS' && currentSpace.business && (
                        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            CASHFLOW: <span style={{ color: 'var(--color-success)' }}>+${currentSpace.business.cashflow.toLocaleString()}</span>
                          </div>
                          {currentSpace.business.requiredRoll && (
                            <div style={{ fontSize: '0.8rem', color: '#ffd700', marginBottom: '0.5rem', fontWeight: 600 }}>
                              ⚠️ REQUIRES ROLL: {currentSpace.business.requiredRoll}+
                            </div>
                          )}
                          <button 
                            className="btn btn-success btn-pop" 
                            style={{ width: '100%', padding: '1rem', borderRadius: '50px' }}
                            disabled={currentPlayer.statement.cash < currentSpace.business.cost}
                            onClick={() => {
                              if (currentSpace.business!.requiredRoll) {
                                const roll = Math.floor(Math.random() * 6) + 1;
                                alert(`You rolled a ${roll}! (Needed ${currentSpace.business!.requiredRoll}+)`);
                                buyFastTrackBusiness(currentPlayer.id, currentSpace.business!.name, currentSpace.business!.cashflow, currentSpace.business!.cost, roll);
                              } else {
                                buyFastTrackBusiness(currentPlayer.id, currentSpace.business!.name, currentSpace.business!.cashflow, currentSpace.business!.cost);
                              }
                              endTurn();
                            }}
                          >
                            {currentSpace.business.requiredRoll ? 'ROLL & INVEST' : `INVEST $${(currentSpace.business.cost / 1000)}k`}
                          </button>
                        </div>
                      )}

                      {currentSpace.type === 'DREAM' && (
                        <button 
                          className="btn btn-pop" 
                          style={{ backgroundColor: '#ffd700', color: '#000', width: '100%', padding: '1.2rem', fontWeight: 900, fontSize: '1.1rem' }} 
                          onClick={() => { buyDream(currentPlayer.id); endTurn(); }}
                        >
                          ACHIEVE DREAM
                        </button>
                      )}

                      {['TAX_AUDIT', 'LAWSUIT', 'DIVORCE'].includes(currentSpace.type) && (
                        <button 
                          className="btn btn-pop" 
                          style={{ backgroundColor: '#dc3545', color: 'white', width: '100%', padding: '1.2rem' }} 
                          onClick={() => {
                            resolveFastTrackPenalty(currentPlayer.id, currentSpace.type as any);
                            endTurn();
                          }}
                        >
                          RESOLVE SETTLEMENT
                        </button>
                      )}
                      
                      <button className="btn btn-primary btn-pop" style={{ padding: '1rem', marginTop: '1rem', borderRadius: '50px', opacity: 0.8 }} onClick={() => endTurn()}>
                        COMPLETE TURN
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
