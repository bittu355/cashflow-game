import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { createMultiplayerGame, joinMultiplayerGame, generateGameId } from '../utils/multiplayer';
import { PROFESSIONS } from '../data/professions';
import { DREAMS } from '../data/fastTrack';

export const Lobby = () => {
  const [mode, setMode] = useState<'SELECT' | 'ONLINE'>('SELECT');
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [selectedProfIndex, setSelectedProfIndex] = useState(0);
  const [selectedDreamIndex, setSelectedDreamIndex] = useState(0);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const { addPlayer, setMyPlayerId } = useGameStore();

  const currentProf = PROFESSIONS[selectedProfIndex];
  const currentDream = DREAMS[selectedDreamIndex];

  const handleStartLocal = () => {
    setMyPlayerId('LOCAL'); // In local mode, we own all players
    addPlayer(name || 'Player 1', '#FF5A5F', currentProf, currentDream.id);
  };

  const handleCreateOnline = async () => {
    const code = generateGameId();
    const playerId = `host-${Date.now()}`;
    setMyPlayerId(playerId);
    addPlayer(name || 'Host', '#FF5A5F', currentProf, currentDream.id, false, playerId);
    await createMultiplayerGame(code);
    setRoomCode(code);
  };

  const handleJoinOnline = () => {
    if (!joinCode) return;
    const playerId = `guest-${Date.now()}`;
    
    // Join first to get the current state
    joinMultiplayerGame(joinCode.toUpperCase());
    
    // Then add ourselves after a brief delay to ensure we are part of the next sync cycle
    setTimeout(() => {
      setMyPlayerId(playerId);
      addPlayer(name || 'Guest', '#38A169', currentProf, currentDream.id, false, playerId);
    }, 1000);
  };

  if (roomCode) {
    return (
      <div className="lobby-overlay">
        <div className="glass-panel room-created-card animate-pop">
          <h1 className="gold-text">Room Created!</h1>
          <div className="room-code-display">
            {roomCode}
          </div>
          <p className="pencil-text">Share this code with your friends to play together.</p>
          <div className="waiting-indicator animate-pulse">WAITING FOR PLAYERS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="lobby-overlay">
      <div className="mesh-gradient-bg" />
      <div className="glass-panel lobby-card animate-slide-up">
        <div className="lobby-header">
          <h1 className="gold-text main-title">CASHFLOW</h1>
          <p className="pencil-text subtitle">Escape the Rat Race.</p>
        </div>

        <div className="name-input-container">
          <input 
            type="text" 
            placeholder="ENTER YOUR NAME" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
            maxLength={12}
          />
        </div>

        <div className="selector-container profession-selector">
          <h3 className="selector-label">Choose Profession</h3>
          <div className="selector-row">
            <button 
              className="arrow-btn" 
              onClick={() => setSelectedProfIndex(prev => prev > 0 ? prev - 1 : PROFESSIONS.length - 1)}
            >
              ◀
            </button>
            <div className="selection-info">
              <div className="selection-name">{currentProf.name}</div>
              <div className="selection-stats">
                <div className="stat">Salary: <span className="success">${currentProf.salary.toLocaleString()}</span></div>
                <div className="stat">Savings: <span>${currentProf.savings.toLocaleString()}</span></div>
              </div>
            </div>
            <button 
              className="arrow-btn" 
              onClick={() => setSelectedProfIndex(prev => (prev + 1) % PROFESSIONS.length)}
            >
              ▶
            </button>
          </div>
        </div>

        <div className="selector-container dream-selector">
          <h3 className="selector-label dream-label">Choose Your Dream</h3>
          <div className="selector-row">
            <button 
              className="arrow-btn dream-btn" 
              onClick={() => setSelectedDreamIndex(prev => prev > 0 ? prev - 1 : DREAMS.length - 1)}
            >
              ◀
            </button>
            <div className="selection-info">
              <div className="selection-name dream-name">{currentDream.name}</div>
              <div className="dream-description">{currentDream.description}</div>
              <div className="dream-cost">Cost: ${(currentDream.cost / 1000)}k</div>
            </div>
            <button 
              className="arrow-btn dream-btn" 
              onClick={() => setSelectedDreamIndex(prev => (prev + 1) % DREAMS.length)}
            >
              ▶
            </button>
          </div>
        </div>

        {mode === 'SELECT' && (
          <div className="action-stack">
            <button 
              className={`btn btn-primary main-action ${!name.trim() ? 'disabled' : ''}`} 
              onClick={handleStartLocal}
              disabled={!name.trim()}
              title={!name.trim() ? "Please enter your name first" : ""}
            >
              Play Local (Pass & Play)
            </button>
            <button 
              className={`btn ai-action ${!name.trim() ? 'disabled' : ''}`}
              onClick={() => {
                const myId = `human-${Date.now()}`;
                setMyPlayerId(myId);
                addPlayer(name || 'You', '#FF5A5F', currentProf, currentDream.id, false, myId);
                const botProf = PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)];
                const botDream = DREAMS[Math.floor(Math.random() * DREAMS.length)];
                addPlayer('Bot Alpha', '#38A169', botProf, botDream.id, true);
              }}
              disabled={!name.trim()}
              title={!name.trim() ? "Please enter your name first" : ""}
            >
              Play vs AI Bot
            </button>
            <button className="btn btn-secondary online-action" onClick={() => setMode('ONLINE')}>
              Play Online (Firebase)
            </button>
          </div>
        )}

        {mode === 'ONLINE' && (
          <div className="action-stack animate-fade-in">
            <button className="btn btn-primary" onClick={handleCreateOnline}>
              Create New Room
            </button>
            
            <div className="divider-row">
              <span className="divider-text">OR</span>
            </div>

            <div className="join-group">
              <input 
                type="text" 
                placeholder="Enter Room Code" 
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="join-input"
              />
              <button className="btn btn-success join-btn" onClick={handleJoinOnline}>
                Join
              </button>
            </div>
            
            <button className="btn btn-secondary back-btn" onClick={() => setMode('SELECT')}>
              Back
            </button>
          </div>
        )}
      </div>

      <style>{`
        .name-input-container {
          margin-bottom: 2rem;
        }

        .name-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 1.2rem;
          color: #fff;
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 800;
          text-align: center;
          letter-spacing: 1px;
          outline: none;
          transition: all 0.3s;
        }

        .name-input:focus {
          border-color: var(--color-primary);
          background: rgba(212, 175, 55, 0.08);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
        }

        .lobby-overlay {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-main);
          overflow: auto;
          padding: 1rem;
        }

        .lobby-card {
          width: 100%;
          max-width: 500px;
          padding: 2.5rem;
          text-align: center;
        }

        .gold-text {
          color: var(--color-primary);
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
        }

        .main-title { font-size: 3rem; margin-bottom: 0.5rem; }
        .subtitle { font-size: 1.1rem; margin-bottom: 2rem; }

        .selector-container {
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: rgba(0,0,0,0.3);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .selector-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1rem;
          color: var(--color-text-muted);
        }

        .selector-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .arrow-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(212, 175, 55, 0.3);
          background: rgba(212, 175, 55, 0.1);
          color: var(--color-primary);
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .arrow-btn:hover { background: var(--color-primary); color: #000; }

        .selection-info { flex: 1; min-width: 0; }
        .selection-name { font-size: 1.4rem; font-weight: 800; margin-bottom: 0.4rem; }
        .selection-stats { display: flex; justify-content: center; gap: 1.5rem; font-size: 0.8rem; }
        .stat { color: var(--color-text-muted); }
        .stat span { color: #fff; font-weight: 600; }

        .dream-selector { background: rgba(232, 62, 140, 0.05); border-color: rgba(232, 62, 140, 0.2); }
        .dream-label { color: #e83e8c; }
        .dream-btn { border-color: rgba(232, 62, 140, 0.3); background: rgba(232, 62, 140, 0.1); color: #e83e8c; }
        .dream-btn:hover { background: #e83e8c; color: #fff; }
        .dream-name { font-size: 1.2rem; }
        .dream-description { font-size: 0.75rem; color: var(--color-text-muted); line-height: 1.4; height: 2.8rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .dream-cost { color: #e83e8c; font-weight: 700; margin-top: 0.4rem; font-size: 0.9rem; }

        .action-stack { display: flex; flex-direction: column; gap: 1rem; }
        .btn { width: 100%; padding: 1.1rem; border-radius: 16px; font-weight: 800; }
        .ai-action { background: #6b46c1; color: #fff; }
        .ai-action:hover { background: #7c3aed; }

        .divider-row { display: flex; align-items: center; margin: 1rem 0; gap: 1rem; }
        .divider-row::before, .divider-row::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
        .divider-text { font-size: 0.7rem; color: var(--color-text-muted); }

        .join-group { display: flex; gap: 0.5rem; }
        .join-input {
          flex: 1;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 0 1.5rem;
          border-radius: 12px;
          font-family: inherit;
          font-size: 1.1rem;
          letter-spacing: 2px;
          outline: none;
        }
        .join-btn { width: auto; padding: 0 2rem; background: var(--color-success); color: #000; }

        .room-code-display {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: 12px;
          color: var(--color-success);
          margin: 2rem 0;
          padding: 2rem;
          background: rgba(0,0,0,0.4);
          border-radius: 24px;
          border: 1px solid rgba(0,230,118,0.2);
        }

        .waiting-indicator { color: var(--color-success); font-weight: 800; margin-top: 1rem; font-size: 0.9rem; letter-spacing: 2px; }

        @media (max-width: 480px) {
          .lobby-card { padding: 1.5rem; }
          .main-title { font-size: 2.2rem; }
          .selection-name { font-size: 1.2rem; }
          .arrow-btn { width: 36px; height: 36px; }
        }
      `}</style>
    </div>
  );
};
