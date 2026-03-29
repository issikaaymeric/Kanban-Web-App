import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fce7f3 0%, #ede9fe 50%, #dbeafe 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 20px;
`;

const Card = styled.div`
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.8);
  border-radius: 20px;
  padding: 44px 40px;
  width: 100%; max-width: 400px;
  box-shadow: 0 24px 48px rgba(99,102,241,0.12);
  animation: ${fadeUp} 0.4s ease;
`;

const Logo = styled.div`
  font-size: 22px; font-weight: 800; color: #6366f1;
  letter-spacing: -0.5px; margin-bottom: 28px;
  display: flex; align-items: center; gap: 6px;
`;

const Title = styled.h1`
  font-size: 24px; font-weight: 800; color: #1e293b;
  margin: 0 0 6px; letter-spacing: -0.3px;
`;

const Sub = styled.p`
  font-size: 14px; color: #94a3b8; margin: 0 0 28px;
`;

const Field = styled.div`margin-bottom: 16px;`;

const Label = styled.label`
  display: block; font-size: 12px; font-weight: 700;
  color: #64748b; margin-bottom: 6px;
  text-transform: uppercase; letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%; background: #f8fafc;
  border: 1.5px solid ${p => p.$error ? '#ef4444' : '#e2e8f0'};
  border-radius: 10px; padding: 12px 14px; font-size: 14px;
  color: #1e293b; font-family: inherit; outline: none; box-sizing: border-box;
  transition: border-color 0.15s, background 0.15s;
  &:focus { border-color: #6366f1; background: #fff; }
  &::placeholder { color: #cbd5e1; }
`;

const Btn = styled.button`
  width: 100%; background: #6366f1; color: #fff;
  border: none; border-radius: 10px; padding: 13px;
  font-size: 14.5px; font-weight: 700; font-family: inherit;
  cursor: pointer; margin-top: 6px;
  transition: background 0.15s, transform 0.1s;
  letter-spacing: -0.1px;
  &:hover { background: #4f46e5; }
  &:active { transform: scale(0.99); }
  &:disabled { background: #c7d2fe; cursor: not-allowed; }
`;

const Toggle = styled.p`
  text-align: center; font-size: 13.5px; color: #94a3b8;
  margin-top: 20px;
  span {
    color: #6366f1; cursor: pointer; font-weight: 700;
    &:hover { text-decoration: underline; }
  }
`;

const Alert = styled.p`
  border-radius: 8px; padding: 10px 14px;
  font-size: 13px; margin-bottom: 16px;
  background: ${p => p.$success ? '#f0fdf4' : '#fef2f2'};
  border: 1px solid ${p => p.$success ? '#bbf7d0' : '#fecaca'};
  color: ${p => p.$success ? '#16a34a' : '#ef4444'};
`;

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
          options: { data: { full_name: name } }
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

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setError(''); setSuccess('');
  };

  return (
    <Page>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Card>
        <Logo>✦ Kanban</Logo>
        <Title>{mode === 'login' ? 'Welcome back' : 'Get started'}</Title>
        <Sub>{mode === 'login' ? 'Sign in to your board' : 'Create your free account'}</Sub>

        {error && <Alert>{error}</Alert>}
        {success && <Alert $success>{success}</Alert>}

        <form onSubmit={handle}>
          {mode === 'signup' && (
            <Field>
              <Label>Full name</Label>
              <Input placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} required />
            </Field>
          )}
          <Field>
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </Field>
          <Field>
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </Field>
          <Btn type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in →' : 'Create account →'}
          </Btn>
        </form>

        <Toggle>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={switchMode}>{mode === 'login' ? 'Sign up' : 'Sign in'}</span>
        </Toggle>
      </Card>
    </Page>
  );
}
