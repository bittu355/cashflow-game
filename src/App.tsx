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

// Fail-safe initialization check
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled Promise Rejection:', event.reason);
  });
}

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
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => window.location.reload()} style={{ padding: '12px 32px', background: 'rgba(255,255,255,0.1)', border: '1px solid #D4AF37', borderRadius: '50px', color: '#D4AF37', fontWeight: '900', cursor: 'pointer' }}>REBOOT</button>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #F9E29C, #D4AF37)', border: 'none', borderRadius: '50px', color: '#000', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}>DEEP CLEAN</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const GameContent = () => {
  const gameStarted = useGameStore(state => state.gameStarted);

  if (!hasValidConfig) {
    return (
      <div className="lobby-overlay">
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 className="gold-text">CONFIGURATION REQUIRED</h2>
          <p className="pencil-text" style={{ marginTop: '1rem' }}>
            Firebase credentials are not set. 
          </p>
          <p className="pencil-text" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
            Please check your <code>.env</code> file or GitHub Secrets.
          </p>
        </div>
      </div>
    );
  }

  return (
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
  );
};

function App() {
  return (
    <ErrorBoundary>
      <GameContent />
    </ErrorBoundary>
  );
}

export default App;
