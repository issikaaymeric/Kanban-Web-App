import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}`;

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; backdrop-filter: blur(3px);
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px 36px;
  width: 100%; max-width: 460px;
  box-shadow: 0 24px 48px rgba(0,0,0,0.15);
  animation: ${fadeIn} 0.2s ease;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h2`font-size: 17px; font-weight: 700; color: #1e293b; margin: 0;`;

const Close = styled.button`
  background: #f1f5f9; border: none; color: #64748b; border-radius: 8px;
  width: 30px; height: 30px; cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: #e2e8f0; color: #1e293b; }
`;

const Field = styled.div`margin-bottom: 18px;`;

const Label = styled.label`
  display: block; font-size: 11.5px; font-weight: 700;
  color: #94a3b8; margin-bottom: 6px;
  text-transform: uppercase; letter-spacing: 0.6px;
`;

const Input = styled.input`
  width: 100%; background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 8px; padding: 10px 12px; font-size: 14px;
  color: #1e293b; font-family: inherit; outline: none; box-sizing: border-box;
  transition: border-color 0.15s, background 0.15s;
  &:focus { border-color: #6366f1; background: #fff; }
  &::placeholder { color: #cbd5e1; }
`;

const Textarea = styled.textarea`
  width: 100%; background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 8px; padding: 10px 12px; font-size: 14px;
  color: #1e293b; font-family: inherit; outline: none; box-sizing: border-box;
  resize: vertical; min-height: 80px; transition: border-color 0.15s, background 0.15s;
  &:focus { border-color: #6366f1; background: #fff; }
  &::placeholder { color: #cbd5e1; }
`;

const Select = styled.select`
  width: 100%; background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 8px; padding: 10px 12px; font-size: 14px;
  color: #1e293b; font-family: inherit; outline: none; box-sizing: border-box;
  cursor: pointer; transition: border-color 0.15s;
  &:focus { border-color: #6366f1; }
`;

const PriorityRow = styled.div`display: flex; gap: 8px;`;

const PRIORITY_COLORS = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

const PriorityBtn = styled.button`
  flex: 1; padding: 9px 0; border-radius: 8px;
  font-size: 12.5px; font-weight: 700; font-family: inherit; cursor: pointer;
  transition: all 0.15s; text-transform: uppercase; letter-spacing: 0.4px;
  background: ${p => p.$active ? PRIORITY_COLORS[p.$level] + '18' : '#f8fafc'};
  border: 1.5px solid ${p => p.$active ? PRIORITY_COLORS[p.$level] : '#e2e8f0'};
  color: ${p => p.$active ? PRIORITY_COLORS[p.$level] : '#94a3b8'};
  &:hover { border-color: ${p => PRIORITY_COLORS[p.$level]}; color: ${p => PRIORITY_COLORS[p.$level]}; }
`;

const Actions = styled.div`display: flex; gap: 8px; margin-top: 4px;`;

const Btn = styled.button`
  flex: 1; padding: 11px; border-radius: 8px;
  font-size: 13.5px; font-weight: 600; font-family: inherit; cursor: pointer;
  transition: all 0.15s;
  background: ${p => p.$primary ? '#6366f1' : '#f1f5f9'};
  color: ${p => p.$primary ? '#fff' : '#64748b'};
  border: none;
  &:hover { background: ${p => p.$primary ? '#4f46e5' : '#e2e8f0'}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const DeleteBtn = styled.button`
  padding: 11px 16px; border-radius: 8px;
  background: #fff5f5; color: #ef4444;
  border: 1.5px solid #fecaca; font-family: inherit;
  font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s;
  &:hover { background: #ef4444; color: #fff; border-color: #ef4444; }
`;

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
    if (!window.confirm('Delete this card?')) return;
    await onDelete(task.id);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>{isEdit ? 'Edit card' : 'Add card'}</Title>
          <Close onClick={onClose}>✕</Close>
        </Header>

        <Field>
          <Label>Title *</Label>
          <Input
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSave()}
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
          <PriorityRow>
            {['low', 'medium', 'high'].map(p => (
              <PriorityBtn key={p} $active={priority === p} $level={p} onClick={() => setPriority(p)}>
                {p}
              </PriorityBtn>
            ))}
          </PriorityRow>
        </Field>

        <Actions>
          {isEdit && <DeleteBtn onClick={handleDelete}>Delete</DeleteBtn>}
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn $primary onClick={handleSave} disabled={loading || !title.trim()}>
            {loading ? 'Saving…' : isEdit ? 'Save' : 'Add card'}
          </Btn>
        </Actions>
      </Modal>
    </Overlay>
  );
}
