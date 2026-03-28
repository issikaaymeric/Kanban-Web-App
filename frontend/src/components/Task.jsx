import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const PRIORITY_COLORS = {
  high:   { bg: '#f9706615', border: '#f97066', text: '#f97066' },
  medium: { bg: '#fbbf2415', border: '#fbbf24', text: '#fbbf24' },
  low:    { bg: '#4ade8015', border: '#4ade80', text: '#4ade80' },
};

// $isDragging uses the $ transient prefix to prevent it reaching the DOM
const Card = styled.div`
  background: ${p => p.$isDragging ? '#252535' : '#1e1e2a'};
  border: 1px solid ${p => p.$isDragging ? '#7c6af7' : '#2a2a38'};
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 8px;
  cursor: grab;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  box-shadow: ${p => p.$isDragging ? '0 8px 24px rgba(124,106,247,0.2)' : 'none'};
  &:hover { border-color: #3e3e52; }
  &:active { cursor: grabbing; }
`;

const TopRow = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
`;

const TaskTitle = styled.p`
  font-size: 14px; font-weight: 500; color: #e0e0f0;
  margin: 0; line-height: 1.45; flex: 1;
  font-family: 'DM Sans', sans-serif;
`;

const EditBtn = styled.button`
  background: transparent; border: none; color: #4a4a60;
  cursor: pointer; padding: 2px 4px; border-radius: 6px;
  font-size: 14px; line-height: 1; flex-shrink: 0;
  transition: color 0.15s, background 0.15s;
  &:hover { color: #f0f0f5; background: #2e2e3a; }
`;

const Content = styled.p`
  font-size: 12px; color: #5a5a74; margin: 6px 0 10px;
  line-height: 1.5; font-family: 'DM Sans', sans-serif;
`;

const Footer = styled.div`display: flex; align-items: center; justify-content: space-between;`;

const PriorityBadge = styled.span`
  font-size: 10px; font-weight: 700; letter-spacing: 0.8px;
  text-transform: uppercase; padding: 3px 8px; border-radius: 20px;
  background: ${p => PRIORITY_COLORS[p.$level]?.bg || PRIORITY_COLORS.medium.bg};
  border: 1px solid ${p => PRIORITY_COLORS[p.$level]?.border || PRIORITY_COLORS.medium.border};
  color: ${p => PRIORITY_COLORS[p.$level]?.text || PRIORITY_COLORS.medium.text};
  font-family: 'DM Sans', sans-serif;
`;

const TaskId = styled.span`
  font-size: 11px; color: #3a3a50; font-family: 'DM Sans', sans-serif;
`;

export default function Task({ task, index, onEdit }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          $isDragging={snapshot.isDragging}
        >
          <TopRow>
            <TaskTitle>{task.title}</TaskTitle>
            <EditBtn
              onClick={e => { e.stopPropagation(); onEdit(task); }}
              title="Edit task"
            >
              ✎
            </EditBtn>
          </TopRow>

          {task.content && <Content>{task.content}</Content>}

          <Footer>
            <PriorityBadge $level={task.priority || 'medium'}>
              {task.priority || 'medium'}
            </PriorityBadge>
            <TaskId>#{task.id}</TaskId>
          </Footer>
        </Card>
      )}
    </Draggable>
  );
}
