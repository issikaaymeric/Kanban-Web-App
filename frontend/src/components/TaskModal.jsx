import React, { useState } from 'react';

const PRIORITY_COLORS = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

export default function TaskModal({ task, columns, onSave, onDelete, onClose }) {
  const isEdit = !!task?.id;
  const [title, setTitle]       = useState(task?.title || '');
  const [content, setContent]   = useState(task?.content || '');
  const [columnId, setColumnId] = useState(task?.column_id || columns[0]?.id || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [loading, setLoading]   = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await onSave({ title: title.trim(), content: content.trim(), column_id: columnId, priority });
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this card?')) return;
    await onDelete(task.id);
    onClose();
  };

  const inputStyle = {
    width: '100%', background: '#f8fafc',
    border: '1.5px solid #e2e8f0', borderRadius: 8,
    padding: '10px 12px', fontSize: 14, color: '#1e293b',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: '#94a3b8', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.6px',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16,
          padding: '32px 36px', width: '100%', maxWidth: 460,
          boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', margin: 0 }}>
            {isEdit ? 'Edit card' : 'Add card'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9', border: 'none', color: '#64748b',
              borderRadius: 8, width: 30, height: 30, cursor: 'pointer',
              fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Title *</label>
          <input
            style={inputStyle}
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
            placeholder="Add more details…"
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Column */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Column</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={columnId}
            onChange={e => setColumnId(e.target.value)}
          >
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.title}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Priority</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['low', 'medium', 'high'].map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 8, cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px',
                  background: priority === p ? PRIORITY_COLORS[p] + '18' : '#f8fafc',
                  border: `1.5px solid ${priority === p ? PRIORITY_COLORS[p] : '#e2e8f0'}`,
                  color: priority === p ? PRIORITY_COLORS[p] : '#94a3b8',
                  transition: 'all 0.15s',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          {isEdit && (
            <button
              onClick={handleDelete}
              style={{
                padding: '11px 16px', borderRadius: 8,
                background: '#fff5f5', color: '#ef4444',
                border: '1.5px solid #fecaca',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: 11, borderRadius: 8, border: 'none',
              background: '#f1f5f9', color: '#64748b',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !title.trim()}
            style={{
              flex: 1, padding: 11, borderRadius: 8, border: 'none',
              background: loading || !title.trim() ? '#c7d2fe' : '#6366f1',
              color: '#fff',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13.5, fontWeight: 600,
              cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Saving…' : isEdit ? 'Save' : 'Add card'}
          </button>
        </div>
      </div>
    </div>
  );
}
