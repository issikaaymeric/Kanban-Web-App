import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const PRIORITY = {
  high:   { color: '#ef4444', label: 'High' },
  medium: { color: '#f59e0b', label: 'Medium' },
  low:    { color: '#22c55e', label: 'Low' },
};

export default function Task({ task, index, onEdit }) {
  const p = PRIORITY[task.priority || 'medium'];

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onEdit(task)}
          style={{
            background: snapshot.isDragging ? '#f0f4ff' : '#ffffff',
            borderRadius: 10,
            padding: '10px 12px',
            marginBottom: 8,
            cursor: 'pointer',
            boxShadow: snapshot.isDragging
              ? '0 8px 24px rgba(99,102,241,0.2)'
              : '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)',
            border: `1px solid ${snapshot.isDragging ? '#c7d2fe' : 'rgba(0,0,0,0.06)'}`,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'box-shadow 0.15s, border-color 0.15s',
            userSelect: 'none',
            ...provided.draggableProps.style,
          }}
        >
          {/* Priority bar */}
          <div style={{
            width: 32, height: 3, borderRadius: 2,
            background: p.color, marginBottom: 8,
          }} />

          {/* Title */}
          <p style={{
            fontSize: 13.5, fontWeight: 500, color: '#1e293b',
            margin: '0 0 6px', lineHeight: 1.45, wordBreak: 'break-word',
          }}>
            {task.title}
          </p>

          {/* Description preview */}
          {task.content && (
            <p style={{
              fontSize: 12, color: '#94a3b8', margin: '0 0 8px',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {task.content}
            </p>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
              color: p.color, textTransform: 'uppercase',
            }}>
              {p.label}
            </span>
            <span style={{ fontSize: 11, color: '#cbd5e1' }}>#{task.id}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
