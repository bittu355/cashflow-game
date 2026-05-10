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
      <div className="error-screen glass-panel" style={{ margin: '2rem', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-danger)' }}>⚠️ Configuration Missing</h1>
        <p>Firebase environment variables are not set. This usually happens when deploying without setting up GitHub Secrets or a local .env file.</p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', textAlign: 'left', fontSize: '0.8rem' }}>
          <code>
            VITE_FIREBASE_API_KEY<br/>
            VITE_FIREBASE_DATABASE_URL<br/>
            ...
          </code>
        </div>
        <p style={{ marginTop: '1rem', opacity: 0.7 }}>Please check the README for setup instructions.</p>
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
