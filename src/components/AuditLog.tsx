import React from 'react';
import { useGameStore } from '../store/gameStore';

export const AuditLog = () => {
  const history = useGameStore(state => state.history);
  const players = useGameStore(state => state.players);

  return (
    <div className="glass-panel" style={{ 
      marginTop: '1rem', 
      height: '250px', 
      display: 'flex', 
      flexDirection: 'column',
      border: '1px solid rgba(255,255,255,0.1)',
      overflow: 'hidden'
    }}>
      <div style={{ 
        padding: '0.8rem', 
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        backgroundColor: 'rgba(0,0,0,0.2)',
        fontWeight: 'bold',
        color: 'var(--color-primary)',
        fontSize: '0.9rem',
        letterSpacing: '1px'
      }}>
        TRANSACTION HISTORY
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {history.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem' }}>
            No transactions yet.
          </div>
        )}
        
        {history.map((record) => {
          const player = players.find(p => p.id === record.playerId);
          return (
            <div key={record.id} style={{ 
              backgroundColor: 'rgba(255,255,255,0.03)', 
              padding: '0.6rem', 
              borderRadius: '8px',
              fontSize: '0.8rem',
              borderLeft: `3px solid ${player?.color || 'white'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 'bold', color: player?.color }}>{player?.name || 'System'}</span>
                <span style={{ opacity: 0.5 }}>{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <div style={{ color: '#fff' }}>{record.description}</div>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.2rem', fontSize: '0.75rem' }}>
                {record.amount !== 0 && (
                  <span style={{ color: record.amount > 0 ? 'var(--color-success)' : '#ff4d4d' }}>
                    {record.amount > 0 ? '+' : ''}${Math.abs(record.amount).toLocaleString()} Cash
                  </span>
                )}
                {record.cashflowChange !== 0 && (
                  <span style={{ color: record.cashflowChange > 0 ? '#00d4ff' : '#ffaa00' }}>
                    {record.cashflowChange > 0 ? '+' : ''}${record.cashflowChange.toLocaleString()} CF
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
