import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}`;

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: #1a1a22;
  border: 1px solid #2e2e3a;
  border-radius: 20px;
  padding: 36px 40px;
  width: 100%; max-width: 460px;
  animation: ${fadeIn} 0.22s ease;
  font-family: 'DM Sans', sans-serif;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px;
`;

const Title = styled.h2`font-size: 18px; font-weight: 700; color: #f0f0f5; margin: 0;`;

const Close = styled.button`
  background: #2e2e3a; border: none; color: #888; border-radius: 8px;
  width: 32px; height: 32px; cursor: pointer; font-size: 15px;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: #3a3a4a; color: #f0f0f5; }
`;

const Field = styled.div`margin-bottom: 20px;`;

const Label = styled.label`
  display: block; font-size: 12px; font-weight: 600;
  color: #8888a0; margin-bottom: 7px;
  text-transform: uppercase; letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%; background: #0f0f13; border: 1px solid #2e2e3a;
  border-radius: 10px; padding: 11px 14px; font-size: 15px;
  color: #f0f0f5; font-family: inherit; outline: none; box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus { border-color: #7c6af7; }
  &::placeholder { color: #3a3a50; }
`;

const Textarea = styled.textarea`
  width: 100%; background: #0f0f13; border: 1px solid #2e2e3a;
  border-radius: 10px; padding: 11px 14px; font-size: 15px;
  color: #f0f0f5; font-family: inherit; outline: none; box-sizing: border-box;
  resize: vertical; min-height: 90px; transition: border-color 0.2s;
  &:focus { border-color: #7c6af7; }
  &::placeholder { color: #3a3a50; }
`;

const Select = styled.select`
  width: 100%; background: #0f0f13; border: 1px solid #2e2e3a;
  border-radius: 10px; padding: 11px 14px; font-size: 15px;
  color: #f0f0f5; font-family: inherit; outline: none; box-sizing: border-box;
  cursor: pointer; transition: border-color 0.2s;
  &:focus { border-color: #7c6af7; }
`;

const Actions = styled.div`display: flex; gap: 10px; margin-top: 8px;`;

const Btn = styled.button`
  flex: 1; padding: 13px; border-radius: 10px;
  font-size: 14px; font-weight: 600; font-family: inherit;
  cursor: pointer; transition: all 0.2s;
  background: ${p => p.$primary ? '#7c6af7' : 'transparent'};
  color: ${p => p.$primary ? '#fff' : '#8888a0'};
  border: 1px solid ${p => p.$primary ? '#7c6af7' : '#2e2e3a'};
  &:hover {
    background: ${p => p.$primary ? '#6a58e8' : '#2e2e3a'};
    color: #f0f0f5;
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const DeleteBtn = styled.button`
  padding: 13px 18px; border-radius: 10px;
  background: transparent; color: #f97066;
  border: 1px solid #f97066; font-family: inherit;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #f97066; color: #fff; }
`;

const PRIORITY_COLORS = { low: '#4ade80', medium: '#fbbf24', high: '#f97066' };

export default function TaskModal({ task, columns, onSave, onDelete, onClose }) {
  const isEdit = !!task?.id;
  const [title, setTitle] = useState(task?.title || '');
  const [content, setContent] = useState(task?.content || '');
  const [columnId, setColumnId] = useState(task?.column_id || columns[0]?.id || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await onSave({ title: title.trim(), content: content.trim(), column_id: columnId, priority });
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    await onDelete(task.id);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>{isEdit ? 'Edit task' : 'New task'}</Title>
          <Close onClick={onClose}>✕</Close>
        </Header>

        <Field>
          <Label>Title *</Label>
          <Input
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
        </Field>

        <Field>
          <Label>Description</Label>
          <Textarea
            placeholder="Add more details…"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </Field>

        <Field>
          <Label>Column</Label>
          <Select value={columnId} onChange={e => setColumnId(e.target.value)}>
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.title}</option>
            ))}
          </Select>
        </Field>

        <Field>
          <Label>Priority</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['low', 'medium', 'high'].map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                  background: priority === p ? PRIORITY_COLORS[p] + '22' : '#0f0f13',
                  border: `1px solid ${priority === p ? PRIORITY_COLORS[p] : '#2e2e3a'}`,
                  color: priority === p ? PRIORITY_COLORS[p] : '#5a5a70',
                  transition: 'all 0.15s',
                }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </Field>

        <Actions>
          {isEdit && <DeleteBtn onClick={handleDelete}>Delete</DeleteBtn>}
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn $primary onClick={handleSave} disabled={loading || !title.trim()}>
            {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
          </Btn>
        </Actions>
      </Modal>
    </Overlay>
  );
}
