import React, { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import styled, { createGlobalStyle } from 'styled-components';
import Column from './Column.jsx';
import TaskModal from './TaskModal.jsx';
import Settings from './Settings.jsx';
import ShareModal from './ShareModal.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; }
`;

const Page = styled.div`
  min-height: 100vh;
  background: ${p => p.$bg || '#fce7f3'};
  display: flex;
  flex-direction: column;
  transition: background 0.4s;
`;

// Topbar — white, clean, Trello-like
const Topbar = styled.div`
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,0,0,0.08);
  padding: 0 20px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
`;

const LeftSide = styled.div`display: flex; align-items: center; gap: 12px;`;

const Logo = styled.div`
  font-size: 16px; font-weight: 800; color: #6366f1;
  letter-spacing: -0.3px; display: flex; align-items: center; gap: 5px;
`;

const Divider = styled.div`width: 1px; height: 20px; background: #e2e8f0;`;

const BoardName = styled.h1`
  font-size: 14px; font-weight: 700; color: #1e293b;
`;

const RightSide = styled.div`display: flex; align-items: center; gap: 8px;`;

const TopBtn = styled.button`
  display: flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 6px;
  font-size: 12.5px; font-weight: 600; font-family: inherit;
  cursor: pointer; transition: all 0.15s; border: none;
  background: ${p => p.$primary ? '#6366f1' : 'rgba(0,0,0,0.06)'};
  color: ${p => p.$primary ? '#fff' : '#475569'};
  &:hover {
    background: ${p => p.$primary ? '#4f46e5' : 'rgba(0,0,0,0.1)'};
    color: ${p => p.$primary ? '#fff' : '#1e293b'};
  }
`;

const Avatar = styled.button`
  width: 32px; height: 32px; border-radius: 50%;
  background: ${p => p.$color || '#6366f1'};
  border: 2px solid rgba(255,255,255,0.8);
  color: #fff; font-size: 12px; font-weight: 700;
  cursor: pointer; font-family: inherit;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover { transform: scale(1.08); box-shadow: 0 3px 8px rgba(0,0,0,0.2); }
`;

// Board area below topbar
const BoardArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// Scrollable columns row
const ColumnsRow = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  overflow-x: auto;
  align-items: flex-start;
  flex: 1;
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
`;

const AddColWrap = styled.div`
  width: 272px;
  flex-shrink: 0;
`;

const AddColBtn = styled.button`
  width: 100%;
  background: rgba(255,255,255,0.5);
  border: 2px dashed rgba(0,0,0,0.15);
  border-radius: 10px;
  padding: 12px;
  font-size: 13px; font-weight: 600; color: #475569;
  font-family: inherit; cursor: pointer;
  transition: all 0.15s; text-align: left;
  display: flex; align-items: center; gap: 6px;
  &:hover { background: rgba(255,255,255,0.75); border-color: rgba(0,0,0,0.25); color: #1e293b; }
`;

const ErrBanner = styled.div`
  background: #fef2f2; border: 1px solid #fecaca; color: #ef4444;
  border-radius: 8px; padding: 10px 16px; margin: 12px 20px 0;
  font-size: 13px;
`;

const Loading = styled.div`
  display: flex; align-items: center; justify-content: center;
  flex: 1; color: #94a3b8; font-size: 14px;
`;

export default function KanbanBoard({ user }) {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskModal, setTaskModal] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kanban_settings')) || {}; } catch { return {}; }
  });

  const boardBg = settings.boardBg || '#fce7f3';

  const fetchBoard = async () => {
    try {
      const res = await fetch(`${API}/columns`);
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
      const src = next.find(c => String(c.id) === source.droppableId);
      const dst = next.find(c => String(c.id) === destination.droppableId);
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

  // ── Quick add (inline) ────────────────────────────────────────
  const handleQuickAdd = async (columnId, title) => {
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: '', column_id: columnId, priority: 'medium' }),
      });
      const { data } = await res.json();
      setColumns(prev => prev.map(c =>
        String(c.id) === String(data.column_id)
          ? { ...c, tasks: [...c.tasks, data] }
          : c
      ));
    } catch (e) { console.error(e); }
  };

  // ── Full create/update ────────────────────────────────────────
  const handleSaveTask = async (fields) => {
    if (taskModal?.task?.id) {
      const res = await fetch(`${API}/tasks/${taskModal.task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const { data } = await res.json();
      setColumns(prev => prev.map(c => ({
        ...c, tasks: c.tasks.map(t => t.id === data.id ? data : t),
      })));
    } else {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const { data } = await res.json();
      setColumns(prev => prev.map(c =>
        String(c.id) === String(data.column_id)
          ? { ...c, tasks: [...c.tasks, data] }
          : c
      ));
    }
  };

  // ── Delete task ───────────────────────────────────────────────
  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    setColumns(prev => prev.map(c => ({
      ...c, tasks: c.tasks.filter(t => t.id !== id),
    })));
  };

  // ── Add column ────────────────────────────────────────────────
  const addColumn = async () => {
    const title = prompt('Column name:');
    if (!title?.trim()) return;
    const res = await fetch(`${API}/columns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), position: columns.length }),
    });
    const { data } = await res.json();
    setColumns(prev => [...prev, { ...data, tasks: [] }]);
  };

  // ── Save settings ─────────────────────────────────────────────
  const saveSettings = (s) => {
    setSettings(s);
    localStorage.setItem('kanban_settings', JSON.stringify(s));
  };

  const displayName = settings.name || user?.user_metadata?.full_name || user?.email || '?';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <GlobalStyle />
      <Page $bg={boardBg}>
        {/* ── Topbar ── */}
        <Topbar>
          <LeftSide>
            <Logo>✦ Kanban</Logo>
            <Divider />
            <BoardName>My Board</BoardName>
          </LeftSide>

          <RightSide>
            <TopBtn onClick={() => setShowShare(true)}>
              🔗 Share
            </TopBtn>
            <TopBtn onClick={addColumn}>
              + Add list
            </TopBtn>
            <Avatar
              $color={settings.avatarColor || '#6366f1'}
              onClick={() => setShowSettings(true)}
              title={`${displayName} — Settings`}
            >
              {initials}
            </Avatar>
          </RightSide>
        </Topbar>

        {/* ── Board ── */}
        <BoardArea>
          {error && <ErrBanner>{error}</ErrBanner>}

          {loading ? (
            <Loading>Loading board…</Loading>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <ColumnsRow>
                {columns.map((col, index) => (
                  <Column
                    key={col.id}
                    column={col}
                    tasks={col.tasks ?? []}
                    colIndex={index}
                    onAddTask={(colId) => setTaskModal({ columnId: colId })}
                    onEditTask={(task) => setTaskModal({ task })}
                    onQuickAdd={handleQuickAdd}
                    onDeleteColumn={() => {}}
                  />
                ))}

                <AddColWrap>
                  <AddColBtn onClick={addColumn}>
                    <span style={{ fontSize: 16 }}>+</span> Add another list
                  </AddColBtn>
                </AddColWrap>
              </ColumnsRow>
            </DragDropContext>
          )}
        </BoardArea>

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
      </Page>
    </>
  );
}
