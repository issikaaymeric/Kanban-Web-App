import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const AVATAR_COLORS = ['#6366f1','#ec4899','#f59e0b','#22c55e','#06b6d4','#8b5cf6','#f97316','#14b8a6'];

const BG_OPTIONS = [
  { label: '🌸 Pink',     value: '#fce7f3' },
  { label: '🌊 Sky',      value: '#dbeafe' },
  { label: '🌿 Mint',     value: '#dcfce7' },
  { label: '🌅 Peach',    value: '#ffedd5' },
  { label: '☁️ White',    value: '#f8fafc' },
  { label: '🪻 Lavender', value: '#ede9fe' },
];

export default function Settings({ user, settings, onSave, onClose }) {
  const [name, setName]               = useState(settings?.name || user?.user_metadata?.full_name || '');
  const [avatarColor, setAvatarColor] = useState(settings?.avatarColor || '#6366f1');
  const [boardBg, setBoardBg]         = useState(settings?.boardBg || '#fce7f3');

  const inputStyle = {
    width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
    borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#1e293b',
    fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', boxSizing: 'border-box',
  };

  const sectionLabel = {
    fontSize: 11, fontWeight: 700, letterSpacing: 1,
    textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 12px', display: 'block',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16,
          padding: '32px 36px', width: '100%', maxWidth: 420,
          boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', margin: 0 }}>Settings</h2>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9', border: 'none', color: '#64748b',
              borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 24 }}>
          <span style={sectionLabel}>Profile</span>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Display name</label>
          <input
            style={inputStyle}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Avatar color */}
        <div style={{ marginBottom: 24 }}>
          <span style={sectionLabel}>Avatar color</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {AVATAR_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setAvatarColor(c)}
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: c, cursor: 'pointer',
                  border: avatarColor === c ? '3px solid #1e293b' : '3px solid transparent',
                  outline: avatarColor === c ? `2px solid ${c}` : 'none',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            ))}
          </div>
        </div>

        {/* Board background */}
        <div style={{ marginBottom: 28 }}>
          <span style={sectionLabel}>Board background</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BG_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setBoardBg(opt.value)}
                style={{
                  padding: '7px 12px', borderRadius: 20,
                  fontSize: 12, fontWeight: 600,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  cursor: 'pointer', background: opt.value,
                  border: `2px solid ${boardBg === opt.value ? '#6366f1' : 'transparent'}`,
                  color: '#1e293b', transition: 'border-color 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={() => { onSave({ name, avatarColor, boardBg }); onClose(); }}
          style={{
            width: '100%', background: '#6366f1', color: '#fff', border: 'none',
            borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer',
            marginBottom: 8,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
          onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
        >
          Save changes
        </button>

        {/* Sign out */}
        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            width: '100%', background: '#fff', color: '#ef4444',
            border: '1.5px solid #fecaca', borderRadius: 8, padding: 11,
            fontSize: 13.5, fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#ef4444'; }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
