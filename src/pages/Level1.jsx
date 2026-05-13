import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { DOCUMENTS } from '../data/documents';

export default function Level1() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleSelect = (docId) => {
    if (state.selectedDocuments.length >= 3 && !state.selectedDocuments.includes(docId)) return;
    dispatch({ type: 'SELECT_DOCUMENT', payload: docId });
  };

  const handleConfirm = () => {
    dispatch({ type: 'CONFIRM_DOCUMENTS' });
    navigate('/level2');
  };

  return (
    <div className="level1-page">
      <div className="gov-navbar">
        <div className="brand">
          <div className="emblem">🏛️</div>
          <div className="brand-text">
            <h1>KIADB Industrial Application Challenge</h1>
            <p>Government of Karnataka — Document Selection</p>
          </div>
        </div>
        <div className="nav-right">
          <span>Team: <strong>{state.teamName}</strong></span>
          <span>#{state.teamNumber}</span>
        </div>
      </div>
      <div className="gov-sub-bar">
        <span>📋 LEVEL 1 — Document Repository</span>
        <span>Select 3 of 10 documents</span>
      </div>

      <div className="level1-content fade-in">
        <div className="level1-header">
          <h2>📁 Document Repository — KIADB Compliance Portal</h2>
          <p>Select exactly 3 documents that will be available during the application process. Choose strategically — your selection determines which sections you can complete.</p>
          <div className="selection-counter">
            <span className="count">{state.selectedDocuments.length}</span>
            <span>/ 3 Documents Selected</span>
            {state.selectedDocuments.length === 3 && (
              <button className="btn btn-primary btn-sm" style={{marginLeft:'auto'}} onClick={() => setShowConfirm(true)}>
                Confirm & Proceed →
              </button>
            )}
          </div>
        </div>

        <div className="doc-grid">
          {DOCUMENTS.map(doc => {
            const selected = state.selectedDocuments.includes(doc.id);
            const disabled = state.selectedDocuments.length >= 3 && !selected;
            return (
              <div
                key={doc.id}
                className={`doc-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && handleSelect(doc.id)}
              >
                <div className="doc-check">✓</div>
                <div className="doc-icon">{doc.icon}</div>
                <div className="doc-title">{doc.title}</div>
                <div className="doc-desc">{doc.description}</div>
                <div className="doc-meta">
                  <span className="doc-size">📎 {doc.fileSize}</span>
                  <span className={`status-badge ${doc.status.toLowerCase()}`}>{doc.status}</span>
                </div>
                <div style={{marginTop:8}}>
                  <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); setPreviewDoc(doc); }} style={{fontSize:10,padding:'4px 10px'}}>
                    👁️ Preview
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal fade-in" onClick={e => e.stopPropagation()}>
            <h3>⚠️ Confirm Document Selection</h3>
            <p>You have selected the following documents:</p>
            <div style={{textAlign:'left',marginBottom:12}}>
              {state.selectedDocuments.map(id => {
                const doc = DOCUMENTS.find(d => d.id === id);
                return <div key={id} style={{padding:'6px 0',fontSize:13,borderBottom:'1px solid #f1f5f9'}}>
                  {doc.icon} <strong>{doc.title}</strong>
                </div>;
              })}
            </div>
            <div className="warning-box">
              ⚠️ Selected documents cannot be modified after proceeding. You will have 2 minutes to complete the application.
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline btn-sm" onClick={() => setShowConfirm(false)}>← Go Back</button>
              <button className="btn btn-primary btn-sm" onClick={handleConfirm}>Confirm & Start Timer →</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="doc-viewer-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="doc-viewer fade-in" onClick={e => e.stopPropagation()}>
            <div className="doc-viewer-header">
              <h3>{previewDoc.icon} {previewDoc.title}</h3>
              <button className="doc-viewer-close" onClick={() => setPreviewDoc(null)}>✕</button>
            </div>
            <div className="doc-viewer-body" style={{position:'relative'}}>
              <div className="doc-watermark">PREVIEW ONLY</div>
              <div className="doc-official-header">
                <h2>{previewDoc.content.header}</h2>
                <p>{previewDoc.content.subheader}</p>
              </div>
              <p style={{fontSize:11,color:'#94a3b8',textAlign:'center',marginBottom:16,fontStyle:'italic'}}>
                Document Type: {previewDoc.content.type} • {previewDoc.fileSize}
              </p>
              <p style={{fontSize:12,color:'#64748b',textAlign:'center'}}>
                Full document content will be available after selection and during the application phase.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
