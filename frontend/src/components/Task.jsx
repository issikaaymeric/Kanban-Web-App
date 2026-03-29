import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import styled from 'styled-components';

const PRIORITY = {
  high:   { color: '#ef4444', label: 'High' },
  medium: { color: '#f59e0b', label: 'Medium' },
  low:    { color: '#22c55e', label: 'Low' },
};

const Card = styled.div`
  background: ${p => p.$isDragging ? '#f8faff' : '#ffffff'};
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  cursor: pointer;
  box-shadow: ${p => p.$isDragging
    ? '0 8px 24px rgba(0,0,0,0.15)'
    : '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)'};
  border: 1px solid ${p => p.$isDragging ? '#c7d2fe' : 'rgba(0,0,0,0.06)'};
  transition: box-shadow 0.15s, border-color 0.15s;
  position: relative;
  font-family: 'Plus Jakarta Sans', sans-serif;
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    border-color: rgba(0,0,0,0.1);
  }
`;

const PriorityBar = styled.div`
  width: 32px;
  height: 3px;
  border-radius: 2px;
  background: ${p => PRIORITY[p.$level]?.color || PRIORITY.medium.color};
  margin-bottom: 8px;
`;

const CardTitle = styled.p`
  font-size: 13.5px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 6px;
  line-height: 1.45;
  word-break: break-word;
`;

const CardDesc = styled.p`
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PriorityTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${p => PRIORITY[p.$level]?.color || PRIORITY.medium.color};
  text-transform: uppercase;
`;

const EditBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #cbd5e1;
  font-size: 13px;
  padding: 2px 4px;
  border-radius: 4px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s, background 0.15s;
  ${Card}:hover & {
    opacity: 1;
  }
  &:hover {
    color: #64748b;
    background: #f1f5f9;
  }
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
          onClick={() => onEdit(task)}
        >
          <PriorityBar $level={task.priority || 'medium'} />
          <CardTitle>{task.title}</CardTitle>
          {task.content && <CardDesc>{task.content}</CardDesc>}
          <Footer>
            <PriorityTag $level={task.priority || 'medium'}>
              {PRIORITY[task.priority || 'medium'].label}
            </PriorityTag>
            <EditBtn onClick={e => { e.stopPropagation(); onEdit(task); }} title="Edit">
              ✎
            </EditBtn>
          </Footer>
        </Card>
      )}
    </Draggable>
  );
}
