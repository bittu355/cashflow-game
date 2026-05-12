import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { RAT_RACE_SPACES } from '../data/board';
import { CardModal } from './CardModal';
import { FastTrackBoard } from './FastTrackBoard';
import { Dice3D } from './Dice3D';
import { gameAudio } from '../utils/audio';
import { triggerFastTrackConfetti } from '../utils/celebration';
import { hapticFeedback } from '../utils/haptics';

export const Board = () => {
  const { 
    players, turnPhase, rollDice, diceRoll, 
    currentPlayerIndex, endTurn, drawCard, 
    pendingPaydays, collectPayday, runAITurn,
    isRolling, setRolling, lastAIAction,
    activeMacroEvent, myPlayerId
  } = useGameStore();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width < 600) {
        // More aggressive scaling for mobile to account for Nav and Bottom Sheet
        const availableHeight = height - 180; 
        const boardSize = 520;
        const scaleFit = Math.min(width / boardSize, availableHeight / boardSize, 0.85);
        setScale(scaleFit);
      } else if (width < 1100) {
        setScale(Math.min((width - 40) / 600, 0.9));
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentPlayer = players[currentPlayerIndex];
  if (!currentPlayer) return null;
  const isMyTurn = myPlayerId === 'LOCAL' || currentPlayer?.id === myPlayerId;

  // Celebration trigger for Fast Track entry
  useEffect(() => {
    if (currentPlayer?.phase === 'FAST_TRACK' && turnPhase === 'ACTION') {
      // We only want to trigger this once per player entry
      const hasCelebrated = sessionStorage.getItem(`celebrated_${currentPlayer.id}`);
      if (!hasCelebrated) {
        triggerFastTrackConfetti();
        sessionStorage.setItem(`celebrated_${currentPlayer.id}`, 'true');
      }
    }
  }, [currentPlayer?.id, currentPlayer?.phase, turnPhase]);

  useEffect(() => {
    if (currentPlayer?.isBot && turnPhase === 'ROLL') {
      runAITurn();
    }
  }, [currentPlayer?.id, turnPhase, runAITurn]);

  if (currentPlayer?.phase === 'FAST_TRACK') {
    return (
      <div className="board-area">
        <FastTrackBoard />
      </div>
    );
  }

  return (
    <div className="board-area" style={{ perspective: '1000px' }}>
      {/* Background Ambient Glows */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      
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
            boxShadow: '0 0 50px rgba(212, 175, 55, 0.3)'
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

      {activeMacroEvent && (
        <div className="macro-event-banner glass-panel animate-slide-up">
          <span className="warning">⚠️ {activeMacroEvent.type}</span>
        </div>
      )}

      <div className="board-scaler-wrapper" style={{ 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale}) rotateX(25deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{
          position: 'relative', 
          width: '520px', 
          height: '520px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transformStyle: 'preserve-3d'
        }}>
        
          <div className="outer-ring-decoration" />

          <div className="board-track-base">
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
                    transform: `rotate(${angle}deg) translate(0, -${radius}px) rotate(-${angle}deg) translateZ(10px)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={space.label}
                >
                  <div className="space-content">
                    <span className="space-icon">
                      {space.type === 'OPPORTUNITY' ? '💰' :
                       space.type === 'DOODAD' ? '🛒' :
                       space.type === 'MARKET' ? '📈' :
                       space.type === 'BABY' ? '👶' :
                       space.type === 'PAYDAY' ? '🏦' :
                       space.type === 'CHARITY' ? '🤝' : ''}
                    </span>
                    <span className="space-label-text">{space.label.substring(0, 3)}</span>
                  </div>

                  <div className="tokens-container">
                    {players.filter(p => p.position === space.id).map(p => (
                      <div 
                        key={p.id} 
                        className="player-token-pulse"
                        style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="glass-panel center-hub">
              {turnPhase === 'ROLL' || isRolling ? (
                <div className="hub-content">
                  <div className="dice-container">
                    {diceRoll.map((v, i) => (
                      <Dice3D key={i} value={v} rolling={isRolling} />
                    ))}
                  </div>
                  {!currentPlayer.isBot && !isRolling && isMyTurn && (
                    <div className="hub-actions">
                      <button 
                        className="btn btn-primary btn-pop roll-btn" 
                        onClick={() => {
                          setRolling(true);
                          gameAudio.playSFX('dice');
                          hapticFeedback.medium();
                          setTimeout(() => {
                            rollDice(1);
                            setRolling(false);
                          }, 1000);
                        }}
                      >
                        {isRolling ? 'ROLLING...' : 'ROLL DIE'}
                      </button>
                      {currentPlayer.charityTurnsRemaining > 0 && (
                        <button 
                          className="btn btn-secondary btn-pop" 
                          onClick={() => {
                            setRolling(true);
                            gameAudio.playSFX('dice');
                            setTimeout(() => {
                              rollDice(2);
                              setRolling(false);
                            }, 1000);
                          }}
                        >
                          2 DICE
                        </button>
                      )}
                    </div>
                  )}
                  {!isMyTurn && !currentPlayer.isBot && !isRolling && (
                    <div className="waiting-text">Waiting for {currentPlayer?.name}...</div>
                  )}
                  {currentPlayer.isBot && isRolling && (
                    <div className="waiting-text">AI is rolling...</div>
                  )}
                </div>
              ) : (
                <div className="hub-content">
                  <div className="dice-container">
                    {diceRoll.map((v, i) => (
                      <Dice3D key={i} value={v} rolling={false} />
                    ))}
                  </div>
                  <div className="landed-on-badge">
                    <span className="label">Landed On</span>
                    <span className="value" style={{ color: RAT_RACE_SPACES[currentPlayer.position].color }}>
                      {RAT_RACE_SPACES[currentPlayer.position].label}
                    </span>
                  </div>
                  
                  <div className="action-buttons-group">
                    {!isMyTurn ? (
                      <div className="other-player-status">
                        {currentPlayer?.name} is thinking...
                      </div>
                    ) : (
                      <>
                        {RAT_RACE_SPACES[currentPlayer.position].type === 'OPPORTUNITY' && (
                          <div className="deal-buttons">
                            <button className="btn btn-primary btn-pop" onClick={() => drawCard('SMALL_DEAL')}>SMALL</button>
                            <button className="btn btn-primary btn-pop" style={{ opacity: currentPlayer.statement.cash < 6000 ? 0.6 : 1 }} onClick={() => drawCard('BIG_DEAL')}>BIG</button>
                          </div>
                        )}
                        
                        {RAT_RACE_SPACES[currentPlayer.position].type === 'DOODAD' && (
                          <button className="btn btn-danger btn-pop" onClick={() => drawCard('DOODAD')}>PAY DOODAD</button>
                        )}
                        
                        {RAT_RACE_SPACES[currentPlayer.position].type === 'MARKET' && (
                          <button className="btn btn-blue btn-pop" onClick={() => drawCard('MARKET')}>MARKET INFO</button>
                        )}

                        {RAT_RACE_SPACES[currentPlayer.position].type === 'BABY' && (
                          <button className="btn btn-primary btn-pop" style={{ background: '#e83e8c' }} onClick={() => { useGameStore.getState().haveChild(currentPlayer.id); endTurn(); }}>NEW BABY</button>
                        )}
                        
                        {RAT_RACE_SPACES[currentPlayer.position].type === 'CHARITY' && (
                          <div className="deal-buttons">
                            <button className="btn btn-primary btn-pop" style={{ background: '#17a2b8' }} onClick={() => { useGameStore.getState().donateToCharity(currentPlayer.id); endTurn(); }}>DONATE</button>
                            <button className="btn btn-secondary" onClick={() => endTurn()}>SKIP</button>
                          </div>
                        )}

                        {RAT_RACE_SPACES[currentPlayer.position].type === 'DOWNSIZED' && (
                          <button className="btn btn-danger btn-pop" onClick={() => { useGameStore.getState().goDownsized(currentPlayer.id); endTurn(); }}>PAY & LOSE TURNS</button>
                        )}

                        {pendingPaydays > 0 && (
                          <button className="btn btn-pop payday-special animate-payday-glow" onClick={collectPayday}>
                            COLLECT PAYDAY! ({pendingPaydays})
                          </button>
                        )}
                        
                        <button className="btn btn-secondary btn-pop end-turn-btn" onClick={() => endTurn()}>END TURN</button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <CardModal />
          </div>
        </div>
      </div>
    </div>
  );
};
