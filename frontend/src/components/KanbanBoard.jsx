import React, { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column.jsx';
import TaskModal from './TaskModal.jsx';
import Settings from './Settings.jsx';
import ShareModal from './ShareModal.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

export default function KanbanBoard({ user }) {
  const [columns, setColumns]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [taskModal, setTaskModal] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare]       = useState(false);
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kanban_settings')) || {}; } catch { return {}; }
  });

  const boardBg      = settings.boardBg      || '#fce7f3';
  const avatarColor  = settings.avatarColor  || '#6366f1';
  const displayName  = settings.name || user?.user_metadata?.full_name || user?.email || '?';
  const initials     = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // ── inject Google Font ────────────────────────────────────────
  useEffect(() => {
    if (!document.querySelector(`link[href="${FONT_LINK}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = FONT_LINK;
      document.head.appendChild(link);
    }
    document.body.style.margin = '0';
    document.body.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
  }, []);

  const fetchBoard = async () => {
    try {
      const res  = await fetch(`${API}/columns`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setColumns(json.data || []);
    } catch (e) {
      setError('Could not load board. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBoard(); }, []);

  // ── Drag & drop ───────────────────────────────────────────────
  const handleDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setColumns(prev => {
      const next = prev.map(c => ({ ...c, tasks: [...c.tasks] }));
      const src  = next.find(c => String(c.id) === source.droppableId);
      const dst  = next.find(c => String(c.id) === destination.droppableId);
      const [moved] = src.tasks.splice(source.index, 1);
      dst.tasks.splice(destination.index, 0, moved);
      return next;
    });

    try {
      await fetch(`${API}/tasks/${draggableId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ column_id: destination.droppableId, position: destination.index }),
      });
    } catch { fetchBoard(); }
  };

  // ── Quick add ─────────────────────────────────────────────────
  const handleQuickAdd = async (columnId, title) => {
    try {
      const res  = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: '', column_id: columnId, priority: 'medium' }),
      });
      const { data } = await res.json();
      setColumns(prev => prev.map(c =>
        String(c.id) === String(data.column_id) ? { ...c, tasks: [...c.tasks, data] } : c
      ));
    } catch (e) { console.error(e); }
  };

  // ── Save/Update task ──────────────────────────────────────────
  const handleSaveTask = async (fields) => {
    if (taskModal?.task?.id) {
      const res    = await fetch(`${API}/tasks/${taskModal.task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const { data } = await res.json();
      setColumns(prev => prev.map(c => ({
        ...c, tasks: c.tasks.map(t => t.id === data.id ? data : t),
      })));
    } else {
      const res    = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const { data } = await res.json();
      setColumns(prev => prev.map(c =>
        String(c.id) === String(data.column_id) ? { ...c, tasks: [...c.tasks, data] } : c
      ));
    }
  };

  // ── Delete task ───────────────────────────────────────────────
  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    setColumns(prev => prev.map(c => ({ ...c, tasks: c.tasks.filter(t => t.id !== id) })));
  };

  // ── Add column ────────────────────────────────────────────────
  const addColumn = async () => {
    const title = prompt('Column name:');
    if (!title?.trim()) return;
    const res  = await fetch(`${API}/columns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), position: columns.length }),
    });
    const { data } = await res.json();
    setColumns(prev => [...prev, { ...data, tasks: [] }]);
  };

  const saveSettings = (s) => {
    setSettings(s);
    localStorage.setItem('kanban_settings', JSON.stringify(s));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: boardBg,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      transition: 'background 0.4s',
    }}>

      {/* ── Topbar ── */}
      <div style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '0 20px',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#6366f1', letterSpacing: -0.3 }}>
            ✦ Kanban
          </span>
          <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>My Board</span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TopbarBtn onClick={() => setShowShare(true)}>🔗 Share</TopbarBtn>
          <TopbarBtn onClick={addColumn}>+ Add list</TopbarBtn>
          <button
            onClick={() => setShowSettings(true)}
            title={`${displayName} — Settings`}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: avatarColor,
              border: '2px solid rgba(255,255,255,0.8)',
              color: '#fff', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {initials}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444',
          borderRadius: 8, padding: '10px 16px', margin: '12px 20px 0',
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* ── Board ── */}
      {loading ? (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#94a3b8', fontSize: 14,
        }}>
          Loading board…
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div style={{
            display: 'flex', gap: 12, padding: 20,
            overflowX: 'auto', alignItems: 'flex-start', flex: 1,
          }}>
            {columns.map((col, index) => (
              <Column
                key={col.id}
                column={col}
                tasks={col.tasks ?? []}
                colIndex={index}
                onAddTask={(colId) => setTaskModal({ columnId: colId })}
                onEditTask={(task) => setTaskModal({ task })}
                onQuickAdd={handleQuickAdd}
              />
            ))}

            {/* Add another list */}
            <div style={{ width: 272, flexShrink: 0 }}>
              <button
                onClick={addColumn}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.5)',
                  border: '2px dashed rgba(0,0,0,0.18)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontSize: 13, fontWeight: 600, color: '#64748b',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; e.currentTarget.style.color = '#1e293b'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#64748b'; }}
              >
                <span style={{ fontSize: 18 }}>+</span> Add another list
              </button>
            </div>
          </div>
        </DragDropContext>
      )}

      {/* ── Modals ── */}
      {taskModal !== null && (
        <TaskModal
          task={taskModal.task || null}
          columns={columns}
          onSave={handleSaveTask}
          onDelete={deleteTask}
          onClose={() => setTaskModal(null)}
        />
      )}
      {showSettings && (
        <Settings
          user={user}
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </div>
  );
}

// Small reusable topbar button
function TopbarBtn({ children, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '6px 12px', borderRadius: 6,
        fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
        cursor: 'pointer', border: 'none',
        background: hovered ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.06)',
        color: hovered ? '#1e293b' : '#475569',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}
