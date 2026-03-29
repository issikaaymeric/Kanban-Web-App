import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Task from './Task.jsx';

const COLUMN_COLORS = [
  { bg: '#fef9c3', hover: '#fef08a', border: '#fde047' },   // yellow
  { bg: '#dcfce7', hover: '#bbf7d0', border: '#86efac' },   // green
  { bg: '#ffffff', hover: '#f8fafc', border: '#e2e8f0' },   // white
];

export default function Column({ column, tasks, colIndex, onAddTask, onEditTask, onQuickAdd }) {
  const [quickAdd, setQuickAdd] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [isOver, setIsOver] = useState(false);

  const colors = COLUMN_COLORS[colIndex % COLUMN_COLORS.length];

  const submitQuick = () => {
    if (!quickTitle.trim()) return;
    onQuickAdd(column.id, quickTitle.trim());
    setQuickTitle('');
    setQuickAdd(false);
  };

  return (
    <div style={{
      width: 272,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 'calc(100vh - 100px)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        background: colors.bg,
        borderRadius: '12px 12px 0 0',
        padding: '10px 12px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `2px solid ${colors.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 13, fontWeight: 700, color: '#1e293b',
          }}>
            {column.title}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#64748b',
            background: 'rgba(0,0,0,0.08)', borderRadius: 12,
            padding: '1px 8px',
          }}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setQuickAdd(true)}
          title="Add card"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, color: '#94a3b8', lineHeight: 1,
            padding: '0 4px', borderRadius: 4,
            fontWeight: 300,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'none'; }}
        >
          +
        </button>
      </div>

      {/* Task list */}
      <div style={{
        background: colors.bg,
        padding: '8px 8px 0',
        flex: 1,
        overflowY: 'auto',
        minHeight: 40,
      }}>
        <Droppable droppableId={String(column.id)}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: 8,
                background: snapshot.isDraggingOver ? 'rgba(99,102,241,0.06)' : 'transparent',
                borderRadius: 8,
                transition: 'background 0.2s',
                paddingBottom: 4,
              }}
            >
              {tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} onEdit={onEditTask} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      {/* Quick add form or Add a card button */}
      {quickAdd ? (
        <div style={{
          background: colors.bg,
          padding: '6px 8px 10px',
          borderRadius: '0 0 12px 12px',
        }}>
          <textarea
            autoFocus
            placeholder="Enter a title for this card…"
            value={quickTitle}
            onChange={e => setQuickTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitQuick(); }
              if (e.key === 'Escape') { setQuickAdd(false); setQuickTitle(''); }
            }}
            style={{
              width: '100%', background: '#fff',
              border: '2px solid #6366f1', borderRadius: 8,
              padding: '8px 10px', fontSize: 13.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: '#1e293b', outline: 'none', resize: 'none',
              minHeight: 60, boxSizing: 'border-box',
              boxShadow: '0 0 0 4px rgba(99,102,241,0.1)',
            }}
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button
              onClick={submitQuick}
              style={{
                padding: '7px 16px', borderRadius: 6, border: 'none',
                background: '#6366f1', color: '#fff',
                fontSize: 13, fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer',
              }}
            >
              Add card
            </button>
            <button
              onClick={() => { setQuickAdd(false); setQuickTitle(''); }}
              style={{
                padding: '7px 12px', borderRadius: 6, border: 'none',
                background: 'transparent', color: '#64748b',
                fontSize: 13, fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setQuickAdd(true)}
          style={{
            width: '100%', background: colors.bg,
            border: 'none', borderRadius: '0 0 12px 12px',
            padding: '8px 12px', fontSize: 13, fontWeight: 500,
            color: '#64748b', cursor: 'pointer', textAlign: 'left',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            display: 'flex', alignItems: 'center', gap: 6,
            borderTop: `1px solid ${colors.border}`,
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = colors.hover; e.currentTarget.style.color = '#1e293b'; }}
          onMouseLeave={e => { e.currentTarget.style.background = colors.bg; e.currentTarget.style.color = '#64748b'; }}
        >
          <span style={{ fontSize: 16 }}>+</span> Add a card
        </button>
      )}
    </div>
  );
}
