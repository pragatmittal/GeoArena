import React from 'react';
import useGameStore from '../hooks/useGameStore';

const Scoreboard: React.FC = () => {
  const { players } = useGameStore();
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="panel">
      <h3 style={{ marginBottom: '1rem' }}>Live Scores</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>RANK</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>PLAYER</th>
            <th style={{ textAlign: 'center', padding: '0.5rem' }}>SCORE</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.75rem 0.5rem' }}>{i + 1}</td>
              <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{p.username}</td>
              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', color: 'var(--success)' }}>{p.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;
