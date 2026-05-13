import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASS = 'kiadb2026';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      sessionStorage.setItem('kiadb_admin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="admin-login">
      <form className="reg-card fade-in" onSubmit={handleLogin}>
        <div style={{textAlign:'center',marginBottom:16}}>
          <span style={{fontSize:40}}>🔒</span>
        </div>
        <h2 style={{textAlign:'center'}}>Admin Access</h2>
        <p className="reg-sub" style={{textAlign:'center'}}>KIADB Challenge Administration Panel</p>
        <div className="form-group">
          <label>Admin Password</label>
          <input className="form-input" type="password" value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            placeholder="Enter admin password" required />
        </div>
        {error && <p style={{color:'#dc2626',fontSize:12,marginBottom:12}}>{error}</p>}
        <button className="btn btn-primary" type="submit" style={{width:'100%'}}>🔓 Login</button>
        <button className="btn btn-outline btn-sm" type="button" onClick={() => navigate('/')}
          style={{width:'100%',marginTop:8}}>← Back to Home</button>
      </form>
    </div>
  );
}
