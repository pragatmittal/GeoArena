import React, { useEffect } from 'react';
import useGameStore from '../hooks/useGameStore';

const Timer: React.FC = () => {
  const { timeLeft, updateTimeLeft, phase } = useGameStore();

  useEffect(() => {
    if (phase !== 'question') return;
    const interval = setInterval(() => {
      updateTimeLeft();
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, updateTimeLeft]);

  const percentage = (timeLeft / useGameStore.getState().roundDuration) * 100;
  const color = timeLeft <= 5 ? 'var(--danger)' : timeLeft <= 10 ? 'var(--warning)' : 'var(--accent)';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 600 }}>Time Left</span>
        <span style={{ fontWeight: 700, color, fontSize: '1.2rem' }}>{timeLeft}s</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: color,
            borderRadius: '4px',
            transition: 'width 1s linear, background 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

export default Timer;
