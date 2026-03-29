import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#f8fafc',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    padding: '12px 14px', fontSize: 14, color: '#1e293b',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: '#64748b', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.5px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fce7f3 0%, #ede9fe 50%, #dbeafe 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: 20,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: 20,
        padding: '44px 40px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 24px 48px rgba(99,102,241,0.12)',
      }}>
        {/* Logo */}
        <div style={{ fontSize: 22, fontWeight: 800, color: '#6366f1', marginBottom: 28, letterSpacing: -0.5 }}>
          ✦ Kanban
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', margin: '0 0 6px', letterSpacing: -0.3 }}>
          {mode === 'login' ? 'Welcome back' : 'Get started'}
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 28px' }}>
          {mode === 'login' ? 'Sign in to your board' : 'Create your free account'}
        </p>

        {/* Alerts */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444',
            borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}
        {success && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a',
            borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16,
          }}>{success}</div>
        )}

        <form onSubmit={handle}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Full name</label>
              <input style={inputStyle} placeholder="Jane Doe" value={name}
                onChange={e => setName(e.target.value)} required
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} required
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)} required
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#c7d2fe' : '#6366f1',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: 13, fontSize: 14.5, fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: -0.1,
            }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in →' : 'Create account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: '#94a3b8', marginTop: 20 }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
            style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 700 }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}
