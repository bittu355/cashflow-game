import { useState } from 'react';
import { Lobby } from './components/Lobby';
import { Board } from './components/Board';
import { Ledger } from './components/Ledger';
import { useGameStore } from './store/gameStore';
import './App.css';

function App() {
  const { players } = useGameStore();

  if (players.length === 0) {
    return <Lobby />;
  }

  return (
    <div className="app-container">
      <Board />
      <Ledger />
    </div>
  );
}

export default App;
