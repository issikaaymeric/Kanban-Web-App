import React, { useState } from 'react';

export default function ShareModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const [perm, setPerm]     = useState('view');
  const shareUrl = window.location.href;

  const copy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const permOptions = [
    { key: 'view',  label: '👁 View only' },
    { key: 'edit',  label: '✏️ Can edit' },
    { key: 'admin', label: '⚙️ Admin' },
  ];

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
          padding: '32px 36px', width: '100%', maxWidth: 440,
          boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', margin: 0 }}>Share board</h2>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9', border: 'none', color: '#64748b',
              borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        <p style={{ fontSize: 13.5, color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
          Anyone with this link can access your board.
        </p>

        {/* Permission */}
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 10 }}>
          Permission
        </span>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {permOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => setPerm(opt.key)}
              style={{
                flex: 1, padding: '9px 4px', borderRadius: 8,
                fontSize: 12, fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer',
                background: perm === opt.key ? '#6366f115' : '#f8fafc',
                border: `1.5px solid ${perm === opt.key ? '#6366f1' : '#e2e8f0'}`,
                color: perm === opt.key ? '#6366f1' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Link */}
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 10 }}>
          Share link
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            readOnly
            value={shareUrl}
            onFocus={e => e.target.select()}
            style={{
              flex: 1, background: '#f8fafc', border: '1.5px solid #e2e8f0',
              borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#475569',
              fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none',
            }}
          />
          <button
            onClick={copy}
            style={{
              padding: '10px 18px', borderRadius: 8, border: 'none',
              background: copied ? '#22c55e' : '#6366f1',
              color: '#fff', fontSize: 13, fontWeight: 600,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy link'}
          </button>
        </div>

        <p style={{ fontSize: 12, color: '#94a3b8', margin: '12px 0 0', textAlign: 'center' }}>
          🔒 Auth-protected sharing coming soon
        </p>
      </div>
    </div>
  );
}
