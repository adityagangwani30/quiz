import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSessions, getLeaderboard, clearAllData, onLeaderboardUpdate } from '../firebase/config';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem('kiadb_admin') !== 'true') {
      navigate('/admin');
      return;
    }
    loadData();
    const unsub = onLeaderboardUpdate(setLeaderboard);
    const interval = setInterval(loadData, 5000);
    return () => { clearInterval(interval); if (typeof unsub === 'function') unsub(); };
  }, []);

  const loadData = async () => {
    const s = await getAllSessions();
    setSessions(s.filter(Boolean));
    const lb = await getLeaderboard();
    setLeaderboard(lb);
  };

  const handleReset = () => {
    if (window.confirm('Clear ALL data? This cannot be undone.')) {
      clearAllData().then(() => { setSessions([]); setLeaderboard([]); });
    }
  };

  const handleExport = () => {
    const data = { sessions, leaderboard, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'kiadb_challenge_export.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const submitted = sessions.filter(s => s.submitted);
  const active = sessions.filter(s => !s.submitted);

  return (
    <div className="admin-page">
      <div className="gov-navbar">
        <div className="brand">
          <div className="emblem">🔒</div>
          <div className="brand-text">
            <h1>KIADB Admin Dashboard</h1>
            <p>Challenge Administration Panel</p>
          </div>
        </div>
        <div className="nav-right">
          <button className="btn btn-sm btn-secondary" onClick={() => navigate('/leaderboard')}>📊 Leaderboard</button>
          <button className="btn btn-sm btn-secondary" onClick={() => { sessionStorage.removeItem('kiadb_admin'); navigate('/'); }}>🚪 Logout</button>
        </div>
      </div>
      <div className="gov-sub-bar">
        <span>🛡️ Administrator Mode — Full Access</span>
        <span>Auto-refresh: 5s</span>
      </div>

      <div className="admin-content fade-in">
        <div className="admin-stats">
          <div className="admin-stat">
            <div className="as-val">{sessions.length}</div>
            <div className="as-label">Total Teams</div>
          </div>
          <div className="admin-stat">
            <div className="as-val">{active.length}</div>
            <div className="as-label">Active Now</div>
          </div>
          <div className="admin-stat">
            <div className="as-val">{submitted.length}</div>
            <div className="as-label">Submitted</div>
          </div>
          <div className="admin-stat">
            <div className="as-val">{leaderboard.length > 0 ? leaderboard[0].finalScore : '—'}</div>
            <div className="as-label">Top Score</div>
          </div>
        </div>

        <div className="admin-actions">
          <button className="btn btn-primary btn-sm" onClick={loadData}>🔄 Refresh</button>
          <button className="btn btn-outline btn-sm" onClick={handleExport}>📥 Export Data</button>
          <button className="btn btn-danger btn-sm" onClick={handleReset}>🗑️ Reset All</button>
        </div>

        {/* Sessions Table */}
        <div style={{background:'#fff',borderRadius:8,overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,.1)',marginBottom:20}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid #dce1e8',fontWeight:700,fontSize:14,color:'#1a3a6b'}}>
            📋 All Team Sessions
          </div>
          {sessions.length === 0 ? (
            <div style={{padding:24,textAlign:'center',color:'#94a3b8',fontSize:13}}>No sessions yet</div>
          ) : (
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead>
                  <tr style={{background:'#f8fafc'}}>
                    <th style={{padding:'8px 12px',textAlign:'left',color:'#64748b'}}>Team</th>
                    <th style={{padding:'8px 12px',textAlign:'left',color:'#64748b'}}>Phase</th>
                    <th style={{padding:'8px 12px',textAlign:'left',color:'#64748b'}}>Timer</th>
                    <th style={{padding:'8px 12px',textAlign:'left',color:'#64748b'}}>Score</th>
                    <th style={{padding:'8px 12px',textAlign:'left',color:'#64748b'}}>Status</th>
                    <th style={{padding:'8px 12px',textAlign:'left',color:'#64748b'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => (
                    <tr key={s.sessionId} style={{borderBottom:'1px solid #f1f5f9'}}>
                      <td style={{padding:'8px 12px'}}>
                        <strong>{s.teamName}</strong><br/>
                        <span style={{color:'#94a3b8',fontSize:10}}>#{s.teamNumber}</span>
                      </td>
                      <td style={{padding:'8px 12px'}}><span className={`status-badge ${s.phase}`}>{s.phase}</span></td>
                      <td style={{padding:'8px 12px'}}>{s.timeRemaining != null ? `${Math.floor(s.timeRemaining/60)}:${String(s.timeRemaining%60).padStart(2,'0')}` : '—'}</td>
                      <td style={{padding:'8px 12px',fontWeight:700}}>{s.score ? s.score.finalScore : '—'}</td>
                      <td style={{padding:'8px 12px'}}>{s.submitted ? '✅ Submitted' : '⏳ In Progress'}</td>
                      <td style={{padding:'8px 12px'}}>
                        <button className="btn btn-sm btn-outline" style={{fontSize:10,padding:'3px 8px'}}
                          onClick={() => setSelectedSession(s === selectedSession ? null : s)}>
                          {s === selectedSession ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Session Detail */}
        {selectedSession && (
          <div style={{background:'#fff',borderRadius:8,padding:20,boxShadow:'0 1px 3px rgba(0,0,0,.1)',marginBottom:20}} className="fade-in">
            <h3 style={{fontSize:15,color:'#1a3a6b',marginBottom:12}}>📄 {selectedSession.teamName} — Form Data</h3>
            {selectedSession.formData && Object.keys(selectedSession.formData).length > 0 ? (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:12}}>
                {Object.entries(selectedSession.formData).map(([key, val]) => (
                  <div key={key} style={{padding:6,background:'#f8fafc',borderRadius:4}}>
                    <div style={{color:'#94a3b8',fontSize:10}}>{key}</div>
                    <div style={{fontWeight:600}}>{String(val)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{color:'#94a3b8',fontSize:12}}>No form data submitted</p>
            )}
            <div style={{marginTop:12}}>
              <strong style={{fontSize:12}}>Selected Documents:</strong>
              <span style={{fontSize:12,marginLeft:8}}>{selectedSession.selectedDocuments?.join(', ') || 'None'}</span>
            </div>
          </div>
        )}

        {/* Leaderboard Preview */}
        <div style={{background:'#fff',borderRadius:8,overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,.1)'}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid #dce1e8',fontWeight:700,fontSize:14,color:'#1a3a6b'}}>
            🏆 Leaderboard
          </div>
          {leaderboard.length === 0 ? (
            <div style={{padding:24,textAlign:'center',color:'#94a3b8',fontSize:13}}>No submissions</div>
          ) : (
            <table className="lb-table">
              <thead><tr><th>Rank</th><th>Team</th><th>Score</th><th>Accuracy</th><th>Completion</th><th>Speed</th></tr></thead>
              <tbody>
                {leaderboard.map((e, i) => (
                  <tr key={e.sessionId} className={i < 3 ? `rank-${i+1}` : ''}>
                    <td>{i+1}</td>
                    <td><strong>{e.teamName}</strong></td>
                    <td><strong>{e.finalScore}</strong></td>
                    <td>{e.accuracy}%</td>
                    <td>{e.completion}%</td>
                    <td>{e.speedBonus}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
