import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { supabase } from './supabaseClient';

const fadeIn = keyframes`from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}`;

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: #1a1a22;
  border: 1px solid #2e2e3a;
  border-radius: 20px;
  padding: 40px;
  width: 100%; max-width: 480px;
  animation: ${fadeIn} 0.25s ease;
  font-family: 'DM Sans', sans-serif;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 32px;
`;

const Title = styled.h2`font-size: 20px; font-weight: 700; color: #f0f0f5; margin: 0;`;

const Close = styled.button`
  background: #2e2e3a; border: none; color: #888; border-radius: 8px;
  width: 32px; height: 32px; cursor: pointer; font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: #3a3a4a; color: #f0f0f5; }
`;

const Section = styled.div`margin-bottom: 28px;`;
const SectionTitle = styled.p`
  font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
  text-transform: uppercase; color: #5a5a70; margin: 0 0 14px;
`;

const Label = styled.label`
  display: block; font-size: 12px; font-weight: 600;
  color: #8888a0; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%; background: #0f0f13; border: 1px solid #2e2e3a;
  border-radius: 10px; padding: 11px 14px; font-size: 15px;
  color: #f0f0f5; font-family: inherit; outline: none; box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus { border-color: #7c6af7; }
`;

const ColorGrid = styled.div`display: flex; gap: 10px; flex-wrap: wrap;`;

const ColorDot = styled.button`
  width: 32px; height: 32px; border-radius: 50%;
  background: ${p => p.$color};
  border: 3px solid ${p => p.$active ? '#f0f0f5' : 'transparent'};
  cursor: pointer; transition: transform 0.15s;
  outline: none;
  &:hover { transform: scale(1.15); }
`;

const ThemeGrid = styled.div`display: flex; gap: 10px;`;

const ThemeBtn = styled.button`
  flex: 1; padding: 12px 8px; border-radius: 10px;
  background: ${p => p.$active ? '#7c6af7' : '#0f0f13'};
  border: 1px solid ${p => p.$active ? '#7c6af7' : '#2e2e3a'};
  color: ${p => p.$active ? '#fff' : '#8888a0'};
  font-family: inherit; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  &:hover { border-color: #7c6af7; color: #f0f0f5; }
`;

const SaveBtn = styled.button`
  width: 100%; background: #7c6af7; color: #fff; border: none;
  border-radius: 10px; padding: 13px; font-size: 15px; font-weight: 600;
  font-family: inherit; cursor: pointer; transition: background 0.2s;
  &:hover { background: #6a58e8; }
  &:disabled { background: #3a3a50; cursor: not-allowed; }
`;

const SignOutBtn = styled.button`
  width: 100%; background: transparent; color: #f97066;
  border: 1px solid #f97066; border-radius: 10px; padding: 11px;
  font-size: 14px; font-weight: 600; font-family: inherit;
  cursor: pointer; margin-top: 10px; transition: all 0.2s;
  &:hover { background: #f97066; color: #fff; }
`;

const AVATAR_COLORS = ['#7c6af7','#f97066','#34d399','#60a5fa','#fbbf24','#f472b6','#a78bfa','#2dd4bf'];
const THEMES = ['dark', 'light', 'ocean'];

export default function Settings({ user, settings, onSave, onClose }) {
  const [name, setName] = useState(settings?.name || user?.user_metadata?.full_name || '');
  const [avatarColor, setAvatarColor] = useState(settings?.avatarColor || '#7c6af7');
  const [theme, setTheme] = useState(settings?.theme || 'dark');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    const newSettings = { name, avatarColor, theme };
    onSave(newSettings);
    setLoading(false);
    onClose();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Settings</Title>
          <Close onClick={onClose}>✕</Close>
        </Header>

        <Section>
          <SectionTitle>Profile</SectionTitle>
          <Label>Display name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </Section>

        <Section>
          <SectionTitle>Avatar color</SectionTitle>
          <ColorGrid>
            {AVATAR_COLORS.map(c => (
              <ColorDot key={c} $color={c} $active={avatarColor === c} onClick={() => setAvatarColor(c)} />
            ))}
          </ColorGrid>
        </Section>

        <Section>
          <SectionTitle>Board theme</SectionTitle>
          <ThemeGrid>
            {THEMES.map(t => (
              <ThemeBtn key={t} $active={theme === t} onClick={() => setTheme(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </ThemeBtn>
            ))}
          </ThemeGrid>
        </Section>

        <SaveBtn onClick={save} disabled={loading}>Save changes</SaveBtn>
        <SignOutBtn onClick={signOut}>Sign out</SignOutBtn>
      </Modal>
    </Overlay>
  );
}
