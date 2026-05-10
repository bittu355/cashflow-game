import { Ledger } from './components/Ledger';
import { Board } from './components/Board';
import { Lobby } from './components/Lobby';
import { TopNav } from './components/TopNav';
import { GameWinModal } from './components/GameWinModal';
import { useGameStore } from './store/gameStore';
import { hasValidConfig } from './utils/firebase';
import './utils/multiplayer'; 
import './index.css';

function App() {
  const players = useGameStore(state => state.players);

  if (!hasValidConfig) {
    return (
      <div className="lobby-overlay">
        <div className="mesh-gradient-bg" />
        <div className="glass-panel lobby-card animate-pop-in" style={{ borderColor: 'var(--color-danger)' }}>
          <div className="error-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 className="gold-text" style={{ filter: 'hue-rotate(320deg)' }}>Configuration Required</h1>
          <p className="pencil-text" style={{ margin: '1rem 0', opacity: 0.8 }}>
            Firebase environment variables are missing. 
          </p>
          <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,0,0,0.1)', borderRadius: '12px', fontSize: '0.8rem', textAlign: 'left', fontFamily: 'monospace' }}>
            VITE_FIREBASE_API_KEY<br/>
            VITE_FIREBASE_AUTH_DOMAIN<br/>
            VITE_FIREBASE_DATABASE_URL<br/>
            VITE_FIREBASE_PROJECT_ID
          </div>
          <p className="pencil-text" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
            Please check your <code>.env</code> file or GitHub Secrets.
          </p>
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return <Lobby />;
  }

  return (
    <div className="app-container">
      <TopNav />
      <div className="main-game-layout">
        <Board />
        <Ledger />
      </div>
      <GameWinModal />
    </div>
  );
}

export default App;
