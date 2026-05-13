import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { DOCUMENTS } from '../data/documents';
import { FORM_SECTIONS } from '../data/formSections';

function Timer({ timeRemaining }) {
  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const cls = timeRemaining <= 20 ? 'critical' : timeRemaining <= 60 ? 'warning' : '';
  return (
    <div className={`timer-widget ${cls}`}>
      <div>
        <div className="timer-label">Time Remaining</div>
        <div className="timer-display">{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</div>
      </div>
      <div style={{fontSize:20}}>{timeRemaining <= 20 ? '🔴' : timeRemaining <= 60 ? '🟡' : '🟢'}</div>
    </div>
  );
}

function SimplifiedDocument({ docId }) {
  const doc = DOCUMENTS.find(d => d.id === docId);
  if (!doc) return null;

  return (
    <div style={{background: '#fff', borderRadius: 8, padding: 16, marginBottom: 16, borderLeft: '4px solid #2557a7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
      <h4 style={{margin: '0 0 12px 0', fontSize: 14, color: '#1a3a6b', display: 'flex', alignItems: 'center', gap: 8}}>
        {doc.icon} {doc.title.toUpperCase()}
      </h4>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: 12}}>
        {Object.entries(doc.content.fields).map(([key, val]) => (
          <div key={key} style={{padding: '4px 0', borderBottom: '1px solid #f1f5f9'}}>
            <span style={{color: '#64748b', display: 'block', fontSize: 10, textTransform: 'uppercase'}}>{key}</span>
            <strong style={{color: '#1e293b'}}>{val}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Level2() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [warningPopup, setWarningPopup] = useState(null);

  // Redirect if not ready
  useEffect(() => {
    if (!state.sessionId || state.selectedDocuments.length === 0) {
      navigate('/');
    }
  }, []);

  // Redirect on submit
  useEffect(() => {
    if (state.submitted) navigate('/result');
  }, [state.submitted]);

  // Warning popups
  useEffect(() => {
    if (state.timeRemaining === 120 && !state.warningShown120) {
      setWarningPopup(120);
      dispatch({ type: 'SET_WARNING_SHOWN', payload: 120 });
      setTimeout(() => setWarningPopup(null), 3000);
    }
    if (state.timeRemaining === 60 && !state.warningShown60) {
      setWarningPopup(60);
      dispatch({ type: 'SET_WARNING_SHOWN', payload: 60 });
      setTimeout(() => setWarningPopup(null), 3000);
    }
    if (state.timeRemaining === 20 && !state.warningShown20) {
      setWarningPopup(20);
      dispatch({ type: 'SET_WARNING_SHOWN', payload: 20 });
      setTimeout(() => setWarningPopup(null), 3000);
    }
  }, [state.timeRemaining]);

  const filledCount = Object.values(state.formData).filter(v => v && String(v).trim()).length;
  const totalFields = FORM_SECTIONS.reduce((sum, s) => sum + s.fields.length, 0);
  const completionPct = Math.round((filledCount / totalFields) * 100);

  const handleSubmit = () => {
    if (window.confirm('Submit your application? This action cannot be undone.')) {
      dispatch({ type: 'SUBMIT' });
    }
  };

  const currentSection = FORM_SECTIONS.find(s => s.id === state.activeSection) || FORM_SECTIONS[0];

  return (
    <div className="level2-page">
      {/* Navbar */}
      <div className="gov-navbar">
        <div className="brand">
          <div className="emblem">🏛️</div>
          <div className="brand-text">
            <h1>KIADB — Industrial Application Portal</h1>
            <p>Karnataka Single Window System</p>
          </div>
        </div>
        <div className="nav-right">
          <span>👤 {state.teamName}</span>
          <span>#{state.teamNumber}</span>
        </div>
      </div>
      <div className="gov-sub-bar">
        <span>📋 Application ID: {state.applicationId}</span>
        <span>Session: {state.sessionId?.slice(0,8)}</span>
      </div>

      {/* Application Header */}
      <div className="app-header">
        <div className="app-header-inner">
          <div className="app-id-block">
            <span className="app-label">Application Reference</span>
            <span className="app-id">{state.applicationId}</span>
          </div>
          <div className="progress-block">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{width:`${completionPct}%`}}></div>
            </div>
            <div className="progress-text">{completionPct}% Complete — {filledCount}/{totalFields} fields</div>
          </div>
          <div className="app-status draft">📝 Draft</div>
        </div>
      </div>

      <Timer timeRemaining={state.timeRemaining} />

      {/* Main body - SIDE BY SIDE LAYOUT */}
      <div className="level2-body" style={{display: 'flex', flexDirection: 'row'}}>
        
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">Application Sections</div>
          {FORM_SECTIONS.map((section, idx) => {
            const sectionFilled = section.fields.filter(f => state.formData[f.id] && String(state.formData[f.id]).trim()).length;
            return (
              <div
                key={section.id}
                className={`sidebar-item ${state.activeSection === section.id ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ACTIVE_SECTION', payload: section.id })}
              >
                <span className="s-icon">{section.icon}</span>
                <span>{section.title}</span>
                <span className="s-num">{sectionFilled}/{section.fields.length}</span>
              </div>
            );
          })}
          <div style={{padding:16}}>
            <button className="btn btn-success" style={{width:'100%'}} onClick={handleSubmit}>
              ✅ Submit Application
            </button>
          </div>
        </div>

        {/* Mobile sidebar */}
        <button className="mobile-sidebar-btn" onClick={() => setShowMobileSidebar(!showMobileSidebar)}>☰</button>
        <div className={`mobile-sidebar ${showMobileSidebar ? 'open' : ''}`}>
          <div className="sidebar-header" style={{display:'flex',justifyContent:'space-between'}}>
            <span>Sections</span>
            <button onClick={() => setShowMobileSidebar(false)} style={{background:'none',border:'none',fontSize:18,cursor:'pointer'}}>✕</button>
          </div>
          {FORM_SECTIONS.map(section => (
            <div key={section.id} className={`sidebar-item ${state.activeSection === section.id ? 'active' : ''}`}
              onClick={() => { dispatch({ type: 'SET_ACTIVE_SECTION', payload: section.id }); setShowMobileSidebar(false); }}>
              <span className="s-icon">{section.icon}</span>
              <span>{section.title}</span>
            </div>
          ))}
          <div style={{padding:16}}>
            <button className="btn btn-success" style={{width:'100%'}} onClick={handleSubmit}>✅ Submit</button>
          </div>
        </div>

        {/* Form area (Left Side) */}
        <div className="form-area" style={{flex: 1, borderRight: '1px solid #dce1e8'}}>
          <div className="section-card fade-in" key={currentSection.id}>
            <div className="section-header">
              <span className="s-icon">{currentSection.icon}</span>
              <div>
                <h3>{currentSection.title}</h3>
                <p>{currentSection.description}</p>
              </div>
            </div>
            <div className="section-body">
              <div className="field-grid">
                {currentSection.fields.map(field => (
                  <div className="form-group" key={field.id}>
                    {field.type === 'checkbox' ? (
                      <div className="checkbox-group">
                        <input type="checkbox" id={field.id}
                          checked={!!state.formData[field.id]}
                          onChange={e => dispatch({ type: 'UPDATE_FORM_FIELD', payload: { fieldId: field.id, value: e.target.checked }})}
                        />
                        <label htmlFor={field.id}>
                          {field.mandatory && <span className="mandatory">* </span>}
                          {field.checkboxLabel}
                        </label>
                      </div>
                    ) : (
                      <>
                        <label>{field.label} {field.mandatory && <span className="mandatory">*</span>}</label>
                        {field.type === 'select' ? (
                          <select className="form-input"
                            value={state.formData[field.id] || ''}
                            onChange={e => dispatch({ type: 'UPDATE_FORM_FIELD', payload: { fieldId: field.id, value: e.target.value }})}>
                            <option value="">— Select —</option>
                            {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea className="form-input form-textarea" placeholder={field.placeholder}
                            value={state.formData[field.id] || ''}
                            onChange={e => dispatch({ type: 'UPDATE_FORM_FIELD', payload: { fieldId: field.id, value: e.target.value }})}
                          />
                        ) : (
                          <input className="form-input" type="text" placeholder={field.placeholder}
                            value={state.formData[field.id] || ''}
                            onChange={e => dispatch({ type: 'UPDATE_FORM_FIELD', payload: { fieldId: field.id, value: e.target.value }})}
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="section-actions">
              <button className="btn btn-outline btn-sm"
                disabled={FORM_SECTIONS.findIndex(s => s.id === state.activeSection) === 0}
                onClick={() => {
                  const idx = FORM_SECTIONS.findIndex(s => s.id === state.activeSection);
                  if (idx > 0) dispatch({ type: 'SET_ACTIVE_SECTION', payload: FORM_SECTIONS[idx - 1].id });
                }}>← Previous</button>
              {FORM_SECTIONS.findIndex(s => s.id === state.activeSection) < FORM_SECTIONS.length - 1 ? (
                <button className="btn btn-primary btn-sm"
                  onClick={() => {
                    const idx = FORM_SECTIONS.findIndex(s => s.id === state.activeSection);
                    dispatch({ type: 'SET_ACTIVE_SECTION', payload: FORM_SECTIONS[idx + 1].id });
                  }}>Next Section →</button>
              ) : (
                <button className="btn btn-success btn-sm" onClick={handleSubmit}>✅ Submit Application</button>
              )}
            </div>
          </div>
        </div>

        {/* Document Panel (Right Side) - Persistent and Readable */}
        <div style={{width: '400px', flexShrink: 0, background: '#f8fafc', padding: 20, overflowY: 'auto'}}>
          <h3 style={{fontSize: 14, color: '#475569', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px'}}>
            📄 Document Reference Panel
          </h3>
          {state.selectedDocuments && state.selectedDocuments.length > 0 ? (
            state.selectedDocuments.map(docId => (
              <SimplifiedDocument key={docId} docId={docId} />
            ))
          ) : (
            <p style={{fontSize: 12, color: '#94a3b8'}}>No documents selected.</p>
          )}
        </div>
      </div>

      {/* Warning popups */}
      {warningPopup && (
        <div className={`warning-popup time-${warningPopup}`}>
          <h3>{warningPopup === 120 ? '⚠️ 2 Minutes Remaining!' : warningPopup === 60 ? '⚠️ 1 Minute Remaining!' : '🚨 20 Seconds Remaining!'}</h3>
          <p>{warningPopup === 20 ? 'CRITICAL! Application will auto-submit at 0:00.' : 'Hurry! Review your details and keep going.'}</p>
        </div>
      )}
    </div>
  );
}
