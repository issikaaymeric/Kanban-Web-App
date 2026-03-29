import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import styled from 'styled-components';
import Task from './Task.jsx';

// Each column gets one of three Trello-inspired pastel backgrounds
const COLUMN_BG = ['#fef9c3', '#dcfce7', '#ffffff'];  // yellow, green, white

const Wrap = styled.div`
  width: 272px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 140px);
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 8px;
  background: ${p => p.$bg};
  border-radius: 10px 10px 0 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const ColTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Count = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 1px 7px;
  flex-shrink: 0;
`;

const MenuBtn = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 16px;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
  &:hover { background: rgba(0,0,0,0.08); color: #475569; }
`;

const Body = styled.div`
  background: ${p => p.$bg};
  padding: 4px 8px;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
`;

const DropZone = styled.div`
  min-height: 8px;
  transition: background 0.2s;
  background: ${p => p.$isDraggingOver ? 'rgba(99,102,241,0.06)' : 'transparent'};
  border-radius: 6px;
`;

const AddCardBtn = styled.button`
  width: 100%;
  background: ${p => p.$bg};
  border: none;
  border-radius: 0 0 10px 10px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  text-align: left;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s, background 0.15s;
  &:hover { color: #1e293b; background: ${p => p.$hoverBg}; }
`;

const QuickAddForm = styled.div`
  padding: 4px 8px 8px;
  background: ${p => p.$bg};
`;

const QuickInput = styled.textarea`
  width: 100%;
  background: #fff;
  border: 2px solid #6366f1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13.5px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1e293b;
  outline: none;
  resize: none;
  min-height: 60px;
  box-sizing: border-box;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
`;

const QuickActions = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
`;

const QBtn = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  border: none;
  background: ${p => p.$primary ? '#6366f1' : 'transparent'};
  color: ${p => p.$primary ? '#fff' : '#64748b'};
  &:hover { background: ${p => p.$primary ? '#4f46e5' : '#f1f5f9'}; }
`;

// Darken a pastel slightly for hover
const HOVER_BG = ['#fef08a', '#bbf7d0', '#f1f5f9'];

export default function Column({ column, tasks, colIndex, onAddTask, onEditTask, onQuickAdd, onDeleteColumn }) {
  const [quickAdd, setQuickAdd] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');

  const bg = COLUMN_BG[colIndex % COLUMN_BG.length];
  const hoverBg = HOVER_BG[colIndex % HOVER_BG.length];

  const submitQuick = () => {
    if (!quickTitle.trim()) return;
    onQuickAdd(column.id, quickTitle.trim());
    setQuickTitle('');
    setQuickAdd(false);
  };

  return (
    <Wrap>
      <Header $bg={bg}>
        <TitleRow>
          <ColTitle>{column.title}</ColTitle>
          <Count>{tasks.length}</Count>
        </TitleRow>
        <MenuBtn title="Column options" onClick={() => onAddTask(column.id)}>+</MenuBtn>
      </Header>

      <Body $bg={bg}>
        <Droppable droppableId={String(column.id)}>
          {(provided, snapshot) => (
            <DropZone
              ref={provided.innerRef}
              {...provided.droppableProps}
              $isDraggingOver={snapshot.isDraggingOver}
            >
              {tasks.map((task, index) => (
                <Task
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={onEditTask}
                />
              ))}
              {provided.placeholder}
            </DropZone>
          )}
        </Droppable>
      </Body>

      {quickAdd ? (
        <QuickAddForm $bg={bg}>
          <QuickInput
            autoFocus
            placeholder="Enter a title for this card…"
            value={quickTitle}
            onChange={e => setQuickTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitQuick(); }
              if (e.key === 'Escape') { setQuickAdd(false); setQuickTitle(''); }
            }}
          />
          <QuickActions>
            <QBtn $primary onClick={submitQuick}>Add card</QBtn>
            <QBtn onClick={() => { setQuickAdd(false); setQuickTitle(''); }}>✕</QBtn>
          </QuickActions>
        </QuickAddForm>
      ) : (
        <AddCardBtn $bg={bg} $hoverBg={hoverBg} onClick={() => setQuickAdd(true)}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add a card
        </AddCardBtn>
      )}
    </Wrap>
  );
}
