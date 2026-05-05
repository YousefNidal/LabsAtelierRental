import { Scissors, Mail, Lock, UserPlus, Phone, MapPin, Zap } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ROLES } from '../store/data';

export default function LoginPage() {
  const { login, dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [regData, setRegData] = useState({ name: '', email: '', password: '', phone: '', address: '' });

  const handleLogin = e => {
    e.preventDefault();
    setError('');
    try { login(email, password); }
    catch (err) { setError(err.message); }
  };

  const handleRegister = e => {
    e.preventDefault();
    setError('');
    try {
      dispatch({ type: 'REGISTER', payload: { ...regData, role: ROLES.CLIENT } });
      login(regData.email, regData.password);
    } catch (err) { setError(err.message); }
  };

  const quickLogin = (e, p) => { setEmail(e); setPassword(p); };

  const QUICK = [
    { label: 'Administrator', sub: 'Full access',      e: 'admin@atelier.com',   p: 'admin123',   color: '#dc2626' },
    { label: 'Manager',       sub: 'Booking ops',      e: 'manager@atelier.com', p: 'manager123', color: '#6355e0' },
    { label: 'Storekeeper',   sub: 'Inventory',        e: 'store@atelier.com',   p: 'store123',   color: '#d97706' },
    { label: 'Client',        sub: 'Browse & book',    e: 'client@atelier.com',  p: 'client123',  color: '#059669' },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f4f6fb 0%, #eef0ff 100%)',
      padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '44px 40px',
          boxShadow: '0 8px 48px rgba(99,85,224,.14), 0 1px 3px rgba(0,0,0,.06)',
          border: '1px solid #e5e7eb',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #6355e0, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14, boxShadow: '0 8px 24px rgba(99,85,224,.3)',
            }}>
              <Scissors size={30} color="#fff" />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Atelier Rental</h1>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>Premium Costume & Dress Rental System</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {!showRegister ? (
            <>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input id="login-email" type="email" value={email}
                      onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                      style={{ paddingLeft: 38 }} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input id="login-password" type="password" value={password}
                      onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                      style={{ paddingLeft: 38 }} required />
                  </div>
                </div>
                <button id="login-submit" type="submit" className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: 15, borderRadius: 10 }}>
                  <Zap size={16} />
                  Sign In
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>QUICK LOGIN</span>
                <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {QUICK.map(({ label, sub, e, p, color }) => (
                  <button key={label} onClick={() => quickLogin(e, p)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      padding: '10px 14px', border: `1px solid #e5e7eb`, borderRadius: 10,
                      background: '#f9fafb', cursor: 'pointer', transition: 'all .2s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={ev => { ev.currentTarget.style.borderColor = color; ev.currentTarget.style.background = '#fff'; }}
                    onMouseLeave={ev => { ev.currentTarget.style.borderColor = '#e5e7eb'; ev.currentTarget.style.background = '#f9fafb'; }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{label}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{sub}</span>
                  </button>
                ))}
              </div>

              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b7280' }}>
                New client?{' '}
                <button style={{ background: 'none', border: 'none', color: '#6355e0', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
                  onClick={() => setShowRegister(true)}>
                  Register here
                </button>
              </p>
            </>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-group"><label>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserPlus size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input value={regData.name} onChange={e => setRegData(p => ({ ...p, name: e.target.value }))} style={{ paddingLeft: 38 }} required />
                </div>
              </div>
              <div className="form-group"><label>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input type="email" value={regData.email} onChange={e => setRegData(p => ({ ...p, email: e.target.value }))} style={{ paddingLeft: 38 }} required />
                </div>
              </div>
              <div className="form-group"><label>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input type="password" value={regData.password} onChange={e => setRegData(p => ({ ...p, password: e.target.value }))} style={{ paddingLeft: 38 }} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Phone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input value={regData.phone} onChange={e => setRegData(p => ({ ...p, phone: e.target.value }))} style={{ paddingLeft: 38 }} />
                  </div>
                </div>
                <div className="form-group"><label>Address</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input value={regData.address} onChange={e => setRegData(p => ({ ...p, address: e.target.value }))} style={{ paddingLeft: 38 }} />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: 10 }}>
                Create Account
              </button>
              <button type="button" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, borderRadius: 10 }}
                onClick={() => setShowRegister(false)}>
                ← Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
