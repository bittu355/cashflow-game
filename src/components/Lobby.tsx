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
    </div>
  );
};

/* Removed Redundant Style Tag */
