import React, { useState } from 'react';
import { supabase, createClient } from './supabaseClient';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`;

const Page = styled.div`
  min-height: 100vh;
  background: #0f0f13;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
`;

const Card = styled.div`
  background: #1a1a22;
  border: 1px solid #2e2e3a;
  border-radius: 20px;
  padding: 48px 44px;
  width: 100%;
  max-width: 420px;
  animation: ${fadeIn} 0.4s ease;
`;

const Logo = styled.div`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #7c6af7;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #f0f0f5;
  margin: 0 0 6px;
`;

const Sub = styled.p`
  font-size: 14px;
  color: #6b6b80;
  margin: 0 0 32px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #8888a0;
  margin-bottom: 6px;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  background: #0f0f13;
  border: 1px solid ${p => p.$error ? '#f97066' : '#2e2e3a'};
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 15px;
  color: #f0f0f5;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus { border-color: #7c6af7; }
  &::placeholder { color: #3a3a50; }
`;

const Field = styled.div`margin-bottom: 18px;`;

const Btn = styled.button`
  width: 100%;
  background: #7c6af7;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s, transform 0.1s;
  &:hover { background: #6a58e8; }
  &:active { transform: scale(0.98); }
  &:disabled { background: #3a3a50; cursor: not-allowed; }
`;

const Toggle = styled.p`
  text-align: center;
  font-size: 14px;
  color: #6b6b80;
  margin-top: 24px;
  span {
    color: #7c6af7;
    cursor: pointer;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`;

const Err = styled.p`
  background: #2a1a1a;
  border: 1px solid #f97066;
  color: #f97066;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 18px;
`;

const Succ = styled.p`
  background: #1a2a1a;
  border: 1px solid #4ade80;
  color: #4ade80;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 18px;
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

  return (
    <Page>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Card>
        <Logo>✦ Kanban</Logo>
        <Title>{mode === 'login' ? 'Welcome back' : 'Create account'}</Title>
        <Sub>{mode === 'login' ? 'Sign in to your board' : 'Start managing your tasks'}</Sub>

        {error && <Err>{error}</Err>}
        {success && <Succ>{success}</Succ>}

        <form onSubmit={handle}>
          {mode === 'signup' && (
            <Field>
              <Label>Full name</Label>
              <Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
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
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </Btn>
        </form>

        <Toggle>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </Toggle>
      </Card>
    </Page>
  );
}
