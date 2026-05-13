import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export default function Landing() {
  const { dispatch } = useGame();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [teamNumber, setTeamNumber] = useState('');

  const handleStart = (e) => {
    e.preventDefault();
    if (!teamName.trim() || !teamNumber.trim()) return;
    dispatch({ type: 'SET_TEAM_INFO', payload: { teamName: teamName.trim(), teamNumber: teamNumber.trim() } });
    dispatch({ type: 'START_LEVEL1' });
    navigate('/level1');
  };

  return (
    <div style={{minHeight:'100vh',background:'#f0f2f5'}}>
      {/* Government Navbar */}
      <div className="gov-navbar">
        <div className="brand">
          <div className="emblem">🏛️</div>
          <div className="brand-text">
            <h1>Government of Karnataka</h1>
            <p>Department of Industries & Commerce</p>
          </div>
        </div>
        <div className="nav-right">
          <span style={{opacity:.7}}>🇮🇳</span>
          <button className="btn btn-sm btn-secondary" onClick={() => navigate('/leaderboard')}>📊 Leaderboard</button>
          <button className="btn btn-sm btn-secondary" onClick={() => navigate('/admin')} style={{opacity:.6,fontSize:10}}>🔒 Admin</button>
        </div>
      </div>
      <div className="gov-sub-bar">
        <span>Karnataka Industrial Areas Development Board — Single Window System</span>
        <span>KIADB Online Services</span>
      </div>

      {/* Hero Banner */}
      <div style={{background:'linear-gradient(135deg,#0f2847 0%,#1a3a6b 40%,#2557a7 100%)',padding:'40px 20px',textAlign:'center',color:'#fff',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:.06,backgroundImage:'repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(255,255,255,.1) 35px,rgba(255,255,255,.1) 70px)'}}></div>
        <div style={{position:'relative',zIndex:1,maxWidth:700,margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'center',gap:16,marginBottom:16}}>
            <span style={{fontSize:36}}>🏗️</span>
            <span style={{fontSize:36}}>⚙️</span>
            <span style={{fontSize:36}}>🏭</span>
          </div>
          <h1 style={{fontSize:26,fontWeight:800,marginBottom:8,letterSpacing:'.5px',textShadow:'0 2px 8px rgba(0,0,0,.3)'}}>
            KIADB Industrial Application Challenge
          </h1>
          <p style={{fontSize:14,opacity:.85,lineHeight:1.7,maxWidth:550,margin:'0 auto'}}>
            A strategic industrial registration simulation challenge.<br/>
            Complete a realistic KIADB land allotment application under time pressure using limited documents.
          </p>
          <div style={{display:'flex',justifyContent:'center',gap:20,marginTop:20,flexWrap:'wrap'}}>
            <div style={{background:'rgba(255,255,255,.12)',borderRadius:8,padding:'10px 18px',backdropFilter:'blur(4px)'}}>
              <div style={{fontSize:20,fontWeight:800}}>⏱️ 5 min</div>
              <div style={{fontSize:10,opacity:.7}}>Time Limit</div>
            </div>
            <div style={{background:'rgba(255,255,255,.12)',borderRadius:8,padding:'10px 18px',backdropFilter:'blur(4px)'}}>
              <div style={{fontSize:20,fontWeight:800}}>📄 3 / 10</div>
              <div style={{fontSize:10,opacity:.7}}>Documents</div>
            </div>
            <div style={{background:'rgba(255,255,255,.12)',borderRadius:8,padding:'10px 18px',backdropFilter:'blur(4px)'}}>
              <div style={{fontSize:20,fontWeight:800}}>🎯 100</div>
              <div style={{fontSize:10,opacity:.7}}>Max Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{maxWidth:900,margin:'0 auto',padding:'24px 20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        {/* Team Registration Card */}
        <div style={{gridColumn:'1 / -1'}}>
          <form onSubmit={handleStart} style={{background:'#fff',borderRadius:8,boxShadow:'0 1px 3px rgba(0,0,0,.1)',borderTop:'4px solid #1a3a6b',padding:28}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <span style={{fontSize:24}}>📋</span>
              <div>
                <h2 style={{fontSize:18,color:'#1a3a6b',margin:0}}>Team Registration</h2>
                <p style={{fontSize:12,color:'#64748b',margin:0}}>Enter your team details to begin the Industrial Application Challenge</p>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
              <div className="form-group" style={{margin:0}}>
                <label>Team Name <span className="mandatory">*</span></label>
                <input className="form-input" type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Enter team name" required />
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Team Number <span className="mandatory">*</span></label>
                <input className="form-input" type="text" value={teamNumber} onChange={e => setTeamNumber(e.target.value)} placeholder="Assigned team number" required />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" style={{width:'100%',fontSize:15,padding:'14px 24px'}} disabled={!teamName.trim() || !teamNumber.trim()}>
              Proceed to Document Selection →
            </button>
          </form>
        </div>

        {/* Rules Card */}
        <div style={{background:'#fff',borderRadius:8,boxShadow:'0 1px 3px rgba(0,0,0,.1)',padding:20,borderLeft:'4px solid #e87722'}}>
          <h3 style={{fontSize:14,color:'#1a3a6b',marginBottom:12,display:'flex',alignItems:'center',gap:8}}>📌 Challenge Rules</h3>
          <ul style={{fontSize:12,color:'#475569',lineHeight:2,paddingLeft:18,margin:0}}>
            <li><strong>Level 1:</strong> Select 3 documents from 10 available</li>
            <li><strong>Level 2:</strong> Complete the KIADB application form</li>
            <li>Extract information from documents manually</li>
            <li>Wrong document choices = harder application</li>
            <li>Form auto-submits when timer reaches zero</li>
          </ul>
        </div>

        {/* Scoring Card */}
        <div style={{background:'#fff',borderRadius:8,boxShadow:'0 1px 3px rgba(0,0,0,.1)',padding:20,borderLeft:'4px solid #16a34a'}}>
          <h3 style={{fontSize:14,color:'#1a3a6b',marginBottom:12,display:'flex',alignItems:'center',gap:8}}>🎯 Scoring System</h3>
          <div style={{fontSize:12,color:'#475569',lineHeight:2}}>
            <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid #f1f5f9'}}><span>Accuracy</span><strong>50%</strong></div>
            <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid #f1f5f9'}}><span>Completion</span><strong>30%</strong></div>
            <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}><span>Speed Bonus</span><strong>20%</strong></div>
          </div>
          <p style={{fontSize:11,color:'#94a3b8',marginTop:8}}>Final score calculated out of 100 points</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{textAlign:'center',padding:'20px',fontSize:10,color:'#94a3b8',borderTop:'1px solid #dce1e8',marginTop:20}}>
        Government of Karnataka • Department of Industries & Commerce • KIADB • Karnataka Single Window System
      </div>
    </div>
  );
}
