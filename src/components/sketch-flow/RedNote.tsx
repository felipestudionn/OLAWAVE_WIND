'use client';

import { useState, useRef, useEffect } from 'react';
import { ConstructionNote } from '@/types/tech-pack';

interface RedNoteProps {
  note: ConstructionNote;
  onTextChange: (text: string) => void;
  scale?: number;
}

export default function RedNote({ note, onTextChange, scale = 1 }: RedNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isEditing && spanRef.current) {
      spanRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      range.selectNodeContents(spanRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: `${(note.x / 300) * 100}%`,
        top: `${(note.y / 500) * 100}%`,
        maxWidth: '40%',
      }}
    >
      {/* Leader line dot */}
      <div
        className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500"
      />
      <span
        ref={spanRef}
        contentEditable
        suppressContentEditableWarning
        onClick={() => setIsEditing(true)}
        onBlur={(e) => {
          setIsEditing(false);
          const newText = e.currentTarget.textContent || '';
          if (newText !== note.text) onTextChange(newText);
        }}
        className="inline-block px-1 cursor-text select-text"
        style={{
          color: '#DC2626',
          fontSize: `${10 * scale}px`,
          fontWeight: 500,
          lineHeight: 1.3,
          fontStyle: 'italic',
          whiteSpace: 'nowrap',
        }}
      >
        {note.text}
      </span>
    </div>
  );
}
