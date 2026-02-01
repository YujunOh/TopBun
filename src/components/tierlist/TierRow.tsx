'use client';

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
}

export function TierRow({ tierId, label, color, items, burgerMap }: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id: tierId });

  return (
    <div
      data-testid={`tier-${tierId}`}
      className={`flex border border-white/10 rounded-lg overflow-hidden transition-colors ${
        isOver ? 'ring-2 ring-primary/50' : ''
      }`}
    >
      {/* Tier label */}
      <div
        className={`flex w-16 shrink-0 items-center justify-center text-lg font-extrabold text-white ${color}`}
      >
        {label}
      </div>

      {/* Droppable area */}
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex min-h-[80px] flex-1 flex-wrap gap-2 bg-surface p-2"
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
