import React, { useState } from 'react';
import './AuthModal.css';

function AuthModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email || !password) return alert('Enter email and password');
    
    setLoading(true);
    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.message || 'Failed');
        setLoading(false);
        return;
      }

      // SUCCESS - SAVE USER
      localStorage.setItem('userEmail', email);
      localStorage.setItem('token', data.token || 'logged-in');
      alert(isSignup ? 'Account created!' : 'Logged in!');
      onClose();
      window.location.reload();
    } catch (err) {
      console.log(err);
      // Fallback if backend not ready yet - still works for demo
      localStorage.setItem('userEmail', email);
      onClose();
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="auth__overlay" onClick={onClose}>
      <div className="auth__modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth__close" onClick={onClose}>✕</button>
        
        <div className="auth__header">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="airbnb" style={{height:'32px', marginBottom:'10px'}} />
          <h2>{isSignup ? 'Sign up' : 'Log in'}</h2>
        </div>

        <div className="auth__body">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth__input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth__input"
            style={{marginTop: '10px'}}
          />
          <p className="auth__subtext">
            We'll call or text you to confirm your number. Standard message and data rates apply. <span>Privacy Policy</span>
          </p>

          <button className="auth__continue" onClick={handleContinue} disabled={loading}>
            {loading ? 'Please wait...' : isSignup ? 'Sign up' : 'Continue'}
          </button>

          <p style={{textAlign:'center', marginTop:'12px', fontSize:'14px'}}>
            {isSignup ? 'Already have an account?' : "Don't have account?"}{' '}
            <span onClick={()=>setIsSignup(!isSignup)} style={{color:'#FF385C', cursor:'pointer', fontWeight:700}}>
              {isSignup ? 'Log in' : 'Sign up'}
            </span>
          </p>

          <div className="auth__divider">or</div>

          <div className="auth__socials">
            <button className="auth__socialBtn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="g" />
            </button>
            <button className="auth__socialBtn"></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;