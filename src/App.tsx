import React from 'react';
import { Ledger } from './components/Ledger';
import { Board } from './components/Board';
import { Lobby } from './components/Lobby';
import { TopNav } from './components/TopNav';
import { FreedomMeter } from './components/FreedomMeter';
import { GameWinModal } from './components/GameWinModal';
import { useGameStore } from './store/gameStore';
import { hasValidConfig } from './utils/firebase';
import './utils/multiplayer'; 
import './index.css';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) { 
    console.error("CRITICAL ENGINE ERROR:", error, errorInfo); 
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#0A0A0F', height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', letterSpacing: '4px' }}>ENGINE RECOVERY</h1>
          <p style={{ opacity: 0.7, marginBottom: '2rem', maxWidth: '400px' }}>A synchronization error occurred. We're stabilizing the financial simulation.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #F9E29C, #D4AF37)', border: 'none', borderRadius: '50px', color: '#000', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}>REBOOT SYSTEM</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { players, gameStarted } = useGameStore(state => ({ 
    players: state.players, 
    gameStarted: state.gameStarted 
  }));

  // Note: hasValidConfig is now hardcoded to true in utils/firebase.ts for stability
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
          <p className="pencil-text" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
            Please check your <code>.env</code> file or GitHub Secrets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app-container">
        {!gameStarted ? (
          <Lobby />
        ) : (
          <>
            <TopNav />
            <FreedomMeter />
            <div className="main-game-layout">
              <Board />
              <Ledger />
            </div>
            <GameWinModal />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
