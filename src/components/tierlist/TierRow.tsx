'use client';

import { useEffect, useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { TierItem } from './TierItem';

interface BurgerInfo {
  id: number;
  name: string;
  imageUrl: string;
}

interface TierRowProps {
  tierId: string;
  label: string;
  color: string;
  items: string[];
  burgerMap: Record<string, BurgerInfo>;
  onLabelChange?: (tierId: string, nextLabel: string) => void;
  editLabelText?: string;
}

export function TierRow({
  tierId,
  label,
  color,
  items,
  burgerMap,
  onLabelChange,
  editLabelText,
}: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id: tierId });
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(label);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraftLabel(label);
  }, [label]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const commitLabel = () => {
    const nextLabel = draftLabel.trim();
    setIsEditing(false);
    if (!onLabelChange) return;
    if (!nextLabel) {
      setDraftLabel(label);
      return;
    }
    if (nextLabel !== label) {
      onLabelChange(tierId, nextLabel);
    }
  };

  return (
    <div
      data-testid={`tier-${tierId}`}
      ref={setNodeRef}
      className={`flex border-2 border-dashed rounded-2xl overflow-hidden transition-colors ${
        isOver ? 'border-primary ring-2 ring-primary/40 bg-primary/5' : 'border-white/20 bg-surface/60'
      }`}
      >
      {/* Tier label */}
      <div
        className={`flex w-16 shrink-0 items-center justify-center text-lg font-extrabold text-white ${color} border-r border-white/10`}
      >
        {onLabelChange ? (
          isEditing ? (
            <input
              ref={inputRef}
              aria-label={editLabelText}
              className="w-full bg-transparent text-center text-lg font-extrabold text-white focus:outline-none ring-2 ring-white/50"
              value={draftLabel}
              onChange={(event) => setDraftLabel(event.target.value)}
              onBlur={commitLabel}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  commitLabel();
                }
                if (event.key === 'Escape') {
                  event.preventDefault();
                  setDraftLabel(label);
                  setIsEditing(false);
                }
              }}
            />
          ) : (
            <button
              type="button"
              className="group relative h-full w-full hover:bg-white/20 transition-colors"
              onClick={() => setIsEditing(true)}
              aria-label={editLabelText}
              title={editLabelText}
            >
              {label}
              <svg 
                className="absolute bottom-1 right-1 w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )
        ) : (
          label
        )}
      </div>

      {/* Droppable area */}
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <div
          className="flex min-h-[110px] flex-1 flex-wrap gap-2 bg-surface p-3"
        >
          {items.map((itemId) => {
            const burger = burgerMap[itemId];
            if (!burger) return null;
            return (
              <TierItem
                key={itemId}
                id={itemId}
                name={burger.name}
                imageUrl={burger.imageUrl}
                burgerId={burger.id}
              />
            );
          })}
        </div>
      </SortableContext>
    </div>
  );
}
