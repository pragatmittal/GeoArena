import React from 'react';
import useGameStore from '../hooks/useGameStore';
import { useSocket } from '../hooks/useSocket';

const Lobby: React.FC = () => {
  const { roomCode, hostUsername, username, players } = useGameStore();
  const isHost = hostUsername === username;
  const socket = useSocket();

  const handleStart = () => {
    if (socket) {
      socket.emit('start_game', { roomId: roomCode });
    }
  };

  return (
    <div className="panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2 className="title">Room Code</h2>
      <div className="mono" style={{ margin: '1rem 0' }}>{roomCode}</div>
      <p style={{ color: 'var(--text-muted)' }}>Share this code with your friends!</p>
      
      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <h3>Players ({players.length}/8)</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {players.map((p, i) => (
            <li key={i} style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
              <span>
                {p.username} {p.username === hostUsername ? '(Host)' : ''}
              </span>
              <span style={{ color: 'var(--success)' }}>Ready</span>
            </li>
          ))}
        </ul>
      </div>

      {isHost ? (
        <button 
          className="btn" 
          style={{ marginTop: '2rem', width: '100%' }}
          onClick={handleStart}
          disabled={players.length < 2}
        >
          {players.length < 2 ? 'Need multiple players to start...' : 'Start Game'}
        </button>
      ) : (
        <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>Waiting for host to start...</p>
      )}
    </div>
  );
};

export default Lobby;
