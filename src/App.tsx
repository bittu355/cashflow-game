import { Ledger } from './components/Ledger';
import { Board } from './components/Board';
import { Lobby } from './components/Lobby';
import { TopNav } from './components/TopNav';
import { GameWinModal } from './components/GameWinModal';
import { useGameStore } from './store/gameStore';
import './utils/multiplayer'; 
import './index.css';

function App() {
  const players = useGameStore(state => state.players);

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
