import { Ledger } from './components/Ledger';
import { Board } from './components/Board';
import { Lobby } from './components/Lobby';
import { GameWinModal } from './components/GameWinModal';
import { useGameStore } from './store/gameStore';
import './index.css';

function App() {
  const players = useGameStore(state => state.players);

  if (players.length === 0) {
    return <Lobby />;
  }

  return (
    <div className="app-container">
      <Board />
      <Ledger />
      <GameWinModal />
    </div>
  );
}

export default App;
