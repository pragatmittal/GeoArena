import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../hooks/useGameStore';
import { api } from '../lib/api';

const Home: React.FC = () => {
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setRoomInfo = useGameStore(s => s.setRoomInfo);

  const handleCreate = async () => {
    if (!name) return setError('Enter a username first');
    try {
      const res = await api.post('/rooms', { host: name });
      setRoomInfo(res.data.code, res.data.code, name);
      navigate(`/room/${res.data.code}`);
    } catch (err) {
      setError('Failed to create room');
    }
  };

  const handleJoin = async () => {
    if (!name) return setError('Enter a username first');
    if (!joinCode) return setError('Enter a room code');
    try {
      const res = await api.get(`/rooms/${joinCode.toUpperCase()}`);
      setRoomInfo(res.data.code, res.data.code, name);
      navigate(`/room/${res.data.code}`);
    } catch (err) {
      setError('Room not found');
    }
  };

  return (
    <div className="app-container">
      <div className="panel" style={{ maxWidth: '500px', margin: '10vh auto', textAlign: 'center' }}>
        <h1 className="title">Geo Arena</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>A real-time multiplayer geography quiz!</p>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

        <div style={{ padding: '0', borderRadius: '12px' }}>
          <input
            type="text"
            placeholder="Step 1: Enter Your Username"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />

          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <h3 style={{ color: '#93c5fd', marginTop: 0 }}>Option A: Host a Game</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Create a brand new room and send the code to your friends.</p>
              <button type="button" className="btn" style={{ width: '100%' }} onClick={handleCreate}>
                Create Room
              </button>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <h3 style={{ color: '#86efac', marginTop: 0 }}>Option B: Join Existing Game</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Paste the 6-letter room code you received to join.</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="EX: ZV0OK8"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleJoin(); }}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', textTransform: 'uppercase' }}
                  maxLength={6}
                />
                <button type="button" className="btn" style={{ background: 'var(--success)' }} onClick={handleJoin}>
                  Join Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
