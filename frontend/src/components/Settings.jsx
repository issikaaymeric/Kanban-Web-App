import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { supabase } from './supabaseClient';

const fadeIn = keyframes`from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}`;

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; backdrop-filter: blur(4px);
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px 36px;
  width: 100%; max-width: 420px;
  box-shadow: 0 24px 48px rgba(0,0,0,0.15);
  animation: ${fadeIn} 0.22s ease;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px;
`;

const Title = styled.h2`font-size: 17px; font-weight: 700; color: #1e293b; margin: 0;`;

const Close = styled.button`
  background: #f1f5f9; border: none; color: #64748b; border-radius: 8px;
  width: 30px; height: 30px; cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: #e2e8f0; color: #1e293b; }
`;

const Section = styled.div`margin-bottom: 24px;`;

const SectionTitle = styled.p`
  font-size: 11px; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase; color: #94a3b8; margin: 0 0 12px;
`;

const Label = styled.label`
  display: block; font-size: 12px; font-weight: 600;
  color: #64748b; margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%; background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 8px; padding: 10px 12px; font-size: 14px;
  color: #1e293b; font-family: inherit; outline: none; box-sizing: border-box;
  &:focus { border-color: #6366f1; background: #fff; }
`;

const ColorGrid = styled.div`display: flex; gap: 8px; flex-wrap: wrap;`;

const ColorDot = styled.button`
  width: 30px; height: 30px; border-radius: 50%;
  background: ${p => p.$color};
  border: 3px solid ${p => p.$active ? '#1e293b' : 'transparent'};
  outline: 2px solid ${p => p.$active ? p.$color : 'transparent'};
  cursor: pointer; transition: transform 0.15s;
  &:hover { transform: scale(1.15); }
`;

const BgGrid = styled.div`display: flex; gap: 8px; flex-wrap: wrap;`;

const BgChip = styled.button`
  padding: 8px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
  font-family: inherit; cursor: pointer; transition: all 0.15s;
  background: ${p => p.$bg};
  border: 2px solid ${p => p.$active ? '#6366f1' : 'transparent'};
  color: #1e293b;
  &:hover { border-color: #6366f1; }
`;

const SaveBtn = styled.button`
  width: 100%; background: #6366f1; color: #fff; border: none;
  border-radius: 8px; padding: 12px; font-size: 14px; font-weight: 600;
  font-family: inherit; cursor: pointer; transition: background 0.15s;
  &:hover { background: #4f46e5; }
`;

const SignOutBtn = styled.button`
  width: 100%; background: #fff; color: #ef4444;
  border: 1.5px solid #fecaca; border-radius: 8px; padding: 11px;
  font-size: 13.5px; font-weight: 600; font-family: inherit;
  cursor: pointer; margin-top: 8px; transition: all 0.15s;
  &:hover { background: #ef4444; color: #fff; border-color: #ef4444; }
`;

const AVATAR_COLORS = ['#6366f1','#ec4899','#f59e0b','#22c55e','#06b6d4','#8b5cf6','#f97316','#14b8a6'];

const BOARD_BG_OPTIONS = [
  { label: '🌸 Pink', value: '#fce7f3' },
  { label: '🌊 Blue', value: '#dbeafe' },
  { label: '🌿 Sage', value: '#dcfce7' },
  { label: '🌅 Peach', value: '#ffedd5' },
  { label: '☁️ White', value: '#f8fafc' },
  { label: '🪻 Lavender', value: '#ede9fe' },
];

export default function Settings({ user, settings, onSave, onClose }) {
  const [name, setName] = useState(settings?.name || user?.user_metadata?.full_name || '');
  const [avatarColor, setAvatarColor] = useState(settings?.avatarColor || '#6366f1');
  const [boardBg, setBoardBg] = useState(settings?.boardBg || '#fce7f3');

  const save = () => {
    onSave({ name, avatarColor, boardBg });
    onClose();
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
          <SectionTitle>Board background</SectionTitle>
          <BgGrid>
            {BOARD_BG_OPTIONS.map(opt => (
              <BgChip key={opt.value} $bg={opt.value} $active={boardBg === opt.value} onClick={() => setBoardBg(opt.value)}>
                {opt.label}
              </BgChip>
            ))}
          </BgGrid>
        </Section>

        <SaveBtn onClick={save}>Save changes</SaveBtn>
        <SignOutBtn onClick={() => supabase.auth.signOut()}>Sign out</SignOutBtn>
      </Modal>
    </Overlay>
  );
}
