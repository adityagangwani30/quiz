import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getSubmissionStatus } from '../data/scoring';

export default function ResultScreen() {
  const { state } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.score) navigate('/');
  }, []);

  if (!state.score) return null;

  const status = getSubmissionStatus(state.score.finalScore);
  const mins = Math.floor(state.score.timeRemaining / 60);
  const secs = state.score.timeRemaining % 60;

  return (
    <div className="result-page">
      <div className="gov-navbar">
        <div className="brand">
          <div className="emblem">🏛️</div>
          <div className="brand-text">
            <h1>KIADB — Application Review</h1>
            <p>Karnataka Single Window System</p>
          </div>
        </div>
      </div>
      <div className="gov-sub-bar">
        <span>Application ID: {state.applicationId}</span>
        <span>Team: {state.teamName} (#{state.teamNumber})</span>
      </div>

      <div className="result-content fade-in">
        <div className="result-hero">
          <div className="score-circle">
            <div>
              <div className="score-num">{state.score.finalScore}</div>
              <div className="score-label">out of 100</div>
            </div>
          </div>
          <h2>{state.teamName}</h2>
          <p style={{opacity:.8,fontSize:13}}>Team #{state.teamNumber} • Session: {state.sessionId?.slice(0,8)}</p>
          <div className="status-pill" style={{background: status.color, color:'#fff'}}>
            {status.icon} {status.status}
          </div>
          <div style={{marginTop:16}}>
            <span className="stamp" style={{color: status.color, borderColor: status.color}}>
              {status.status}
            </span>
          </div>
        </div>

        <div className="result-cards">
          <div className="result-stat">
            <div className="stat-val">{state.score.accuracy}%</div>
            <div className="stat-label">Accuracy (50%)</div>
          </div>
          <div className="result-stat">
            <div className="stat-val">{state.score.completion}%</div>
            <div className="stat-label">Completion (30%)</div>
          </div>
          <div className="result-stat">
            <div className="stat-val">{state.score.speedBonus}%</div>
            <div className="stat-label">Speed Bonus (20%)</div>
          </div>
          <div className="result-stat">
            <div className="stat-val">{mins}:{String(secs).padStart(2,'0')}</div>
            <div className="stat-label">Time Remaining</div>
          </div>
        </div>

        <div style={{background:'#fff',borderRadius:8,padding:20,boxShadow:'0 1px 3px rgba(0,0,0,.1)',marginBottom:20}}>
          <h3 style={{fontSize:15,color:'#1a3a6b',marginBottom:12}}>📊 Detailed Breakdown</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,fontSize:13}}>
            <div style={{padding:8,background:'#f8fafc',borderRadius:6}}>
              <div style={{color:'#64748b',fontSize:11}}>Correct Fields</div>
              <div style={{fontWeight:700}}>{state.score.details.correctFields} / {Object.keys(state.score.details).length > 0 ? state.score.details.totalFields : '—'}</div>
            </div>
            <div style={{padding:8,background:'#f8fafc',borderRadius:6}}>
              <div style={{color:'#64748b',fontSize:11}}>Fields Filled</div>
              <div style={{fontWeight:700}}>{state.score.details.totalFieldsFilled} / {state.score.details.totalFields}</div>
            </div>
            <div style={{padding:8,background:'#f8fafc',borderRadius:6}}>
              <div style={{color:'#64748b',fontSize:11}}>Mandatory Filled</div>
              <div style={{fontWeight:700}}>{state.score.details.mandatoryFilled} / {state.score.details.totalMandatory}</div>
            </div>
            <div style={{padding:8,background:'#f8fafc',borderRadius:6}}>
              <div style={{color:'#64748b',fontSize:11}}>Documents Used</div>
              <div style={{fontWeight:700}}>{state.selectedDocuments.length} / 3</div>
            </div>
          </div>
        </div>

        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <button className="btn btn-primary" onClick={() => navigate('/leaderboard')}>📊 View Leaderboard</button>
          <button className="btn btn-outline" onClick={() => { window.location.href = '/'; }}>🔄 New Challenge</button>
        </div>
      </div>
    </div>
  );
}
