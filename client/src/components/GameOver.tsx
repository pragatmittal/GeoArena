import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../hooks/useGameStore';

const GameOver: React.FC = () => {
  const { finalScores, leaderboard } = useGameStore();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="panel" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="title">Game Over!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here are the final results</p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="panel" style={{ flex: '1 1 350px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🏆 Final Standings</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>#</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Player</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {finalScores.map((p: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i === 0 ? 'rgba(251, 191, 36, 0.1)' : '' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{p.username}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', color: 'var(--success)' }}>{p.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel" style={{ flex: '1 1 350px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#a78bfa' }}>🌍 Global Leaderboard</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>#</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Player</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>Total</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>Games</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.5rem' }}>{i + 1}</td>
                  <td style={{ padding: '0.5rem' }}>{entry.username}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>{entry.totalScore}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>{entry.gamesPlayed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button 
        className="btn" 
        style={{ marginTop: '2rem', width: '100%', fontSize: '1.1rem' }}
        onClick={() => {
          navigate('/');
          window.location.reload();
        }}
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOver;
