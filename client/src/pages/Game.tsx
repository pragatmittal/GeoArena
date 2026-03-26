import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGameStore from '../hooks/useGameStore';
import { useSocket } from '../hooks/useSocket';
import { api } from '../lib/api';
import MapView from '../components/MapView';
import Lobby from '../components/Lobby';
import Timer from '../components/Timer';
import Scoreboard from '../components/Scoreboard';
import GameOver from '../components/GameOver';

const Game: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const socket = useSocket();
  const store = useGameStore();

  useEffect(() => {
    if (!store.username || !roomId) {
      return;
    }

    if (socket) {
      socket.emit('join_room', { roomId: roomId, username: store.username });

      socket.on('player_joined', (data: any) => store.setPlayers(data.players, data.hostUsername));
      socket.on('player_left', () => {
        // Will get a new player_joined with updated players right after
      });
      socket.on('game_started', () => {
        // prepare for round_started
      });
      socket.on('round_started', (data: any) => {
        store.setQuestion(data.roundIndex, data.totalRounds, data.question, data.duration);
      });
      socket.on('guess_received', () => {
        // Wait for round_ended
      });
      socket.on('round_ended', (data: any) => {
        store.setReveal(data.correctLocation, data.guesses, data.scores);
      });
      socket.on('score_updated', (data: any) => store.setPlayers(data.scores));
      socket.on('game_over', (data: any) => {
        store.setGameOver(data.finalScores, data.leaderboard);
      });
      socket.on('error', (data: any) => {
        alert(data.message);
        navigate('/');
      });

      return () => {
        socket.emit('leave_room', { roomId: roomId });
        socket.off('player_joined');
        socket.off('player_left');
        socket.off('game_started');
        socket.off('round_started');
        socket.off('guess_received');
        socket.off('round_ended');
        socket.off('score_updated');
        socket.off('game_over');
        socket.off('error');
      };
    }
  }, [socket, roomId, store.username, navigate]);

  if (!store.username) {
    return (
      <div className="app-container">
        <div className="panel" style={{ maxWidth: '400px', margin: '20vh auto', textAlign: 'center' }}>
          <h2>Join Room {roomId}</h2>
          <input 
            type="text" 
            placeholder="Enter your username" 
            style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                const name = e.currentTarget.value;
                if (!name) return;
                try {
                  const res = await api.get(`/rooms/${roomId?.toUpperCase()}`);
                  store.setRoomInfo(res.data.code, res.data.code, name);
                } catch {
                  alert('Room not found');
                  navigate('/');
                }
              }
            }}
          />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Press Enter to join</p>
        </div>
      </div>
    );
  }

  const renderPhase = () => {
    switch (store.phase) {
      case 'lobby':
        return <Lobby />;
      case 'question':
      case 'reveal':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Round {store.roundIndex + 1} / {store.totalRounds}</h2>
              <div className="panel" style={{ padding: '0.75rem 1.5rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid var(--accent)' }}>
                <strong>Find: </strong> {store.currentQuestion?.name}
                {store.currentQuestion?.hint && <div style={{ fontSize: '0.85rem', color: '#93c5fd' }}>Hint: {store.currentQuestion.hint}</div>}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 600px' }}>
                <MapView />
                {store.phase === 'question' && <div style={{ marginTop: '1rem' }}><Timer /></div>}
                
                {store.phase === 'reveal' && store.username === store.hostUsername && (
                  <button className="btn" style={{ marginTop: '1rem', width: '100%' }} onClick={() => socket?.emit('next_round', { roomId: roomId })}>
                    Next Round
                  </button>
                )}
                {store.phase === 'reveal' && store.username !== store.hostUsername && (
                  <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Waiting for host to start next round...</div>
                )}
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <Scoreboard />
              </div>
            </div>
          </div>
        );
      case 'finished':
        return <GameOver />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="app-container">
      {renderPhase()}
    </div>
  );
};

export default Game;
