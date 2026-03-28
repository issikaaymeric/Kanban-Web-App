import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import styled, { createGlobalStyle } from 'styled-components';
import Column from './Column.jsx';
import TaskModal from './TaskModal.jsx';
import Settings from './Settings.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const THEMES = {
  dark:  { bg: '#0f0f13', surface: '#16161e', text: '#f0f0f5' },
  light: { bg: '#f0f0f5', surface: '#ffffff', text: '#1a1a22' },
  ocean: { bg: '#0a1628', surface: '#0f2040', text: '#e0f0ff' },
};

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${p => THEMES[p.$theme]?.bg || THEMES.dark.bg}; }
`;

const Page = styled.div`
  min-height: 100vh;
  background: ${p => THEMES[p.$theme]?.bg || THEMES.dark.bg};
  font-family: 'DM Sans', sans-serif;
  transition: background 0.3s;
`;

const Topbar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 32px;
  border-bottom: 1px solid #1e1e2a;
`;

const Logo = styled.div`
  font-size: 13px; font-weight: 700; letter-spacing: 3px;
  text-transform: uppercase; color: #7c6af7;
`;

const BoardTitle = styled.h1`
  font-size: 18px; font-weight: 700;
  color: ${p => THEMES[p.$theme]?.text || '#f0f0f5'};
`;

const TopRight = styled.div`display: flex; align-items: center; gap: 12px;`;

const AddColBtn = styled.button`
  background: #7c6af722; color: #7c6af7;
  border: 1px solid #7c6af744; border-radius: 10px;
  padding: 8px 16px; font-size: 13px; font-weight: 600;
  font-family: inherit; cursor: pointer; transition: all 0.2s;
  &:hover { background: #7c6af7; color: #fff; }
`;

const Avatar = styled.button`
  width: 36px; height: 36px; border-radius: 50%;
  background: ${p => p.$color || '#7c6af7'};
  border: 2px solid #2e2e3a; color: #fff;
  font-size: 14px; font-weight: 700; font-family: inherit;
  cursor: pointer; transition: border-color 0.2s;
  display: flex; align-items: center; justify-content: center;
  &:hover { border-color: #7c6af7; }
`;

const Board = styled.div`
  display: flex; gap: 20px; padding: 28px 32px;
  overflow-x: auto; align-items: flex-start;
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #2e2e3a; border-radius: 3px; }
`;

const Loading = styled.div`
  display: flex; align-items: center; justify-content: center;
  min-height: 60vh; color: #4a4a60; font-size: 15px;
`;

const Err = styled.div`
  background: #2a1a1a; border: 1px solid #f97066;
  color: #f97066; border-radius: 10px; padding: 12px 16px;
  margin: 20px 32px; font-size: 14px;
`;

export default function KanbanBoard({ user }) {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskModal, setTaskModal] = useState(null);  // null | { task?, columnId? }
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kanban_settings')) || {}; } catch { return {}; }
  });

  const theme = settings.theme || 'dark';

  // ── Fetch all columns with tasks ──────────────────────────────
  const fetchBoard = async () => {
    try {
      const res = await fetch(`${API}/columns`);
      const { data, error } = await res.json();
      if (error) throw new Error(error);
      setColumns(data || []);
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

    // Optimistic update
    setColumns(prev => {
      const next = prev.map(c => ({ ...c, tasks: [...c.tasks] }));
      const src = next.find(c => String(c.id) === source.droppableId);
      const dst = next.find(c => String(c.id) === destination.droppableId);

      if (!src || !dst) return prev; // should not happen

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
    } catch {
      fetchBoard(); // revert on failure
    }
  };

  // ── Create task ───────────────────────────────────────────────
  const createTask = async (fields) => {
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
  };

  // ── Update task ───────────────────────────────────────────────
  const updateTask = async (fields) => {
    const res = await fetch(`${API}/tasks/${taskModal.task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const { data } = await res.json();
    setColumns(prev => prev.map(c => ({
      ...c,
      tasks: c.tasks.map(t => t.id === data.id ? data : t),
    })));
  };

  // ── Delete task ───────────────────────────────────────────────
  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    setColumns(prev => prev.map(c => ({
      ...c,
      tasks: c.tasks.filter(t => t.id !== id),
    })));
  };

  // ── Save/dispatch task modal ──────────────────────────────────
  const handleSaveTask = async (fields) => {
    if (taskModal?.task?.id) {
      await updateTask(fields);
    } else {
      await createTask(fields);
    }
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

  if (loading) return <Loading>Loading board…</Loading>;

  return (
    <>
      <GlobalStyle $theme={theme} />
      <Page $theme={theme}>
        <Topbar>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Logo>✦ Kanban</Logo>
            <BoardTitle $theme={theme}>My Board</BoardTitle>
          </div>
          <TopRight>
            <AddColBtn onClick={addColumn}>+ Column</AddColBtn>
            <Avatar
              $color={settings.avatarColor || '#7c6af7'}
              onClick={() => setShowSettings(true)}
              title="Settings"
            >
              {initials}
            </Avatar>
          </TopRight>
        </Topbar>

        {error && <Err>{error}</Err>}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Board>
            {columns.map(col => (
              <Column
                key={col.id}
                column={col}
                tasks={col.tasks ?? []}
                onAddTask={(colId) => setTaskModal({ columnId: colId })}
                onEditTask={(task) => setTaskModal({ task })}
              />
            ))}
          </Board>
        </DragDropContext>

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
      </Page>
    </>
  );
}
