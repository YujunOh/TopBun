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
      ref={setNodeRef}
      className={`flex border-2 border-dashed rounded-2xl overflow-hidden transition-colors ${
        isOver ? 'border-primary ring-2 ring-primary/40 bg-primary/5' : 'border-white/20 bg-surface/60'
      }`}
    >
      {/* Tier label */}
      <div
        className={`flex w-16 shrink-0 items-center justify-center text-lg font-extrabold text-white ${color} border-r border-white/10`}
      >
        {label}
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
