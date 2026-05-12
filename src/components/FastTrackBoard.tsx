import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { FAST_TRACK_SPACES } from '../data/fastTrack';
import { Dice3D } from './Dice3D';
import { gameAudio } from '../utils/audio';

export const FastTrackBoard = () => {
  const { 
    players, turnPhase, rollDice, diceRoll, 
    currentPlayerIndex, endTurn, 
    pendingPaydays, collectPayday,
    isRolling, setRolling, myPlayerId
  } = useGameStore();
  const { gameStarted } = useGameStore(state => ({ 
    gameStarted: state.gameStarted 
  }));
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width < 600) {
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
  const isMyTurn = myPlayerId === 'LOCAL' || currentPlayer?.id === myPlayerId;

  return (
    <div className="board-area ft-board-area" style={{ perspective: '1000px' }}>
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(255, 0, 100, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div className="board-scaler-wrapper" style={{ 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'rotateX(5deg)',
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
          <div className="outer-ring-decoration ft-ring" />

          <div className="board-track-base ft-track">
            {FAST_TRACK_SPACES.map((space, i) => {
              const radius = 240; 
              const angle = (i * 360) / 38;
              
              return (
                <div 
                  key={space.id}
                  className="board-space-node ft-node"
                  style={{
                    position: 'absolute',
                    width: '38px',
                    height: '38px',
                    backgroundColor: space.color,
                    borderRadius: '8px',
                    transform: `rotate(${angle}deg) translate(0, -${radius}px) rotate(-${angle}deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  title={space.label}
                >
                  <div className="tokens-container">
                    {players.filter(p => p.position === space.id && p.phase === 'FAST_TRACK').map(p => (
                      <div 
                        key={p.id} 
                        className="player-token-pulse"
                        style={{ backgroundColor: p.color, width: '12px', height: '12px' }} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="glass-panel center-hub ft-hub">
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
                          setTimeout(() => {
                            rollDice(2);
                            setRolling(false);
                          }, 1000);
                        }}
                      >
                        {isRolling ? 'ROLLING...' : 'ROLL 2 DICE'}
                      </button>
                      {currentPlayer.charityTurnsRemaining > 0 && (
                        <button 
                          className="btn btn-secondary btn-pop" 
                          onClick={() => {
                            setRolling(true);
                            gameAudio.playSFX('dice');
                            setTimeout(() => {
                              rollDice(3);
                              setRolling(false);
                            }, 1000);
                          }}
                        >
                          3 DICE
                        </button>
                      )}
                    </div>
                  )}
                  {!isMyTurn && !currentPlayer.isBot && !isRolling && (
                    <div className="waiting-text">Waiting for {currentPlayer?.name}...</div>
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
                    <span className="label">Fast Track</span>
                    <span className="value" style={{ color: FAST_TRACK_SPACES[currentPlayer.position].color }}>
                      {FAST_TRACK_SPACES[currentPlayer.position].label}
                    </span>
                  </div>

                  <div className="action-buttons-group">
                    {isMyTurn ? (
                      <>
                        {FAST_TRACK_SPACES[currentPlayer.position].type === 'BUSINESS' && (
                          <button className="btn btn-primary btn-pop" onClick={() => {
                            const biz = FAST_TRACK_SPACES[currentPlayer.position].business!;
                            useGameStore.getState().buyFastTrackBusiness(currentPlayer.id, biz.name, biz.cashflow, biz.cost);
                            endTurn();
                          }}>INVEST ${FAST_TRACK_SPACES[currentPlayer.position].business?.cost.toLocaleString()}</button>
                        )}
                        
                        {FAST_TRACK_SPACES[currentPlayer.position].type === 'DREAM' && (
                          <button className="btn btn-primary btn-pop" onClick={() => {
                            useGameStore.getState().buyDream(currentPlayer.id, 100000);
                            endTurn();
                          }}>BUY DREAM</button>
                        )}
                        
                        {(FAST_TRACK_SPACES[currentPlayer.position].type === 'TAX_AUDIT' || 
                          FAST_TRACK_SPACES[currentPlayer.position].type === 'LAWSUIT' || 
                          FAST_TRACK_SPACES[currentPlayer.position].type === 'DIVORCE') && (
                          <button className="btn btn-danger btn-pop" onClick={() => {
                            const type = FAST_TRACK_SPACES[currentPlayer.position].type as any;
                            useGameStore.getState().resolveFastTrackPenalty(currentPlayer.id, type);
                            endTurn();
                          }}>RESOLVE {FAST_TRACK_SPACES[currentPlayer.position].label}</button>
                        )}

                        {pendingPaydays > 0 && (
                          <button className="btn btn-pop payday-special" onClick={collectPayday}>
                            CASHFLOW DAY!
                          </button>
                        )}

                        <button className="btn btn-secondary btn-pop" onClick={() => endTurn()}>END TURN</button>
                      </>
                    ) : (
                      <div className="other-player-status">{currentPlayer?.name} is playing...</div>
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
