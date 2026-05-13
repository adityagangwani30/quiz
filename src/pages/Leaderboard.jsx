import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard, onLeaderboardUpdate } from '../firebase/config';

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getLeaderboard().then(setEntries);
    const unsub = onLeaderboardUpdate(setEntries);
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  return (
    <div className="lb-page">
      <div className="gov-navbar">
        <div className="brand">
          <div className="emblem">🏛️</div>
          <div className="brand-text">
            <h1>KIADB Challenge — Live Leaderboard</h1>
            <p>Karnataka Industrial Application Challenge</p>
          </div>
        </div>
        <div className="nav-right">
          <button className="btn btn-sm btn-secondary" onClick={() => navigate('/')}>← Home</button>
        </div>
      </div>
      <div className="gov-sub-bar">
        <span>🏆 Real-Time Rankings</span>
        <span>{entries.length} Teams Submitted</span>
      </div>

      <div className="lb-content fade-in">
        <div className="lb-header">
          <h2>🏆 Challenge Leaderboard</h2>
          <p style={{color:'#64748b',fontSize:13,marginTop:4}}>Rankings update in real-time</p>
        </div>

        {entries.length === 0 ? (
          <div style={{textAlign:'center',padding:40,background:'#fff',borderRadius:8,color:'#94a3b8'}}>
            <p style={{fontSize:40,marginBottom:12}}>📊</p>
            <p>No submissions yet. Be the first team to complete the challenge!</p>
          </div>
        ) : (
          <table className="lb-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Score</th>
                <th>Accuracy</th>
                <th>Completion</th>
                <th>Speed</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr key={entry.sessionId} className={idx < 3 ? `rank-${idx+1}` : ''}>
                  <td>
                    <span className={`rank-badge ${idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : ''}`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                    </span>
                  </td>
                  <td>
                    <strong>{entry.teamName}</strong>
                    <div style={{fontSize:10,color:'#94a3b8'}}>#{entry.teamNumber}</div>
                  </td>
                  <td><strong style={{fontSize:18,color:'#1a3a6b'}}>{entry.finalScore}</strong>/100</td>
                  <td>{entry.accuracy}%</td>
                  <td>{entry.completion}%</td>
                  <td>{entry.speedBonus}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
