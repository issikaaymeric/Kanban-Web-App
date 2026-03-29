import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

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
  width: 100%; max-width: 440px;
  box-shadow: 0 24px 48px rgba(0,0,0,0.15);
  animation: ${fadeIn} 0.22s ease;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 17px; font-weight: 700; color: #1e293b; margin: 0;
`;

const Close = styled.button`
  background: #f1f5f9; border: none; color: #64748b;
  border-radius: 8px; width: 30px; height: 30px;
  cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: #e2e8f0; color: #1e293b; }
`;

const Desc = styled.p`
  font-size: 13.5px; color: #64748b; margin: 0 0 20px; line-height: 1.5;
`;

const LinkRow = styled.div`
  display: flex; gap: 8px; align-items: center;
`;

const LinkInput = styled.input`
  flex: 1; background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 8px; padding: 10px 12px; font-size: 13px;
  color: #475569; font-family: inherit; outline: none;
  &:focus { border-color: #6366f1; }
`;

const CopyBtn = styled.button`
  background: ${p => p.$copied ? '#22c55e' : '#6366f1'};
  color: #fff; border: none; border-radius: 8px;
  padding: 10px 18px; font-size: 13px; font-weight: 600;
  font-family: inherit; cursor: pointer; white-space: nowrap;
  transition: background 0.2s;
  &:hover { background: ${p => p.$copied ? '#16a34a' : '#4f46e5'}; }
`;

const Divider = styled.div`
  border-top: 1px solid #f1f5f9; margin: 24px 0;
`;

const InviteLabel = styled.p`
  font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
  text-transform: uppercase; color: #94a3b8; margin: 0 0 10px;
`;

const PermRow = styled.div`
  display: flex; gap: 8px;
`;

const PermBtn = styled.button`
  flex: 1; padding: 9px;
  border-radius: 8px; font-size: 12.5px; font-weight: 600;
  font-family: inherit; cursor: pointer; transition: all 0.15s;
  background: ${p => p.$active ? '#6366f115' : '#f8fafc'};
  border: 1.5px solid ${p => p.$active ? '#6366f1' : '#e2e8f0'};
  color: ${p => p.$active ? '#6366f1' : '#64748b'};
  &:hover { border-color: #6366f1; color: #6366f1; }
`;

const Note = styled.p`
  font-size: 12px; color: #94a3b8; margin: 12px 0 0; text-align: center;
`;

export default function ShareModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const [perm, setPerm] = useState('view');
  const shareUrl = window.location.href;

  const copy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Share board</Title>
          <Close onClick={onClose}>✕</Close>
        </Header>

        <Desc>
          Anyone with this link can access your board. Choose what they're allowed to do.
        </Desc>

        <InviteLabel>Permission</InviteLabel>
        <PermRow>
          <PermBtn $active={perm === 'view'} onClick={() => setPerm('view')}>👁 View only</PermBtn>
          <PermBtn $active={perm === 'edit'} onClick={() => setPerm('edit')}>✏️ Can edit</PermBtn>
          <PermBtn $active={perm === 'admin'} onClick={() => setPerm('admin')}>⚙️ Admin</PermBtn>
        </PermRow>

        <Divider />

        <InviteLabel>Share link</InviteLabel>
        <LinkRow>
          <LinkInput readOnly value={shareUrl} onFocus={e => e.target.select()} />
          <CopyBtn $copied={copied} onClick={copy}>
            {copied ? '✓ Copied!' : 'Copy link'}
          </CopyBtn>
        </LinkRow>

        <Note>🔒 Link sharing is currently public — auth coming soon.</Note>
      </Modal>
    </Overlay>
  );
}
