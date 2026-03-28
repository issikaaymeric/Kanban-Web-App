import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Task from './Task.jsx';

const COLUMN_COLORS = {
  'To Do':       '#60a5fa',
  'In Progress': '#fbbf24',
  'Completed':   '#4ade80',
};

const Wrap = styled.div`
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  font-family: 'DM Sans', sans-serif;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 4px 12px;
`;

const TitleRow = styled.div`display: flex; align-items: center; gap: 8px;`;

const Dot = styled.span`
  width: 8px; height: 8px; border-radius: 50%;
  background: ${p => p.$color || '#7c6af7'};
  flex-shrink: 0;
`;

const ColTitle = styled.h3`
  font-size: 13px; font-weight: 700; letter-spacing: 0.5px;
  text-transform: uppercase; color: #8888a0; margin: 0;
`;

const Count = styled.span`
  font-size: 12px; font-weight: 600; color: #4a4a60;
  background: #1e1e2a; border-radius: 20px;
  padding: 1px 8px;
`;

const AddBtn = styled.button`
  background: transparent; border: none; color: #4a4a60;
  cursor: pointer; font-size: 18px; line-height: 1;
  padding: 2px 6px; border-radius: 6px; transition: all 0.15s;
  &:hover { color: #7c6af7; background: #7c6af722; }
`;

// $isDraggingOver uses $ prefix to prevent it reaching the DOM
const TaskList = styled.div`
  background: ${p => p.$isDraggingOver ? '#1e1e2e' : '#16161e'};
  border: 1px solid ${p => p.$isDraggingOver ? '#7c6af744' : '#1e1e2a'};
  border-radius: 14px;
  padding: 10px;
  min-height: 120px;
  transition: background 0.2s, border-color 0.2s;
  flex: 1;
`;

export default function Column({ column, tasks, onAddTask, onEditTask }) {
  const color = COLUMN_COLORS[column.title] || '#7c6af7';

  return (
    <Wrap>
      <Header>
        <TitleRow>
          <Dot $color={color} />
          <ColTitle>{column.title}</ColTitle>
          <Count>{tasks.length}</Count>
        </TitleRow>
        <AddBtn onClick={() => onAddTask(column.id)} title="Add task">+</AddBtn>
      </Header>

      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <TaskList
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
          </TaskList>
        )}
      </Droppable>
    </Wrap>
  );
}
